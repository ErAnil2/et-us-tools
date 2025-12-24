// Comprehensive search data for all tools
export interface SearchItem {
  name: string;
  url: string;
  category: 'Calculator' | 'Game' | 'App';
  keywords: string[];
  icon: string;
}

export const allTools: SearchItem[] = [
  // === CALCULATORS ===
  // Financial
  { name: 'SIP Calculator', url: '/us/tools/calculators/sip-calculator', category: 'Calculator', keywords: ['sip', 'mutual fund', 'investment', 'returns'], icon: '💰' },
  { name: 'EMI Calculator', url: '/us/tools/calculators/emi-calculator', category: 'Calculator', keywords: ['emi', 'loan', 'monthly payment', 'installment'], icon: '🏦' },
  { name: 'Loan Calculator', url: '/us/tools/calculators/loan-calculator', category: 'Calculator', keywords: ['loan', 'interest', 'payment', 'debt'], icon: '💳' },
  { name: 'Compound Interest Calculator', url: '/us/tools/calculators/compound-interest-calculator', category: 'Calculator', keywords: ['compound', 'interest', 'investment', 'growth'], icon: '📈' },
  { name: 'Mortgage Calculator', url: '/us/tools/calculators/mortgage-payment-calculator', category: 'Calculator', keywords: ['mortgage', 'home loan', 'house payment'], icon: '🏠' },
  { name: 'Mortgage Amortization', url: '/us/tools/calculators/mortgage-amortization-calculator', category: 'Calculator', keywords: ['mortgage', 'amortization', 'schedule'], icon: '🏡' },
  { name: '401k Calculator', url: '/us/tools/calculators/401k-calculator', category: 'Calculator', keywords: ['401k', 'retirement', 'savings'], icon: '💼' },
  { name: 'Retirement Calculator', url: '/us/tools/calculators/retirement-calculator', category: 'Calculator', keywords: ['retirement', 'pension', 'savings'], icon: '🏖️' },
  { name: 'Salary Calculator', url: '/us/tools/calculators/salary-calculator', category: 'Calculator', keywords: ['salary', 'wage', 'income', 'pay'], icon: '💵' },
  { name: 'Tip Calculator', url: '/us/tools/calculators/tip-calculator', category: 'Calculator', keywords: ['tip', 'gratuity', 'restaurant', 'bill'], icon: '🍽️' },
  { name: 'Discount Calculator', url: '/us/tools/calculators/discount-calculator', category: 'Calculator', keywords: ['discount', 'sale', 'percent off', 'savings'], icon: '🏷️' },
  { name: 'Credit Card Payoff', url: '/us/tools/calculators/credit-card-payoff-calculator', category: 'Calculator', keywords: ['credit card', 'debt', 'payoff'], icon: '💳' },
  { name: 'Currency Converter', url: '/us/tools/calculators/currency-converter', category: 'Calculator', keywords: ['currency', 'exchange', 'forex', 'money'], icon: '💱' },
  { name: 'Inflation Calculator', url: '/us/tools/calculators/inflation-calculator', category: 'Calculator', keywords: ['inflation', 'cost', 'value'], icon: '📊' },
  { name: 'Budget Calculator', url: '/us/tools/calculators/budget-calculator', category: 'Calculator', keywords: ['budget', 'spending', 'finance'], icon: '📋' },
  { name: 'Net Worth Calculator', url: '/us/tools/calculators/net-worth-calculator', category: 'Calculator', keywords: ['net worth', 'assets', 'wealth'], icon: '💰' },
  { name: 'Car Loan Calculator', url: '/us/tools/calculators/car-loan-calculator', category: 'Calculator', keywords: ['car loan', 'auto loan', 'vehicle'], icon: '🚗' },
  { name: 'Auto Loan Calculator', url: '/us/tools/calculators/auto-loan-calculator', category: 'Calculator', keywords: ['auto loan', 'car payment', 'vehicle'], icon: '🚙' },
  { name: 'Investment Growth', url: '/us/tools/calculators/investment-growth-calculator', category: 'Calculator', keywords: ['investment', 'growth', 'returns'], icon: '📈' },
  { name: 'CAGR Calculator', url: '/us/tools/calculators/cagr-calculator', category: 'Calculator', keywords: ['cagr', 'compound annual growth'], icon: '📊' },
  { name: 'FD Calculator', url: '/us/tools/calculators/fd-calculator', category: 'Calculator', keywords: ['fixed deposit', 'fd', 'interest'], icon: '🏦' },
  { name: 'Lumpsum Calculator', url: '/us/tools/calculators/lumpsum-calculator', category: 'Calculator', keywords: ['lumpsum', 'one time investment'], icon: '💵' },

  // Health & Fitness
  { name: 'BMI Calculator', url: '/us/tools/calculators/bmi-calculator', category: 'Calculator', keywords: ['bmi', 'body mass index', 'weight', 'health'], icon: '❤️' },
  { name: 'BMR Calculator', url: '/us/tools/calculators/bmr-calculator', category: 'Calculator', keywords: ['bmr', 'metabolism', 'calories'], icon: '🔥' },
  { name: 'Calorie Calculator', url: '/us/tools/calculators/calorie-calculator', category: 'Calculator', keywords: ['calorie', 'diet', 'nutrition', 'food'], icon: '🍎' },
  { name: 'TDEE Calculator', url: '/us/tools/calculators/tdee-calculator', category: 'Calculator', keywords: ['tdee', 'energy expenditure', 'calories'], icon: '⚡' },
  { name: 'Body Fat Calculator', url: '/us/tools/calculators/body-fat-calculator', category: 'Calculator', keywords: ['body fat', 'percentage', 'fitness'], icon: '💪' },
  { name: 'Ideal Weight Calculator', url: '/us/tools/calculators/ideal-weight-calculator', category: 'Calculator', keywords: ['ideal weight', 'target weight'], icon: '⚖️' },
  { name: 'Pregnancy Calculator', url: '/us/tools/calculators/pregnancy-due-date-calculator', category: 'Calculator', keywords: ['pregnancy', 'due date', 'baby'], icon: '👶' },
  { name: 'Ovulation Calculator', url: '/us/tools/calculators/ovulation-calculator', category: 'Calculator', keywords: ['ovulation', 'fertility', 'period'], icon: '📅' },
  { name: 'Blood Pressure', url: '/us/tools/calculators/blood-pressure-calculator', category: 'Calculator', keywords: ['blood pressure', 'health'], icon: '❤️' },
  { name: 'Blood Sugar', url: '/us/tools/calculators/blood-sugar-calculator', category: 'Calculator', keywords: ['blood sugar', 'glucose', 'diabetes'], icon: '🩸' },
  { name: 'Water Intake', url: '/us/tools/calculators/water-intake-calculator', category: 'Calculator', keywords: ['water', 'hydration', 'drink'], icon: '💧' },
  { name: 'Sleep Calculator', url: '/us/tools/calculators/sleep-calculator', category: 'Calculator', keywords: ['sleep', 'rest', 'bedtime'], icon: '😴' },

  // Math & Science
  { name: 'Percentage Calculator', url: '/us/tools/calculators/percentage-calculator', category: 'Calculator', keywords: ['percentage', 'percent', 'ratio'], icon: '📊' },
  { name: 'Percentage Change', url: '/us/tools/calculators/percentage-change-calculator', category: 'Calculator', keywords: ['percentage change', 'increase', 'decrease'], icon: '📈' },
  { name: 'Average Calculator', url: '/us/tools/calculators/average-calculator', category: 'Calculator', keywords: ['average', 'mean', 'statistics'], icon: '📐' },
  { name: 'GPA Calculator', url: '/us/tools/calculators/gpa-calculator', category: 'Calculator', keywords: ['gpa', 'grade point', 'grades'], icon: '🎓' },
  { name: 'Grade Calculator', url: '/us/tools/calculators/grade-calculator', category: 'Calculator', keywords: ['grade', 'score', 'marks'], icon: '📚' },
  { name: 'Long Division', url: '/us/tools/calculators/long-division-calculator', category: 'Calculator', keywords: ['division', 'math', 'remainder'], icon: '➗' },
  { name: 'Modulo Calculator', url: '/us/tools/calculators/modulo-calculator', category: 'Calculator', keywords: ['modulo', 'remainder', 'mod'], icon: '🔢' },
  { name: 'Binary Calculator', url: '/us/tools/calculators/binary-calculator', category: 'Calculator', keywords: ['binary', 'base 2', 'conversion'], icon: '💻' },
  { name: 'Area Calculator', url: '/us/tools/calculators/area-calculator', category: 'Calculator', keywords: ['area', 'square', 'geometry'], icon: '📐' },
  { name: 'Volume Calculator', url: '/us/tools/calculators/volume-calculator', category: 'Calculator', keywords: ['volume', 'cubic', '3d'], icon: '📦' },
  { name: 'Circumference', url: '/us/tools/calculators/circumference-calculator', category: 'Calculator', keywords: ['circumference', 'circle', 'perimeter'], icon: '⭕' },

  // Time & Date
  { name: 'Age Calculator', url: '/us/tools/calculators/age-calculator', category: 'Calculator', keywords: ['age', 'birthday', 'years old'], icon: '🎂' },
  { name: 'Date Calculator', url: '/us/tools/calculators/date-calculator', category: 'Calculator', keywords: ['date', 'days between', 'calendar'], icon: '📅' },
  { name: 'Hours Calculator', url: '/us/tools/calculators/hours-calculator', category: 'Calculator', keywords: ['hours', 'time', 'work hours'], icon: '⏰' },
  { name: 'Time Zone Converter', url: '/us/tools/calculators/time-zone-converter', category: 'Calculator', keywords: ['timezone', 'time conversion'], icon: '🌍' },
  { name: 'Countdown Calculator', url: '/us/tools/calculators/countdown-calculator', category: 'Calculator', keywords: ['countdown', 'days until', 'event'], icon: '⏳' },
  { name: 'Business Days', url: '/us/tools/calculators/business-days-calculator', category: 'Calculator', keywords: ['business days', 'working days'], icon: '📆' },

  // Converters
  { name: 'Length Converter', url: '/us/tools/calculators/length-converter', category: 'Calculator', keywords: ['length', 'distance', 'meters', 'feet'], icon: '📏' },
  { name: 'Temperature Converter', url: '/us/tools/calculators/celsius-to-fahrenheit-calculator', category: 'Calculator', keywords: ['temperature', 'celsius', 'fahrenheit'], icon: '🌡️' },
  { name: 'Weight Converter', url: '/us/tools/calculators/kg-to-lbs-converter-calculator', category: 'Calculator', keywords: ['weight', 'kg', 'lbs', 'pounds'], icon: '⚖️' },
  { name: 'Miles to Kilometers', url: '/us/tools/calculators/miles-to-kilometers-calculator', category: 'Calculator', keywords: ['miles', 'kilometers', 'distance'], icon: '🛣️' },
  { name: 'ML to OZ', url: '/us/tools/calculators/ml-to-oz-converter-calculator', category: 'Calculator', keywords: ['ml', 'oz', 'milliliter', 'ounce'], icon: '🥤' },

  // === GAMES ===
  { name: '2048 Game', url: '/us/tools/games/2048-game', category: 'Game', keywords: ['2048', 'puzzle', 'number game', 'tiles'], icon: '🎯' },
  { name: 'Snake Game', url: '/us/tools/games/snake-game', category: 'Game', keywords: ['snake', 'arcade', 'classic game'], icon: '🐍' },
  { name: 'Chess', url: '/us/tools/games/chess', category: 'Game', keywords: ['chess', 'board game', 'strategy'], icon: '♟️' },
  { name: 'Tic Tac Toe', url: '/us/tools/games/tic-tac-toe', category: 'Game', keywords: ['tic tac toe', 'x and o', 'noughts'], icon: '⭕' },
  { name: 'Memory Cards', url: '/us/tools/games/memory-cards', category: 'Game', keywords: ['memory', 'matching', 'cards', 'pairs'], icon: '🎴' },
  { name: 'Word Scramble', url: '/us/tools/games/word-scramble', category: 'Game', keywords: ['word', 'scramble', 'unscramble', 'letters'], icon: '🔤' },
  { name: 'Crossword', url: '/us/tools/games/crossword', category: 'Game', keywords: ['crossword', 'puzzle', 'words'], icon: '📝' },
  { name: 'Hangman', url: '/us/tools/games/hangman', category: 'Game', keywords: ['hangman', 'word guess', 'letters'], icon: '🎮' },
  { name: 'Math Quiz', url: '/us/tools/games/math-quiz', category: 'Game', keywords: ['math', 'quiz', 'arithmetic'], icon: '➕' },
  { name: 'Mental Math', url: '/us/tools/games/mental-math', category: 'Game', keywords: ['mental math', 'brain training'], icon: '🧠' },
  { name: 'Typing Speed Test', url: '/us/tools/games/typing-speed', category: 'Game', keywords: ['typing', 'speed test', 'wpm'], icon: '⌨️' },
  { name: 'Brain Teaser Quiz', url: '/us/tools/games/brain-teaser-quiz', category: 'Game', keywords: ['brain teaser', 'puzzle', 'riddle'], icon: '🧩' },
  { name: 'Number Sequence', url: '/us/tools/games/number-sequence', category: 'Game', keywords: ['number', 'sequence', 'pattern'], icon: '🔢' },
  { name: 'Logic Grid', url: '/us/tools/games/logic-grid', category: 'Game', keywords: ['logic', 'grid', 'puzzle'], icon: '🧮' },
  { name: 'Checkers', url: '/us/tools/games/checkers', category: 'Game', keywords: ['checkers', 'draughts', 'board game'], icon: '⚫' },
  { name: 'Connect Four', url: '/us/tools/games/connect-four', category: 'Game', keywords: ['connect four', 'four in a row'], icon: '🔴' },
  { name: 'Rock Paper Scissors', url: '/us/tools/games/rock-paper-scissors', category: 'Game', keywords: ['rock paper scissors', 'rps'], icon: '✊' },
  { name: 'Flappy Bird', url: '/us/tools/games/flappy-bird', category: 'Game', keywords: ['flappy bird', 'arcade', 'flying'], icon: '🐦' },
  { name: 'Breakout', url: '/us/tools/games/breakout', category: 'Game', keywords: ['breakout', 'brick breaker', 'arcade'], icon: '🧱' },
  { name: 'Pong', url: '/us/tools/games/pong', category: 'Game', keywords: ['pong', 'tennis', 'classic'], icon: '🏓' },
  { name: 'Whack a Mole', url: '/us/tools/games/whack-a-mole', category: 'Game', keywords: ['whack a mole', 'arcade'], icon: '🔨' },
  { name: 'Maze Runner', url: '/us/tools/games/maze-runner', category: 'Game', keywords: ['maze', 'puzzle', 'path'], icon: '🌀' },
  { name: 'Simon Says', url: '/us/tools/games/simon-says', category: 'Game', keywords: ['simon says', 'memory', 'pattern'], icon: '🎵' },
  { name: 'Reaction Time', url: '/us/tools/games/reaction-time', category: 'Game', keywords: ['reaction', 'speed', 'reflex'], icon: '⚡' },
  { name: 'Color Memory', url: '/us/tools/games/color-memory', category: 'Game', keywords: ['color', 'memory', 'match'], icon: '🎨' },
  { name: 'Pattern Memory', url: '/us/tools/games/pattern-memory', category: 'Game', keywords: ['pattern', 'memory', 'sequence'], icon: '🔲' },
  { name: 'Visual Memory', url: '/us/tools/games/visual-memory', category: 'Game', keywords: ['visual', 'memory', 'tiles'], icon: '👁️' },
  { name: 'Jigsaw Puzzle', url: '/us/tools/games/jigsaw-puzzle', category: 'Game', keywords: ['jigsaw', 'puzzle', 'pieces'], icon: '🧩' },
  { name: 'Speed Math', url: '/us/tools/games/speed-math', category: 'Game', keywords: ['speed', 'math', 'fast'], icon: '⚡' },
  { name: 'Multiplication Table', url: '/us/tools/games/multiplication-table', category: 'Game', keywords: ['multiplication', 'times table'], icon: '✖️' },
  { name: 'Fraction Match', url: '/us/tools/games/fraction-match', category: 'Game', keywords: ['fraction', 'math', 'match'], icon: '📊' },
  { name: 'Equation Solver', url: '/us/tools/games/equation-solver', category: 'Game', keywords: ['equation', 'algebra', 'solve'], icon: '🔣' },
  { name: 'Number Guessing', url: '/us/tools/games/number-guessing', category: 'Game', keywords: ['guess', 'number', 'high low'], icon: '🎲' },
  { name: 'Shopping Math', url: '/us/tools/games/shopping-math', category: 'Game', keywords: ['shopping', 'money', 'math'], icon: '🛒' },
  { name: 'Budget Challenge', url: '/us/tools/games/budget-challenge', category: 'Game', keywords: ['budget', 'finance', 'money'], icon: '💰' },

  // === APPS ===
  { name: 'Lucky Draw Picker', url: '/us/tools/apps/lucky-draw-picker', category: 'App', keywords: ['lucky draw', 'raffle', 'winner', 'random picker', 'giveaway'], icon: '🎰' },
  { name: 'Spin Wheel', url: '/us/tools/apps/spin-wheel', category: 'App', keywords: ['spin wheel', 'wheel of fortune', 'random', 'picker'], icon: '🎡' },
  { name: 'Dice Roller', url: '/us/tools/apps/dice-roller', category: 'App', keywords: ['dice', 'roll', 'random', 'd20', 'd6'], icon: '🎲' },
  { name: 'Coin Flip', url: '/us/tools/apps/coin-flip', category: 'App', keywords: ['coin', 'flip', 'heads', 'tails', 'random'], icon: '🪙' },
  { name: 'Random Number Generator', url: '/us/tools/apps/random-number-generator', category: 'App', keywords: ['random', 'number', 'generator', 'rng'], icon: '🔢' },
  { name: 'Pomodoro Timer', url: '/us/tools/apps/pomodoro-timer', category: 'App', keywords: ['pomodoro', 'timer', 'productivity', 'focus'], icon: '🍅' },
  { name: 'Stopwatch', url: '/us/tools/apps/stopwatch', category: 'App', keywords: ['stopwatch', 'timer', 'time'], icon: '⏱️' },
  { name: 'Timer', url: '/us/tools/apps/timer', category: 'App', keywords: ['timer', 'countdown', 'alarm'], icon: '⏲️' },
  { name: 'World Clock', url: '/us/tools/apps/world-clock', category: 'App', keywords: ['world clock', 'timezone', 'time'], icon: '🌍' },
  { name: 'Note Taking', url: '/us/tools/apps/note-taking', category: 'App', keywords: ['notes', 'notepad', 'memo', 'write'], icon: '📝' },
  { name: 'Text Editor', url: '/us/tools/apps/text-editor', category: 'App', keywords: ['text', 'editor', 'write', 'document'], icon: '📄' },
  { name: 'Markdown Editor', url: '/us/tools/apps/markdown-editor', category: 'App', keywords: ['markdown', 'editor', 'md', 'format'], icon: '📑' },
  { name: 'Word Counter', url: '/us/tools/apps/word-counter', category: 'App', keywords: ['word', 'count', 'character', 'text'], icon: '🔢' },
  { name: 'Color Picker', url: '/us/tools/apps/color-picker', category: 'App', keywords: ['color', 'picker', 'hex', 'rgb'], icon: '🎨' },
  { name: 'Color Palette', url: '/us/tools/apps/color-palette', category: 'App', keywords: ['color', 'palette', 'scheme', 'design'], icon: '🖌️' },
  { name: 'Image Resizer', url: '/us/tools/apps/image-resizer', category: 'App', keywords: ['image', 'resize', 'photo', 'scale'], icon: '🖼️' },
  { name: 'QR Generator', url: '/us/tools/apps/qr-generator', category: 'App', keywords: ['qr', 'code', 'generator', 'barcode'], icon: '📱' },
  { name: 'Password Generator', url: '/us/tools/apps/strong-password-generator', category: 'App', keywords: ['password', 'generator', 'secure', 'strong'], icon: '🔐' },
  { name: 'Hash Generator', url: '/us/tools/apps/hash-generator', category: 'App', keywords: ['hash', 'md5', 'sha', 'encrypt'], icon: '🔒' },
  { name: 'Base64 Encoder', url: '/us/tools/apps/base64-encoder', category: 'App', keywords: ['base64', 'encode', 'decode'], icon: '🔣' },
  { name: 'JSON Formatter', url: '/us/tools/apps/json-formatter', category: 'App', keywords: ['json', 'format', 'beautify', 'minify'], icon: '📋' },
  { name: 'URL Shortener', url: '/us/tools/apps/url-shortener', category: 'App', keywords: ['url', 'shortener', 'link'], icon: '🔗' },
  { name: 'Unit Converter', url: '/us/tools/apps/unit-converter-simple', category: 'App', keywords: ['unit', 'converter', 'convert'], icon: '🔄' },
  { name: 'Basic Calculator', url: '/us/tools/apps/basic-calculator', category: 'App', keywords: ['calculator', 'basic', 'math'], icon: '🧮' },
  { name: 'Expense Tracker', url: '/us/tools/apps/expense-tracker', category: 'App', keywords: ['expense', 'tracker', 'budget', 'money'], icon: '💸' },
  { name: 'Wordle Solver', url: '/us/tools/apps/wordle-solver', category: 'App', keywords: ['wordle', 'solver', 'word game'], icon: '🔤' },
  { name: 'Scrabble Helper', url: '/us/tools/apps/scrabble-helper', category: 'App', keywords: ['scrabble', 'words', 'helper'], icon: '🔠' },
  { name: 'Anagram Solver', url: '/us/tools/apps/anagram-solver', category: 'App', keywords: ['anagram', 'solver', 'words'], icon: '🔀' },
  { name: 'Jumble Solver', url: '/us/tools/apps/jumble-solver', category: 'App', keywords: ['jumble', 'solver', 'unscramble'], icon: '🧩' },
  { name: 'Quordle Solver', url: '/us/tools/apps/quordle-solver', category: 'App', keywords: ['quordle', 'solver', 'word game'], icon: '4️⃣' },
  { name: 'Word Combiner', url: '/us/tools/apps/word-combiner', category: 'App', keywords: ['word', 'combiner', 'merge'], icon: '🔗' },
  { name: 'Syllable Counter', url: '/us/tools/apps/syllable-counter', category: 'App', keywords: ['syllable', 'count', 'poetry'], icon: '📖' },
];

// Helper function to search tools
export function searchTools(query: string, limit: number = 10): SearchItem[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (normalizedQuery.length < 2) return [];

  // Score each tool based on match quality
  const scored = allTools.map(tool => {
    let score = 0;
    const name = tool.name.toLowerCase();

    // Exact name match (highest priority)
    if (name === normalizedQuery) score += 100;
    // Name starts with query
    else if (name.startsWith(normalizedQuery)) score += 50;
    // Name contains query
    else if (name.includes(normalizedQuery)) score += 30;

    // Word-level matching in name
    const nameWords = name.split(' ');
    for (const word of nameWords) {
      if (word.startsWith(normalizedQuery)) score += 25;
    }

    // Keyword matching
    for (const keyword of tool.keywords) {
      if (keyword === normalizedQuery) score += 40;
      else if (keyword.startsWith(normalizedQuery)) score += 20;
      else if (keyword.includes(normalizedQuery)) score += 10;
    }

    // Category matching
    if (tool.category.toLowerCase().includes(normalizedQuery)) score += 5;

    return { tool, score };
  });

  // Filter and sort by score
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.tool);
}

// Get tools by category
export function getToolsByCategory(category: 'Calculator' | 'Game' | 'App'): SearchItem[] {
  return allTools.filter(tool => tool.category === category);
}

// Get featured tools
export function getFeaturedTools(): { calculators: SearchItem[], games: SearchItem[], apps: SearchItem[] } {
  return {
    calculators: allTools.filter(t => t.category === 'Calculator').slice(0, 12),
    games: allTools.filter(t => t.category === 'Game').slice(0, 9),
    apps: allTools.filter(t => t.category === 'App').slice(0, 10),
  };
}
