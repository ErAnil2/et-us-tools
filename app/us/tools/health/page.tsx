import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Health Calculators - BMI, Body Fat, Fitness & Nutrition | The Economic Times',
  description: 'Free online health calculators for BMI, body fat percentage, calories, nutrition, fitness tracking, and more. Make informed health decisions.',
  alternates: {
    canonical: 'https://economictimes.indiatimes.com/us/tools/health',
  },
  openGraph: {
    title: 'Health Calculators - BMI, Body Fat, Fitness & Nutrition | The Economic Times',
    description: 'Free online health calculators for BMI, body fat percentage, calories, nutrition, fitness tracking, and more.',
    url: 'https://economictimes.indiatimes.com/us/tools/health',
    type: 'website',
  },
};

const bodyCompositionCalculators = [
  { slug: "bmi-calculator", name: "BMI Calculator", description: "Calculate body mass index", icon: "⚖️", gradient: "from-rose-400 to-pink-500" },
  { slug: "body-fat-calculator", name: "Body Fat", description: "Estimate body fat percentage", icon: "📏", gradient: "from-purple-400 to-violet-500" },
  { slug: "ideal-weight-calculator", name: "Ideal Weight", description: "Find your ideal body weight", icon: "🎯", gradient: "from-blue-400 to-cyan-500" },
  { slug: "lean-body-mass-calculator", name: "Lean Body Mass", description: "Calculate muscle mass", icon: "💪", gradient: "from-green-400 to-emerald-500" },
  { slug: "body-shape-calculator", name: "Body Shape", description: "Determine your body type", icon: "👤", gradient: "from-amber-400 to-orange-500" },
  { slug: "waist-hip-ratio-calculator", name: "Waist-Hip Ratio", description: "Health risk indicator", icon: "📐", gradient: "from-indigo-400 to-purple-500" },
  { slug: "height-calculator", name: "Height Calculator", description: "Predict height growth", icon: "📈", gradient: "from-teal-400 to-cyan-500" },
];

const calorieCalculators = [
  { slug: "calorie-calculator", name: "Calorie Calculator", description: "Daily calorie needs", icon: "🔥", gradient: "from-orange-400 to-red-500" },
  { slug: "bmr-calculator", name: "BMR Calculator", description: "Basal metabolic rate", icon: "⚡", gradient: "from-yellow-400 to-amber-500" },
  { slug: "calorie-deficit-calculator", name: "Calorie Deficit", description: "Weight loss planning", icon: "📉", gradient: "from-green-400 to-teal-500" },
  { slug: "calorie-burn-calculator", name: "Calorie Burn", description: "Exercise calories burned", icon: "🏃", gradient: "from-cyan-400 to-blue-500" },
  { slug: "walking-calorie-calculator", name: "Walking Calories", description: "Calories burned walking", icon: "🚶", gradient: "from-lime-400 to-green-500" },
  { slug: "steps-to-calories-calculator", name: "Steps to Calories", description: "Convert steps to calories", icon: "👟", gradient: "from-violet-400 to-purple-500" },
];

const nutritionCalculators = [
  { slug: "macro-calculator", name: "Macro Calculator", description: "Protein, carbs, and fats", icon: "🥗", gradient: "from-green-500 to-lime-500" },
  { slug: "protein-requirement-calculator", name: "Protein Needs", description: "Daily protein intake", icon: "🥩", gradient: "from-red-400 to-rose-500" },
  { slug: "water-intake-calculator", name: "Water Intake", description: "Daily hydration needs", icon: "💧", gradient: "from-cyan-400 to-blue-500" },
  { slug: "carb-calculator", name: "Carb Calculator", description: "Daily carbohydrate needs", icon: "🍞", gradient: "from-amber-400 to-orange-500" },
  { slug: "fat-intake-calculator", name: "Fat Intake", description: "Healthy fat requirements", icon: "🥑", gradient: "from-lime-400 to-green-500" },
  { slug: "fiber-calculator", name: "Fiber Calculator", description: "Daily fiber needs", icon: "🥬", gradient: "from-emerald-400 to-teal-500" },
];

const fitnessCalculators = [
  { slug: "heart-rate-zone-calculator", name: "Heart Rate Zone", description: "Training heart rate zones", icon: "❤️", gradient: "from-red-400 to-rose-500" },
  { slug: "target-heart-rate-calculator", name: "Target Heart Rate", description: "Exercise intensity guide", icon: "💓", gradient: "from-pink-400 to-red-500" },
  { slug: "vo2-max-calculator", name: "VO2 Max", description: "Aerobic fitness level", icon: "🫁", gradient: "from-blue-400 to-indigo-500" },
  { slug: "running-pace-calculator", name: "Running Pace", description: "Calculate running pace", icon: "🏃‍♂️", gradient: "from-orange-400 to-amber-500" },
  { slug: "steps-to-miles-calculator", name: "Steps to Miles", description: "Convert steps to distance", icon: "📍", gradient: "from-green-400 to-emerald-500" },
  { slug: "one-rep-max-calculator", name: "One Rep Max", description: "Strength training tool", icon: "🏋️", gradient: "from-purple-400 to-violet-500" },
];

const pregnancyCalculators = [
  { slug: "pregnancy-calculator", name: "Pregnancy Calculator", description: "Track pregnancy progress", icon: "🤰", gradient: "from-pink-400 to-rose-500" },
  { slug: "pregnancy-due-date-calculator", name: "Due Date", description: "Calculate due date", icon: "📅", gradient: "from-purple-400 to-pink-500" },
  { slug: "ovulation-calculator", name: "Ovulation", description: "Fertility window tracker", icon: "🌸", gradient: "from-rose-400 to-pink-500" },
  { slug: "baby-cost-calculator", name: "Baby Cost", description: "Estimate baby expenses", icon: "👶", gradient: "from-blue-400 to-cyan-500" },
  { slug: "pregnancy-weight-gain-calculator", name: "Weight Gain", description: "Healthy pregnancy weight", icon: "⚖️", gradient: "from-green-400 to-teal-500" },
];

const medicalCalculators = [
  { slug: "blood-pressure-calculator", name: "Blood Pressure", description: "BP category checker", icon: "🩺", gradient: "from-red-500 to-rose-600" },
  { slug: "blood-sugar-calculator", name: "Blood Sugar", description: "Glucose level checker", icon: "🩸", gradient: "from-rose-500 to-red-600" },
  { slug: "sleep-calculator", name: "Sleep Calculator", description: "Optimal sleep timing", icon: "😴", gradient: "from-indigo-400 to-purple-500" },
  { slug: "bac-calculator", name: "BAC Calculator", description: "Blood alcohol content", icon: "🍺", gradient: "from-amber-400 to-yellow-500" },
  { slug: "dog-age-calculator", name: "Dog Age", description: "Dog years calculator", icon: "🐕", gradient: "from-orange-400 to-amber-500" },
  { slug: "cat-age-calculator", name: "Cat Age", description: "Cat years calculator", icon: "🐱", gradient: "from-gray-400 to-slate-500" },
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
          <h3 className="text-base font-bold text-gray-800 mb-1 group-hover:text-rose-600 transition-colors">{name}</h3>
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
      <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

export default function HealthPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-red-500 text-white py-20 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400/20 rounded-full blur-lg"></div>
        <div className="absolute top-20 right-1/4 w-12 h-12 bg-cyan-400/20 rounded-full blur-lg"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-xl">❤️</span>
            <span className="text-sm font-medium">Health & Fitness Calculators</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Health, Your Numbers</h1>
          <p className="text-xl text-rose-100 max-w-2xl mx-auto">
            30+ free health calculators for BMI, calories, fitness, nutrition, and more. Make informed decisions about your health.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="text-3xl font-bold">30+</div>
              <div className="text-rose-200 text-sm">Calculators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">6</div>
              <div className="text-rose-200 text-sm">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-rose-200 text-sm">Free & Private</div>
            </div>
          </div>
        </div>
      </div>

      {/* Body Composition */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Body Composition" subtitle="Measure and track your body metrics" icon="⚖️" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {bodyCompositionCalculators.map((calc) => (
            <CalculatorCard key={calc.slug} {...calc} />
          ))}
        </div>
      </section>

      {/* Calorie & Energy */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader title="Calorie & Energy" subtitle="Track calories and energy expenditure" icon="🔥" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {calorieCalculators.map((calc) => (
              <CalculatorCard key={calc.slug} {...calc} />
            ))}
          </div>
        </div>
      </section>

      {/* Nutrition */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Nutrition" subtitle="Plan your macros and daily nutrition" icon="🥗" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {nutritionCalculators.map((calc) => (
            <CalculatorCard key={calc.slug} {...calc} />
          ))}
        </div>
      </section>

      {/* Fitness */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader title="Fitness" subtitle="Optimize your workouts and training" icon="🏃" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {fitnessCalculators.map((calc) => (
              <CalculatorCard key={calc.slug} {...calc} />
            ))}
          </div>
        </div>
      </section>

      {/* Pregnancy & Family */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Pregnancy & Family" subtitle="Track pregnancy and family planning" icon="👶" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {pregnancyCalculators.map((calc) => (
            <CalculatorCard key={calc.slug} {...calc} />
          ))}
        </div>
      </section>

      {/* Medical */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader title="Medical & Lifestyle" subtitle="Health indicators and lifestyle tools" icon="🩺" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {medicalCalculators.map((calc) => (
              <CalculatorCard key={calc.slug} {...calc} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Why Use Our Health Calculators?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Make better health decisions with accurate tools</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 text-center border border-rose-100">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl text-white">✓</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Evidence-Based</h3>
            <p className="text-sm text-gray-600">Scientifically validated formulas</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center border border-green-100">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">100% Private</h3>
            <p className="text-sm text-gray-600">Your health data stays with you</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 text-center border border-blue-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Instant Results</h3>
            <p className="text-sm text-gray-600">Get answers immediately</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 text-center border border-purple-100">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Mobile Friendly</h3>
            <p className="text-sm text-gray-600">Track health anywhere</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-rose-500 to-pink-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start Your Health Journey Today</h2>
          <p className="text-rose-100 text-lg mb-8">Begin with our most popular calculators</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/us/tools/calculators/bmi-calculator" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-rose-600 rounded-xl font-semibold hover:bg-rose-50 transition-all shadow-lg">
              <span>⚖️</span> BMI Calculator
            </Link>
            <Link href="/us/tools/calculators/calorie-calculator" className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all backdrop-blur-sm">
              <span>🔥</span> Calorie Calculator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
