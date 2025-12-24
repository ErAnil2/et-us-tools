import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Math Calculators - Percentage, Fraction, Area & Conversion | The Economic Times',
  description: 'Free online math calculators for percentages, fractions, geometry, statistics, and unit conversions. Accurate calculations for students and professionals.',
  alternates: {
    canonical: 'https://economictimes.indiatimes.com/us/tools/math',
  },
  openGraph: {
    title: 'Math Calculators - Percentage, Fraction, Area & Conversion | The Economic Times',
    description: 'Free online math calculators for percentages, fractions, geometry, statistics, and unit conversions.',
    url: 'https://economictimes.indiatimes.com/us/tools/math',
    type: 'website',
  },
};

const percentageCalculators = [
  { slug: "percentage-calculator", name: "Percentage Calculator", description: "Calculate any percentage", icon: "%", gradient: "from-indigo-400 to-purple-500" },
  { slug: "percentage-change-calculator", name: "Percentage Change", description: "Find percentage change", icon: "📊", gradient: "from-blue-400 to-indigo-500" },
  { slug: "percentage-increase-calculator", name: "Percentage Increase", description: "Calculate increases", icon: "📈", gradient: "from-green-400 to-emerald-500" },
  { slug: "percentage-decrease-calculator", name: "Percentage Decrease", description: "Calculate decreases", icon: "📉", gradient: "from-red-400 to-rose-500" },
  { slug: "percent-off-calculator", name: "Percent Off", description: "Discount calculations", icon: "🏷️", gradient: "from-pink-400 to-rose-500" },
];

const basicMathCalculators = [
  { slug: "average-calculator", name: "Average Calculator", description: "Mean, median, mode", icon: "📐", gradient: "from-blue-400 to-indigo-500" },
  { slug: "fraction-calculator", name: "Fraction Calculator", description: "Add, subtract, multiply fractions", icon: "➗", gradient: "from-cyan-400 to-blue-500" },
  { slug: "ratio-calculator", name: "Ratio Calculator", description: "Solve ratio problems", icon: "⚖️", gradient: "from-amber-400 to-orange-500" },
  { slug: "proportion-calculator", name: "Proportion", description: "Solve proportions", icon: "🔢", gradient: "from-violet-400 to-purple-500" },
  { slug: "gcd-lcm-calculator", name: "GCD/LCM", description: "Find GCD and LCM", icon: "🧮", gradient: "from-teal-400 to-cyan-500" },
  { slug: "square-root-calculator", name: "Square Root", description: "Calculate square roots", icon: "√", gradient: "from-orange-400 to-amber-500" },
  { slug: "scientific-calculator", name: "Scientific Calculator", description: "Advanced calculations", icon: "🔬", gradient: "from-gray-500 to-slate-600" },
  { slug: "statistics-calculator", name: "Statistics", description: "Statistical analysis", icon: "📊", gradient: "from-blue-500 to-cyan-600" },
  { slug: "long-division-calculator", name: "Long Division", description: "Step-by-step division", icon: "➗", gradient: "from-green-400 to-teal-500" },
  { slug: "exponent-calculator", name: "Exponent Calculator", description: "Powers and exponents", icon: "^", gradient: "from-purple-400 to-indigo-500" },
];

const geometryCalculators = [
  { slug: "area-calculator", name: "Area Calculator", description: "Calculate area of shapes", icon: "📐", gradient: "from-green-400 to-teal-500" },
  { slug: "area-of-a-circle-calculator", name: "Circle Area", description: "Calculate circle area", icon: "⭕", gradient: "from-blue-400 to-indigo-500" },
  { slug: "circumference-calculator", name: "Circumference", description: "Circle circumference", icon: "🔵", gradient: "from-cyan-400 to-blue-500" },
  { slug: "volume-calculator", name: "Volume Calculator", description: "3D shape volumes", icon: "📦", gradient: "from-purple-400 to-violet-500" },
  { slug: "square-footage-calculator", name: "Square Footage", description: "Calculate square feet", icon: "🏠", gradient: "from-orange-400 to-amber-500" },
  { slug: "cubic-feet-calculator", name: "Cubic Feet", description: "Calculate cubic feet", icon: "📐", gradient: "from-rose-400 to-pink-500" },
  { slug: "pythagorean-theorem-calculator", name: "Pythagorean Theorem", description: "Right triangle solver", icon: "📏", gradient: "from-indigo-400 to-purple-500" },
  { slug: "triangle-calculator", name: "Triangle Calculator", description: "Triangle properties", icon: "🔺", gradient: "from-amber-400 to-yellow-500" },
];

const conversionCalculators = [
  { slug: "unit-converter", name: "Unit Converter", description: "Convert any units", icon: "🔄", gradient: "from-teal-400 to-emerald-500" },
  { slug: "length-converter", name: "Length Converter", description: "Convert lengths", icon: "📏", gradient: "from-blue-400 to-indigo-500" },
  { slug: "weight-converter", name: "Weight Converter", description: "Convert weights", icon: "⚖️", gradient: "from-orange-400 to-amber-500" },
  { slug: "temperature-converter", name: "Temperature", description: "C, F, K conversions", icon: "🌡️", gradient: "from-red-400 to-orange-500" },
  { slug: "celsius-to-fahrenheit-calculator", name: "Celsius to Fahrenheit", description: "C to F conversion", icon: "🔥", gradient: "from-amber-400 to-red-500" },
  { slug: "kilometers-to-miles-calculator", name: "KM to Miles", description: "Distance conversion", icon: "🛣️", gradient: "from-green-400 to-teal-500" },
  { slug: "kg-to-lbs-converter-calculator", name: "KG to LBS", description: "Weight conversion", icon: "🏋️", gradient: "from-purple-400 to-violet-500" },
];

const numberSystemCalculators = [
  { slug: "binary-calculator", name: "Binary Calculator", description: "Binary operations", icon: "01", gradient: "from-green-500 to-emerald-600" },
  { slug: "hex-calculator", name: "Hex Calculator", description: "Hexadecimal operations", icon: "0x", gradient: "from-blue-500 to-indigo-600" },
  { slug: "modulo-calculator", name: "Modulo Calculator", description: "Find remainders", icon: "%", gradient: "from-purple-500 to-violet-600" },
  { slug: "decimal-to-binary-calculator", name: "Decimal to Binary", description: "Number conversion", icon: "🔢", gradient: "from-cyan-400 to-blue-500" },
  { slug: "roman-numeral-calculator", name: "Roman Numerals", description: "Roman numeral converter", icon: "Ⅶ", gradient: "from-amber-500 to-orange-600" },
];

const algebraCalculators = [
  { slug: "quadratic-equation-solver", name: "Quadratic Solver", description: "Solve quadratic equations", icon: "x²", gradient: "from-indigo-500 to-purple-600" },
  { slug: "slope-calculator", name: "Slope Calculator", description: "Calculate line slope", icon: "📈", gradient: "from-blue-400 to-cyan-500" },
  { slug: "midpoint-calculator", name: "Midpoint Calculator", description: "Find midpoint", icon: "📍", gradient: "from-green-400 to-emerald-500" },
  { slug: "distance-calculator", name: "Distance Formula", description: "Distance between points", icon: "📏", gradient: "from-orange-400 to-amber-500" },
  { slug: "logarithm-calculator", name: "Logarithm", description: "Calculate logarithms", icon: "log", gradient: "from-violet-400 to-purple-500" },
];

function CalculatorCard({ slug, name, description, icon, gradient }: { slug: string; name: string; description: string; icon: string; gradient: string }) {
  return (
    <Link href={`/us/tools/calculators/${slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full border border-gray-100">
        <div className={`h-24 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
          <span className="text-5xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300 font-bold text-white">{icon}</span>
          <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 bg-white/15 rounded-full"></div>
        </div>
        <div className="p-4">
          <h3 className="text-base font-bold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors">{name}</h3>
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
      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

export default function MathPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white py-20 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-400/20 rounded-full blur-lg"></div>
        <div className="absolute top-20 right-1/4 w-12 h-12 bg-cyan-400/20 rounded-full blur-lg"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-xl">📐</span>
            <span className="text-sm font-medium">Math Calculators</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Math Made Easy</h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            30+ free math calculators for percentages, fractions, geometry, algebra, and conversions. Perfect for students and professionals.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="text-3xl font-bold">30+</div>
              <div className="text-purple-200 text-sm">Calculators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">6</div>
              <div className="text-purple-200 text-sm">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-purple-200 text-sm">Free & Accurate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Percentage Calculators */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Percentage Calculators" subtitle="All types of percentage calculations" icon="%" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {percentageCalculators.map((calc) => (
            <CalculatorCard key={calc.slug} {...calc} />
          ))}
        </div>
      </section>

      {/* Basic Math */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader title="Basic Math" subtitle="Fundamental mathematical operations" icon="🧮" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {basicMathCalculators.map((calc) => (
              <CalculatorCard key={calc.slug} {...calc} />
            ))}
          </div>
        </div>
      </section>

      {/* Geometry */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Geometry" subtitle="Area, volume, and shape calculations" icon="📐" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {geometryCalculators.map((calc) => (
            <CalculatorCard key={calc.slug} {...calc} />
          ))}
        </div>
      </section>

      {/* Conversion Tools */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader title="Unit Conversions" subtitle="Convert between different units" icon="🔄" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {conversionCalculators.map((calc) => (
              <CalculatorCard key={calc.slug} {...calc} />
            ))}
          </div>
        </div>
      </section>

      {/* Number Systems */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Number Systems" subtitle="Binary, hex, and number conversions" icon="01" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {numberSystemCalculators.map((calc) => (
            <CalculatorCard key={calc.slug} {...calc} />
          ))}
        </div>
      </section>

      {/* Algebra */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader title="Algebra" subtitle="Equations, slopes, and formulas" icon="x²" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {algebraCalculators.map((calc) => (
              <CalculatorCard key={calc.slug} {...calc} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Why Use Our Math Calculators?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Trusted by students and professionals worldwide</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 text-center border border-purple-100">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl text-white">✓</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">100% Accurate</h3>
            <p className="text-sm text-gray-600">Verified mathematical formulas</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center border border-green-100">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Step-by-Step</h3>
            <p className="text-sm text-gray-600">Learn while you calculate</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 text-center border border-blue-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Instant Results</h3>
            <p className="text-sm text-gray-600">Calculate in milliseconds</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 text-center border border-orange-100">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Student Friendly</h3>
            <p className="text-sm text-gray-600">Perfect for homework help</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-purple-600 to-indigo-700 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start Calculating Now</h2>
          <p className="text-purple-100 text-lg mb-8">Try our most popular math calculators</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/us/tools/calculators/percentage-calculator" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg">
              <span>%</span> Percentage Calculator
            </Link>
            <Link href="/us/tools/calculators/fraction-calculator" className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all backdrop-blur-sm">
              <span>➗</span> Fraction Calculator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
