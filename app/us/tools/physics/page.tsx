import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Physics Calculators - Motion, Energy, Electricity & Engineering | The Economic Times',
  description: 'Free online physics and engineering calculators for mechanics, energy, electricity, construction, and more. Accurate scientific calculations.',
  alternates: {
    canonical: 'https://economictimes.indiatimes.com/us/tools/physics',
  },
  openGraph: {
    title: 'Physics Calculators - Motion, Energy, Electricity & Engineering | The Economic Times',
    description: 'Free online physics and engineering calculators for mechanics, energy, electricity, construction, and more.',
    url: 'https://economictimes.indiatimes.com/us/tools/physics',
    type: 'website',
  },
};

const mechanicsCalculators = [
  { slug: "motion-calculator", name: "Motion Calculator", description: "Velocity, acceleration, time", icon: "🚀", gradient: "from-blue-400 to-indigo-500" },
  { slug: "speed-calculator", name: "Speed Calculator", description: "Calculate speed & velocity", icon: "⚡", gradient: "from-orange-400 to-red-500" },
  { slug: "acceleration-calculator", name: "Acceleration", description: "Rate of velocity change", icon: "📈", gradient: "from-green-400 to-emerald-500" },
  { slug: "torque-calculator", name: "Torque Calculator", description: "Rotational force", icon: "🔧", gradient: "from-gray-500 to-slate-600" },
  { slug: "gear-ratio-calculator", name: "Gear Ratio", description: "Gear and pulley ratios", icon: "⚙️", gradient: "from-purple-400 to-violet-500" },
  { slug: "momentum-calculator", name: "Momentum", description: "Mass × velocity", icon: "💨", gradient: "from-cyan-400 to-blue-500" },
  { slug: "force-calculator", name: "Force Calculator", description: "F = ma calculations", icon: "💪", gradient: "from-red-400 to-rose-500" },
  { slug: "friction-calculator", name: "Friction Calculator", description: "Frictional force", icon: "🛞", gradient: "from-amber-400 to-orange-500" },
];

const energyCalculators = [
  { slug: "kinetic-energy-calculator", name: "Kinetic Energy", description: "Energy of motion", icon: "🏃", gradient: "from-cyan-400 to-blue-500" },
  { slug: "potential-energy-calculator", name: "Potential Energy", description: "Stored energy", icon: "⬆️", gradient: "from-green-400 to-teal-500" },
  { slug: "work-calculator", name: "Work Calculator", description: "Work = Force × Distance", icon: "🔨", gradient: "from-orange-400 to-amber-500" },
  { slug: "power-calculator", name: "Power Calculator", description: "Rate of energy transfer", icon: "⚡", gradient: "from-yellow-400 to-amber-500" },
  { slug: "joules-calculator", name: "Joules Calculator", description: "Energy in joules", icon: "🔋", gradient: "from-purple-400 to-violet-500" },
  { slug: "horsepower-calculator", name: "Horsepower", description: "HP conversions", icon: "🐎", gradient: "from-red-400 to-rose-500" },
];

const electricityCalculators = [
  { slug: "ohms-law-calculator", name: "Ohm's Law", description: "V = I × R", icon: "⚡", gradient: "from-yellow-400 to-amber-500" },
  { slug: "electricity-bill-calculator", name: "Electricity Bill", description: "Calculate power costs", icon: "💡", gradient: "from-green-400 to-emerald-500" },
  { slug: "voltage-calculator", name: "Voltage Calculator", description: "Electrical potential", icon: "🔌", gradient: "from-blue-400 to-indigo-500" },
  { slug: "wattage-calculator", name: "Wattage Calculator", description: "Power consumption", icon: "💡", gradient: "from-amber-400 to-orange-500" },
  { slug: "resistance-calculator", name: "Resistance", description: "Electrical resistance", icon: "Ω", gradient: "from-purple-400 to-violet-500" },
  { slug: "capacitance-calculator", name: "Capacitance", description: "Capacitor calculations", icon: "🔋", gradient: "from-cyan-400 to-blue-500" },
  { slug: "battery-life-calculator", name: "Battery Life", description: "Battery runtime", icon: "🔋", gradient: "from-green-500 to-teal-600" },
  { slug: "led-resistor-calculator", name: "LED Resistor", description: "LED circuit design", icon: "💡", gradient: "from-red-400 to-pink-500" },
];

const solarCalculators = [
  { slug: "solar-panel-calculator", name: "Solar Panel", description: "Solar system sizing", icon: "☀️", gradient: "from-orange-400 to-yellow-500" },
  { slug: "solar-savings-calculator", name: "Solar Savings", description: "ROI on solar", icon: "💰", gradient: "from-green-400 to-emerald-500" },
  { slug: "solar-battery-calculator", name: "Solar Battery", description: "Battery storage needs", icon: "🔋", gradient: "from-blue-400 to-cyan-500" },
  { slug: "ev-charging-calculator", name: "EV Charging", description: "Electric vehicle charging", icon: "🚗", gradient: "from-teal-400 to-cyan-500" },
];

const constructionCalculators = [
  { slug: "concrete-calculator", name: "Concrete Calculator", description: "Concrete volume needed", icon: "🧱", gradient: "from-gray-400 to-slate-500" },
  { slug: "roofing-calculator", name: "Roofing Calculator", description: "Roofing materials", icon: "🏠", gradient: "from-orange-400 to-amber-500" },
  { slug: "ramp-calculator", name: "Ramp Calculator", description: "ADA ramp design", icon: "📐", gradient: "from-blue-400 to-indigo-500" },
  { slug: "staircase-calculator", name: "Staircase", description: "Stair dimensions", icon: "🪜", gradient: "from-amber-400 to-yellow-500" },
  { slug: "hvac-load-calculator", name: "HVAC Load", description: "Heating/cooling needs", icon: "❄️", gradient: "from-cyan-400 to-blue-500" },
  { slug: "paint-coverage-calculator", name: "Paint Coverage", description: "Paint needed", icon: "🎨", gradient: "from-purple-400 to-pink-500" },
  { slug: "lumber-calculator", name: "Lumber Calculator", description: "Wood requirements", icon: "🪵", gradient: "from-amber-500 to-orange-600" },
  { slug: "gravel-calculator", name: "Gravel Calculator", description: "Gravel volume", icon: "🪨", gradient: "from-gray-500 to-slate-600" },
];

const vehicleCalculators = [
  { slug: "fuel-cost-calculator", name: "Fuel Cost", description: "Trip fuel costs", icon: "⛽", gradient: "from-green-400 to-emerald-500" },
  { slug: "fuel-economy-calculator", name: "Fuel Economy", description: "MPG calculations", icon: "📊", gradient: "from-blue-400 to-indigo-500" },
  { slug: "mpg-calculator", name: "MPG Calculator", description: "Miles per gallon", icon: "🚗", gradient: "from-teal-400 to-cyan-500" },
  { slug: "0-60-calculator", name: "0-60 Calculator", description: "Acceleration time", icon: "🏎️", gradient: "from-red-400 to-rose-500" },
  { slug: "tire-size-calculator", name: "Tire Size", description: "Tire dimensions", icon: "🛞", gradient: "from-gray-500 to-slate-600" },
  { slug: "gas-mileage-calculator", name: "Gas Mileage", description: "Fuel efficiency", icon: "⛽", gradient: "from-amber-400 to-orange-500" },
];

const technologyCalculators = [
  { slug: "download-time-calculator", name: "Download Time", description: "File download duration", icon: "📥", gradient: "from-blue-400 to-indigo-500" },
  { slug: "data-usage-calculator", name: "Data Usage", description: "Data consumption", icon: "📶", gradient: "from-green-400 to-teal-500" },
  { slug: "subnet-calculator", name: "Subnet Calculator", description: "IP subnetting", icon: "🌐", gradient: "from-purple-400 to-violet-500" },
  { slug: "bandwidth-calculator", name: "Bandwidth", description: "Network bandwidth", icon: "📡", gradient: "from-cyan-400 to-blue-500" },
  { slug: "storage-converter", name: "Storage Converter", description: "GB, TB, PB conversion", icon: "💾", gradient: "from-orange-400 to-amber-500" },
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
          <h3 className="text-base font-bold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">{name}</h3>
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
      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

export default function PhysicsPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 text-white py-20 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400/30 rounded-full blur-lg"></div>
        <div className="absolute top-20 right-1/4 w-12 h-12 bg-blue-400/20 rounded-full blur-lg"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-xl">⚡</span>
            <span className="text-sm font-medium">Physics & Engineering Calculators</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Science & Engineering Tools</h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            40+ free physics and engineering calculators for mechanics, energy, electricity, construction, and more.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="text-3xl font-bold">40+</div>
              <div className="text-orange-200 text-sm">Calculators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">7</div>
              <div className="text-orange-200 text-sm">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-orange-200 text-sm">Free & Accurate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mechanics */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Mechanics" subtitle="Motion, force, and momentum calculations" icon="🚀" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {mechanicsCalculators.map((calc) => (
            <CalculatorCard key={calc.slug} {...calc} />
          ))}
        </div>
      </section>

      {/* Energy */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader title="Energy & Work" subtitle="Energy transformations and power" icon="⚡" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {energyCalculators.map((calc) => (
              <CalculatorCard key={calc.slug} {...calc} />
            ))}
          </div>
        </div>
      </section>

      {/* Electricity */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Electricity" subtitle="Electrical circuits and power" icon="💡" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {electricityCalculators.map((calc) => (
            <CalculatorCard key={calc.slug} {...calc} />
          ))}
        </div>
      </section>

      {/* Solar & Green Energy */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader title="Solar & Green Energy" subtitle="Renewable energy calculations" icon="☀️" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {solarCalculators.map((calc) => (
              <CalculatorCard key={calc.slug} {...calc} />
            ))}
          </div>
        </div>
      </section>

      {/* Construction */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Construction & Engineering" subtitle="Building and materials calculations" icon="🏗️" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {constructionCalculators.map((calc) => (
            <CalculatorCard key={calc.slug} {...calc} />
          ))}
        </div>
      </section>

      {/* Vehicle */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader title="Vehicle & Fuel" subtitle="Automotive and fuel calculations" icon="🚗" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {vehicleCalculators.map((calc) => (
              <CalculatorCard key={calc.slug} {...calc} />
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Technology" subtitle="Computing and network calculations" icon="💻" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {technologyCalculators.map((calc) => (
            <CalculatorCard key={calc.slug} {...calc} />
          ))}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Why Use Our Physics Calculators?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Trusted by engineers and scientists</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl text-white">✓</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Scientific Accuracy</h3>
              <p className="text-sm text-gray-600">Verified physics formulas</p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">📐</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Unit Conversion</h3>
              <p className="text-sm text-gray-600">SI and imperial units</p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Instant Results</h3>
              <p className="text-sm text-gray-600">Real-time calculations</p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Educational</h3>
              <p className="text-sm text-gray-600">Learn while calculating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-orange-500 to-red-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start Your Calculations</h2>
          <p className="text-orange-100 text-lg mb-8">Explore our most popular physics calculators</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/us/tools/calculators/ohms-law-calculator" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all shadow-lg">
              <span>⚡</span> Ohm&apos;s Law
            </Link>
            <Link href="/us/tools/calculators/speed-calculator" className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all backdrop-blur-sm">
              <span>🚀</span> Speed Calculator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
