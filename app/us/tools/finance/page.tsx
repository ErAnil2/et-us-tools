import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Financial Calculators - Investment, Loan & Tax Calculators | The Economic Times',
  description: 'Free online financial calculators for investments, loans, mortgages, retirement planning, taxes, and more. Make informed financial decisions with accurate calculations.',
  alternates: {
    canonical: 'https://economictimes.indiatimes.com/us/tools/finance',
  },
  openGraph: {
    title: 'Financial Calculators - Investment, Loan & Tax Calculators | The Economic Times',
    description: 'Free online financial calculators for investments, loans, mortgages, retirement planning, taxes, and more.',
    url: 'https://economictimes.indiatimes.com/us/tools/finance',
    type: 'website',
  },
};

const investmentCalculators = [
  { href: "/us/tools/calculators/sip-calculator", title: "SIP Calculator", description: "Calculate systematic investment returns", icon: "📈", gradient: "from-green-400 to-emerald-500" },
  { href: "/us/tools/calculators/lumpsum-calculator", title: "Lumpsum Calculator", description: "One-time investment returns", icon: "💵", gradient: "from-emerald-400 to-teal-500" },
  { href: "/us/tools/calculators/compound-interest-calculator", title: "Compound Interest", description: "See your money grow over time", icon: "📊", gradient: "from-blue-400 to-indigo-500" },
  { href: "/us/tools/calculators/simple-interest-calculator", title: "Simple Interest", description: "Basic interest calculations", icon: "🧮", gradient: "from-cyan-400 to-blue-500" },
  { href: "/us/tools/calculators/ppf-calculator", title: "PPF Calculator", description: "Public provident fund returns", icon: "🏦", gradient: "from-violet-400 to-purple-500" },
  { href: "/us/tools/calculators/fd-calculator", title: "FD Calculator", description: "Fixed deposit maturity value", icon: "🔒", gradient: "from-amber-400 to-orange-500" },
  { href: "/us/tools/calculators/rd-calculator", title: "RD Calculator", description: "Recurring deposit returns", icon: "🔄", gradient: "from-pink-400 to-rose-500" },
  { href: "/us/tools/calculators/cagr-calculator", title: "CAGR Calculator", description: "Compound annual growth rate", icon: "📉", gradient: "from-indigo-400 to-violet-500" },
  { href: "/us/tools/calculators/investment-calculator", title: "Investment Calculator", description: "General investment planning", icon: "💰", gradient: "from-teal-400 to-cyan-500" },
  { href: "/us/tools/calculators/dividend-yield-calculator", title: "Dividend Yield", description: "Calculate dividend returns", icon: "💸", gradient: "from-green-500 to-lime-500" },
  { href: "/us/tools/calculators/stock-valuation-calculator", title: "Stock Valuation", description: "Estimate stock fair value", icon: "📋", gradient: "from-blue-500 to-cyan-500" },
  { href: "/us/tools/calculators/apy-calculator", title: "APY Calculator", description: "Annual percentage yield", icon: "📐", gradient: "from-purple-400 to-pink-500" },
];

const loanCalculators = [
  { href: "/us/tools/calculators/emi-calculator", title: "EMI Calculator", description: "Monthly installment calculator", icon: "💳", gradient: "from-blue-500 to-indigo-600" },
  { href: "/us/tools/calculators/home-loan-calculator", title: "Home Loan", description: "Calculate home loan EMI", icon: "🏠", gradient: "from-orange-400 to-red-500" },
  { href: "/us/tools/calculators/personal-loan-calculator", title: "Personal Loan", description: "Personal loan EMI & interest", icon: "👤", gradient: "from-purple-500 to-violet-600" },
  { href: "/us/tools/calculators/car-loan-calculator", title: "Car Loan", description: "Auto financing calculator", icon: "🚗", gradient: "from-red-400 to-pink-500" },
  { href: "/us/tools/calculators/education-loan-calculator", title: "Education Loan", description: "Student loan calculations", icon: "🎓", gradient: "from-cyan-500 to-blue-600" },
  { href: "/us/tools/calculators/auto-loan-calculator", title: "Auto Loan", description: "Vehicle loan calculator", icon: "🚙", gradient: "from-gray-500 to-slate-600" },
  { href: "/us/tools/calculators/loan-calculator", title: "Loan Calculator", description: "General loan calculator", icon: "📝", gradient: "from-teal-500 to-emerald-600" },
  { href: "/us/tools/calculators/student-loan-calculator", title: "Student Loan", description: "Student debt planning", icon: "📚", gradient: "from-indigo-500 to-purple-600" },
  { href: "/us/tools/calculators/loan-payment-calculator", title: "Loan Payment", description: "Monthly payment breakdown", icon: "📅", gradient: "from-rose-500 to-pink-600" },
];

const mortgageCalculators = [
  { href: "/us/tools/calculators/mortgage-payment-calculator", title: "Mortgage Payment", description: "Monthly mortgage calculator", icon: "🏡", gradient: "from-green-500 to-teal-600" },
  { href: "/us/tools/calculators/mortgage-calculator-advanced", title: "Advanced Mortgage", description: "Detailed mortgage analysis", icon: "🔍", gradient: "from-blue-500 to-indigo-600" },
  { href: "/us/tools/calculators/mortgage-amortization-calculator", title: "Amortization", description: "Loan payoff schedule", icon: "📊", gradient: "from-violet-500 to-purple-600" },
  { href: "/us/tools/calculators/home-affordability-calculator", title: "Home Affordability", description: "How much home can you afford?", icon: "🔑", gradient: "from-amber-500 to-orange-600" },
  { href: "/us/tools/calculators/rent-vs-buy-calculator", title: "Rent vs Buy", description: "Compare renting vs buying", icon: "⚖️", gradient: "from-cyan-500 to-teal-600" },
  { href: "/us/tools/calculators/rental-property-calculator", title: "Rental Property", description: "Investment property analysis", icon: "🏢", gradient: "from-rose-500 to-red-600" },
];

const retirementCalculators = [
  { href: "/us/tools/calculators/retirement-calculator", title: "Retirement Calculator", description: "Plan your retirement savings", icon: "🌴", gradient: "from-orange-400 to-amber-500" },
  { href: "/us/tools/calculators/401k-calculator", title: "401k Calculator", description: "Retirement account growth", icon: "📈", gradient: "from-green-500 to-emerald-600" },
  { href: "/us/tools/calculators/nps-calculator", title: "NPS Calculator", description: "National pension scheme", icon: "🏛️", gradient: "from-blue-500 to-cyan-600" },
  { href: "/us/tools/calculators/savings-goal-calculator", title: "Savings Goal", description: "Reach your savings target", icon: "🎯", gradient: "from-purple-500 to-violet-600" },
  { href: "/us/tools/calculators/emergency-fund-calculator", title: "Emergency Fund", description: "Build your safety net", icon: "🛡️", gradient: "from-red-500 to-rose-600" },
  { href: "/us/tools/calculators/college-savings-calculator", title: "College Savings", description: "529 plan & education savings", icon: "🎓", gradient: "from-indigo-500 to-blue-600" },
];

const taxCalculators = [
  { href: "/us/tools/calculators/us-federal-income-tax-calculator", title: "Federal Income Tax", description: "US federal tax calculator", icon: "🇺🇸", gradient: "from-blue-600 to-indigo-700" },
  { href: "/us/tools/calculators/capital-gains-calculator", title: "Capital Gains", description: "Investment tax calculator", icon: "📈", gradient: "from-green-500 to-teal-600" },
  { href: "/us/tools/calculators/sales-tax-calculator", title: "Sales Tax", description: "Calculate sales tax amount", icon: "🧾", gradient: "from-orange-500 to-red-600" },
  { href: "/us/tools/calculators/hra-calculator", title: "HRA Calculator", description: "House rent allowance", icon: "🏠", gradient: "from-purple-500 to-pink-600" },
  { href: "/us/tools/calculators/tds-calculator", title: "TDS Calculator", description: "Tax deducted at source", icon: "✂️", gradient: "from-cyan-500 to-blue-600" },
];

const incomeCalculators = [
  { href: "/us/tools/calculators/salary-calculator", title: "Salary Calculator", description: "Net salary & deductions", icon: "💼", gradient: "from-blue-500 to-indigo-600" },
  { href: "/us/tools/calculators/hourly-to-annual-salary-calculator", title: "Hourly to Annual", description: "Convert hourly to yearly", icon: "⏰", gradient: "from-green-500 to-emerald-600" },
  { href: "/us/tools/calculators/salary-to-hourly-calculator", title: "Salary to Hourly", description: "Convert yearly to hourly", icon: "🕐", gradient: "from-purple-500 to-violet-600" },
  { href: "/us/tools/calculators/pay-raise-calculator", title: "Pay Raise", description: "Calculate raise percentage", icon: "📈", gradient: "from-amber-500 to-orange-600" },
  { href: "/us/tools/calculators/payroll-calculator", title: "Payroll Calculator", description: "Payroll & paycheck calculator", icon: "📋", gradient: "from-teal-500 to-cyan-600" },
  { href: "/us/tools/calculators/overtime-calculator", title: "Overtime Calculator", description: "Calculate overtime pay", icon: "⏱️", gradient: "from-rose-500 to-pink-600" },
];

const businessCalculators = [
  { href: "/us/tools/calculators/roi-calculator", title: "ROI Calculator", description: "Return on investment", icon: "💹", gradient: "from-green-500 to-emerald-600" },
  { href: "/us/tools/calculators/profit-margin-calculator", title: "Profit Margin", description: "Calculate profit margins", icon: "📊", gradient: "from-blue-500 to-indigo-600" },
  { href: "/us/tools/calculators/break-even-calculator", title: "Break Even", description: "Break-even analysis", icon: "⚖️", gradient: "from-orange-500 to-amber-600" },
  { href: "/us/tools/calculators/margin-calculator", title: "Margin Calculator", description: "Gross & net margins", icon: "📉", gradient: "from-purple-500 to-violet-600" },
  { href: "/us/tools/calculators/markup-calculator", title: "Markup Calculator", description: "Calculate product markup", icon: "🏷️", gradient: "from-cyan-500 to-teal-600" },
];

const otherCalculators = [
  { href: "/us/tools/calculators/currency-converter", title: "Currency Converter", description: "Convert currencies worldwide", icon: "💱", gradient: "from-green-500 to-teal-600" },
  { href: "/us/tools/calculators/inflation-calculator", title: "Inflation Calculator", description: "Purchasing power over time", icon: "📈", gradient: "from-red-500 to-orange-600" },
  { href: "/us/tools/calculators/net-worth-calculator", title: "Net Worth", description: "Calculate your net worth", icon: "💎", gradient: "from-purple-500 to-indigo-600" },
  { href: "/us/tools/calculators/budget-calculator", title: "Budget Calculator", description: "Monthly budget planner", icon: "📝", gradient: "from-blue-500 to-cyan-600" },
  { href: "/us/tools/calculators/tip-calculator", title: "Tip Calculator", description: "Calculate tips & split bills", icon: "💵", gradient: "from-amber-500 to-yellow-600" },
  { href: "/us/tools/calculators/discount-calculator", title: "Discount Calculator", description: "Calculate sale prices", icon: "🏷️", gradient: "from-pink-500 to-rose-600" },
];

function CalculatorCard({ href, title, description, icon, gradient }: { href: string; title: string; description: string; icon: string; gradient: string }) {
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
          <h3 className="text-base font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">{title}</h3>
          <p className="text-sm text-gray-500 leading-snug">{description}</p>
        </div>

        {/* Calculator indicator */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={`w-8 h-8 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center shadow-lg`}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
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
      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

export default function FinancePage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white py-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400/20 rounded-full blur-lg"></div>
        <div className="absolute top-20 right-1/4 w-12 h-12 bg-green-400/20 rounded-full blur-lg"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-xl">💰</span>
            <span className="text-sm font-medium">Financial Calculators</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Smart Financial Decisions</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            70+ free financial calculators for investments, loans, mortgages, taxes, and more. Make informed decisions with accurate calculations.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="text-3xl font-bold">70+</div>
              <div className="text-blue-200 text-sm">Calculators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">8</div>
              <div className="text-blue-200 text-sm">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-blue-200 text-sm">Free & Accurate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Calculators */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Investment Calculators" subtitle="Plan and track your investment growth" icon="📈" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {investmentCalculators.map((calc) => (
            <CalculatorCard key={calc.href} {...calc} />
          ))}
        </div>
      </section>

      {/* Loan Calculators */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader title="Loan Calculators" subtitle="Calculate EMIs, interest, and repayment schedules" icon="💳" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {loanCalculators.map((calc) => (
              <CalculatorCard key={calc.href} {...calc} />
            ))}
          </div>
        </div>
      </section>

      {/* Mortgage Calculators */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Mortgage Calculators" subtitle="Home buying and mortgage planning tools" icon="🏡" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {mortgageCalculators.map((calc) => (
            <CalculatorCard key={calc.href} {...calc} />
          ))}
        </div>
      </section>

      {/* Retirement & Savings */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader title="Retirement & Savings" subtitle="Plan for a secure financial future" icon="🌴" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {retirementCalculators.map((calc) => (
              <CalculatorCard key={calc.href} {...calc} />
            ))}
          </div>
        </div>
      </section>

      {/* Tax Calculators */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Tax Calculators" subtitle="Estimate taxes and plan deductions" icon="🧾" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {taxCalculators.map((calc) => (
            <CalculatorCard key={calc.href} {...calc} />
          ))}
        </div>
      </section>

      {/* Income & Salary */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader title="Income & Salary" subtitle="Calculate salary, raises, and conversions" icon="💼" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {incomeCalculators.map((calc) => (
              <CalculatorCard key={calc.href} {...calc} />
            ))}
          </div>
        </div>
      </section>

      {/* Business Calculators */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <SectionHeader title="Business Calculators" subtitle="Tools for business owners and entrepreneurs" icon="💹" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {businessCalculators.map((calc) => (
            <CalculatorCard key={calc.href} {...calc} />
          ))}
        </div>
      </section>

      {/* Other Financial Tools */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader title="Other Financial Tools" subtitle="Everyday financial utilities" icon="🛠️" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {otherCalculators.map((calc) => (
              <CalculatorCard key={calc.href} {...calc} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Why Use Our Financial Calculators?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Make better financial decisions with our trusted tools</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center border border-blue-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl text-white">✓</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">100% Accurate</h3>
            <p className="text-sm text-gray-600">Industry-standard formulas for precise calculations</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center border border-green-100">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">100% Private</h3>
            <p className="text-sm text-gray-600">Your financial data never leaves your browser</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 text-center border border-purple-100">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Instant Results</h3>
            <p className="text-sm text-gray-600">Get calculations instantly, no waiting</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 text-center border border-orange-100">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Mobile Friendly</h3>
            <p className="text-sm text-gray-600">Works perfectly on any device</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start Planning Your Financial Future</h2>
          <p className="text-blue-100 text-lg mb-8">Choose from 70+ calculators to make smarter financial decisions today</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/us/tools/calculators/sip-calculator" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg">
              <span>📈</span> Try SIP Calculator
            </Link>
            <Link href="/us/tools/calculators/emi-calculator" className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all backdrop-blur-sm">
              <span>💳</span> Try EMI Calculator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
