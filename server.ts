import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '2mb' }));

// Helper to normalize question text for fingerprinting
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '') // Keep letters and numbers across all Unicode alphabets
    .replace(/\s+/g, ' ')
    .trim();
}

function createQuestionFingerprint(questionText: string, category: string): string {
  const norm = normalizeText(questionText);
  return crypto.createHash('sha256').update(`${category}:${norm}`).digest('hex').slice(0, 16);
}

// Language names mapped for prompt clarity
const languageNames: Record<string, string> = {
  en: 'English',
  zh: 'Simplified Chinese (中文)',
  hi: 'Hindi (हिन्दी)',
  es: 'Spanish (Español)',
  fr: 'French (Français)',
  ar: 'Arabic (العربية)',
  bn: 'Bengali (বাংলা)',
  pt: 'Portuguese (Português)',
  ru: 'Russian (Русский)',
  ur: 'Urdu (اردو)',
};

// Category guidance for prompt
const categoryDescriptions: Record<string, string> = {
  logic: 'Deductive reasoning, sequences, analogies, logic puzzles, or syllogisms',
  knowledge: 'General trivia, world facts, cultural landmarks, inventions, and global achievements',
  math: 'Mental math, percentages, arithmetic, algebraic puzzles, fractions, and order of operations',
  focus: 'Visual observation, pattern identification, finding anomalies, and spatial reasoning',
  speed: 'Quick reflex questions, fast estimation, immediate recall, and intuitive associations',
  memory: 'Working memory, sequence recall, pattern retention, and coded message comprehension',
  word: 'Vocabulary, anagrams, synonyms, antonyms, idioms, and language puzzles',
  pattern: 'Visual sequences, geometric progression, matrices, and rotation patterns',
  science: 'Physics, chemistry, biology, astronomy, human anatomy, and natural phenomena',
  history: 'World civilizations, historic milestones, notable figures, and key epochs',
  geography: 'Countries, capitals, mountains, rivers, climates, flags, and physical geography',
};

// API Endpoint for AI-Powered Question Generation
app.post('/api/generate-questions', async (req: Request, res: Response) => {
  const {
    language = 'en',
    category = 'auto',
    difficulty = 'auto',
    questionCount = 5,
    excludeFingerprints = [],
  } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return res.status(200).json({
      success: false,
      fallbackRequired: true,
      error: 'GEMINI_API_KEY is not configured on server. Falling back to local verified pool.',
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const langName = languageNames[language] || 'English';
    const num = Math.min(10, Math.max(1, Number(questionCount) || 5));

    let categoryInstruction = '';
    if (category === 'auto') {
      categoryInstruction =
        'Select a diverse, balanced mix from: logic, knowledge, math, focus, speed, memory, word, pattern, science, history, geography.';
    } else {
      const desc = categoryDescriptions[category] || category;
      categoryInstruction = `Generate ALL ${num} questions exclusively for category "${category}" (${desc}).`;
    }

    let difficultyInstruction = '';
    if (difficulty === 'auto') {
      difficultyInstruction =
        'Distribute difficulty progressively: round 1 Easy, rounds 2-3 Medium, rounds 4-5 Hard.';
    } else {
      difficultyInstruction = `Every question must strictly match the "${difficulty}" difficulty level.`;
    }

    const prompt = `You are the lead puzzle designer for "Daily Pulse", a premier cognitive training app.
Generate exactly ${num} brain-training challenge questions in ${langName}.

Requirements:
1. Target Language: Strictly use ${langName} for question prompt, all 4 options, and explanation.
2. Category: ${categoryInstruction}
3. Difficulty: ${difficultyInstruction}
4. Format: Multiple-choice with exactly 4 distinct options. One option must be strictly correct.
5. Novelty: Ensure all questions are fresh, clever, engaging, and not trivial duplicates.
6. Factuality: Ensure all factual questions are accurate and objectively verified.
7. Tone: Encouraging, intellectually stimulating, and educational.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an expert cognitive psychologist and trivia master. Always return a JSON array conforming strictly to the requested schema. Ensure correct option matching and 100% accurate translations in ${langName}.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              category: {
                type: Type.STRING,
                description: 'One of: logic, knowledge, math, focus, speed, memory, word, pattern, science, history, geography',
              },
              difficulty: {
                type: Type.STRING,
                description: 'One of: easy, medium, hard, expert',
              },
              language: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Exactly 4 distinct plausible options in the target language',
              },
              correctAnswer: {
                type: Type.STRING,
                description: 'Must match one of the items in the options array exactly',
              },
              explanation: {
                type: Type.STRING,
                description: 'Clear, concise rationale explaining why this answer is correct in the target language',
              },
              xp: {
                type: Type.INTEGER,
                description: 'XP reward between 10 and 50 based on difficulty',
              },
            },
            required: ['category', 'difficulty', 'question', 'options', 'correctAnswer', 'explanation'],
          },
        },
      },
    });

    const text = response.text?.trim() || '';
    if (!text) {
      throw new Error('Empty response received from Gemini model');
    }

    const rawQuestions = JSON.parse(text);
    if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
      throw new Error('Invalid questions array structure');
    }

    // Server-Side Strict Validation & Duplicate Filtering
    const validQuestions: Array<{
      id: string;
      category: string;
      difficulty: string;
      language: string;
      question: string;
      options: string[];
      correctAnswer: string;
      correctIndex: number;
      explanation: string;
      xp: number;
      fingerprint: string;
    }> = [];

    const existingFingerprints = new Set(excludeFingerprints);

    for (let i = 0; i < rawQuestions.length; i++) {
      const q = rawQuestions[i];

      // 1. Basic field checks
      if (!q.question || !Array.isArray(q.options) || q.options.length < 4 || !q.correctAnswer) {
        continue;
      }

      // 2. Ensure exactly 4 unique non-empty options
      const uniqueOptions = Array.from(new Set(q.options.map((o: unknown) => String(o).trim())));
      if (uniqueOptions.length < 4) {
        continue;
      }
      const finalOptions: string[] = uniqueOptions.slice(0, 4) as string[];

      // 3. Match correct answer
      let correctIdx = finalOptions.findIndex(
        (opt: string) => opt.toLowerCase().trim() === String(q.correctAnswer).toLowerCase().trim()
      );
      if (correctIdx === -1) {
        // If not exact match, check trimmed equality
        correctIdx = finalOptions.indexOf(String(q.correctAnswer).trim());
      }
      if (correctIdx === -1) {
        // Fallback: assign first option if matching failed
        finalOptions[0] = String(q.correctAnswer).trim();
        correctIdx = 0;
      }

      // 4. Duplicate check via fingerprint
      const fingerprint = createQuestionFingerprint(q.question, q.category || category);
      if (existingFingerprints.has(fingerprint)) {
        continue; // Skip duplicate
      }
      existingFingerprints.add(fingerprint);

      const validDifficulty = ['easy', 'medium', 'hard', 'expert'].includes(q.difficulty)
        ? q.difficulty
        : difficulty === 'auto'
        ? (i === 0 ? 'easy' : i < 3 ? 'medium' : 'hard')
        : difficulty;

      const validCategory = [
        'logic',
        'knowledge',
        'math',
        'focus',
        'speed',
        'memory',
        'word',
        'pattern',
        'science',
        'history',
        'geography',
      ].includes(q.category)
        ? q.category
        : category === 'auto'
        ? 'logic'
        : category;

      validQuestions.push({
        id: `ai_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 6)}`,
        category: validCategory,
        difficulty: validDifficulty,
        language: language,
        question: q.question.trim(),
        options: finalOptions,
        correctAnswer: finalOptions[correctIdx],
        correctIndex: correctIdx,
        explanation: (q.explanation || '').trim(),
        xp: Number(q.xp) || (validDifficulty === 'easy' ? 20 : validDifficulty === 'medium' ? 30 : 40),
        fingerprint,
      });

      if (validQuestions.length >= num) break;
    }

    if (validQuestions.length === 0) {
      return res.status(200).json({
        success: false,
        fallbackRequired: true,
        error: 'Validation rejected generated questions. Using verified local backup pool.',
      });
    }

    return res.status(200).json({
      success: true,
      questions: validQuestions,
      generatedCount: validQuestions.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error generating questions with Gemini:', message);
    return res.status(200).json({
      success: false,
      fallbackRequired: true,
      error: message,
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'Daily Pulse',
    version: '3.1.0',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
  });
});

// Static Assets / Vite Middleware Setup
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Daily Pulse server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
