import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Timer,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Bot,
} from 'lucide-react';
import {
  QuestionItem,
  QuestionResult,
  SessionConfig,
  SessionResult,
  Language,
  ChallengeCategory,
} from '../types';
import { sounds } from '../utils/audio';
import { challengeEngine } from '../utils/challengeEngine';
import { getTodayDateString } from '../services/storageService';
import { translations } from '../data/translations';
import { getLocalizedQuestion } from '../data/questionTranslations';

interface ChallengeSessionProps {
  questions: QuestionItem[];
  config: SessionConfig;
  language: Language;
  currentStreak: number;
  isDailyFeaturedSession: boolean;
  isAiLoading?: boolean;
  onClose: () => void;
  onFinishSession: (result: SessionResult) => void;
}

export const ChallengeSession: React.FC<ChallengeSessionProps> = ({
  questions,
  config,
  language,
  currentStreak,
  isDailyFeaturedSession,
  isAiLoading = false,
  onClose,
  onFinishSession,
}) => {
  const t = translations[language] || translations.en;
  const isRtl = language === 'ar' || language === 'ur';

  const startTimeRef = useRef<number>(Date.now());
  const questionResultsRef = useRef<QuestionResult[]>([]);
  const totalScoreRef = useRef(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = questions[currentIndex] || questions[0];

  const [timeLeft, setTimeLeft] = useState<number>(
    currentQuestion?.duration || 30
  );
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeSpeedPad, setActiveSpeedPad] = useState<number | null>(null);
  const [speedPlayerInputs, setSpeedPlayerInputs] = useState<number[]>([]);

  const [sessionQuestionResults, setSessionQuestionResults] = useState<
    QuestionResult[]
  >([]);
  const [totalSessionScore, setTotalSessionScore] = useState(0);

  useEffect(() => {
    if (!currentQuestion) return;

    setTimeLeft(currentQuestion.duration);
    setSelectedOption(null);
    setHasAnswered(false);
    setIsCorrect(false);
    setEarnedPoints(0);
    setSpeedPlayerInputs([]);
    setIsShowingSequence(false);
    setActiveSpeedPad(null);

    if (
      currentQuestion.taskType === 'instant_recall' &&
      currentQuestion.speedSequence
    ) {
      setIsShowingSequence(true);

      const seq = currentQuestion.speedSequence;

      seq.forEach((padId, i) => {
        setTimeout(() => {
          setActiveSpeedPad(padId);
          sounds.playTap();

          setTimeout(() => {
            setActiveSpeedPad(null);
          }, 350);
        }, (i + 1) * 600);
      });

      setTimeout(() => {
        setIsShowingSequence(false);
      }, (seq.length + 1) * 600);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, currentQuestion]);

  useEffect(() => {
    if (timeLeft !== 0 || hasAnswered || !currentQuestion) return;

    submitAnswer(
      -1,
      false,
      currentQuestion.duration
    );
  }, [timeLeft, hasAnswered, currentQuestion]);

  const handleTimeOut = () => {
    if (hasAnswered || !currentQuestion) return;

    submitAnswer(
      -1,
      false,
      currentQuestion.duration
    );
  };

  const handleSelectOption = (index: number) => {
    if (hasAnswered || !currentQuestion) return;

    const timeTaken = Math.max(
      1,
      currentQuestion.duration - timeLeft
    );

    const correct =
      index === currentQuestion.correctIndex;

    setSelectedOption(index);

    submitAnswer(
      index,
      correct,
      timeTaken
    );
  };

  const handleFocusClick = (index: number) => {
    if (hasAnswered || !currentQuestion) return;

    const timeTaken = Math.max(
      1,
      currentQuestion.duration - timeLeft
    );

    const correct =
      index === currentQuestion.oddPuzzleData?.oddIndex;

    setSelectedOption(index);

    submitAnswer(
      index,
      correct,
      timeTaken
    );
  };

  const handleSpeedPadClick = (padId: number) => {
    if (
      hasAnswered ||
      isShowingSequence ||
      !currentQuestion
    ) {
      return;
    }

    sounds.playTap();

    const expectedSeq =
      currentQuestion.speedSequence || [0, 1, 2];

    const stepIndex =
      speedPlayerInputs.length;

    const newInputs = [
      ...speedPlayerInputs,
      padId,
    ];

    setSpeedPlayerInputs(newInputs);

    if (expectedSeq[stepIndex] !== padId) {
      const timeTaken = Math.max(
        1,
        currentQuestion.duration - timeLeft
      );

      submitAnswer(
        padId,
        false,
        timeTaken
      );

      return;
    }

    if (
      newInputs.length ===
      expectedSeq.length
    ) {
      const timeTaken = Math.max(
        1,
        currentQuestion.duration - timeLeft
      );

      submitAnswer(
        padId,
        true,
        timeTaken
      );
    }
  };

  const submitAnswer = (
    chosenIndex: number,
    correct: boolean,
    timeTaken: number
  ) => {
    if (!currentQuestion || hasAnswered) return;

    setHasAnswered(true);
    setIsCorrect(correct);

    const scoring =
      challengeEngine.calculateQuestionScore({
        basePoints:
          currentQuestion.basePoints,
        difficulty:
          currentQuestion.difficulty,
        duration:
          currentQuestion.duration,
        timeTaken,
        isCorrect: correct,
        currentStreak,
      });

    setEarnedPoints(scoring.score);

    totalScoreRef.current += scoring.score;

    setTotalSessionScore(
      totalScoreRef.current
    );

    if (correct) {
      sounds.playSuccess();
    } else {
      sounds.playError();
    }

    let userAnsStr = '—';
    let correctAnsStr = '—';

    const opts =
      currentQuestion.options ||
      (isRtl
        ? currentQuestion.optionsAr
        : currentQuestion.optionsEn);

    if (currentQuestion.optionsNumber) {
      userAnsStr =
        chosenIndex >= 0
          ? String(
              currentQuestion.optionsNumber[
                chosenIndex
              ]
            )
          : 'Timeout';

      correctAnsStr = String(
        currentQuestion.optionsNumber[
          currentQuestion.correctIndex
        ]
      );
    } else if (opts) {
      userAnsStr =
        chosenIndex >= 0
          ? opts[chosenIndex]
          : 'Timeout';

      correctAnsStr =
        opts[currentQuestion.correctIndex] ||
        '—';
    } else if (
      currentQuestion.taskType ===
      'odd_one_out'
    ) {
      userAnsStr = correct
        ? currentQuestion.oddPuzzleData
            ?.odd || '✓'
        : 'Outlier Missed';

      correctAnsStr =
        currentQuestion.oddPuzzleData?.odd ||
        'Tile';
    } else if (
      currentQuestion.taskType ===
      'instant_recall'
    ) {
      userAnsStr = correct
        ? 'Correct Sequence'
        : 'Mismatched Pattern';

      correctAnsStr = 'Exact Sequence';
    }

    const qResult: QuestionResult = {
      questionId: currentQuestion.id,
      category: currentQuestion.category,
      titleAr: currentQuestion.titleAr,
      titleEn: currentQuestion.titleEn,
      isCorrect: correct,
      timeTaken,
      scoreAwarded: scoring.score,
      userAnswer: userAnsStr,
      correctAnswer: correctAnsStr,
      explanationAr:
        currentQuestion.localizedExplanation ||
        currentQuestion.explanationAr,
      explanationEn:
        currentQuestion.localizedExplanation ||
        currentQuestion.explanationEn,
    };

    questionResultsRef.current = [
      ...questionResultsRef.current,
      qResult,
    ];

    setSessionQuestionResults(
      questionResultsRef.current
    );
  };

  const handleNextQuestion = () => {
    sounds.playTap();

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(
        (prev) => prev + 1
      );
      return;
    }

    const finalResults =
      questionResultsRef.current;

    const finalScore =
      totalScoreRef.current;

    const totalTime = Math.round(
      (Date.now() - startTimeRef.current) /
        1000
    );

    const correctCount =
      finalResults.filter(
        (result) => result.isCorrect
      ).length;

    const accuracy =
      questions.length > 0
        ? Math.round(
            (correctCount /
              questions.length) *
              100
          )
        : 0;

    const earnedXp =
      challengeEngine.calculateSessionXp(
        finalScore,
        accuracy,
        isDailyFeaturedSession
      );

    const catCount: Record<
      string,
      number
    > = {};

    finalResults.forEach((result) => {
      if (result.isCorrect) {
        catCount[result.category] =
          (catCount[result.category] || 0) +
          1;
      }
    });

    const bestCat =
      (Object.keys(catCount).sort(
        (a, b) =>
          catCount[b] - catCount[a]
      )[0] ||
        currentQuestion.category) as ChallengeCategory;

    const finalResult: SessionResult = {
      id: `sess_${Date.now()}`,
      date: getTodayDateString(),
      timestamp: Date.now(),
      sessionType: config.type,
      difficulty: config.difficulty,
      score: finalScore,
      earnedXp,
      accuracy,
      timeSpentSeconds: totalTime,
      questionsCount: questions.length,
      correctCount,
      bestCategory: bestCat,
      questionResults: finalResults,
    };

    onFinishSession(finalResult);
  };

  if (isAiLoading) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-amber-500 mx-auto flex items-center justify-center animate-pulse">
            <Bot className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.aiGenerating}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {t.aiGeneratingDesc}
            </p>
          </div>

          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mt-2" />
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const speedPads = [
    {
      id: 0,
      color: 'bg-cyan-500',
      activeColor:
        'bg-cyan-300 ring-4 ring-cyan-200 shadow-lg shadow-cyan-500/50',
    },
    {
      id: 1,
      color: 'bg-amber-500',
      activeColor:
        'bg-amber-300 ring-4 ring-amber-200 shadow-lg shadow-amber-500/50',
    },
    {
      id: 2,
      color: 'bg-emerald-500',
      activeColor:
        'bg-emerald-300 ring-4 ring-emerald-200 shadow-lg shadow-emerald-500/50',
    },
    {
      id: 3,
      color: 'bg-rose-500',
      activeColor:
        'bg-rose-300 ring-4 ring-rose-200 shadow-lg shadow-rose-500/50',
    },
  ];

  const timerRatio = Math.max(
    0,
    timeLeft / currentQuestion.duration
  );

  const localizedQ =
    getLocalizedQuestion(
      currentQuestion,
      language
    );

  const promptText =
    localizedQ.localizedQuestion ||
    (isRtl
      ? localizedQ.promptAr
      : localizedQ.promptEn);

  const explanationText =
    localizedQ.localizedExplanation ||
    (isRtl
      ? localizedQ.explanationAr
      : localizedQ.explanationEn);

  const optionsList =
    localizedQ.options ||
    (isRtl
      ? localizedQ.optionsAr
      : localizedQ.optionsEn);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl text-slate-900 dark:text-slate-100 flex flex-col max-h-[92vh] overflow-y-auto space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {currentQuestion.isAiGenerated &&
                '⚡ AI '}
              {t[
                `cat_${currentQuestion.category}`
              ] ||
                currentQuestion.category.toUpperCase()}
            </span>

            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {currentIndex + 1} /{' '}
              {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400">
              {totalSessionScore} PTS
            </span>

            <button
              onClick={() => {
                if (window.confirm(t.quitConfirm)) {
                  sounds.playTap();
                  onClose();
                }
              }}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-mono">
              <Timer className="w-3.5 h-3.5 text-amber-500" />
              {timeLeft} {t.timeRemaining}
            </span>

            <span className="text-[10px] uppercase font-mono font-semibold text-slate-500">
              {currentQuestion.difficulty}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                timerRatio < 0.25
                  ? 'bg-rose-500 animate-pulse'
                  : timerRatio < 0.5
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
              style={{
                width: `${timerRatio * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-800 dark:text-amber-300 leading-relaxed">
            {promptText}
          </p>

          {currentQuestion.sequenceString && (
            <div className="text-2xl sm:text-3xl font-mono font-black tracking-wider text-slate-900 dark:text-white py-1">
              {currentQuestion.sequenceString}
            </div>
          )}

          {currentQuestion.mathEquation && (
            <div className="text-2xl sm:text-3xl font-mono font-black tracking-wider text-amber-600 dark:text-amber-300 py-1">
              {currentQuestion.mathEquation}
            </div>
          )}
        </div>

        <div className="py-2">
          {(currentQuestion.optionsNumber ||
            optionsList) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQuestion.optionsNumber
                ? currentQuestion.optionsNumber.map(
                    (opt, idx) => {
                      const isSelected =
                        selectedOption === idx;

                      const isCorrectAnswer =
                        idx ===
                        currentQuestion.correctIndex;

                      let style =
                        'bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white';

                      if (hasAnswered) {
                        if (isCorrectAnswer) {
                          style =
                            'bg-emerald-600 border-emerald-400 text-white ring-2 ring-emerald-400';
                        } else if (
                          isSelected
                        ) {
                          style =
                            'bg-rose-600 border-rose-400 text-white ring-2 ring-rose-400';
                        } else {
                          style =
                            'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={hasAnswered}
                          onClick={() =>
                            handleSelectOption(
                              idx
                            )
                          }
                          className={`py-3.5 px-4 rounded-xl border text-base sm:text-lg font-bold font-mono transition-all active:scale-95 ${style}`}
                        >
                          {opt}
                        </button>
                      );
                    }
                  )
                : optionsList!.map(
                    (opt, idx) => {
                      const isSelected =
                        selectedOption === idx;

                      const isCorrectAnswer =
                        idx ===
                        currentQuestion.correctIndex;

                      let style =
                        'bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';

                      if (hasAnswered) {
                        if (isCorrectAnswer) {
                          style =
                            'bg-emerald-600 border-emerald-400 text-white ring-2 ring-emerald-400';
                        } else if (
                          isSelected
                        ) {
                          style =
                            'bg-rose-600 border-rose-400 text-white ring-2 ring-rose-400';
                        } else {
                          style =
                            'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={hasAnswered}
                          onClick={() =>
                            handleSelectOption(
                              idx
                            )
                          }
                          className={`py-3 px-3.5 rounded-xl border text-xs sm:text-sm font-semibold text-start transition-all active:scale-98 ${style}`}
                        >
                          {opt}
                        </button>
                      );
                    }
                  )}
            </div>
          )}

          {currentQuestion.taskType ===
            'odd_one_out' &&
            currentQuestion.oddPuzzleData &&
            (() => {
              const oddData =
                currentQuestion.oddPuzzleData;

              return (
                <div className="grid grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-950/60 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  {Array.from({
                    length: 16,
                  }).map((_, idx) => {
                    const isOdd =
                      idx ===
                      oddData.oddIndex;

                    const isSelected =
                      selectedOption === idx;

                    let tileClass =
                      'bg-white dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-transparent';

                    if (hasAnswered) {
                      if (isOdd) {
                        tileClass =
                          'bg-emerald-600 ring-2 ring-emerald-400 text-white';
                      } else if (
                        isSelected
                      ) {
                        tileClass =
                          'bg-rose-600 ring-2 ring-rose-400 text-white';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={hasAnswered}
                        onClick={() =>
                          handleFocusClick(
                            idx
                          )
                        }
                        className={`h-12 rounded-xl text-2xl flex items-center justify-center transition-transform active:scale-90 ${tileClass}`}
                      >
                        {isOdd
                          ? oddData.odd
                          : oddData.normal}
                      </button>
                    );
                  })}
                </div>
              );
            })()}

          {currentQuestion.taskType ===
            'instant_recall' && (
            <div className="space-y-3 text-center">
              <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                {isShowingSequence
                  ? '👀 Watch the sequence...'
                  : '⚡ Repeat the sequence in order!'}
              </span>

              <div className="grid grid-cols-2 gap-3 p-1">
                {speedPads.map((pad) => {
                  const isActive =
                    activeSpeedPad ===
                    pad.id;

                  return (
                    <button
                      key={pad.id}
                      disabled={
                        hasAnswered ||
                        isShowingSequence
                      }
                      onClick={() =>
                        handleSpeedPadClick(
                          pad.id
                        )
                      }
                      className={`h-20 sm:h-24 rounded-2xl transition-all active:scale-95 ${
                        isActive
                          ? pad.activeColor
                          : pad.color
                      } ${
                        isShowingSequence
                          ? 'opacity-80'
                          : 'opacity-100 hover:brightness-110 shadow-md'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {hasAnswered && (
          <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    {t.correctAnswer}
                  </span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5 font-bold text-xs">
                    <AlertCircle className="w-4 h-4" />
                    {t.incorrectAnswer}
                  </span>
                )}
              </div>

              <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                +{earnedPoints} PTS
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="text-amber-600 dark:text-amber-400 block mb-0.5">
                {t.explanation}
              </strong>
              {explanationText}
            </p>

            <button
              onClick={handleNextQuestion}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-transform active:scale-95 shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <span>
                {currentIndex <
                questions.length - 1
                  ? t.nextQuestion
                  : t.viewSessionResults}
              </span>

              {isRtl ? (
                <ArrowLeft className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};