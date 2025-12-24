import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Online Games - Brain Games, Puzzles & More | The Economic Times',
  description: 'Play free online games including brain teasers, puzzles, word games, math games, and classic arcade games. No download required!',
  alternates: {
    canonical: 'https://economictimes.indiatimes.com/us/tools/games',
  },
  openGraph: {
    title: 'Free Online Games - Brain Games, Puzzles & More | The Economic Times',
    description: 'Play free online games including brain teasers, puzzles, word games, math games, and classic arcade games. No download required!',
    url: 'https://economictimes.indiatimes.com/us/tools/games',
    type: 'website',
  },
};

const puzzleGames = [
  { href: "/us/tools/games/2048-game", title: "2048", description: "Slide and merge tiles to reach 2048", icon: "🎯", gradient: "from-orange-400 to-pink-500" },
  { href: "/us/tools/games/crossword", title: "Crossword", description: "Classic crossword puzzle", icon: "📝", gradient: "from-blue-400 to-indigo-500" },
  { href: "/us/tools/games/jigsaw-puzzle", title: "Jigsaw Puzzle", description: "Piece together beautiful puzzles", icon: "🧩", gradient: "from-purple-400 to-pink-500" },
  { href: "/us/tools/games/logic-grid", title: "Logic Grid", description: "Solve logic puzzles", icon: "🧠", gradient: "from-cyan-400 to-blue-500" },
  { href: "/us/tools/games/word-scramble", title: "Word Scramble", description: "Unscramble the letters", icon: "🔤", gradient: "from-green-400 to-teal-500" },
  { href: "/us/tools/games/hangman", title: "Hangman", description: "Classic word guessing game", icon: "🎪", gradient: "from-red-400 to-orange-500" },
];

const brainGames = [
  { href: "/us/tools/games/memory-cards", title: "Memory Cards", description: "Test your memory skills", icon: "🎴", gradient: "from-violet-400 to-purple-500" },
  { href: "/us/tools/games/color-memory", title: "Color Memory", description: "Remember the color patterns", icon: "🌈", gradient: "from-pink-400 to-rose-500" },
  { href: "/us/tools/games/pattern-memory", title: "Pattern Memory", description: "Memorize and repeat patterns", icon: "🔲", gradient: "from-slate-400 to-gray-600" },
  { href: "/us/tools/games/visual-memory", title: "Visual Memory", description: "Train your visual memory", icon: "👁", gradient: "from-amber-400 to-orange-500" },
  { href: "/us/tools/games/simon-says", title: "Simon Says", description: "Follow the sequence", icon: "🔴", gradient: "from-red-500 to-rose-600" },
  { href: "/us/tools/games/reaction-time", title: "Reaction Time", description: "Test your reflexes", icon: "⚡", gradient: "from-yellow-400 to-amber-500" },
  { href: "/us/tools/games/brain-teaser-quiz", title: "Brain Teaser", description: "Challenge your mind", icon: "💡", gradient: "from-emerald-400 to-green-500" },
];

const mathGames = [
  { href: "/us/tools/games/math-quiz", title: "Math Quiz", description: "Test your math skills", icon: "➕", gradient: "from-blue-500 to-cyan-500" },
  { href: "/us/tools/games/mental-math", title: "Mental Math", description: "Quick mental calculations", icon: "🧮", gradient: "from-indigo-400 to-purple-500" },
  { href: "/us/tools/games/speed-math", title: "Speed Math", description: "Fast-paced math challenge", icon: "⏱", gradient: "from-orange-400 to-red-500" },
  { href: "/us/tools/games/multiplication-table", title: "Multiplication", description: "Practice multiplication", icon: "✖", gradient: "from-teal-400 to-cyan-500" },
  { href: "/us/tools/games/fraction-match", title: "Fraction Match", description: "Match equivalent fractions", icon: "🥧", gradient: "from-amber-400 to-yellow-500" },
  { href: "/us/tools/games/equation-solver", title: "Equation Solver", description: "Solve math equations", icon: "📐", gradient: "from-violet-400 to-indigo-500" },
  { href: "/us/tools/games/number-sequence", title: "Number Sequence", description: "Find the pattern", icon: "🔢", gradient: "from-green-400 to-emerald-500" },
  { href: "/us/tools/games/number-guessing", title: "Number Guessing", description: "Guess the number", icon: "❓", gradient: "from-pink-400 to-fuchsia-500" },
  { href: "/us/tools/games/word-math", title: "Word Math", description: "Math with words", icon: "📖", gradient: "from-sky-400 to-blue-500" },
  { href: "/us/tools/games/shopping-math", title: "Shopping Math", description: "Real-world math problems", icon: "🛒", gradient: "from-rose-400 to-pink-500" },
];

const arcadeGames = [
  { href: "/us/tools/games/snake-game", title: "Snake Game", description: "Classic snake arcade game", icon: "🐍", gradient: "from-green-500 to-lime-500" },
  { href: "/us/tools/games/pong", title: "Pong", description: "Classic table tennis game", icon: "🏓", gradient: "from-gray-500 to-slate-600" },
  { href: "/us/tools/games/breakout", title: "Breakout", description: "Break all the bricks", icon: "🧱", gradient: "from-red-500 to-orange-500" },
  { href: "/us/tools/games/flappy-bird", title: "Flappy Bird", description: "Fly through obstacles", icon: "🐦", gradient: "from-sky-400 to-cyan-500" },
  { href: "/us/tools/games/whack-a-mole", title: "Whack-a-Mole", description: "Hit the moles!", icon: "🔨", gradient: "from-amber-500 to-yellow-500" },
  { href: "/us/tools/games/maze-runner", title: "Maze Runner", description: "Navigate the maze", icon: "🏃", gradient: "from-purple-500 to-violet-600" },
];

const strategyGames = [
  { href: "/us/tools/games/chess", title: "Chess", description: "Classic strategy board game", icon: "♟", gradient: "from-gray-700 to-slate-800" },
  { href: "/us/tools/games/checkers", title: "Checkers", description: "Classic checkers game", icon: "🔴", gradient: "from-red-600 to-rose-700" },
  { href: "/us/tools/games/tic-tac-toe", title: "Tic Tac Toe", description: "Classic X and O game", icon: "⭕", gradient: "from-blue-500 to-indigo-600" },
  { href: "/us/tools/games/connect-four", title: "Connect Four", description: "Connect four in a row", icon: "🔵", gradient: "from-yellow-500 to-red-500" },
  { href: "/us/tools/games/rock-paper-scissors", title: "Rock Paper Scissors", description: "Classic hand game", icon: "✊", gradient: "from-purple-500 to-pink-500" },
];

const typingGames = [
  { href: "/us/tools/games/typing-speed", title: "Typing Speed Test", description: "Measure your WPM and accuracy", icon: "⌨", gradient: "from-blue-500 to-teal-500" },
];

const financeGames = [
  { href: "/us/tools/games/budget-challenge", title: "Budget Challenge", description: "Learn to manage money wisely", icon: "💰", gradient: "from-green-500 to-emerald-600" },
];

function GameCard({ href, title, description, icon, gradient }: { href: string; title: string; description: string; icon: string; gradient: string }) {
  return (
    <Link href={href} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full border border-gray-100">
        {/* Gradient Header */}
        <div className={`h-24 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
          <span className="text-5xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">{icon}</span>
          {/* Decorative circles */}
          <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 bg-white/15 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-base font-bold text-gray-800 mb-1 group-hover:text-green-600 transition-colors">{title}</h3>
          <p className="text-sm text-gray-500 leading-snug">{description}</p>
        </div>

        {/* Play indicator */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={`w-8 h-8 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center shadow-lg`}>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SectionHeader({ title, subtitle, icon }: { title: string; subtitle: string; icon: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

export default function GamesPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-teal-600 to-cyan-600 text-white py-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400/20 rounded-full blur-lg"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-xl">🎮</span>
            <span className="text-sm font-medium">Free Online Games</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Play Games, Train Your Brain</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Explore our collection of 35+ free games - from puzzles and brain teasers to arcade classics. No downloads, no sign-ups!
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="text-3xl font-bold">35+</div>
              <div className="text-green-200 text-sm">Free Games</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">7</div>
              <div className="text-green-200 text-sm">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-green-200 text-sm">Free to Play</div>
            </div>
          </div>
        </div>
      </div>

      {/* Puzzle Games */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Puzzle Games" subtitle="Challenge your problem-solving skills" icon="🧩" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {puzzleGames.map((game) => (
            <GameCard key={game.href} {...game} />
          ))}
        </div>
      </section>

      {/* Brain Games */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader title="Brain Training Games" subtitle="Boost memory, focus, and cognitive skills" icon="🧠" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {brainGames.map((game) => (
              <GameCard key={game.href} {...game} />
            ))}
          </div>
        </div>
      </section>

      {/* Math Games */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Math Games" subtitle="Fun ways to practice math skills" icon="🔢" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {mathGames.map((game) => (
            <GameCard key={game.href} {...game} />
          ))}
        </div>
      </section>

      {/* Arcade Games */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader title="Arcade Games" subtitle="Classic arcade fun, right in your browser" icon="🕹" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {arcadeGames.map((game) => (
              <GameCard key={game.href} {...game} />
            ))}
          </div>
        </div>
      </section>

      {/* Strategy Games */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Strategy & Board Games" subtitle="Think ahead and outsmart your opponent" icon="♟" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {strategyGames.map((game) => (
            <GameCard key={game.href} {...game} />
          ))}
        </div>
      </section>

      {/* Typing & Finance Games */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Typing Games */}
            <div>
              <SectionHeader title="Typing Games" subtitle="Improve your typing speed" icon="⌨" />
              <div className="grid grid-cols-1 gap-4">
                {typingGames.map((game) => (
                  <GameCard key={game.href} {...game} />
                ))}
              </div>
            </div>

            {/* Finance Games */}
            <div>
              <SectionHeader title="Finance Games" subtitle="Learn money management skills" icon="💰" />
              <div className="grid grid-cols-1 gap-4">
                {financeGames.map((game) => (
                  <GameCard key={game.href} {...game} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Play Section */}
      <section className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Why Play Our Games?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Discover the benefits of playing our free online games</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center border border-green-100">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">100% Free</h3>
            <p className="text-sm text-gray-600">All games are completely free to play, forever</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 text-center border border-blue-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">No Download</h3>
            <p className="text-sm text-gray-600">Play instantly in your browser, no installation</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 text-center border border-purple-100">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Train Your Brain</h3>
            <p className="text-sm text-gray-600">Improve memory, logic, and cognitive skills</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 text-center border border-orange-100">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Mobile Friendly</h3>
            <p className="text-sm text-gray-600">Play on any device - phone, tablet, or desktop</p>
          </div>
        </div>
      </section>
    </>
  );
}
