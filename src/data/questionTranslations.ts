import { SupportedLanguage } from './translations';
import { QuestionItem } from '../types';

export interface LocalizedQuestionData {
  title: string;
  prompt: string;
  options?: string[];
  explanation: string;
}

export const QUESTION_TRANSLATIONS: Record<string, Partial<Record<SupportedLanguage, LocalizedQuestionData>>> = {
  // ==========================================
  // LOGIC QUESTIONS
  // ==========================================
  log_01: {
    en: {
      title: 'Double Sequence',
      prompt: 'What number completes the following pattern?',
      explanation: 'Each number is multiplied by 2 (24 × 2 = 48).',
    },
    zh: {
      title: '成倍递增数列',
      prompt: '哪一个数字能补全下面的规律？',
      explanation: '序列中每个数字都乘以2（24 × 2 = 48）。',
    },
    hi: {
      title: 'दोगुनी श्रृंखला',
      prompt: 'निम्नलिखित पैटर्न को कौन सी संख्या पूरा करती है?',
      explanation: 'प्रत्येक संख्या को 2 से गुणा किया जाता है (24 × 2 = 48)।',
    },
    es: {
      title: 'Secuencia de Dobles',
      prompt: '¿Qué número completa el siguiente patrón?',
      explanation: 'Cada número se multiplica por 2 (24 × 2 = 48).',
    },
    fr: {
      title: 'Suite Double',
      prompt: 'Quel nombre complète la suite logique suivante ?',
      explanation: 'Chaque nombre est multiplié par 2 (24 × 2 = 48).',
    },
    ar: {
      title: 'تسلسل الضعف',
      prompt: 'ما هو الرقم الذي يكمل النمط التالي؟',
      explanation: 'كل رقم في المتتالية يُضرب في 2 (24 × 2 = 48).',
    },
    bn: {
      title: 'দ্বিগুণ ক্রম',
      prompt: 'কোন সংখ্যাটি নিচের প্যাটার্নটি সম্পূর্ণ করে?',
      explanation: 'প্রতিটি সংখ্যা ২ দিয়ে গুণ করা হয়েছে (২৪ × ২ = ৪৮)।',
    },
    pt: {
      title: 'Sequência de Dobros',
      prompt: 'Qual número completa o seguinte padrão?',
      explanation: 'Cada número é multiplicado por 2 (24 × 2 = 48).',
    },
    ru: {
      title: 'Удвоение чисел',
      prompt: 'Какое число продолжает следующий числовой ряд?',
      explanation: 'Каждое число умножается на 2 (24 × 2 = 48).',
    },
    ur: {
      title: 'دگنا تسلسل',
      prompt: 'کون سا عدد نیچے دیے گئے پیٹرن کو مکمل کرتا ہے؟',
      explanation: 'ہر عدد کو 2 سے ضرب دی گئی ہے (24 × 2 = 48)۔',
    },
  },

  log_02: {
    en: {
      title: 'Increasing Deltas',
      prompt: 'Find the missing number in the sequence:',
      explanation: 'The differences are consecutive odd numbers: +3, +5, +7, +9, +11 (26 + 11 = 37).',
    },
    zh: {
      title: '递增差值',
      prompt: '找出数列中缺失的数字：',
      explanation: '差值是连续奇数：+3, +5, +7, +9, +11 (26 + 11 = 37)。',
    },
    hi: {
      title: 'बढ़ते अंतर',
      prompt: 'श्रृंखला में लुप्त संख्या ज्ञात करें:',
      explanation: 'संख्याओं के बीच का अंतर विषम संख्याएँ हैं: +3, +5, +7, +9, +11 (26 + 11 = 37)।',
    },
    es: {
      title: 'Deltas Crecientes',
      prompt: 'Encuentra el número que falta en la secuencia:',
      explanation: 'Las diferencias son números impares consecutivos: +3, +5, +7, +9, +11 (26 + 11 = 37).',
    },
    fr: {
      title: 'Deltas Croissants',
      prompt: 'Trouvez le nombre manquant dans la suite :',
      explanation: 'Les écarts sont des nombres impairs consécutifs : +3, +5, +7, +9, +11 (26 + 11 = 37).',
    },
    ar: {
      title: 'الفروقات المتزايدة',
      prompt: 'اكتشف الرقم المفقود في السلسلة:',
      explanation: 'الفروق بين الأعداد تتزايد بأعداد فردية: +3، +5، +7، +9، +11 (26 + 11 = 37).',
    },
    bn: {
      title: 'ক্রমবর্ধমান ব্যবধান',
      prompt: 'সিরিজের অনুপস্থিত সংখ্যাটি নির্ণয় করুন:',
      explanation: 'ব্যবধানগুলো ধারাবাহিক বিজোড় সংখ্যা: +৩, +৫, +৭, +৯, +১১ (২৬ + ১১ = ৩৭)।',
    },
    pt: {
      title: 'Diferenças Crescentes',
      prompt: 'Encontre o número que falta na sequência:',
      explanation: 'As diferenças são números ímpares consecutivos: +3, +5, +7, +9, +11 (26 + 11 = 37).',
    },
    ru: {
      title: 'Возрастающая разность',
      prompt: 'Найдите пропущенное число в ряду:',
      explanation: 'Разности между числами — нечётные числа: +3, +5, +7, +9, +11 (26 + 11 = 37).',
    },
    ur: {
      title: 'بڑھتے ہوئے فرق',
      prompt: 'تسلسل میں غائب عدد تلاش کریں:',
      explanation: 'اعداد کے درمیان فرق مسلسل طاق اعداد ہیں: +3, +5, +7, +9, +11 (26 + 11 = 37)۔',
    },
  },

  log_03: {
    en: {
      title: 'Fibonacci Flow',
      prompt: 'What is the next number according to Fibonacci?',
      explanation: 'Each number is the sum of the two preceding ones (8 + 13 = 21).',
    },
    zh: {
      title: '斐波那契规律',
      prompt: '根据斐波那契数列规则，下一个数字是多少？',
      explanation: '每个数字都是前两个数字之和（8 + 13 = 21）。',
    },
    hi: {
      title: 'फाइबोनैचि प्रवाह',
      prompt: 'फाइबोनैचि नियम के अनुसार अगली संख्या क्या है?',
      explanation: 'प्रत्येक संख्या पिछली दो संख्याओं का योग है (8 + 13 = 21)।',
    },
    es: {
      title: 'Flujo Fibonacci',
      prompt: '¿Cuál es el siguiente número según la regla de Fibonacci?',
      explanation: 'Cada número es la suma de los dos anteriores (8 + 13 = 21).',
    },
    fr: {
      title: 'Suite de Fibonacci',
      prompt: 'Quel est le nombre suivant selon la règle de Fibonacci ?',
      explanation: 'Chaque nombre est la somme des deux précédents (8 + 13 = 21).',
    },
    ar: {
      title: 'متتالية فيبوناتشي',
      prompt: 'ما هو العدد التالي وفق قاعدة فيبوناتشي؟',
      explanation: 'كل عدد هو حاصل جمع العددين السابقين له (8 + 13 = 21).',
    },
    bn: {
      title: 'ফিবোনাচ্চি ধারা',
      prompt: 'ফিবোনাচ্চি নিয়ম অনুসারে পরবর্তী সংখ্যাটি কত?',
      explanation: 'প্রতিটি সংখ্যা আগের দুটি সংখ্যার যোগফল (৮ + ১৩ = ২১)।',
    },
    pt: {
      title: 'Fluxo Fibonacci',
      prompt: 'Qual é o próximo número de acordo com Fibonacci?',
      explanation: 'Cada número é a soma dos dois anteriores (8 + 13 = 21).',
    },
    ru: {
      title: 'Ряд Фибоначчи',
      prompt: 'Какое следующее число в ряду Фибоначчи?',
      explanation: 'Каждое число равно сумме двух предыдущих (8 + 13 = 21).',
    },
    ur: {
      title: 'فبوناکی تسلسل',
      prompt: 'فبوناکی اصول کے مطابق اگلا عدد کیا ہوگا؟',
      explanation: 'ہر عدد پچھلے دو اعداد کا مجموعہ ہوتا ہے (8 + 13 = 21)۔',
    },
  },

  log_04: {
    en: {
      title: 'Cube Offsets',
      prompt: 'What is the missing number in the sequence?',
      explanation: 'The formula is n³ - 1: for n=6, 6³ - 1 = 216 - 1 = 215.',
    },
    zh: {
      title: '立方偏移',
      prompt: '序列中缺少的数字是多少？',
      explanation: '规律是 n³ - 1：当 n=6 时，6³ - 1 = 216 - 1 = 215。',
    },
    hi: {
      title: 'घन घटाव',
      prompt: 'श्रृंखला में लुप्त संख्या क्या है?',
      explanation: 'सूत्र n³ - 1 है: n=6 के लिए, 6³ - 1 = 216 - 1 = 215।',
    },
    es: {
      title: 'Desplazamiento Cúbico',
      prompt: '¿Cuál es el número que falta en la secuencia?',
      explanation: 'La fórmula es n³ - 1: para n=6, 6³ - 1 = 216 - 1 = 215.',
    },
    fr: {
      title: 'Cubes Décalés',
      prompt: 'Quel est le nombre manquant dans la suite ?',
      explanation: 'La formule est n³ - 1 : pour n=6, 6³ - 1 = 216 - 1 = 215.',
    },
    ar: {
      title: 'المكعبات التنازلية',
      prompt: 'ما هو الرقم المجهول في المتتالية؟',
      explanation: 'النمط هو مكعب العدد ناقص 1 (n³ - 1): 6³ - 1 = 216 - 1 = 215.',
    },
    bn: {
      title: 'ঘনকের বিয়োগফল',
      prompt: 'ক্রমটিতে অনুপস্থিত সংখ্যাটি কী?',
      explanation: 'প্যাটার্নটি n³ - ১: n=৬ এর জন্য, ৬³ - ১ = ২১৬ - ১ = ২১৫।',
    },
    pt: {
      title: 'Deslocamento de Cubos',
      prompt: 'Qual é o número ausente na sequência?',
      explanation: 'A fórmula é n³ - 1: para n=6, 6³ - 1 = 216 - 1 = 215.',
    },
    ru: {
      title: 'Кубическое смещение',
      prompt: 'Какое число пропущено в числовом ряду?',
      explanation: 'Формула n³ - 1: при n=6 получаем 6³ - 1 = 216 - 1 = 215.',
    },
    ur: {
      title: 'مکعب کا فرق',
      prompt: 'تسلسل میں کون سا عدد غائب ہے؟',
      explanation: 'اصول n³ - 1 ہے: n=6 کے لیے، 6³ - 1 = 216 - 1 = 215۔',
    },
  },

  log_05: {
    en: {
      title: 'Deductive Logic',
      prompt: 'If all A are B, and some B are not C, what conclusion is strictly valid?',
      options: [
        'Some A are not C necessarily',
        'It is not guaranteed that all A are C',
        'All A are definitely C',
        'There is no relation between A and B',
      ],
      explanation: 'Since only some B are not C, there is no guarantee that set A completely overlaps with C.',
    },
    zh: {
      title: '演绎逻辑',
      prompt: '如果所有的A都是B，且有些B不是C，那么下列哪个结论必然成立？',
      options: [
        '有些A必然不是C',
        '无法保证所有A都是C',
        '所有A肯定都是C',
        'A和B之间没有任何关系',
      ],
      explanation: '因为只有部分B不是C，所以无法保证集合A完全落入集合C中。',
    },
    hi: {
      title: 'निगमनात्मक तर्क',
      prompt: 'यदि सभी A, B हैं, और कुछ B, C नहीं हैं, तो कौन सा निष्कर्ष पूर्णतः मान्य है?',
      options: [
        'कुछ A अनिवार्य रूप से C नहीं हैं',
        'यह गारंटी नहीं है कि सभी A, C हैं',
        'सभी A निश्चित रूप से C हैं',
        'A और B के बीच कोई संबंध नहीं है',
      ],
      explanation: 'चूंकि केवल कुछ B, C नहीं हैं, इसलिए कोई गारंटी नहीं है कि सभी A, C होंगे।',
    },
    es: {
      title: 'Lógica Deductiva',
      prompt: 'Si todos los A son B, y algunos B no son C, ¿qué conclusión es estrictamente válida?',
      options: [
        'Algunos A no son C necesariamente',
        'No está garantizado que todos los A sean C',
        'Todos los A son definitivamente C',
        'No hay relación entre A y B',
      ],
      explanation: 'Como solo algunos B no son C, no hay garantía de que el conjunto A coincida totalmente con C.',
    },
    fr: {
      title: 'Logique Déductive',
      prompt: 'Si tous les A sont B, et certains B ne sont pas C, quelle conclusion est valide ?',
      options: [
        'Certains A ne sont pas C nécessairement',
        'Il n’est pas garanti que tous les A soient C',
        'Tous les A sont définitivement C',
        'Il n’y a aucun lien entre A et B',
      ],
      explanation: 'Puisque seuls certains B ne sont pas C, rien ne garantit que tous les A soient C.',
    },
    ar: {
      title: 'استنتاج منطقي معقد',
      prompt: 'إذا كان كل (س) هو (ص)، وبعض (ص) ليس (ع)، فما النتيجة المؤكدة دائماً؟',
      options: [
        'بعض (س) ليس (ع) بالضرورة',
        'ليس بالضرورة أن يكون كل (س) تابعاً لـ (ع)',
        'كل (س) هو بالتأكيد (ع)',
        'لا يوجد أي علاقة بين (س) و(ص)',
      ],
      explanation: 'بما أن بعض B ليس C، فلا ضمان بأن عناصر A المحتواة في B تتقاطع بالكامل مع C.',
    },
    bn: {
      title: 'যৌক্তিক অনুমান',
      prompt: 'যদি সকল A হয় B, এবং কিছু B, C না হয়, তবে কোন সিদ্ধান্তটি নিশ্চিতভাবে সত্য?',
      options: [
        'কিছু A নিশ্চিতভাবেই C নয়',
        'সকল A যে C হবে তার কোনো নিশ্চয়তা নেই',
        'সকল A নিশ্চিতভাবেই C',
        'A এবং B এর মধ্যে কোনো সম্পর্ক নেই',
      ],
      explanation: 'যেহেতু কিছু B, C নয়, তাই A সম্পূর্ণভাবে C এর সাথে মিলবে এমন কোনো নিশ্চয়তা নেই।',
    },
    pt: {
      title: 'Lógica Dedutiva',
      prompt: 'Se todos os A são B, e alguns B não são C, que conclusão é estritamente válida?',
      options: [
        'Alguns A não são C necessariamente',
        'Não há garantia de que todos os A sejam C',
        'Todos os A são definitivamente C',
        'Não há relação entre A e B',
      ],
      explanation: 'Como apenas alguns B não são C, não há garantia de que o conjunto A se sobreponha totalmente a C.',
    },
    ru: {
      title: 'Дедуктивная логика',
      prompt: 'Если все А являются В, а некоторые В не являются С, какой вывод строго верен?',
      options: [
        'Некоторые А обязательно не являются С',
        'Не гарантировано, что все А являются С',
        'Все А обязательно являются С',
        'Между А и В нет связи',
      ],
      explanation: 'Так как лишь некоторые В не входят в С, нет гарантии полного совпадения множества А с С.',
    },
    ur: {
      title: 'منطقی استدلال',
      prompt: 'اگر تمام A، B ہیں اور کچھ B، C نہیں ہیں، تو قطعی طور پر درست نتیجہ کیا ہے؟',
      options: [
        'کچھ A لازمی طور پر C نہیں ہیں',
        'اس بات کی کوئی ضمانت نہیں کہ تمام A، C ہوں',
        'تمام A یقینی طور پر C ہیں',
        'A اور B کے درمیان کوئی تعلق نہیں ہے',
      ],
      explanation: 'چونکہ کچھ B، C نہیں ہیں، اس لیے یہ یقینی نہیں کہ تمام A، C میں شامل ہوں۔',
    },
  },

  // ==========================================
  // KNOWLEDGE QUESTIONS
  // ==========================================
  know_01: {
    en: {
      title: 'Continent Capital',
      prompt: 'What is the federal capital of Australia?',
      options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
      explanation: 'Canberra was chosen as a compromise capital between Sydney and Melbourne in 1908.',
    },
    zh: {
      title: '国家首都',
      prompt: '澳大利亚的联邦首都是哪座城市？',
      options: ['悉尼', '墨尔本', '堪培拉', '布里斯班'],
      explanation: '1908年，堪培拉被选为悉尼和墨尔本之间的妥协首都。',
    },
    hi: {
      title: 'महाद्वीप की राजधानी',
      prompt: 'ऑस्ट्रेलिया की संघीय राजधानी क्या है?',
      options: ['सिडनी', 'मेलबर्न', 'कैनबरा', 'ब्रिस्बेन'],
      explanation: 'कैनबरा को 1908 में सिडनी और मेलबर्न के बीच एक समझौते के रूप में चुना गया था।',
    },
    es: {
      title: 'Capital de Continente',
      prompt: '¿Cuál es la capital federal de Australia?',
      options: ['Sídney', 'Melbourne', 'Canberra', 'Brisbane'],
      explanation: 'Canberra fue elegida como capital de compromiso entre Sídney y Melbourne en 1908.',
    },
    fr: {
      title: 'Capitale Fédérale',
      prompt: 'Quelle est la capitale fédérale de l’Australie ?',
      options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
      explanation: 'Canberra a été choisie comme capitale de compromis entre Sydney et Melbourne en 1908.',
    },
    ar: {
      title: 'عاصمة القارة',
      prompt: 'ما هي عاصمة أستراليا الفيدرالية؟',
      options: ['سيدني', 'ملبورن', 'كانبيرا', 'بريسبان'],
      explanation: 'كانبيرا تم اختيارها كعاصمة وسطية بين مدينتي سيدني وملبورن عام 1908.',
    },
    bn: {
      title: 'দেশের রাজধানী',
      prompt: 'অস্ট্রেলিয়ার যুক্তরাষ্ট্রীয় রাজধানী কোনটি?',
      options: ['সিডনি', 'মেলবোর্ন', 'ক্যানবেরা', 'ব্রিসবেন'],
      explanation: '১৯০৮ সালে সিডনি ও মেলবোর্নের মধ্যে সমঝোতা হিসেবে ক্যানবেরাকে রাজধানী নির্বাচিত করা হয়।',
    },
    pt: {
      title: 'Capital Federal',
      prompt: 'Qual é a capital federal da Austrália?',
      options: ['Sydney', 'Melbourne', 'Camberra', 'Brisbane'],
      explanation: 'Camberra foi escolhida em 1908 como um meio-termo entre Sydney e Melbourne.',
    },
    ru: {
      title: 'Столица континента',
      prompt: 'Какова официальная столица Австралии?',
      options: ['Сидней', 'Мельбурн', 'Канберра', 'Брисбен'],
      explanation: 'Канберра была выбрана в качестве компромиссной столицы между Сиднеем и Мельбурном в 1908 году.',
    },
    ur: {
      title: 'ملک کا دارالحکومت',
      prompt: 'آسٹریلیا کا وفاقی دارالحکومت کون سا شہر ہے؟',
      options: ['سڈنی', 'میلبورن', 'کینبرا', 'برسبین'],
      explanation: 'کینبرا کو 1908 میں سڈنی اور میلبورن کے درمیان سمجھوتے کے طور پر دارالحکومت منتخب کیا گیا تھا۔',
    },
  },

  know_02: {
    en: {
      title: 'Solar Proximity',
      prompt: 'Which planet in our solar system is closest to the Sun?',
      options: ['Venus', 'Mercury', 'Mars', 'Earth'],
      explanation: 'Mercury is the closest planet to the Sun, orbiting in 88 Earth days.',
    },
    zh: {
      title: '太阳系行星',
      prompt: '太阳系中距离太阳最近的行星是哪一颗？',
      options: ['金星', '水星', '火星', '地球'],
      explanation: '水星是距离太阳最近的行星，公转周期约为88个地球日。',
    },
    hi: {
      title: 'सूर्य की निकटता',
      prompt: 'हमारे सौर मंडल में सूर्य के सबसे निकट कौन सा ग्रह है?',
      options: ['शुक्र', 'बुध', 'मंगल', 'पृथ्वी'],
      explanation: 'बुध सूर्य के सबसे निकटतम ग्रह है और 88 दिनों में सूर्य की परिक्रमा करता है।',
    },
    es: {
      title: 'Proximidad Solar',
      prompt: '¿Qué planeta del sistema solar está más cerca del Sol?',
      options: ['Venus', 'Mercurio', 'Marte', 'Tierra'],
      explanation: 'Mercurio es el planeta más cercano al Sol y tarda 88 días terrestres en orbitarlo.',
    },
    fr: {
      title: 'Proximité Solaire',
      prompt: 'Quelle planète de notre système solaire est la plus proche du Soleil ?',
      options: ['Vénus', 'Mercure', 'Mars', 'Terre'],
      explanation: 'Mercure est la planète la plus proche du Soleil, accomplissant son orbite en 88 jours terrestres.',
    },
    ar: {
      title: 'أقرب الكواكب',
      prompt: 'أي الكواكب في نظامنا الشمسي هو الأقرب إلى الشمس؟',
      options: ['الزهرة', 'عطارد', 'المريخ', 'الأرض'],
      explanation: 'عطارد هو الكوكب الأقرب للشمس ويدور حولها في 88 يوماً أرضياً.',
    },
    bn: {
      title: 'সূর্যের নিকটবর্তী গ্রহ',
      prompt: 'সৌরজগতের কোন গ্রহটি সূর্যের সবচেয়ে কাছে অবস্থিত?',
      options: ['শুক্র', 'বুধ', 'মঙ্গল', 'পৃথিবী'],
      explanation: 'বুধ সূর্যের সবচেয়ে কাছের গ্রহ এবং এটি ৮৮ দিনে সূর্যকে প্রদক্ষিণ করে।',
    },
    pt: {
      title: 'Proximidade Solar',
      prompt: 'Qual planeta do sistema solar está mais próximo do Sol?',
      options: ['Vênus', 'Mercúrio', 'Marte', 'Terra'],
      explanation: 'Mercúrio é o planeta mais próximo do Sol e completa sua órbita em 88 dias terrestres.',
    },
    ru: {
      title: 'Ближайшая планета',
      prompt: 'Какая планета Солнечной системы расположена ближе всего к Солнцу?',
      options: ['Венера', 'Меркурий', 'Марс', 'Земля'],
      explanation: 'Меркурий — ближайшая к Солнцу планета, совершающая оборот за 88 земных дней.',
    },
    ur: {
      title: 'سورج سے قریب ترین سیارہ',
      prompt: 'ہمارے نظام شمسی میں سورج کے سب سے قریب کون سا سیارہ ہے؟',
      options: ['زہرہ', 'عطارد', 'مریخ', 'زمین'],
      explanation: 'عطارد سورج کے قریب ترین سیارہ ہے اور 88 زمین کے دنوں میں اس کا چکر لگاتا ہے۔',
    },
  },

  know_03: {
    en: {
      title: 'Atmospheric Gas',
      prompt: 'What is the most abundant chemical element in Earth atmosphere?',
      options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'],
      explanation: 'Nitrogen gas accounts for approximately 78% of Earth atmosphere by volume.',
    },
    zh: {
      title: '大气成分',
      prompt: '地球大气中含量最丰富的化学元素是什么？',
      options: ['氧气', '氮气', '二氧化碳', '氩气'],
      explanation: '氮气约占地球大气总体积的78%。',
    },
    hi: {
      title: 'वायुमंडलीय गैस',
      prompt: 'पृथ्वी के वायुमंडल में सबसे प्रचुर रासायनिक तत्व कौन सा है?',
      options: ['ऑक्सीजन', 'नाइट्रोजन', 'कार्बन डाइऑक्साइड', 'आर्गन'],
      explanation: 'नाइट्रोजन गैस पृथ्वी के वायुमंडल की मात्रा का लगभग 78% हिस्सा है।',
    },
    es: {
      title: 'Gas Atmosférico',
      prompt: '¿Cuál es el elemento químico más abundante en la atmósfera terrestre?',
      options: ['Oxígeno', 'Nitrógeno', 'Dióxido de carbono', 'Argón'],
      explanation: 'El nitrógeno representa aproximadamente el 78% del volumen de la atmósfera.',
    },
    fr: {
      title: 'Gaz Atmosphérique',
      prompt: 'Quel est l’élément chimique le plus abondant dans l’atmosphère terrestre ?',
      options: ['Oxygène', 'Azote', 'Dioxyde de carbone', 'Argon'],
      explanation: 'Le diazote (azote) représente environ 78% du volume de l’atmosphère terrestre.',
    },
    ar: {
      title: 'غازات الغلاف الجوي',
      prompt: 'ما هو العنصر الكيميائي الأكثر وفرة في الغلاف الجوي للأرض؟',
      options: ['الأكسجين', 'النيتروجين', 'ثاني أكسيد الكربون', 'الأرجون'],
      explanation: 'يشكل غاز النيتروجين حوالي 78% من حجم الغلاف الجوي للأرض.',
    },
    bn: {
      title: 'বায়ুমণ্ডলীয় গ্যাস',
      prompt: 'পৃথিবীর বায়ুমণ্ডলে সবচেয়ে বেশি পরিমাণে কোন রাসায়নিক উপাদান রয়েছে?',
      options: ['অক্সিজেন', 'নাইট্রোজেন', 'কার্বন ডাই অক্সাইড', 'আর্গন'],
      explanation: 'নাইট্রোজেন গ্যাস পৃথিবীর বায়ুমণ্ডলের আয়তনের প্রায় ৭৮% গঠন করে।',
    },
    pt: {
      title: 'Gás Atmosférico',
      prompt: 'Qual é o elemento químico mais abundante na atmosfera terrestre?',
      options: ['Oxigênio', 'Nitrogênio', 'Dióxido de carbono', 'Argônio'],
      explanation: 'O nitrogênio compõe aproximadamente 78% do volume da atmosfera terrestre.',
    },
    ru: {
      title: 'Атмосферный газ',
      prompt: 'Какой химический элемент наиболее распространен в атмосфере Земли?',
      options: ['Кислород', 'Азот', 'Углекислый газ', 'Аргон'],
      explanation: 'Азот составляет около 78% объема земной атмосферы.',
    },
    ur: {
      title: 'فضائی گیس',
      prompt: 'زمین کے کرۂ ہوائی میں سب سے زیادہ پایا جانے والا عنصر کون سا ہے؟',
      options: ['آکسیجن', 'نائٹروجن', 'کاربن ڈائی آکسائیڈ', 'آرگن'],
      explanation: 'نائٹروجن گیس زمین کے فضا کا تقریباً 78 فیصد حجم بناتی ہے۔',
    },
  },

  // ==========================================
  // MATH QUESTIONS
  // ==========================================
  math_01: {
    en: {
      title: 'Mental Addition',
      prompt: 'Calculate the total accurately:',
      explanation: '47 + 68 = 115.',
    },
    zh: {
      title: '心算加法',
      prompt: '请快速准确计算下列等式：',
      explanation: '47 + 68 = 115。',
    },
    hi: {
      title: 'मानसिक जोड़',
      prompt: 'सटीक गणना करें:',
      explanation: '47 + 68 = 115।',
    },
    es: {
      title: 'Suma Mental',
      prompt: 'Calcula el total con precisión:',
      explanation: '47 + 68 = 115.',
    },
    fr: {
      title: 'Addition Mentale',
      prompt: 'Calculez rapidement le résultat :',
      explanation: '47 + 68 = 115.',
    },
    ar: {
      title: 'جمع ذهني سريع',
      prompt: 'احسب الناتج بأسرع وقت بدقة:',
      explanation: '47 + 68 = 115.',
    },
    bn: {
      title: 'মানসিক যোগ',
      prompt: 'দ্রুত সঠিক ফলাফল নির্ণয় করুন:',
      explanation: '৪৭ + ৬৮ = ১১৫।',
    },
    pt: {
      title: 'Adição Mental',
      prompt: 'Calcule o total com rapidez e precisão:',
      explanation: '47 + 68 = 115.',
    },
    ru: {
      title: 'Устный счет',
      prompt: 'Вычислите результат сложения:',
      explanation: '47 + 68 = 115.',
    },
    ur: {
      title: 'ذہنی جمع',
      prompt: 'درست جواب کا حساب لگائیں:',
      explanation: '47 + 68 = 115۔',
    },
  },

  math_02: {
    en: {
      title: 'Rapid Multiplication',
      prompt: 'Solve the equation before time runs out:',
      explanation: '14 × 16 = (15 - 1)(15 + 1) = 225 - 1 = 224.',
    },
    zh: {
      title: '快速乘法',
      prompt: '在倒计时结束前计算结果：',
      explanation: '14 × 16 = (15 - 1)(15 + 1) = 225 - 1 = 224。',
    },
    hi: {
      title: 'तेज़ गुणा',
      prompt: 'समय समाप्त होने से पहले समीकरण हल करें:',
      explanation: '14 × 16 = 224।',
    },
    es: {
      title: 'Multiplicación Rápida',
      prompt: 'Resuelve la ecuación antes de que se acabe el tiempo:',
      explanation: '14 × 16 = (15 - 1)(15 + 1) = 225 - 1 = 224.',
    },
    fr: {
      title: 'Multiplication Rapide',
      prompt: 'Résolvez l’équation avant la fin du temps :',
      explanation: '14 × 16 = (15 - 1)(15 + 1) = 225 - 1 = 224.',
    },
    ar: {
      title: 'ضرب سريع',
      prompt: 'حل المعادلة قبل انتهاء المؤقت:',
      explanation: '14 × 16 = 224.',
    },
    bn: {
      title: 'দ্রুত গুণ',
      prompt: 'সময় শেষ হওয়ার আগেই সমাধান করুন:',
      explanation: '১৪ × ১৬ = ২২৪।',
    },
    pt: {
      title: 'Multiplicação Rápida',
      prompt: 'Resolva a equação antes que o tempo acabe:',
      explanation: '14 × 16 = (15 - 1)(15 + 1) = 225 - 1 = 224.',
    },
    ru: {
      title: 'Быстрое умножение',
      prompt: 'Решите уравнение до истечения времени:',
      explanation: '14 × 16 = (15 - 1)(15 + 1) = 225 - 1 = 224.',
    },
    ur: {
      title: 'تیز ضرب',
      prompt: 'وقت ختم ہونے سے پہلے حساب مکمل کریں:',
      explanation: '14 × 16 = 224۔',
    },
  },

  // ==========================================
  // FOCUS / ODD ONE OUT QUESTIONS
  // ==========================================
  foc_01: {
    en: {
      title: 'Odd Symbol',
      prompt: 'Find the different symbol hidden in the grid below as fast as possible:',
      explanation: 'The unique symbol "O" is hidden amongst the grid of "Q".',
    },
    zh: {
      title: '辨识异类',
      prompt: '在下方网格中尽快找到唯一的不同符号：',
      explanation: '在字符 Q 的矩阵中隐藏着一个字母 O。',
    },
    hi: {
      title: 'विचित्र प्रतीक खोजें',
      prompt: 'नीचे दिए गए ग्रिड में छिपे अलग प्रतीक को जल्द से जल्द खोजें:',
      explanation: 'Q के ग्रिड में छिपा हुआ अकेला प्रतीक O है।',
    },
    es: {
      title: 'Símbolo Diferente',
      prompt: 'Encuentra el símbolo diferente oculto en la cuadrícula:',
      explanation: 'El símbolo único "O" está oculto entre las "Q".',
    },
    fr: {
      title: 'Intrus Visuel',
      prompt: 'Trouvez le symbole différent caché dans la grille :',
      explanation: 'Le symbole unique "O" est dissimulé parmi les "Q".',
    },
    ar: {
      title: 'اكتشف الرمز المختلف',
      prompt: 'انقر على الرمز الشاذ والمختلف بين الرموز بأسرع ما يمكن:',
      explanation: 'الرمز المختلف هو الحرف O بين مجموعة كبيرة من أحرف Q.',
    },
    bn: {
      title: 'ভিন্ন প্রতীক খুঁজুন',
      prompt: 'গ্রিডের মধ্যে লুকিয়ে থাকা ভিন্ন প্রতীকটি দ্রুত চিহ্নিত করুন:',
      explanation: 'Q-এর গ্রিডে ভিন্ন প্রতীকটি হলো O।',
    },
    pt: {
      title: 'Símbolo Diferente',
      prompt: 'Encontre o símbolo diferente escondido na grade o mais rápido possível:',
      explanation: 'O símbolo diferente "O" está escondido entre os "Q".',
    },
    ru: {
      title: 'Найдите лишнее',
      prompt: 'Найдите отличающийся символ в сетке как можно быстрее:',
      explanation: 'Среди множества символов Q скрыта буква O.',
    },
    ur: {
      title: 'مختلف علامت تلاش کریں',
      prompt: 'گرڈ میں چھپی ہوئی مختلف علامت کو جلد از جلد منتخب کریں:',
      explanation: 'حروف Q کے درمیان الگ علامت O ہے۔',
    },
  },

  // ==========================================
  // SPEED / MEMORY QUESTIONS
  // ==========================================
  spd_01: {
    en: {
      title: 'Memory Pattern Recall',
      prompt: 'Watch the sequence flash on the pads, then repeat it in exact order:',
      explanation: 'Instant working memory activates cognitive recall circuits.',
    },
    zh: {
      title: '速记按键复现',
      prompt: '仔细观察闪烁的色块顺序，随后按相同顺序点击：',
      explanation: '即时工作记忆可以有效激活大脑神经突触。',
    },
    hi: {
      title: 'त्वरित याददाश्त',
      prompt: 'पैड पर चमकने वाले क्रम को ध्यान से देखें और उसी क्रम में दोहराएं:',
      explanation: 'कार्यशील स्मृति संज्ञानात्मक सजगता को बढ़ाती है।',
    },
    es: {
      title: 'Memoria de Secuencia',
      prompt: 'Observa la secuencia en los paneles y repítela en el orden exacto:',
      explanation: 'La memoria de trabajo instantánea estimula la agilidad cognitiva.',
    },
    fr: {
      title: 'Rappel de Séquence',
      prompt: 'Observez la séquence lumineuse puis reproduisez-la dans l’ordre exact :',
      explanation: 'La mémoire de travail rapide active la réactivité cérébrale.',
    },
    ar: {
      title: 'تذكر التسلسل البصري',
      prompt: 'شاهد وميض الأزرار الملونة ثم أعد النقر عليها بنفس الترتيب تماماً:',
      explanation: 'التدريب على استرجاع الذاكرة اللحظية ينشط المراكز الإدراكية.',
    },
    bn: {
      title: 'মেমরি সিকোয়েন্স',
      prompt: 'প্যাডে ভেসে ওঠা ক্রমটি দেখুন এবং হুবহু সেই ক্রমে স্পর্শ করুন:',
      explanation: 'ক্ষণস্থায়ী স্মৃতি মনোযোগ ও প্রতিচ্ছবি ক্ষমতা উন্নত করে।',
    },
    pt: {
      title: 'Memória Sequencial',
      prompt: 'Observe a sequência nos botões e repita-a na ordem exata:',
      explanation: 'A memória de trabalho rápida estimula a agilidade mental.',
    },
    ru: {
      title: 'Мгновенная память',
      prompt: 'Запомните последовательность вспышек и повторите в точном порядке:',
      explanation: 'Кратковременная рабочая память активирует нейроны внимания.',
    },
    ur: {
      title: 'بصری ترتیب کی یادداشت',
      prompt: 'رنگین بٹنوں کے جلنے کی ترتیب دیکھیں اور اسی ترتیب سے دبائیں:',
      explanation: 'فوری یادداشت دماغی مشق کے لیے انتہائی مفید ہے۔',
    },
  },

  // ==========================================
  // GEOGRAPHY QUESTIONS
  // ==========================================
  geo_01: {
    en: {
      title: 'Largest Ocean',
      prompt: 'What is the largest ocean on Earth by surface area and depth?',
      options: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'],
      explanation: 'The Pacific Ocean is the largest, covering more than 30% of the Earth total surface.',
    },
    zh: {
      title: '最大大洋',
      prompt: '地球上面积最大、平均水深最深的大洋是哪一个？',
      options: ['太平洋', '大西洋', '印度洋', '北冰洋'],
      explanation: '太平洋是最大的海洋，面积占地球总表面积的30%以上。',
    },
    hi: {
      title: 'सबसे बड़ा महासागर',
      prompt: 'सतह क्षेत्र और गहराई के मामले में पृथ्वी पर सबसे बड़ा महासागर कौन सा है?',
      options: ['प्रशांत महासागर', 'अटलांटिक महासागर', 'हिंद महासागर', 'आर्कटिक महासागर'],
      explanation: 'प्रशांत महासागर सबसे बड़ा है, जो पृथ्वी की कुल सतह के 30% से अधिक हिस्से को कवर करता है।',
    },
    es: {
      title: 'El Océano Más Grande',
      prompt: '¿Cuál es el océano más grande de la Tierra por superficie y profundidad?',
      options: ['Océano Pacífico', 'Océano Atlántico', 'Océano Índico', 'Océano Ártico'],
      explanation: 'El Océano Pacífico es el más grande, cubriendo más del 30% de la superficie terrestre.',
    },
    fr: {
      title: 'Le Plus Grand Océan',
      prompt: 'Quel est le plus grand océan de la Terre par sa superficie et sa profondeur ?',
      options: ['Océan Pacifique', 'Océan Atlantique', 'Océan Indien', 'Océan Arctique'],
      explanation: 'L’océan Pacifique est le plus vaste, couvrant plus de 30% de la surface terrestre.',
    },
    ar: {
      title: 'أكبر محيطات الأرض',
      prompt: 'ما هو أكبر محيطات كوكب الأرض من حيث المساحة والعمق؟',
      options: ['المحيط الهادئ', 'المحيط الأطلسي', 'المحيط الهندي', 'المحيط المتجمد الشمالي'],
      explanation: 'المحيط الهادئ هو الأكبر ويغطي أكثر من 30% من مساحة سطح الأرض الكلية.',
    },
    bn: {
      title: 'বৃহত্তম মহাসাগর',
      prompt: 'আয়তন এবং গভীরতার দিক থেকে পৃথিবীর বৃহত্তম মহাসাগর কোনটি?',
      options: ['প্রশান্ত মহাসাগর', 'আটলান্টিক মহাসাগর', 'ভারত মহাসাগর', 'উত্তর মহাসাগর'],
      explanation: 'প্রশান্ত মহাসাগর পৃথিবীর মোট পৃষ্ঠের ৩০% এরও বেশি জুড়ে বিস্তৃত।',
    },
    pt: {
      title: 'Maior Oceano',
      prompt: 'Qual é o maior oceano da Terra em área de superfície e profundidade?',
      options: ['Oceano Pacífico', 'Oceano Atlântico', 'Oceano Índico', 'Oceano Ártico'],
      explanation: 'O Oceano Pacífico é o maior, cobrindo mais de 30% da superfície do planeta.',
    },
    ru: {
      title: 'Крупнейший океан',
      prompt: 'Какой океан Земли является самым большим по площади и глубине?',
      options: ['Тихий океан', 'Атлантический океан', 'Индийский океан', 'Северный Ледовитый океан'],
      explanation: 'Тихий океан — крупнейший на планете, покрывающий более 30% поверхности Земли.',
    },
    ur: {
      title: 'سب سے بڑا سمندر',
      prompt: 'رقبے اور گہرائی کے لحاظ سے زمین کا سب سے بڑا سمندر کون سا ہے؟',
      options: ['بحر الکاہل (Pacific)', 'بحر اوقیانوس (Atlantic)', 'بحر ہند (Indian)', 'بحر منجمد شمالی'],
      explanation: 'بحر الکاہل دنیا کا سب سے بڑا سمندر ہے جو زمین کی سطح کے 30 فیصد سے زائد پر پھیلا ہوا ہے۔',
    },
  },

  // ==========================================
  // SCIENCE QUESTIONS
  // ==========================================
  sci_01: {
    en: {
      title: 'States of Matter',
      prompt: 'What is the physical process of transition directly from solid to gas?',
      options: ['Sublimation', 'Condensation', 'Melting', 'Evaporation'],
      explanation: 'Sublimation is the direct phase change from solid to gas without passing through a liquid phase.',
    },
    zh: {
      title: '物质物态',
      prompt: '物质直接从固态转变为气态的物理过程称为什么？',
      options: ['升华 (Sublimation)', '凝结', '熔化', '蒸发'],
      explanation: '升华是指物质不经过液态而直接从固态变成气态的过程（如干冰）。',
    },
    hi: {
      title: 'पदार्थ की अवस्थाएं',
      prompt: 'ठोस से सीधे गैस में संक्रमण की भौतिक प्रक्रिया क्या है?',
      options: ['ऊर्ध्वपातन (Sublimation)', 'संघनन', 'पिघलना', 'वाष्पीकरण'],
      explanation: 'ऊर्ध्वपातन वह प्रक्रिया है जिसमें पदार्थ बिना तरल बने सीधे ठोस से गैस में बदल जाता है।',
    },
    es: {
      title: 'Estados de la Materia',
      prompt: '¿Cómo se llama el proceso de transición directa de sólido a gas?',
      options: ['Sublimación', 'Condensación', 'Fusión', 'Evaporación'],
      explanation: 'La sublimación es el cambio de fase directo de sólido a gas sin pasar por líquido.',
    },
    fr: {
      title: 'États de la Matière',
      prompt: 'Quel est le processus physique de passage direct de l’état solide à l’état gazeux ?',
      options: ['Sublimation', 'Condensation', 'Fusion', 'Évaporation'],
      explanation: 'La sublimation est le passage direct du solide au gaz sans passer par la phase liquide.',
    },
    ar: {
      title: 'حالات المادة',
      prompt: 'ما هي العملية الفيزيائية لتحول المادة مباشرة من الحالة الصلبة إلى الغازية؟',
      options: ['التسامي (Sublimation)', 'التكثف', 'الانصهار', 'التبخر'],
      explanation: 'التسامي هو التحول المباشر من الصلب إلى الغاز دون المرور بالحالة السائلة مثل الجليد الجاف.',
    },
    bn: {
      title: 'পদার্থের অবস্থা',
      prompt: 'কঠিন থেকে সরাসরি গ্যাসে রূপান্তরিত হওয়ার ভৌত প্রক্রিয়াটিকে কী বলা হয়?',
      options: ['উর্ধ্বপাতন (Sublimation)', 'ঘনীভবন', 'গলন', 'বাষ্পীভবন'],
      explanation: 'উর্ধ্বপাতন হলো তরল অবস্থা ছাড়াই সরাসরি কঠিন থেকে গ্যাসে রূপান্তর।',
    },
    pt: {
      title: 'Estados da Matéria',
      prompt: 'Qual é o processo físico de transição direta do estado sólido para o gasoso?',
      options: ['Sublimação', 'Condensação', 'Fusão', 'Evaporação'],
      explanation: 'A sublimação é a mudança de fase direta de sólido para gás sem passar pelo estado líquido.',
    },
    ru: {
      title: 'Агрегатные состояния',
      prompt: 'Как называется физический переход вещества напрямую из твердого состояния в газообразное?',
      options: ['Сублимация', 'Конденсация', 'Плавление', 'Испарение'],
      explanation: 'Сублимация (возгонка) — переход из твёрдого состояния сразу в газообразное без жидкости.',
    },
    ur: {
      title: 'مادے کی حالتیں',
      prompt: 'ٹھوس حالت سے براہ راست گیس میں تبدیل ہونے کا عمل کیا کہلاتا ہے؟',
      options: ['تصعید (Sublimation)', 'تکثیف', 'پگھلنا', 'بخارات بننا'],
      explanation: 'تصعید ٹھوس سے براہ راست گیس بننے کا عمل ہے جس میں مائع حالت نہیں آتی۔',
    },
  },

  // ==========================================
  // HISTORY QUESTIONS
  // ==========================================
  his_01: {
    en: {
      title: 'Ancient Wonders',
      prompt: 'Which of the Seven Wonders of the Ancient World is still standing today?',
      options: ['Great Pyramid of Giza', 'Hanging Gardens of Babylon', 'Lighthouse of Alexandria', 'Colossus of Rhodes'],
      explanation: 'The Great Pyramid of Giza in Egypt is the only surviving ancient world wonder.',
    },
    zh: {
      title: '古代奇迹',
      prompt: '古代世界七大奇迹中，哪一座至今依然屹立于世？',
      options: ['吉萨大金字塔', '巴比伦空中花园', '亚历山大灯塔', '罗德岛太阳神巨像'],
      explanation: '位于埃及的吉萨大金字塔是古代世界七大奇迹中唯一完整幸存至今的奇迹。',
    },
    hi: {
      title: 'प्राचीन अजूबे',
      prompt: 'प्राचीन विश्व के सात अजूबों में से कौन सा आज भी मौजूद है?',
      options: ['गीज़ा का महान पिरामिड', 'बेबीलोन के हैंगिंग गार्डन', 'अलेक्जेंड्रिया का लाइटहाउस', 'रोड्स का कोलोसस'],
      explanation: 'मिस्र में गीज़ा का महान पिरामिड प्राचीन दुनिया का एकमात्र जीवित अजूबा है।',
    },
    es: {
      title: 'Maravillas Antiguas',
      prompt: '¿Cuál de las Siete Maravillas del Mundo Antiguo sigue en pie hoy en día?',
      options: ['Gran Pirámide de Guiza', 'Jardines Colgantes de Babilonia', 'Faro de Alejandría', 'Coloso de Rodas'],
      explanation: 'La Gran Pirámide de Guiza en Egipto es la única maravilla del mundo antiguo que aún existe.',
    },
    fr: {
      title: 'Merveilles Antiques',
      prompt: 'Laquelle des sept merveilles du monde antique est encore debout aujourd’hui ?',
      options: ['Grande Pyramide de Gizeh', 'Jardins suspendus de Babylone', 'Phare d’Alexandrie', 'Colosse de Rhodes'],
      explanation: 'La Grande Pyramide de Gizeh en Égypte est la seule merveille antique encore conservée.',
    },
    ar: {
      title: 'عجائب العالم القديم',
      prompt: 'أي من عجائب العالم القديمة السبع لا تزال قائمة حتى عصرنا الحالي؟',
      options: ['الهرم الأكبر في الجيزة', 'حدائق بابل المعلقة', 'منارة الإسكندرية', 'تمثال رودس'],
      explanation: 'الهرم الأكبر في الجيزة بمصر هو العجيبة الوحيدة المتبقية من عجائب العالم القديم.',
    },
    bn: {
      title: 'প্রাচীন সপ্তাশ্চর্য',
      prompt: 'প্রাচীন বিশ্বের সপ্তাশ্চর্যের মধ্যে কোনটি আজ পর্যন্ত টিকে রয়েছে?',
      options: ['গিজার মহাগোপুরম (পিরামিড)', 'ব্যাবিলনের ঝুলন্ত বাগান', 'আলেকজান্দ্রিয়ার বাতিঘর', 'রোডস-এর কলোসাস'],
      explanation: 'মিশরের গিজার মহা পিরামিড প্রাচীন বিশ্বের একমাত্র টিকে থাকা বিস্ময়।',
    },
    pt: {
      title: 'Maravilhas Antigas',
      prompt: 'Qual das Sete Maravillas do Mundo Antigo ainda está de pé hoje?',
      options: ['Grande Pirâmide de Gizé', 'Jardins Suspensos da Babilônia', 'Farol de Alexandria', 'Colosso de Rodes'],
      explanation: 'A Grande Pirâmide de Gizé, no Egito, é a única maravilha antiga que sobreviveu até hoje.',
    },
    ru: {
      title: 'Чудеса древнего мира',
      prompt: 'Какое из семи чудес античного мира сохранилось до наших дней?',
      options: ['Пирамида Хеопса в Гизе', 'Висячие сады Семирамиды', 'Александрийский маяк', 'Колосс Родосский'],
      explanation: 'Пирамида Хеопса в Египте — единственное сохранившееся чудо древнего мира.',
    },
    ur: {
      title: 'قدیم عجائبات',
      prompt: 'قدیم دنیا کے سات عجائبات میں سے کون سا آج بھی موجود ہے؟',
      options: ['جیزہ کا عظیم اہرام', 'بابل کے معلق باغات', 'اسکندریہ کا لائٹ ہاؤس', 'روڈس کا مجسمہ'],
      explanation: 'مصر میں جیزہ کا عظیم اہرام دنیا کے قدیم عجائبات میں واحد باقی ماندہ عجوبہ ہے۔',
    },
  },
};

/**
 * Returns a cloned QuestionItem fully localized into the requested SupportedLanguage
 */
export function getLocalizedQuestion(question: QuestionItem, language: SupportedLanguage): QuestionItem {
  const trans = QUESTION_TRANSLATIONS[question.id]?.[language];
  const isRtl = language === 'ar' || language === 'ur';

  if (trans) {
    return {
      ...question,
      localizedQuestion: trans.prompt,
      localizedExplanation: trans.explanation,
      options: trans.options || question.options,
    };
  }

  // Fallback if specific translation is not explicitly defined
  if (language === 'ar' || language === 'ur') {
    return {
      ...question,
      localizedQuestion: question.promptAr || question.promptEn,
      localizedExplanation: question.explanationAr || question.explanationEn,
      options: question.optionsAr || question.optionsEn,
    };
  }

  return {
    ...question,
    localizedQuestion: question.promptEn,
    localizedExplanation: question.explanationEn,
    options: question.optionsEn || question.options,
  };
}
