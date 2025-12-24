import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Time Calculators - Date, Age, Time Zone & Duration | The Economic Times',
  description: 'Free online time calculators for date calculations, age, time zones, countdowns, and duration. Plan events and track time effortlessly.',
  alternates: {
    canonical: 'https://economictimes.indiatimes.com/us/tools/time',
  },
  openGraph: {
    title: 'Time Calculators - Date, Age, Time Zone & Duration | The Economic Times',
    description: 'Free online time calculators for date calculations, age, time zones, countdowns, and duration.',
    url: 'https://economictimes.indiatimes.com/us/tools/time',
    type: 'website',
  },
};

const ageCalculators = [
  { slug: "age-calculator", name: "Age Calculator", description: "Calculate exact age", icon: "🎂", gradient: "from-purple-400 to-violet-500" },
  { slug: "age-in-days-calculator", name: "Age in Days", description: "Your age in days", icon: "📅", gradient: "from-blue-400 to-indigo-500" },
  { slug: "birth-year-calculator", name: "Birth Year", description: "Find birth year from age", icon: "🗓️", gradient: "from-cyan-400 to-blue-500" },
  { slug: "korean-age-calculator", name: "Korean Age", description: "Calculate Korean age", icon: "🇰🇷", gradient: "from-pink-400 to-rose-500" },
  { slug: "chronological-age-calculator", name: "Chronological Age", description: "Precise age calculation", icon: "⏳", gradient: "from-amber-400 to-orange-500" },
];

const dateCalculators = [
  { slug: "date-calculator", name: "Date Calculator", description: "Add/subtract dates", icon: "📆", gradient: "from-blue-400 to-indigo-500" },
  { slug: "days-between-dates-calculator", name: "Days Between Dates", description: "Count days between dates", icon: "📊", gradient: "from-green-400 to-emerald-500" },
  { slug: "years-between-dates-calculator", name: "Years Between Dates", description: "Calculate years difference", icon: "📈", gradient: "from-purple-400 to-violet-500" },
  { slug: "business-days-calculator", name: "Business Days", description: "Working days counter", icon: "💼", gradient: "from-gray-500 to-slate-600" },
  { slug: "countdown-calculator", name: "Countdown", description: "Days until event", icon: "⏳", gradient: "from-red-400 to-rose-500" },
  { slug: "week-calculator", name: "Week Calculator", description: "Calculate weeks", icon: "📅", gradient: "from-teal-400 to-cyan-500" },
  { slug: "month-calculator", name: "Month Calculator", description: "Calculate months", icon: "🗓️", gradient: "from-orange-400 to-amber-500" },
  { slug: "day-of-week-calculator", name: "Day of Week", description: "Find day of week", icon: "📆", gradient: "from-indigo-400 to-purple-500" },
];

const timeCalculators = [
  { slug: "time-calculator", name: "Time Calculator", description: "Add/subtract time", icon: "⏰", gradient: "from-orange-400 to-amber-500" },
  { slug: "hours-calculator", name: "Hours Calculator", description: "Calculate hours", icon: "🕐", gradient: "from-indigo-400 to-purple-500" },
  { slug: "minutes-calculator", name: "Minutes Calculator", description: "Calculate minutes", icon: "🕑", gradient: "from-blue-400 to-cyan-500" },
  { slug: "timezone-calculator", name: "Timezone Converter", description: "Convert time zones", icon: "🌍", gradient: "from-green-400 to-teal-500" },
  { slug: "time-duration-calculator", name: "Time Duration", description: "Calculate duration", icon: "⏱️", gradient: "from-rose-400 to-pink-500" },
  { slug: "elapsed-time-calculator", name: "Elapsed Time", description: "Time that has passed", icon: "⌛", gradient: "from-violet-400 to-purple-500" },
];

const workTimeCalculators = [
  { slug: "overtime-calculator", name: "Overtime Calculator", description: "Calculate overtime pay", icon: "💰", gradient: "from-green-500 to-emerald-600" },
  { slug: "timesheet-calculator", name: "Timesheet Calculator", description: "Track work hours", icon: "📋", gradient: "from-blue-500 to-indigo-600" },
  { slug: "shift-calculator", name: "Shift Calculator", description: "Plan shift schedules", icon: "🔄", gradient: "from-purple-500 to-violet-600" },
  { slug: "meeting-planner", name: "Meeting Planner", description: "Schedule across zones", icon: "👥", gradient: "from-orange-500 to-amber-600" },
  { slug: "break-time-calculator", name: "Break Time", description: "Calculate break times", icon: "☕", gradient: "from-amber-400 to-yellow-500" },
];

const eventCalculators = [
  { slug: "birthday-calculator", name: "Birthday Calculator", description: "Days until birthday", icon: "🎉", gradient: "from-pink-400 to-rose-500" },
  { slug: "anniversary-calculator", name: "Anniversary", description: "Anniversary countdown", icon: "💍", gradient: "from-red-400 to-pink-500" },
  { slug: "retirement-age-calculator", name: "Retirement Age", description: "Years until retirement", icon: "🌴", gradient: "from-teal-400 to-cyan-500" },
  { slug: "vacation-countdown", name: "Vacation Countdown", description: "Days until vacation", icon: "✈️", gradient: "from-blue-400 to-indigo-500" },
  { slug: "holiday-calculator", name: "Holiday Calculator", description: "Days until holiday", icon: "🎄", gradient: "from-green-500 to-emerald-600" },
];

function CalculatorCard({ slug, name, description, icon, gradient }: { slug: string; name: string; description: string; icon: string; gradient: string }) {
  return (
    <Link href={`/us/tools/calculators/${slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full border border-gray-100">
        <div className={`h-24 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
          <span className="text-5xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">{icon}</span>
          <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 bg-white/15 rounded-full"></div>
        </div>
        <div className="p-4">
          <h3 className="text-base font-bold text-gray-800 mb-1 group-hover:text-amber-600 transition-colors">{name}</h3>
          <p className="text-sm text-gray-500 leading-snug">{description}</p>
        </div>
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={`w-8 h-8 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center shadow-lg`}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
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
      <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

export default function TimePage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white py-20 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400/30 rounded-full blur-lg"></div>
        <div className="absolute top-20 right-1/4 w-12 h-12 bg-pink-400/20 rounded-full blur-lg"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-xl">⏰</span>
            <span className="text-sm font-medium">Time & Date Calculators</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Master Your Time</h1>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">
            20+ free time calculators for dates, ages, time zones, countdowns, and more. Plan events and track time effortlessly.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="text-3xl font-bold">20+</div>
              <div className="text-amber-200 text-sm">Calculators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">5</div>
              <div className="text-amber-200 text-sm">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-amber-200 text-sm">Free & Accurate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Age Calculators */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Age Calculators" subtitle="Calculate age in various formats" icon="🎂" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {ageCalculators.map((calc) => (
            <CalculatorCard key={calc.slug} {...calc} />
          ))}
        </div>
      </section>

      {/* Date Calculators */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader title="Date Calculators" subtitle="Calculate between dates and plan ahead" icon="📅" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {dateCalculators.map((calc) => (
              <CalculatorCard key={calc.slug} {...calc} />
            ))}
          </div>
        </div>
      </section>

      {/* Time Calculators */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Time Calculators" subtitle="Add, subtract, and convert time" icon="⏱️" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {timeCalculators.map((calc) => (
            <CalculatorCard key={calc.slug} {...calc} />
          ))}
        </div>
      </section>

      {/* Work Time */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader title="Work Time" subtitle="Track work hours and schedules" icon="💼" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {workTimeCalculators.map((calc) => (
              <CalculatorCard key={calc.slug} {...calc} />
            ))}
          </div>
        </div>
      </section>

      {/* Event Calculators */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Event Countdowns" subtitle="Count down to special occasions" icon="🎉" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {eventCalculators.map((calc) => (
            <CalculatorCard key={calc.slug} {...calc} />
          ))}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Why Use Our Time Calculators?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Precise time calculations for every need</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl text-white">✓</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Precise Results</h3>
              <p className="text-sm text-gray-600">Down to the second accuracy</p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">All Time Zones</h3>
              <p className="text-sm text-gray-600">Global time zone support</p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Instant</h3>
              <p className="text-sm text-gray-600">Results in milliseconds</p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Mobile Ready</h3>
              <p className="text-sm text-gray-600">Use on any device</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-amber-500 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start Calculating Time</h2>
          <p className="text-amber-100 text-lg mb-8">Try our most popular time calculators</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/us/tools/calculators/age-calculator" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-600 rounded-xl font-semibold hover:bg-amber-50 transition-all shadow-lg">
              <span>🎂</span> Age Calculator
            </Link>
            <Link href="/us/tools/calculators/date-calculator" className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all backdrop-blur-sm">
              <span>📅</span> Date Calculator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
