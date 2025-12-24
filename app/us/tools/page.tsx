import { Metadata } from 'next';
import Link from 'next/link';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'Free Online Calculators, Games & Apps | The Economic Times',
  description: '360+ free online calculators, games, and apps from The Economic Times. Calculate finances, health metrics, math problems & more. No signup required!',
  keywords: 'calculators, online calculator, BMI calculator, SIP calculator, mortgage calculator, percentage calculator, free calculators',
  openGraph: {
    title: 'Free Online Calculators, Games & Apps | The Economic Times',
    description: '360+ free online calculators, games, and apps from The Economic Times.',
    url: 'https://economictimes.indiatimes.com/us/tools',
    type: 'website',
  },
};

// Featured calculators with gradients
const featuredCalculators = [
  { href: "/us/tools/calculators/sip-calculator", title: "SIP Calculator", description: "Calculate mutual fund returns", icon: "💰", gradient: "from-green-400 to-emerald-500" },
  { href: "/us/tools/calculators/bmi-calculator", title: "BMI Calculator", description: "Body mass index calculator", icon: "❤️", gradient: "from-rose-400 to-pink-500" },
  { href: "/us/tools/calculators/percentage-calculator", title: "Percentage", description: "Calculate percentages", icon: "%", gradient: "from-indigo-400 to-purple-500" },
  { href: "/us/tools/calculators/age-calculator", title: "Age Calculator", description: "Calculate your exact age", icon: "🎂", gradient: "from-purple-400 to-violet-500" },
  { href: "/us/tools/calculators/emi-calculator", title: "EMI Calculator", description: "Calculate loan EMI", icon: "💳", gradient: "from-blue-500 to-indigo-600" },
  { href: "/us/tools/calculators/loan-calculator", title: "Loan Calculator", description: "Calculate loan payments", icon: "📝", gradient: "from-teal-500 to-emerald-600" },
  { href: "/us/tools/calculators/calorie-calculator", title: "Calorie Calculator", description: "Daily calorie needs", icon: "🔥", gradient: "from-orange-400 to-red-500" },
  { href: "/us/tools/calculators/compound-interest-calculator", title: "Compound Interest", description: "Calculate compound returns", icon: "📊", gradient: "from-blue-400 to-indigo-500" },
  { href: "/us/tools/calculators/mortgage-payment-calculator", title: "Mortgage Calculator", description: "Calculate mortgage payments", icon: "🏡", gradient: "from-green-500 to-teal-600" },
  { href: "/us/tools/calculators/tip-calculator", title: "Tip Calculator", description: "Calculate tips & split bills", icon: "💵", gradient: "from-amber-500 to-yellow-600" },
  { href: "/us/tools/calculators/discount-calculator", title: "Discount Calculator", description: "Calculate discounts", icon: "🏷️", gradient: "from-pink-500 to-rose-600" },
  { href: "/us/tools/calculators/date-calculator", title: "Date Calculator", description: "Calculate dates", icon: "📅", gradient: "from-blue-400 to-indigo-500" },
];

// Popular games with gradients - 2 rows (12 games) with descriptions
const popularGames = [
  { href: "/us/tools/games/2048-game", title: "2048", description: "Slide & merge tiles", icon: "🎯", gradient: "from-orange-400 to-amber-500" },
  { href: "/us/tools/games/chess", title: "Chess", description: "Classic strategy game", icon: "♟️", gradient: "from-amber-600 to-yellow-700" },
  { href: "/us/tools/games/snake-game", title: "Snake Game", description: "Grow your snake", icon: "🐍", gradient: "from-green-400 to-emerald-500" },
  { href: "/us/tools/games/word-scramble", title: "Word Scramble", description: "Unscramble words", icon: "🧩", gradient: "from-purple-400 to-violet-500" },
  { href: "/us/tools/games/memory-cards", title: "Memory Cards", description: "Match the pairs", icon: "🎴", gradient: "from-rose-400 to-pink-500" },
  { href: "/us/tools/games/typing-speed", title: "Typing Test", description: "Test typing speed", icon: "⌨️", gradient: "from-blue-400 to-indigo-500" },
  { href: "/us/tools/games/tic-tac-toe", title: "Tic Tac Toe", description: "Classic X and O", icon: "⭕", gradient: "from-cyan-400 to-blue-500" },
  { href: "/us/tools/games/crossword", title: "Crossword", description: "Word puzzle game", icon: "📝", gradient: "from-indigo-400 to-purple-500" },
  { href: "/us/tools/games/math-quiz", title: "Math Quiz", description: "Test math skills", icon: "➕", gradient: "from-green-500 to-teal-600" },
  { href: "/us/tools/games/checkers", title: "Checkers", description: "Board game classic", icon: "🔴", gradient: "from-red-400 to-rose-500" },
  { href: "/us/tools/games/hangman", title: "Hangman", description: "Guess the word", icon: "🎪", gradient: "from-violet-400 to-purple-500" },
  { href: "/us/tools/games/sudoku", title: "Sudoku", description: "Number puzzle", icon: "🔢", gradient: "from-teal-400 to-cyan-500" },
];

// Popular apps with gradients - 2 rows (12 apps) with descriptions
const popularApps = [
  { href: "/us/tools/apps/lucky-draw-picker", title: "Lucky Draw", description: "Random name picker", icon: "🎰", gradient: "from-yellow-400 to-orange-500" },
  { href: "/us/tools/apps/spin-wheel", title: "Spin Wheel", description: "Spin to decide", icon: "🎡", gradient: "from-red-400 to-rose-500" },
  { href: "/us/tools/apps/pomodoro-timer", title: "Pomodoro Timer", description: "Focus timer", icon: "🍅", gradient: "from-red-500 to-rose-600" },
  { href: "/us/tools/apps/qr-generator", title: "QR Generator", description: "Create QR codes", icon: "📱", gradient: "from-blue-500 to-indigo-600" },
  { href: "/us/tools/apps/strong-password-generator", title: "Password Gen", description: "Secure passwords", icon: "🔐", gradient: "from-gray-500 to-slate-600" },
  { href: "/us/tools/apps/color-picker", title: "Color Picker", description: "Pick any color", icon: "🎨", gradient: "from-pink-400 to-purple-500" },
  { href: "/us/tools/apps/word-counter", title: "Word Counter", description: "Count words", icon: "📄", gradient: "from-teal-400 to-cyan-500" },
  { href: "/us/tools/apps/stopwatch", title: "Stopwatch", description: "Track time", icon: "⏱️", gradient: "from-orange-400 to-amber-500" },
  { href: "/us/tools/apps/timer", title: "Timer", description: "Countdown timer", icon: "⏰", gradient: "from-blue-400 to-indigo-500" },
  { href: "/us/tools/apps/dice-roller", title: "Dice Roller", description: "Roll virtual dice", icon: "🎲", gradient: "from-purple-400 to-violet-500" },
  { href: "/us/tools/apps/coin-flip", title: "Coin Flip", description: "Flip a coin", icon: "🪙", gradient: "from-amber-400 to-yellow-500" },
  { href: "/us/tools/apps/json-formatter", title: "JSON Formatter", description: "Format JSON", icon: "{ }", gradient: "from-green-400 to-emerald-500" },
];

// Category links
const categoryLinks = [
  { href: "/us/tools/finance", name: "Finance", icon: "💰", gradient: "from-blue-500 to-indigo-600", count: "70+" },
  { href: "/us/tools/health", name: "Health", icon: "❤️", gradient: "from-rose-500 to-pink-600", count: "30+" },
  { href: "/us/tools/math", name: "Math", icon: "📐", gradient: "from-purple-500 to-violet-600", count: "30+" },
  { href: "/us/tools/time", name: "Time", icon: "⏰", gradient: "from-amber-500 to-orange-600", count: "15+" },
  { href: "/us/tools/games", name: "Games", icon: "🎮", gradient: "from-green-500 to-teal-600", count: "35+" },
  { href: "/us/tools/apps", name: "Apps", icon: "🛠️", gradient: "from-indigo-500 to-purple-600", count: "30+" },
];

// Finance Calculators
const financeCalculators = [
  { href: "/us/tools/calculators/sip-calculator", title: "SIP Calculator", icon: "💰", gradient: "from-green-400 to-emerald-500" },
  { href: "/us/tools/calculators/emi-calculator", title: "EMI Calculator", icon: "💳", gradient: "from-blue-500 to-indigo-600" },
  { href: "/us/tools/calculators/loan-calculator", title: "Loan Calculator", icon: "📝", gradient: "from-teal-500 to-emerald-600" },
  { href: "/us/tools/calculators/compound-interest-calculator", title: "Compound Interest", icon: "📊", gradient: "from-blue-400 to-indigo-500" },
  { href: "/us/tools/calculators/mortgage-payment-calculator", title: "Mortgage Calculator", icon: "🏡", gradient: "from-green-500 to-teal-600" },
  { href: "/us/tools/calculators/simple-interest-calculator", title: "Simple Interest", icon: "💵", gradient: "from-emerald-400 to-green-500" },
];

// Health Calculators
const healthCalculators = [
  { href: "/us/tools/calculators/bmi-calculator", title: "BMI Calculator", icon: "❤️", gradient: "from-rose-400 to-pink-500" },
  { href: "/us/tools/calculators/calorie-calculator", title: "Calorie Calculator", icon: "🔥", gradient: "from-orange-400 to-red-500" },
  { href: "/us/tools/calculators/body-fat-calculator", title: "Body Fat Calculator", icon: "📏", gradient: "from-pink-400 to-rose-500" },
  { href: "/us/tools/calculators/bmr-calculator", title: "BMR Calculator", icon: "⚡", gradient: "from-amber-400 to-orange-500" },
  { href: "/us/tools/calculators/ideal-weight-calculator", title: "Ideal Weight", icon: "⚖️", gradient: "from-violet-400 to-purple-500" },
  { href: "/us/tools/calculators/pregnancy-calculator", title: "Pregnancy Calculator", icon: "👶", gradient: "from-pink-300 to-rose-400" },
];

// Math Calculators
const mathCalculators = [
  { href: "/us/tools/calculators/percentage-calculator", title: "Percentage", icon: "%", gradient: "from-indigo-400 to-purple-500" },
  { href: "/us/tools/calculators/fraction-calculator", title: "Fraction Calculator", icon: "½", gradient: "from-blue-400 to-indigo-500" },
  { href: "/us/tools/calculators/scientific-calculator", title: "Scientific Calculator", icon: "🔬", gradient: "from-purple-400 to-violet-500" },
  { href: "/us/tools/calculators/square-root-calculator", title: "Square Root", icon: "√", gradient: "from-teal-400 to-cyan-500" },
  { href: "/us/tools/calculators/average-calculator", title: "Average Calculator", icon: "📈", gradient: "from-green-400 to-emerald-500" },
  { href: "/us/tools/calculators/ratio-calculator", title: "Ratio Calculator", icon: "⚖️", gradient: "from-amber-400 to-yellow-500" },
];

// Card component matching all-calculators design
function ToolCard({ href, title, icon, gradient }: { href: string; title: string; icon: string; gradient: string }) {
  return (
    <Link href={href} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full border border-gray-100">
        <div className={`h-16 sm:h-20 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
          <span className="text-2xl sm:text-4xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">{icon}</span>
          <div className="absolute top-2 right-2 w-4 sm:w-6 h-4 sm:h-6 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-2 left-2 w-2 sm:w-3 h-2 sm:h-3 bg-white/15 rounded-full"></div>
        </div>
        <div className="p-2 sm:p-3">
          <h3 className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight text-center">{title}</h3>
        </div>
      </div>
    </Link>
  );
}

// Calculator card with description
function CalculatorCard({ href, title, description, icon, gradient }: { href: string; title: string; description: string; icon: string; gradient: string }) {
  return (
    <Link href={href} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full border border-gray-100">
        <div className={`h-16 sm:h-20 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
          <span className="text-2xl sm:text-4xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">{icon}</span>
          <div className="absolute top-2 right-2 w-4 sm:w-6 h-4 sm:h-6 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-2 left-2 w-2 sm:w-3 h-2 sm:h-3 bg-white/15 rounded-full"></div>
        </div>
        <div className="p-2 sm:p-3">
          <h3 className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">{title}</h3>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 leading-tight hidden sm:block">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section - Light Background */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-[1200px] mx-auto px-4 pt-6 pb-8 sm:pt-8 sm:pb-12">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 border border-blue-100 rounded-full mb-4 sm:mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="text-xs sm:text-sm font-medium text-blue-700">360+ Free Tools Available</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Free Online Calculators, Games & Apps
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
              Professional calculators, fun games, and productivity apps. All free, instant results, no signup required.
            </p>

            {/* Search Component */}
            <HomePageClient />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-[1200px] mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <div className="grid grid-cols-4 gap-2 sm:gap-6">
            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold text-blue-600">300+</div>
              <div className="text-[10px] sm:text-sm text-gray-600">Calculators</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold text-green-600">35+</div>
              <div className="text-[10px] sm:text-sm text-gray-600">Games</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold text-purple-600">30+</div>
              <div className="text-[10px] sm:text-sm text-gray-600">Apps</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold text-orange-600">100%</div>
              <div className="text-[10px] sm:text-sm text-gray-600">Free</div>
            </div>
          </div>
        </div>
      </div>

      {/* Browse by Category */}
      <section className="max-w-[1200px] mx-auto px-4 py-6 sm:py-10">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Browse by Category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
          {categoryLinks.map((cat) => (
            <Link key={cat.href} href={cat.href} className="group">
              <div className={`bg-gradient-to-br ${cat.gradient} rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center text-white hover:shadow-xl transition-all transform hover:-translate-y-1`}>
                <span className="text-xl sm:text-3xl block mb-1 sm:mb-2">{cat.icon}</span>
                <h3 className="font-bold text-xs sm:text-base">{cat.name}</h3>
                <p className="text-[10px] sm:text-sm opacity-80">{cat.count} tools</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Calculators */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-8 sm:py-14" id="calculators">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Popular Calculators</h2>
              <p className="text-xs sm:text-base text-gray-600 mt-0.5 sm:mt-1">Most used calculators by our users</p>
            </div>
            <Link href="/us/tools/all-calculators" className="hidden sm:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
            {featuredCalculators.map((calc) => (
              <CalculatorCard key={calc.href} {...calc} />
            ))}
          </div>

          <div className="text-center mt-6 sm:hidden">
            <Link href="/us/tools/all-calculators" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all text-sm">
              View All Calculators
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Finance Calculators */}
      <section className="max-w-[1200px] mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center">
              <span className="text-base sm:text-xl">💰</span>
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-gray-900">Finance Calculators</h2>
              <p className="text-[10px] sm:text-sm text-gray-600">Investment, loan & interest calculators</p>
            </div>
          </div>
          <Link href="/us/tools/finance" className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm">
            View All
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
          {financeCalculators.map((calc) => (
            <ToolCard key={calc.href} {...calc} />
          ))}
        </div>
      </section>

      {/* Health Calculators */}
      <section className="bg-gradient-to-br from-rose-50 to-pink-50 py-8 sm:py-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                <span className="text-base sm:text-xl">❤️</span>
              </div>
              <div>
                <h2 className="text-base sm:text-xl font-bold text-gray-900">Health Calculators</h2>
                <p className="text-[10px] sm:text-sm text-gray-600">BMI, calories & fitness calculators</p>
              </div>
            </div>
            <Link href="/us/tools/health" className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium text-xs sm:text-sm">
              View All
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
            {healthCalculators.map((calc) => (
              <ToolCard key={calc.href} {...calc} />
            ))}
          </div>
        </div>
      </section>

      {/* Math Calculators */}
      <section className="max-w-[1200px] mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg sm:rounded-xl flex items-center justify-center">
              <span className="text-base sm:text-xl">📐</span>
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-gray-900">Math Calculators</h2>
              <p className="text-[10px] sm:text-sm text-gray-600">Percentage, fractions & more</p>
            </div>
          </div>
          <Link href="/us/tools/math" className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium text-xs sm:text-sm">
            View All
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
          {mathCalculators.map((calc) => (
            <ToolCard key={calc.href} {...calc} />
          ))}
        </div>
      </section>

      {/* Popular Games - 2 Rows */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-8 sm:py-14" id="games">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                <span className="text-base sm:text-xl">🎮</span>
              </div>
              <div>
                <h2 className="text-base sm:text-xl font-bold text-gray-900">Fun Games</h2>
                <p className="text-[10px] sm:text-sm text-gray-600">Brain games & entertainment</p>
              </div>
            </div>
            <Link href="/us/tools/games" className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium text-xs sm:text-sm">
              View All
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
            {popularGames.map((game) => (
              <CalculatorCard key={game.href} {...game} />
            ))}
          </div>

          <div className="text-center mt-6">
            <Link href="/us/tools/games" className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-green-600 text-green-600 rounded-xl font-medium hover:bg-green-50 transition-all text-sm">
              View All Games
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Productivity Apps - 2 Rows */}
      <section className="bg-gradient-to-br from-purple-50 to-indigo-50 py-8 sm:py-14" id="apps">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                <span className="text-base sm:text-xl">🛠️</span>
              </div>
              <div>
                <h2 className="text-base sm:text-xl font-bold text-gray-900">Productivity Apps</h2>
                <p className="text-[10px] sm:text-sm text-gray-600">Boost your productivity</p>
              </div>
            </div>
            <Link href="/us/tools/apps" className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium text-xs sm:text-sm">
              View All
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
            {popularApps.map((app) => (
              <CalculatorCard key={app.href} {...app} />
            ))}
          </div>

          <div className="text-center mt-6">
            <Link href="/us/tools/apps" className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-purple-600 text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition-all text-sm">
              View All Apps
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-[1200px] mx-auto px-4 py-8 sm:py-16">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Why Choose Us?</h2>
          <p className="text-xs sm:text-base text-gray-600 mt-1">Trusted by millions of users worldwide</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 text-center border border-gray-100 shadow-sm">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <span className="text-lg sm:text-2xl text-white">✓</span>
            </div>
            <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">100% Accurate</h3>
            <p className="text-[10px] sm:text-sm text-gray-600">Industry-standard formulas</p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 text-center border border-gray-100 shadow-sm">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <span className="text-lg sm:text-2xl">🔒</span>
            </div>
            <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">100% Private</h3>
            <p className="text-[10px] sm:text-sm text-gray-600">Data stays in your browser</p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 text-center border border-gray-100 shadow-sm">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <span className="text-lg sm:text-2xl">⚡</span>
            </div>
            <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">Instant Results</h3>
            <p className="text-[10px] sm:text-sm text-gray-600">No waiting, no loading</p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 text-center border border-gray-100 shadow-sm">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <span className="text-lg sm:text-2xl">📱</span>
            </div>
            <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">Mobile Friendly</h3>
            <p className="text-[10px] sm:text-sm text-gray-600">Works on any device</p>
          </div>
        </div>
      </section>
    </div>
  );
}
