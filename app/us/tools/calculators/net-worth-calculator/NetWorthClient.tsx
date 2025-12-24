'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface NetWorthClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is net worth and why does it matter?",
    answer: "Net worth is the total value of everything you own (assets) minus everything you owe (liabilities). It's a snapshot of your overall financial health. Unlike income, which shows cash flow, net worth shows wealth accumulation. Tracking net worth helps you measure progress toward financial goals, prepare for retirement, and make better financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How often should I calculate my net worth?",
    answer: "Most financial experts recommend calculating net worth quarterly or at least annually. Quarterly tracking helps you spot trends and stay motivated. Don't track too frequently (monthly) as short-term market fluctuations can be misleading. Pick a consistent date and method for accurate comparisons over time.",
    order: 2
  },
  {
    id: '3',
    question: "Should I include my home in net worth calculations?",
    answer: "Yes, include your home at its current market value (not purchase price). However, also include your mortgage as a liability. For a more conservative measure, some people calculate 'liquid net worth' excluding home equity since it's not easily accessible. Both views are useful—total net worth for overall wealth, liquid net worth for financial flexibility.",
    order: 3
  },
  {
    id: '4',
    question: "What is a good debt-to-asset ratio?",
    answer: "A debt-to-asset ratio below 30% is generally considered healthy. Between 30-50% may be acceptable depending on age and circumstances (young homeowners often have higher ratios). Above 50% indicates significant leverage and potential financial risk. The goal is to steadily decrease this ratio over time as you pay down debt and build assets.",
    order: 4
  }
];

export default function NetWorthClient({ relatedCalculators = defaultRelatedCalculators }: NetWorthClientProps) {
  // Section expansion state
  const { getH1, getSubHeading } = usePageSEO('net-worth-calculator');

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    cash: true,
    investments: false,
    retirement: false,
    realEstate: false,
    personal: false,
    mortgages: true,
    consumerDebt: false
  });

  // Cash & Savings
  const [checking, setChecking] = useState(5000);
  const [savings, setSavings] = useState(15000);
  const [moneyMarket, setMoneyMarket] = useState(10000);
  const [cds, setCds] = useState(0);

  // Investments
  const [stocks, setStocks] = useState(50000);
  const [bonds, setBonds] = useState(25000);
  const [mutualFunds, setMutualFunds] = useState(75000);
  const [etfs, setEtfs] = useState(20000);
  const [crypto, setCrypto] = useState(5000);
  const [otherInvestments, setOtherInvestments] = useState(0);

  // Retirement Accounts
  const [retirement401k, setRetirement401k] = useState(150000);
  const [ira, setIra] = useState(50000);
  const [rothIra, setRothIra] = useState(25000);
  const [pension, setPension] = useState(0);
  const [otherRetirement, setOtherRetirement] = useState(0);

  // Real Estate
  const [primaryHome, setPrimaryHome] = useState(400000);
  const [investmentProperty, setInvestmentProperty] = useState(0);
  const [vacationHome, setVacationHome] = useState(0);
  const [land, setLand] = useState(0);

  // Personal Property
  const [vehicles, setVehicles] = useState(35000);
  const [businessEquity, setBusinessEquity] = useState(0);
  const [jewelry, setJewelry] = useState(5000);
  const [collectibles, setCollectibles] = useState(0);
  const [otherAssets, setOtherAssets] = useState(5000);

  // Mortgages
  const [primaryMortgage, setPrimaryMortgage] = useState(280000);
  const [heloc, setHeloc] = useState(0);
  const [otherMortgages, setOtherMortgages] = useState(0);

  // Consumer Debt
  const [creditCards, setCreditCards] = useState(5000);
  const [autoLoans, setAutoLoans] = useState(18000);
  const [studentLoans, setStudentLoans] = useState(25000);
  const [personalLoans, setPersonalLoans] = useState(0);
  const [medicalDebt, setMedicalDebt] = useState(0);
  const [taxLiabilities, setTaxLiabilities] = useState(0);
  const [businessLoans, setBusinessLoans] = useState(0);
  const [otherDebts, setOtherDebts] = useState(0);

  // UI State
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [whatIfDebtPaid, setWhatIfDebtPaid] = useState(0);
  const [whatIfSavingsAdded, setWhatIfSavingsAdded] = useState(0);
  const [whatIfInvestmentGrowth, setWhatIfInvestmentGrowth] = useState(7);

  // Calculated values
  const [cashTotal, setCashTotal] = useState(0);
  const [investmentTotal, setInvestmentTotal] = useState(0);
  const [retirementTotal, setRetirementTotal] = useState(0);
  const [realEstateTotal, setRealEstateTotal] = useState(0);
  const [personalTotal, setPersonalTotal] = useState(0);
  const [totalAssets, setTotalAssets] = useState(0);
  const [mortgageTotal, setMortgageTotal] = useState(0);
  const [consumerDebtTotal, setConsumerDebtTotal] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const [netWorth, setNetWorth] = useState(0);
  const [debtRatio, setDebtRatio] = useState(0);
  const [liquidAssets, setLiquidAssets] = useState(0);

  useEffect(() => {
    // Calculate totals
    const cash = checking + savings + moneyMarket + cds;
    const investments = stocks + bonds + mutualFunds + etfs + crypto + otherInvestments;
    const retirement = retirement401k + ira + rothIra + pension + otherRetirement;
    const realEstate = primaryHome + investmentProperty + vacationHome + land;
    const personal = vehicles + businessEquity + jewelry + collectibles + otherAssets;
    const assets = cash + investments + retirement + realEstate + personal;

    const mortgages = primaryMortgage + heloc + otherMortgages;
    const consumerDebts = creditCards + autoLoans + studentLoans + personalLoans + medicalDebt + taxLiabilities + businessLoans + otherDebts;
    const liabilities = mortgages + consumerDebts;

    const worth = assets - liabilities;
    const debt = assets > 0 ? (liabilities / assets) * 100 : 0;
    const liquid = cash + investments;

    setCashTotal(cash);
    setInvestmentTotal(investments);
    setRetirementTotal(retirement);
    setRealEstateTotal(realEstate);
    setPersonalTotal(personal);
    setTotalAssets(assets);
    setMortgageTotal(mortgages);
    setConsumerDebtTotal(consumerDebts);
    setTotalLiabilities(liabilities);
    setNetWorth(worth);
    setDebtRatio(debt);
    setLiquidAssets(liquid);
  }, [
    checking, savings, moneyMarket, cds,
    stocks, bonds, mutualFunds, etfs, crypto, otherInvestments,
    retirement401k, ira, rothIra, pension, otherRetirement,
    primaryHome, investmentProperty, vacationHome, land,
    vehicles, businessEquity, jewelry, collectibles, otherAssets,
    primaryMortgage, heloc, otherMortgages,
    creditCards, autoLoans, studentLoans, personalLoans,
    medicalDebt, taxLiabilities, businessLoans, otherDebts
  ]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPercentage = (part: number, total: number): number => {
    return total > 0 ? (part / total) * 100 : 0;
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getNetWorthStatus = () => {
    if (netWorth >= 1000000) return { text: 'Millionaire Status', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (netWorth >= 500000) return { text: 'High Net Worth', color: 'text-green-600', bg: 'bg-green-50' };
    if (netWorth >= 100000) return { text: 'Strong Financial Position', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (netWorth >= 0) return { text: 'Positive Net Worth', color: 'text-teal-600', bg: 'bg-teal-50' };
    return { text: 'Focus on Debt Reduction', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const calculateProjectedNetWorth = (years: number) => {
    const adjustedDebt = totalLiabilities - whatIfDebtPaid;
    const adjustedAssets = totalAssets + whatIfSavingsAdded;
    const growableAssets = investmentTotal + retirementTotal;
    const projectedGrowth = growableAssets * Math.pow(1 + whatIfInvestmentGrowth / 100, years) - growableAssets;
    return adjustedAssets + projectedGrowth - adjustedDebt;
  };

  // SVG Donut Chart Component
  const DonutChart = ({ data, size = 200 }: { data: { label: string; value: number; color: string }[], size?: number }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return null;

    let cumulativePercent = 0;
    const radius = 70;
    const circumference = 2 * Math.PI * radius;

    return (
      <svg width={size} height={size} viewBox="0 0 200 200" className="mx-auto">
        {data.map((item, index) => {
          const percent = (item.value / total) * 100;
          const offset = circumference * (1 - percent / 100);
          const rotation = cumulativePercent * 3.6 - 90;
          cumulativePercent += percent;

          return (
            <circle
              key={index}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth="35"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform={`rotate(${rotation} 100 100)`}
              className="transition-all duration-500"
            />
          );
        })}
        <circle cx="100" cy="100" r="52" fill="white" />
        <text x="100" y="95" textAnchor="middle" className="text-xs fill-gray-500">Net Worth</text>
        <text x="100" y="115" textAnchor="middle" className="text-sm font-bold fill-gray-800">
          {formatCurrency(netWorth)}
        </text>
      </svg>
    );
  };

  const InputField = ({ label, value, onChange, step = 100, color = 'blue' }: { label: string; value: number; onChange: (v: number) => void; step?: number; color?: string }) => (
    <div>
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          min="0"
          step={step}
          className={`w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-transparent`}
        />
      </div>
    </div>
  );

  const SectionHeader = ({ title, total, isExpanded, onToggle, color }: { title: string; total: number; isExpanded: boolean; onToggle: () => void; color: string }) => (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between p-3 rounded-lg ${color} hover:opacity-90 transition-all`}
    >
      <span className="font-medium text-sm">{title}</span>
      <div className="flex items-center gap-3">
        <span className="font-semibold text-sm">{formatCurrency(total)}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>
  );

  const status = getNetWorthStatus();

  const assetChartData = [
    { label: 'Cash', value: cashTotal, color: '#10B981' },
    { label: 'Investments', value: investmentTotal, color: '#3B82F6' },
    { label: 'Retirement', value: retirementTotal, color: '#8B5CF6' },
    { label: 'Real Estate', value: realEstateTotal, color: '#F59E0B' },
    { label: 'Personal', value: personalTotal, color: '#EC4899' }
  ];

  const liabilityChartData = [
    { label: 'Mortgages', value: mortgageTotal, color: '#EF4444' },
    { label: 'Consumer Debt', value: consumerDebtTotal, color: '#F97316' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-3 xs:px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-3 sm:mb-4 md:mb-6">
        <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">{getH1('Net Worth Calculator')}</h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Track your complete financial picture by calculating your assets minus liabilities
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Net Worth Summary Card */}
      <div className={`rounded-xl shadow-lg p-4 sm:p-6 mb-6 ${status.bg} border-2 ${netWorth >= 0 ? 'border-green-200' : 'border-red-200'}`}>
        <div className="grid md:grid-cols-4 gap-4 sm:gap-4 md:gap-6 items-center">
          <div className="md:col-span-2 text-center md:text-left">
            <div className={`text-xs uppercase tracking-wide ${status.color} font-semibold mb-1`}>{status.text}</div>
            <div className={`text-3xl sm:text-4xl md:text-5xl font-bold ${netWorth >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {formatCurrency(netWorth)}
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm">
              <div>
                <span className="text-gray-500">Assets:</span>
                <span className="ml-1 font-semibold text-green-600">{formatCurrency(totalAssets)}</span>
              </div>
              <div>
                <span className="text-gray-500">Liabilities:</span>
                <span className="ml-1 font-semibold text-red-600">{formatCurrency(totalLiabilities)}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <DonutChart data={assetChartData} size={160} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2 text-xs sm:text-sm">
            <div className="bg-white/60 rounded-lg p-2 sm:p-3">
              <div className="text-gray-500">Debt-to-Asset Ratio</div>
              <div className={`font-bold ${debtRatio > 50 ? 'text-red-600' : debtRatio > 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                {debtRatio.toFixed(1)}%
              </div>
            </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

            <div className="bg-white/60 rounded-lg p-2 sm:p-3">
              <div className="text-gray-500">Liquid Assets</div>
              <div className="font-bold text-blue-600">{formatCurrency(liquidAssets)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
        {/* Assets Section */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
          <h2 className="text-lg sm:text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
            <span className="text-2xl">📈</span> Assets
          </h2>

          {/* Cash & Savings */}
          <div className="mb-4">
            <SectionHeader
              title="Cash & Savings"
              total={cashTotal}
              isExpanded={expandedSections.cash}
              onToggle={() => toggleSection('cash')}
              color="bg-green-100 text-green-800"
            />
            {expandedSections.cash && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-green-50 rounded-b-lg">
                <InputField label="Checking Accounts" value={checking} onChange={setChecking} color="green" />
                <InputField label="Savings Accounts" value={savings} onChange={setSavings} color="green" />
                <InputField label="Money Market" value={moneyMarket} onChange={setMoneyMarket} color="green" />
                <InputField label="CDs" value={cds} onChange={setCds} color="green" />
              </div>
            )}
          </div>

          {/* Investments */}
          <div className="mb-4">
            <SectionHeader
              title="Investments"
              total={investmentTotal}
              isExpanded={expandedSections.investments}
              onToggle={() => toggleSection('investments')}
              color="bg-blue-100 text-blue-800"
            />
            {expandedSections.investments && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-blue-50 rounded-b-lg">
                <InputField label="Stocks" value={stocks} onChange={setStocks} color="blue" />
                <InputField label="Bonds" value={bonds} onChange={setBonds} color="blue" />
                <InputField label="Mutual Funds" value={mutualFunds} onChange={setMutualFunds} color="blue" />
                <InputField label="ETFs" value={etfs} onChange={setEtfs} color="blue" />
                <InputField label="Cryptocurrency" value={crypto} onChange={setCrypto} color="blue" />
                <InputField label="Other" value={otherInvestments} onChange={setOtherInvestments} color="blue" />
              </div>
            )}
          </div>

          {/* Retirement */}
          <div className="mb-4">
            <SectionHeader
              title="Retirement Accounts"
              total={retirementTotal}
              isExpanded={expandedSections.retirement}
              onToggle={() => toggleSection('retirement')}
              color="bg-purple-100 text-purple-800"
            />
            {expandedSections.retirement && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-purple-50 rounded-b-lg">
                <InputField label="401(k)" value={retirement401k} onChange={setRetirement401k} color="purple" />
                <InputField label="IRA" value={ira} onChange={setIra} color="purple" />
                <InputField label="Roth IRA" value={rothIra} onChange={setRothIra} color="purple" />
                <InputField label="Pension" value={pension} onChange={setPension} color="purple" />
                <InputField label="Other" value={otherRetirement} onChange={setOtherRetirement} color="purple" />
              </div>
            )}
          </div>

          {/* Real Estate */}
          <div className="mb-4">
            <SectionHeader
              title="Real Estate"
              total={realEstateTotal}
              isExpanded={expandedSections.realEstate}
              onToggle={() => toggleSection('realEstate')}
              color="bg-yellow-100 text-yellow-800"
            />
            {expandedSections.realEstate && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-yellow-50 rounded-b-lg">
                <InputField label="Primary Home" value={primaryHome} onChange={setPrimaryHome} color="yellow" />
                <InputField label="Investment Property" value={investmentProperty} onChange={setInvestmentProperty} color="yellow" />
                <InputField label="Vacation Home" value={vacationHome} onChange={setVacationHome} color="yellow" />
                <InputField label="Land" value={land} onChange={setLand} color="yellow" />
              </div>
            )}
          </div>

          {/* Personal Property */}
          <div className="mb-4">
            <SectionHeader
              title="Personal Property"
              total={personalTotal}
              isExpanded={expandedSections.personal}
              onToggle={() => toggleSection('personal')}
              color="bg-pink-100 text-pink-800"
            />
            {expandedSections.personal && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-pink-50 rounded-b-lg">
                <InputField label="Vehicles" value={vehicles} onChange={setVehicles} color="pink" />
                <InputField label="Business Equity" value={businessEquity} onChange={setBusinessEquity} color="pink" />
                <InputField label="Jewelry" value={jewelry} onChange={setJewelry} color="pink" />
                <InputField label="Collectibles" value={collectibles} onChange={setCollectibles} color="pink" />
                <InputField label="Other" value={otherAssets} onChange={setOtherAssets} color="pink" />
              </div>
            )}
          </div>

          {/* Total Assets */}
          <div className="mt-4 p-4 bg-green-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-bold text-green-800">Total Assets</span>
              <span className="text-xl font-bold text-green-800">{formatCurrency(totalAssets)}</span>
            </div>
          </div>
        </div>

        {/* Liabilities Section */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
          <h2 className="text-lg sm:text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
            <span className="text-2xl">📉</span> Liabilities
          </h2>

          {/* Mortgages */}
          <div className="mb-4">
            <SectionHeader
              title="Mortgages"
              total={mortgageTotal}
              isExpanded={expandedSections.mortgages}
              onToggle={() => toggleSection('mortgages')}
              color="bg-red-100 text-red-800"
            />
            {expandedSections.mortgages && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-red-50 rounded-b-lg">
                <InputField label="Primary Mortgage" value={primaryMortgage} onChange={setPrimaryMortgage} color="red" />
                <InputField label="HELOC" value={heloc} onChange={setHeloc} color="red" />
                <InputField label="Other Mortgages" value={otherMortgages} onChange={setOtherMortgages} color="red" />
              </div>
            )}
          </div>

          {/* Consumer Debt */}
          <div className="mb-4">
            <SectionHeader
              title="Consumer Debt"
              total={consumerDebtTotal}
              isExpanded={expandedSections.consumerDebt}
              onToggle={() => toggleSection('consumerDebt')}
              color="bg-orange-100 text-orange-800"
            />
            {expandedSections.consumerDebt && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-orange-50 rounded-b-lg">
                <InputField label="Credit Cards" value={creditCards} onChange={setCreditCards} color="orange" />
                <InputField label="Auto Loans" value={autoLoans} onChange={setAutoLoans} color="orange" />
                <InputField label="Student Loans" value={studentLoans} onChange={setStudentLoans} color="orange" />
                <InputField label="Personal Loans" value={personalLoans} onChange={setPersonalLoans} color="orange" />
                <InputField label="Medical Debt" value={medicalDebt} onChange={setMedicalDebt} color="orange" />
                <InputField label="Tax Liabilities" value={taxLiabilities} onChange={setTaxLiabilities} color="orange" />
                <InputField label="Business Loans" value={businessLoans} onChange={setBusinessLoans} color="orange" />
                <InputField label="Other Debts" value={otherDebts} onChange={setOtherDebts} color="orange" />
              </div>
            )}
          </div>

          {/* Total Liabilities */}
          <div className="mt-4 p-4 bg-red-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-bold text-red-800">Total Liabilities</span>
              <span className="text-xl font-bold text-red-800">{formatCurrency(totalLiabilities)}</span>
            </div>
          </div>

          {/* Asset Breakdown Chart */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Asset Breakdown</h3>
            <div className="space-y-2">
              {assetChartData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-gray-600 flex-1">{item.label}</span>
                  <span className="text-xs font-semibold">{getPercentage(item.value, totalAssets).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Related Finance Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="group">
              <div className="rounded-lg p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Understanding Your Net Worth</h2>

        <div className="prose max-w-none">
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
            Net worth is the most comprehensive snapshot of your financial health. It&apos;s calculated by subtracting everything you owe (liabilities) from everything you own (assets). While income tells you how much money flows in, net worth reveals how much wealth you&apos;ve actually accumulated. Tracking this number over time is one of the best ways to measure financial progress.
          </p>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-green-50 p-5 rounded-xl border border-green-100">
              <h4 className="font-semibold text-green-800 mb-2">Assets: What You Own</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Cash and savings accounts</li>
                <li>• Investment accounts (stocks, bonds, ETFs)</li>
                <li>• Retirement accounts (401k, IRA, Roth)</li>
                <li>• Real estate (home equity)</li>
                <li>• Vehicles and personal property</li>
                <li>• Business ownership equity</li>
              </ul>
            </div>
            <div className="bg-red-50 p-5 rounded-xl border border-red-100">
              <h4 className="font-semibold text-red-800 mb-2">Liabilities: What You Owe</h4>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• Mortgage balance</li>
                <li>• Auto loans</li>
                <li>• Student loans</li>
                <li>• Credit card debt</li>
                <li>• Personal loans</li>
                <li>• Medical debt and other obligations</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">The Net Worth Formula</h3>
          <div className="bg-gray-50 p-5 rounded-xl mb-3 sm:mb-4 md:mb-6">
            <p className="text-center text-lg font-mono text-gray-800">
              Net Worth = Total Assets - Total Liabilities
            </p>
            <p className="text-center text-sm text-gray-600 mt-2">
              Example: $500,000 assets - $200,000 liabilities = $300,000 net worth
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Building Your Net Worth</h3>
          <div className="space-y-3 mb-3 sm:mb-4 md:mb-6">
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-800">Increase Your Assets</h4>
              <p className="text-gray-600 text-sm">Save consistently, invest for growth, maximize retirement contributions, and build equity in your home.</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold text-gray-800">Reduce Your Liabilities</h4>
              <p className="text-gray-600 text-sm">Pay down high-interest debt first, avoid new debt, and make extra mortgage payments when possible.</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-800">Track Progress Regularly</h4>
              <p className="text-gray-600 text-sm">Review your net worth quarterly to stay motivated and make adjustments to your financial plan.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="net-worth-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}

