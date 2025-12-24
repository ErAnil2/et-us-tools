import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'All Calculators - 300+ Free Online Calculators | The Economic Times',
  description: 'Browse our complete collection of 300+ free online calculators for finance, health, math, time, physics, and more. Accurate results, no signup required.',
  alternates: {
    canonical: 'https://economictimes.indiatimes.com/us/tools/all-calculators',
  },
  openGraph: {
    title: 'All Calculators - 300+ Free Online Calculators | The Economic Times',
    description: 'Browse our complete collection of 300+ free online calculators for finance, health, math, time, physics, and more.',
    url: 'https://economictimes.indiatimes.com/us/tools/all-calculators',
    type: 'website',
  },
};

const financeCalculators = [
  { slug: "sip-calculator", name: "SIP Calculator", icon: "📈", gradient: "from-green-400 to-emerald-500" },
  { slug: "emi-calculator", name: "EMI Calculator", icon: "💳", gradient: "from-blue-500 to-indigo-600" },
  { slug: "compound-interest-calculator", name: "Compound Interest", icon: "📊", gradient: "from-blue-400 to-indigo-500" },
  { slug: "mortgage-payment-calculator", name: "Mortgage Payment", icon: "🏡", gradient: "from-green-500 to-teal-600" },
  { slug: "loan-calculator", name: "Loan Calculator", icon: "📝", gradient: "from-teal-500 to-emerald-600" },
  { slug: "retirement-calculator", name: "Retirement", icon: "🌴", gradient: "from-orange-400 to-amber-500" },
  { slug: "401k-calculator", name: "401k Calculator", icon: "📈", gradient: "from-green-500 to-emerald-600" },
  { slug: "roi-calculator", name: "ROI Calculator", icon: "💹", gradient: "from-green-500 to-emerald-600" },
  { slug: "profit-margin-calculator", name: "Profit Margin", icon: "📊", gradient: "from-blue-500 to-indigo-600" },
  { slug: "salary-calculator", name: "Salary Calculator", icon: "💼", gradient: "from-blue-500 to-indigo-600" },
  { slug: "tip-calculator", name: "Tip Calculator", icon: "💵", gradient: "from-amber-500 to-yellow-600" },
  { slug: "discount-calculator", name: "Discount Calculator", icon: "🏷️", gradient: "from-pink-500 to-rose-600" },
];

const healthCalculators = [
  { slug: "bmi-calculator", name: "BMI Calculator", icon: "⚖️", gradient: "from-rose-400 to-pink-500" },
  { slug: "calorie-calculator", name: "Calorie Calculator", icon: "🔥", gradient: "from-orange-400 to-red-500" },
  { slug: "bmr-calculator", name: "BMR Calculator", icon: "💪", gradient: "from-green-400 to-emerald-500" },
  { slug: "body-fat-calculator", name: "Body Fat", icon: "📏", gradient: "from-purple-400 to-violet-500" },
  { slug: "ideal-weight-calculator", name: "Ideal Weight", icon: "🎯", gradient: "from-blue-400 to-cyan-500" },
  { slug: "macro-calculator", name: "Macro Calculator", icon: "🥗", gradient: "from-green-500 to-lime-500" },
  { slug: "water-intake-calculator", name: "Water Intake", icon: "💧", gradient: "from-cyan-400 to-blue-500" },
  { slug: "pregnancy-calculator", name: "Pregnancy", icon: "👶", gradient: "from-pink-400 to-rose-500" },
  { slug: "sleep-calculator", name: "Sleep Calculator", icon: "😴", gradient: "from-indigo-400 to-purple-500" },
  { slug: "heart-rate-zone-calculator", name: "Heart Rate Zone", icon: "❤️", gradient: "from-red-400 to-rose-500" },
  { slug: "vo2-max-calculator", name: "VO2 Max", icon: "🏃", gradient: "from-teal-400 to-cyan-500" },
  { slug: "protein-requirement-calculator", name: "Protein Needs", icon: "🥩", gradient: "from-amber-400 to-orange-500" },
];

const mathCalculators = [
  { slug: "percentage-calculator", name: "Percentage", icon: "%", gradient: "from-indigo-400 to-purple-500" },
  { slug: "average-calculator", name: "Average Calculator", icon: "📐", gradient: "from-blue-400 to-indigo-500" },
  { slug: "fraction-calculator", name: "Fraction Calculator", icon: "➗", gradient: "from-cyan-400 to-blue-500" },
  { slug: "area-calculator", name: "Area Calculator", icon: "📐", gradient: "from-green-400 to-teal-500" },
  { slug: "volume-calculator", name: "Volume Calculator", icon: "📦", gradient: "from-purple-400 to-violet-500" },
  { slug: "scientific-calculator", name: "Scientific", icon: "🔬", gradient: "from-gray-500 to-slate-600" },
  { slug: "binary-calculator", name: "Binary Calculator", icon: "01", gradient: "from-green-500 to-emerald-600" },
  { slug: "square-root-calculator", name: "Square Root", icon: "√", gradient: "from-orange-400 to-amber-500" },
  { slug: "ratio-calculator", name: "Ratio Calculator", icon: "⚖️", gradient: "from-rose-400 to-pink-500" },
  { slug: "statistics-calculator", name: "Statistics", icon: "📊", gradient: "from-blue-500 to-cyan-600" },
  { slug: "gcd-lcm-calculator", name: "GCD/LCM", icon: "🔢", gradient: "from-violet-400 to-purple-500" },
  { slug: "unit-converter", name: "Unit Converter", icon: "🔄", gradient: "from-teal-400 to-emerald-500" },
];

const timeCalculators = [
  { slug: "age-calculator", name: "Age Calculator", icon: "🎂", gradient: "from-purple-400 to-violet-500" },
  { slug: "date-calculator", name: "Date Calculator", icon: "📅", gradient: "from-blue-400 to-indigo-500" },
  { slug: "days-between-dates-calculator", name: "Days Between Dates", icon: "📆", gradient: "from-cyan-400 to-blue-500" },
  { slug: "time-calculator", name: "Time Calculator", icon: "⏰", gradient: "from-orange-400 to-amber-500" },
  { slug: "countdown-calculator", name: "Countdown", icon: "⏳", gradient: "from-red-400 to-rose-500" },
  { slug: "timezone-calculator", name: "Timezone", icon: "🌍", gradient: "from-green-400 to-teal-500" },
  { slug: "hours-calculator", name: "Hours Calculator", icon: "🕐", gradient: "from-indigo-400 to-purple-500" },
  { slug: "business-days-calculator", name: "Business Days", icon: "💼", gradient: "from-gray-500 to-slate-600" },
];

const physicsCalculators = [
  { slug: "speed-calculator", name: "Speed Calculator", icon: "🚀", gradient: "from-orange-400 to-red-500" },
  { slug: "motion-calculator", name: "Motion Calculator", icon: "📍", gradient: "from-blue-400 to-indigo-500" },
  { slug: "ohms-law-calculator", name: "Ohm's Law", icon: "⚡", gradient: "from-yellow-400 to-amber-500" },
  { slug: "kinetic-energy-calculator", name: "Kinetic Energy", icon: "💨", gradient: "from-cyan-400 to-blue-500" },
  { slug: "fuel-cost-calculator", name: "Fuel Cost", icon: "⛽", gradient: "from-green-400 to-emerald-500" },
  { slug: "electricity-bill-calculator", name: "Electricity Bill", icon: "💡", gradient: "from-amber-400 to-yellow-500" },
  { slug: "solar-panel-calculator", name: "Solar Panel", icon: "☀️", gradient: "from-orange-400 to-yellow-500" },
  { slug: "concrete-calculator", name: "Concrete", icon: "🧱", gradient: "from-gray-400 to-slate-500" },
];

const conversionTools = [
  { slug: "celsius-to-fahrenheit-calculator", name: "Celsius to Fahrenheit", icon: "🌡️", gradient: "from-red-400 to-orange-500" },
  { slug: "kg-to-lbs-converter-calculator", name: "KG to LBS", icon: "⚖️", gradient: "from-blue-400 to-indigo-500" },
  { slug: "kilometers-to-miles-calculator", name: "KM to Miles", icon: "📏", gradient: "from-green-400 to-teal-500" },
  { slug: "length-converter", name: "Length Converter", icon: "📐", gradient: "from-purple-400 to-violet-500" },
  { slug: "weight-converter", name: "Weight Converter", icon: "🏋️", gradient: "from-amber-400 to-orange-500" },
  { slug: "temperature-converter", name: "Temperature", icon: "🌡️", gradient: "from-cyan-400 to-blue-500" },
  { slug: "currency-converter", name: "Currency Converter", icon: "💱", gradient: "from-green-500 to-emerald-600" },
  { slug: "ml-to-oz-converter-calculator", name: "ML to OZ", icon: "🥤", gradient: "from-rose-400 to-pink-500" },
];

const categoryLinks = [
  { href: "/us/tools/finance", name: "Finance", icon: "💰", gradient: "from-blue-500 to-indigo-600", count: "70+" },
  { href: "/us/tools/health", name: "Health", icon: "❤️", gradient: "from-rose-500 to-pink-600", count: "30+" },
  { href: "/us/tools/math", name: "Math", icon: "📐", gradient: "from-purple-500 to-violet-600", count: "30+" },
  { href: "/us/tools/time", name: "Time", icon: "⏰", gradient: "from-amber-500 to-orange-600", count: "15+" },
  { href: "/us/tools/physics", name: "Physics", icon: "⚡", gradient: "from-orange-500 to-red-600", count: "25+" },
  { href: "/us/tools/games", name: "Games", icon: "🎮", gradient: "from-green-500 to-teal-600", count: "35+" },
];

function CalculatorCard({ slug, name, icon, gradient }: { slug: string; name: string; icon: string; gradient: string }) {
  return (
    <Link href={`/us/tools/calculators/${slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full border border-gray-100">
        <div className={`h-20 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
          <span className="text-4xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">{icon}</span>
          <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-3 left-3 w-3 h-3 bg-white/15 rounded-full"></div>
        </div>
        <div className="p-3">
          <h3 className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">{name}</h3>
        </div>
      </div>
    </Link>
  );
}

function SectionHeader({ title, subtitle, icon, gradient }: { title: string; subtitle: string; icon: string; gradient: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

export default function AllCalculatorsPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-400/20 rounded-full blur-lg"></div>
        <div className="absolute top-20 right-1/3 w-12 h-12 bg-orange-400/20 rounded-full blur-lg"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-xl">🧮</span>
            <span className="text-sm font-medium">Complete Calculator Collection</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Calculators</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            300+ free online calculators for finance, health, math, time, physics, and more. Accurate results, instant calculations.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="text-3xl font-bold">300+</div>
              <div className="text-slate-400 text-sm">Calculators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">6</div>
              <div className="text-slate-400 text-sm">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-slate-400 text-sm">Free Forever</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Category Links */}
      <section className="max-w-[1200px] mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryLinks.map((cat) => (
            <Link key={cat.href} href={cat.href} className="group">
              <div className={`bg-gradient-to-br ${cat.gradient} rounded-2xl p-4 text-center text-white hover:shadow-xl transition-all transform hover:-translate-y-1`}>
                <span className="text-3xl block mb-2">{cat.icon}</span>
                <h3 className="font-bold">{cat.name}</h3>
                <p className="text-sm opacity-80">{cat.count} tools</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Finance Calculators */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader title="Finance Calculators" subtitle="Investment, loans, and money management" icon="💰" gradient="from-blue-500 to-indigo-600" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {financeCalculators.map((calc) => (
              <CalculatorCard key={calc.slug} {...calc} />
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/us/tools/finance" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
              View all Finance Calculators
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Health Calculators */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Health Calculators" subtitle="BMI, calories, fitness, and wellness" icon="❤️" gradient="from-rose-500 to-pink-600" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {healthCalculators.map((calc) => (
            <CalculatorCard key={calc.slug} {...calc} />
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/us/tools/health" className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium">
            View all Health Calculators
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* Math Calculators */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader title="Math Calculators" subtitle="Percentages, geometry, and conversions" icon="📐" gradient="from-purple-500 to-violet-600" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mathCalculators.map((calc) => (
              <CalculatorCard key={calc.slug} {...calc} />
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/us/tools/math" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium">
              View all Math Calculators
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Time Calculators */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Time Calculators" subtitle="Date, age, and time zone tools" icon="⏰" gradient="from-amber-500 to-orange-600" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {timeCalculators.map((calc) => (
            <CalculatorCard key={calc.slug} {...calc} />
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/us/tools/time" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium">
            View all Time Calculators
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* Physics Calculators */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader title="Physics & Engineering" subtitle="Motion, energy, and construction" icon="⚡" gradient="from-orange-500 to-red-600" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {physicsCalculators.map((calc) => (
              <CalculatorCard key={calc.slug} {...calc} />
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/us/tools/physics" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium">
              View all Physics Calculators
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Conversion Tools */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Conversion Tools" subtitle="Unit, temperature, and currency converters" icon="🔄" gradient="from-teal-500 to-cyan-600" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {conversionTools.map((calc) => (
            <CalculatorCard key={calc.slug} {...calc} />
          ))}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Why Use Our Calculators?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Trusted by millions for accurate calculations</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl text-white">✓</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">100% Accurate</h3>
              <p className="text-sm text-gray-600">Industry-standard formulas</p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">100% Private</h3>
              <p className="text-sm text-gray-600">Data stays in your browser</p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Instant Results</h3>
              <p className="text-sm text-gray-600">No waiting, no loading</p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Mobile Friendly</h3>
              <p className="text-sm text-gray-600">Works on any device</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
