import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Online Apps & Tools - Productivity & Utilities | The Economic Times',
  description: 'Free online productivity apps and utility tools. Timer, stopwatch, note-taking, QR generator, password generator, and more. No download required!',
  openGraph: {
    title: 'Free Online Apps & Tools - Productivity & Utilities | The Economic Times',
    description: 'Free online productivity apps and utility tools. Timer, stopwatch, note-taking, QR generator, password generator, and more. No download required!',
    url: 'https://economictimes.indiatimes.com/us/tools/apps',
    type: 'website',
  },
};

const productivityApps = [
  { href: "/us/tools/apps/pomodoro-timer", title: "Pomodoro Timer", description: "Boost focus with timed work sessions", icon: "🍅" },
  { href: "/us/tools/apps/timer", title: "Timer", description: "Countdown timer for any task", icon: "⏲" },
  { href: "/us/tools/apps/stopwatch", title: "Stopwatch", description: "Precise time tracking", icon: "⏱" },
  { href: "/us/tools/apps/note-taking", title: "Note Taking", description: "Quick and easy notes", icon: "📝" },
  { href: "/us/tools/apps/markdown-editor", title: "Markdown Editor", description: "Write in markdown format", icon: "📄" },
  { href: "/us/tools/apps/text-editor", title: "Text Editor", description: "Simple text editing", icon: "✏️" },
];

const generatorApps = [
  { href: "/us/tools/apps/qr-generator", title: "QR Code Generator", description: "Create QR codes instantly", icon: "📱" },
  { href: "/us/tools/apps/strong-password-generator", title: "Password Generator", description: "Generate secure passwords", icon: "🔐" },
  { href: "/us/tools/apps/random-number-generator", title: "Random Number", description: "Generate random numbers", icon: "🎲" },
  { href: "/us/tools/apps/hash-generator", title: "Hash Generator", description: "Generate MD5, SHA hashes", icon: "🔑" },
  { href: "/us/tools/apps/lucky-draw-picker", title: "Lucky Draw Picker", description: "Random selection tool", icon: "🎰" },
];

const textApps = [
  { href: "/us/tools/apps/word-counter", title: "Word Counter", description: "Count words and characters", icon: "📊" },
  { href: "/us/tools/apps/syllable-counter", title: "Syllable Counter", description: "Count syllables in text", icon: "🔤" },
  { href: "/us/tools/apps/base64-encoder", title: "Base64 Encoder", description: "Encode/decode Base64", icon: "🔣" },
  { href: "/us/tools/apps/json-formatter", title: "JSON Formatter", description: "Format and validate JSON", icon: "{ }" },
  { href: "/us/tools/apps/url-shortener", title: "URL Shortener", description: "Shorten long URLs", icon: "🔗" },
];

const wordApps = [
  { href: "/us/tools/apps/anagram-solver", title: "Anagram Solver", description: "Find anagram solutions", icon: "🔀" },
  { href: "/us/tools/apps/wordle-solver", title: "Wordle Solver", description: "Get Wordle hints", icon: "🟩" },
  { href: "/us/tools/apps/quordle-solver", title: "Quordle Solver", description: "Solve Quordle puzzles", icon: "🟨" },
  { href: "/us/tools/apps/scrabble-helper", title: "Scrabble Helper", description: "Find Scrabble words", icon: "🎯" },
  { href: "/us/tools/apps/jumble-solver", title: "Jumble Solver", description: "Unscramble jumbled words", icon: "🧩" },
  { href: "/us/tools/apps/word-combiner", title: "Word Combiner", description: "Combine words creatively", icon: "➕" },
];

const utilityApps = [
  { href: "/us/tools/apps/color-picker", title: "Color Picker", description: "Pick and convert colors", icon: "🎨" },
  { href: "/us/tools/apps/color-palette", title: "Color Palette", description: "Generate color palettes", icon: "🌈" },
  { href: "/us/tools/apps/image-resizer", title: "Image Resizer", description: "Resize images online", icon: "🖼️" },
  { href: "/us/tools/apps/unit-converter-simple", title: "Unit Converter", description: "Convert between units", icon: "🔄" },
  { href: "/us/tools/apps/world-clock", title: "World Clock", description: "Check time worldwide", icon: "🌍" },
  { href: "/us/tools/apps/basic-calculator", title: "Basic Calculator", description: "Simple calculations", icon: "🧮" },
];

const financeApps = [
  { href: "/us/tools/apps/expense-tracker", title: "Expense Tracker", description: "Track your expenses", icon: "💰" },
];

const funApps = [
  { href: "/us/tools/apps/coin-flip", title: "Coin Flip", description: "Flip a virtual coin", icon: "🪙" },
  { href: "/us/tools/apps/dice-roller", title: "Dice Roller", description: "Roll virtual dice", icon: "🎲" },
];

function AppCard({ href, title, description, icon, gradient }: { href: string; title: string; description: string; icon: string; gradient: string }) {
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
          <h3 className="text-base font-bold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors">{title}</h3>
          <p className="text-sm text-gray-500 leading-snug">{description}</p>
        </div>
        {/* Launch indicator */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={`w-8 h-8 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center shadow-lg`}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SectionHeader({ icon, title, subtitle, gradient }: { icon: string; title: string; subtitle: string; gradient: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

export default function AppsPage() {
  const totalApps = productivityApps.length + generatorApps.length + textApps.length + wordApps.length + utilityApps.length + financeApps.length + funApps.length;

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-700 text-white py-16 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-[1180px] mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-2xl">🚀</span>
            <span className="text-sm font-medium">Boost Your Productivity</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Free Online Apps & Tools
          </h1>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Productivity apps, generators, word solvers, and utilities - all free to use with no sign-up required!
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4">
              <div className="text-3xl font-bold">{totalApps}+</div>
              <div className="text-purple-200 text-sm">Free Apps</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4">
              <div className="text-3xl font-bold">7</div>
              <div className="text-purple-200 text-sm">Categories</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-purple-200 text-sm">Free Forever</div>
            </div>
          </div>
        </div>
      </div>

      {/* Productivity Apps */}
      <section className="max-w-[1180px] mx-auto px-4 py-12">
        <SectionHeader
          icon="⏰"
          title="Productivity Apps"
          subtitle="Stay focused and get more done"
          gradient="from-rose-500 to-pink-600"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {productivityApps.map((app) => (
            <AppCard key={app.href} {...app} gradient="from-rose-500 to-pink-600" />
          ))}
        </div>
      </section>

      {/* Generator Apps */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-[1180px] mx-auto px-4">
          <SectionHeader
            icon="⚡"
            title="Generators"
            subtitle="Create QR codes, passwords, and more"
            gradient="from-amber-500 to-orange-600"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {generatorApps.map((app) => (
              <AppCard key={app.href} {...app} gradient="from-amber-500 to-orange-600" />
            ))}
          </div>
        </div>
      </section>

      {/* Text Tools */}
      <section className="max-w-[1180px] mx-auto px-4 py-12">
        <SectionHeader
          icon="📝"
          title="Text Tools"
          subtitle="Count, format, and transform text"
          gradient="from-cyan-500 to-blue-600"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {textApps.map((app) => (
            <AppCard key={app.href} {...app} gradient="from-cyan-500 to-blue-600" />
          ))}
        </div>
      </section>

      {/* Word & Puzzle Solvers */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-[1180px] mx-auto px-4">
          <SectionHeader
            icon="🧩"
            title="Word & Puzzle Solvers"
            subtitle="Solve Wordle, Scrabble, anagrams, and more"
            gradient="from-emerald-500 to-teal-600"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {wordApps.map((app) => (
              <AppCard key={app.href} {...app} gradient="from-emerald-500 to-teal-600" />
            ))}
          </div>
        </div>
      </section>

      {/* Utility Apps */}
      <section className="max-w-[1180px] mx-auto px-4 py-12">
        <SectionHeader
          icon="🛠️"
          title="Utility Tools"
          subtitle="Colors, images, conversions, and more"
          gradient="from-violet-500 to-purple-600"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {utilityApps.map((app) => (
            <AppCard key={app.href} {...app} gradient="from-violet-500 to-purple-600" />
          ))}
        </div>
      </section>

      {/* Finance & Fun Apps */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Finance Apps */}
            <div>
              <SectionHeader
                icon="💵"
                title="Finance Tools"
                subtitle="Track and manage your money"
                gradient="from-green-500 to-emerald-600"
              />
              <div className="grid grid-cols-2 gap-4">
                {financeApps.map((app) => (
                  <AppCard key={app.href} {...app} gradient="from-green-500 to-emerald-600" />
                ))}
              </div>
            </div>

            {/* Fun Apps */}
            <div>
              <SectionHeader
                icon="🎉"
                title="Fun & Random"
                subtitle="Leave decisions to chance"
                gradient="from-fuchsia-500 to-pink-600"
              />
              <div className="grid grid-cols-2 gap-4">
                {funApps.map((app) => (
                  <AppCard key={app.href} {...app} gradient="from-fuchsia-500 to-pink-600" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Use Section */}
      <section className="max-w-[1180px] mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Use Our Apps?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Everything you need to be productive, creative, and efficient - all in one place</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">100% Free</h3>
            <p className="text-sm text-gray-500">All tools are completely free to use with no hidden costs</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Private & Secure</h3>
            <p className="text-sm text-gray-500">Your data stays on your device and is never stored</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">No Sign-up</h3>
            <p className="text-sm text-gray-500">Use any tool instantly without registration</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Works Everywhere</h3>
            <p className="text-sm text-gray-500">Desktop, tablet, or mobile - works on any device</p>
          </div>
        </div>
      </section>
    </>
  );
}
