'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface BusinessValuationClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

type Industry = 'technology' | 'healthcare' | 'retail' | 'manufacturing' | 'services' | 'restaurant' | 'construction' | 'real-estate' | 'other';
type CustomerConcentration = 'low' | 'medium' | 'high';

interface IndustryMultiples {
  earnings: number;
  revenue: number;
  sde: number;
  pe: number;
  industryFactor: number;
}

const industryMultiplesData: Record<Industry, IndustryMultiples> = {
  technology: { earnings: 5.0, revenue: 3.0, sde: 3.5, pe: 25, industryFactor: 1.2 },
  healthcare: { earnings: 4.0, revenue: 1.8, sde: 3.0, pe: 20, industryFactor: 1.1 },
  retail: { earnings: 2.5, revenue: 0.8, sde: 2.0, pe: 15, industryFactor: 0.9 },
  manufacturing: { earnings: 3.0, revenue: 1.0, sde: 2.5, pe: 18, industryFactor: 1.0 },
  services: { earnings: 3.5, revenue: 1.2, sde: 2.8, pe: 16, industryFactor: 1.0 },
  restaurant: { earnings: 2.0, revenue: 0.6, sde: 1.8, pe: 12, industryFactor: 0.8 },
  construction: { earnings: 2.5, revenue: 0.8, sde: 2.2, pe: 14, industryFactor: 0.9 },
  'real-estate': { earnings: 3.5, revenue: 1.5, sde: 3.0, pe: 20, industryFactor: 1.1 },
  other: { earnings: 3.0, revenue: 1.0, sde: 2.5, pe: 15, industryFactor: 1.0 }
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Business Valuation Calculator?",
    answer: "A Business Valuation Calculator is a free online tool designed to help you quickly and accurately calculate business valuation-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Business Valuation Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Business Valuation Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Business Valuation Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function BusinessValuationClient({ relatedCalculators = defaultRelatedCalculators }: BusinessValuationClientProps) {
  const { getH1, getSubHeading } = usePageSEO('business-valuation-calculator');

  const [industry, setIndustry] = useState<Industry>('technology');
  const [businessAge, setBusinessAge] = useState(5);
  const [revenue, setRevenue] = useState(1000000);
  const [profit, setProfit] = useState(150000);
  const [ebitda, setEbitda] = useState(200000);
  const [assets, setAssets] = useState(500000);
  const [liabilities, setLiabilities] = useState(200000);
  const [growth, setGrowth] = useState(10);
  const [customerConcentration, setCustomerConcentration] = useState<CustomerConcentration>('medium');
  const [recurringRevenue, setRecurringRevenue] = useState(40);

  // Results
  const [avgValuation, setAvgValuation] = useState(0);
  const [lowVal, setLowVal] = useState(0);
  const [highVal, setHighVal] = useState(0);
  const [earningsVal, setEarningsVal] = useState(0);
  const [revenueVal, setRevenueVal] = useState(0);
  const [assetVal, setAssetVal] = useState(0);
  const [dcfVal, setDcfVal] = useState(0);
  const [sdeVal, setSdeVal] = useState(0);
  const [marketCap, setMarketCap] = useState(0);

  // Multiples
  const [adjEarningsMultiple, setAdjEarningsMultiple] = useState(0);
  const [adjRevenueMultiple, setAdjRevenueMultiple] = useState(0);
  const [sdeMultiple, setSdeMultiple] = useState(0);
  const [peMultiple, setPeMultiple] = useState(0);

  // Financial metrics
  const [profitMargin, setProfitMargin] = useState(0);
  const [roa, setRoa] = useState(0);
  const [roe, setRoe] = useState(0);
  const [debtRatio, setDebtRatio] = useState(0);
  const [assetTurnover, setAssetTurnover] = useState(0);
  const [bookValue, setBookValue] = useState(0);

  // Risk factors
  const [ageFactor, setAgeFactor] = useState(1.0);
  const [customerRisk, setCustomerRisk] = useState(1.0);
  const [revenueStability, setRevenueStability] = useState(1.0);
  const [overallRisk, setOverallRisk] = useState(1.0);

  // Badges
  const [growthBadge, setGrowthBadge] = useState({ text: 'Moderate', color: 'bg-yellow-100 text-yellow-700' });
  const [profitBadge, setProfitBadge] = useState({ text: 'Good', color: 'bg-blue-100 text-blue-700' });
  const [efficiencyBadge, setEfficiencyBadge] = useState({ text: 'Average', color: 'bg-yellow-100 text-yellow-700' });
  const [leverageBadge, setLeverageBadge] = useState({ text: 'Moderate', color: 'bg-blue-100 text-blue-700' });
  const [recommendation, setRecommendation] = useState('');

  useEffect(() => {
    calculateValuation();
  }, [industry, businessAge, revenue, profit, ebitda, assets, liabilities, growth, customerConcentration, recurringRevenue]);

  const getIndustryMultiples = (ind: Industry): IndustryMultiples => {
    return industryMultiplesData[ind] || industryMultiplesData.other;
  };

  const getAgeFactor = (age: number): number => {
    if (age < 2) return 0.8;
    if (age < 5) return 0.9;
    if (age > 10) return 1.1;
    return 1.0;
  };

  const getCustomerRiskFactor = (concentration: CustomerConcentration): number => {
    return concentration === 'low' ? 1.05 : concentration === 'high' ? 0.85 : 0.95;
  };

  const getRevenueStabilityFactor = (recurring: number): number => {
    if (recurring > 70) return 1.15;
    if (recurring > 40) return 1.05;
    if (recurring < 20) return 0.9;
    return 1.0;
  };

  const calculateRiskFactor = (age: number, concentration: CustomerConcentration, recurring: number, growthRate: number): number => {
    let factor = 1.0;
    factor *= getAgeFactor(age);
    factor *= getCustomerRiskFactor(concentration);
    factor *= getRevenueStabilityFactor(recurring);
    factor *= growthRate > 15 ? 1.15 : growthRate > 5 ? 1.05 : growthRate < 0 ? 0.85 : 1.0;
    return Math.max(0.6, Math.min(1.5, factor));
  };

  const calculateDCF = (netProfit: number, growthRate: number): number => {
    const discountRate = 0.12;
    let totalValue = 0;

    for (let year = 1; year <= 5; year++) {
      const futureProfit = netProfit * Math.pow(1 + growthRate / 100, year);
      const presentValue = futureProfit / Math.pow(1 + discountRate, year);
      totalValue += presentValue;
    }

    const terminalGrowth = Math.min(growthRate / 100, 0.03);
    const terminalValue = (netProfit * Math.pow(1 + growthRate / 100, 5) * (1 + terminalGrowth)) / (discountRate - terminalGrowth);
    const presentTerminalValue = terminalValue / Math.pow(1 + discountRate, 5);

    return totalValue + presentTerminalValue;
  };

  const updateValueDrivers = (growthRate: number, margin: number, turnover: number, debt: number) => {
    // Growth badge
    if (growthRate > 15) {
      setGrowthBadge({ text: 'Excellent', color: 'bg-green-100 text-green-700' });
    } else if (growthRate > 5) {
      setGrowthBadge({ text: 'Good', color: 'bg-blue-100 text-blue-700' });
    } else if (growthRate < 0) {
      setGrowthBadge({ text: 'Poor', color: 'bg-red-100 text-red-700' });
    } else {
      setGrowthBadge({ text: 'Moderate', color: 'bg-yellow-100 text-yellow-700' });
    }

    // Profit badge
    if (margin > 20) {
      setProfitBadge({ text: 'Excellent', color: 'bg-green-100 text-green-700' });
    } else if (margin > 10) {
      setProfitBadge({ text: 'Good', color: 'bg-blue-100 text-blue-700' });
    } else if (margin > 5) {
      setProfitBadge({ text: 'Fair', color: 'bg-yellow-100 text-yellow-700' });
    } else {
      setProfitBadge({ text: 'Poor', color: 'bg-red-100 text-red-700' });
    }

    // Efficiency badge
    if (turnover > 2) {
      setEfficiencyBadge({ text: 'High', color: 'bg-green-100 text-green-700' });
    } else if (turnover > 1) {
      setEfficiencyBadge({ text: 'Good', color: 'bg-blue-100 text-blue-700' });
    } else {
      setEfficiencyBadge({ text: 'Average', color: 'bg-yellow-100 text-yellow-700' });
    }

    // Leverage badge
    if (debt < 50) {
      setLeverageBadge({ text: 'Low', color: 'bg-green-100 text-green-700' });
    } else if (debt < 100) {
      setLeverageBadge({ text: 'Moderate', color: 'bg-blue-100 text-blue-700' });
    } else if (debt < 200) {
      setLeverageBadge({ text: 'High', color: 'bg-yellow-100 text-yellow-700' });
    } else {
      setLeverageBadge({ text: 'Very High', color: 'bg-red-100 text-red-700' });
    }
  };

  const updateRecommendation = (margin: number, growthRate: number, concentration: CustomerConcentration, recurring: number) => {
    let recommendations: string[] = [];

    if (margin > 15 && growthRate > 10) {
      recommendations.push('Your business shows strong financial performance with healthy margins and growth.');
    } else if (margin < 10) {
      recommendations.push('Focus on improving profit margins to increase business value.');
    }

    if (concentration === 'high') {
      recommendations.push('Diversify your customer base to reduce risk and improve valuation.');
    }

    if (recurring < 30) {
      recommendations.push('Increase recurring revenue streams for more stable and higher valuations.');
    }

    if (growthRate < 0) {
      recommendations.push('Address negative growth trends to improve business attractiveness.');
    }

    const recText = recommendations.length > 0
      ? recommendations.join(' ')
      : 'Your business shows solid fundamentals. Continue monitoring key metrics and focus on sustainable growth.';
    setRecommendation(recText);
  };

  const calculateValuation = () => {
    const multiples = getIndustryMultiples(industry);
    const riskFactor = calculateRiskFactor(businessAge, customerConcentration, recurringRevenue, growth);

    // Calculate SDE (Seller's Discretionary Earnings)
    const ownerBenefit = profit * 0.3; // Estimate owner benefits
    const sde = profit + ownerBenefit;

    // Adjusted multiples with risk factor
    const adjEarnings = multiples.earnings * riskFactor;
    const adjRevenue = multiples.revenue * riskFactor;
    const adjSde = multiples.sde * riskFactor;

    const earningsValue = profit * adjEarnings;
    const revenueValue = revenue * adjRevenue;
    const assetValue = assets - liabilities;
    const dcfValue = calculateDCF(profit, growth);
    const sdeValue = sde * adjSde;
    const marketCapValue = profit * multiples.pe;

    const valuations = [earningsValue, revenueValue, assetValue, dcfValue, sdeValue, marketCapValue].filter(v => v > 0);
    const average = valuations.reduce((a, b) => a + b, 0) / valuations.length;
    const low = Math.min(...valuations);
    const high = Math.max(...valuations);

    setAvgValuation(average);
    setLowVal(low);
    setHighVal(high);
    setEarningsVal(earningsValue);
    setRevenueVal(revenueValue);
    setAssetVal(assetValue);
    setDcfVal(dcfValue);
    setSdeVal(sdeValue);
    setMarketCap(marketCapValue);

    setAdjEarningsMultiple(adjEarnings);
    setAdjRevenueMultiple(adjRevenue);
    setSdeMultiple(adjSde);
    setPeMultiple(multiples.pe);

    // Financial metrics
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const roaValue = assets > 0 ? (profit / assets) * 100 : 0;
    const equity = assets - liabilities;
    const roeValue = equity > 0 ? (profit / equity) * 100 : 0;
    const debt = equity > 0 ? (liabilities / equity) * 100 : 0;
    const turnover = assets > 0 ? revenue / assets : 0;
    const bookVal = equity / 1000; // Assuming 1000 shares

    setProfitMargin(margin);
    setRoa(roaValue);
    setRoe(roeValue);
    setDebtRatio(debt);
    setAssetTurnover(turnover);
    setBookValue(bookVal);

    // Risk factors
    const age = getAgeFactor(businessAge);
    const customer = getCustomerRiskFactor(customerConcentration);
    const recurring = getRevenueStabilityFactor(recurringRevenue);

    setAgeFactor(age);
    setCustomerRisk(customer);
    setRevenueStability(recurring);
    setOverallRisk(riskFactor);

    // Update badges and recommendations
    updateValueDrivers(growth, margin, turnover, debt);
    updateRecommendation(margin, growth, customerConcentration, recurringRevenue);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.round(amount));
  };

  const valuationMethods = [
    { name: 'Earnings Multiple', multiple: adjEarningsMultiple.toFixed(1) + 'x', value: earningsVal, color: 'bg-blue-600' },
    { name: 'Revenue Multiple', multiple: adjRevenueMultiple.toFixed(1) + 'x', value: revenueVal, color: 'bg-green-600' },
    { name: 'Asset Based', multiple: '-', value: assetVal, color: 'bg-purple-600' },
    { name: 'DCF (5-year)', multiple: '-', value: dcfVal, color: 'bg-orange-600' },
    { name: 'SDE Multiple', multiple: sdeMultiple.toFixed(1) + 'x', value: sdeVal, color: 'bg-pink-600' },
    { name: 'Market Cap (P/E)', multiple: peMultiple.toFixed(1) + 'x', value: marketCap, color: 'bg-indigo-600' }
  ];

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Business Valuation Calculator Online')}</h1>
        <p className="text-sm md:text-lg text-gray-600">
          Calculate your business value using multiple professional valuation methods for selling, buying, or partnership decisions.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Business Details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as Industry)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="technology">Technology/Software</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="services">Professional Services</option>
                  <option value="restaurant">Restaurant/Food</option>
                  <option value="construction">Construction</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Age (Years)</label>
                <input
                  type="number"
                  value={businessAge}
                  onChange={(e) => setBusinessAge(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Revenue ($)</label>
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="10000"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Net Profit ($)</label>
                <input
                  type="number"
                  value={profit}
                  onChange={(e) => setProfit(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="1000"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">EBITDA ($)</label>
                <input
                  type="number"
                  value={ebitda}
                  onChange={(e) => setEbitda(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="1000"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Assets ($)</label>
                <input
                  type="number"
                  value={assets}
                  onChange={(e) => setAssets(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="10000"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Liabilities ($)</label>
                <input
                  type="number"
                  value={liabilities}
                  onChange={(e) => setLiabilities(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="10000"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Revenue Growth Rate (%)</label>
                <input
                  type="number"
                  value={growth}
                  onChange={(e) => setGrowth(parseFloat(e.target.value) || 0)}
                  min="-50"
                  max="100"
                  step="1"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Concentration</label>
                <select
                  value={customerConcentration}
                  onChange={(e) => setCustomerConcentration(e.target.value as CustomerConcentration)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low - Well Diversified</option>
                  <option value="medium">Medium - Moderate</option>
                  <option value="high">High - Concentrated</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recurring Revenue (%)</label>
                <input
                  type="number"
                  value={recurringRevenue}
                  onChange={(e) => setRecurringRevenue(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="5"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Valuation Results</h2>
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-sm text-blue-700">Average Business Value</div>
                <div className="text-2xl md:text-3xl font-bold text-blue-600">{formatCurrency(avgValuation)}</div>
                <div className="text-xs text-blue-600 mt-1">Valuation Range: {formatCurrency(lowVal)} - {formatCurrency(highVal)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <div className="text-xs text-gray-600">Earnings Multiple</div>
                  <div className="text-base md:text-lg font-bold text-blue-600">{formatCurrency(earningsVal)}</div>
                  <div className="text-xs text-gray-500">{adjEarningsMultiple.toFixed(1)}x</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <div className="text-xs text-gray-600">Revenue Multiple</div>
                  <div className="text-base md:text-lg font-bold text-green-600">{formatCurrency(revenueVal)}</div>
                  <div className="text-xs text-gray-500">{adjRevenueMultiple.toFixed(1)}x</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <div className="text-xs text-gray-600">Asset Based</div>
                  <div className="text-base md:text-lg font-bold text-purple-600">{formatCurrency(assetVal)}</div>
                  <div className="text-xs text-gray-500">Book Value</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <div className="text-xs text-gray-600">DCF Value</div>
                  <div className="text-base md:text-lg font-bold text-orange-600">{formatCurrency(dcfVal)}</div>
                  <div className="text-xs text-gray-500">5-year</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <div className="text-xs text-gray-600">SDE Multiple</div>
                  <div className="text-base md:text-lg font-bold text-pink-600">{formatCurrency(sdeVal)}</div>
                  <div className="text-xs text-gray-500">{sdeMultiple.toFixed(1)}x</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <div className="text-xs text-gray-600">Market Cap</div>
                  <div className="text-base md:text-lg font-bold text-indigo-600">{formatCurrency(marketCap)}</div>
                  <div className="text-xs text-gray-500">P/E Based</div>
                </div>
              </div>

              {/* Visual Bar Chart */}
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Valuation Methods Comparison</h4>
                <div className="space-y-2">
                  {valuationMethods.map((method, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{method.name}</span>
                        <span className="font-semibold">{formatCurrency(method.value)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${method.color} h-2 rounded-full`}
                          style={{ width: `${(method.value / highVal) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">💼 Comprehensive Business Valuation</h3>
            <p className="text-xs text-blue-800">
              This calculator uses 6 different valuation methods to provide a comprehensive business worth estimate. Industry-specific multiples and risk factors are applied based on your business characteristics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-4 md:gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Valuation Methods Breakdown</h3>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-xs md:text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 text-left border">Method</th>
                      <th className="px-2 py-2 text-right border">Multiple</th>
                      <th className="px-2 py-2 text-right border">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {valuationMethods.map((method, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-2 py-2 border">{method.name}</td>
                        <td className="px-2 py-2 text-right border">{method.multiple}</td>
                        <td className="px-2 py-2 text-right border">{formatCurrency(method.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Financial Health Metrics</h3>
              <div className="space-y-2 text-xs md:text-sm">
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Profit Margin:</span>
                  <span className="font-bold">{profitMargin.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>ROA (Return on Assets):</span>
                  <span className="font-bold">{roa.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>ROE (Return on Equity):</span>
                  <span className="font-bold">{roe.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Debt-to-Equity Ratio:</span>
                  <span className="font-bold">{debtRatio.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Asset Turnover Ratio:</span>
                  <span className="font-bold">{assetTurnover.toFixed(2)}x</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Book Value per Share:</span>
                  <span className="font-bold">{formatCurrency(bookValue)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Risk Assessment</h4>
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex justify-between">
                <span>Business Age Factor:</span>
                <span className="font-bold">{ageFactor.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between">
                <span>Industry Multiple:</span>
                <span className="font-bold">{getIndustryMultiples(industry).industryFactor.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between">
                <span>Customer Risk:</span>
                <span className="font-bold">{customerRisk.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between">
                <span>Revenue Stability:</span>
                <span className="font-bold">{revenueStability.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Overall Risk Factor:</span>
                <span className="font-bold text-blue-600">{overallRisk.toFixed(2)}x</span>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Value Drivers</h4>
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex items-center justify-between">
                <span>Revenue Growth:</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${growthBadge.color}`}>{growthBadge.text}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Profitability:</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${profitBadge.color}`}>{profitBadge.text}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Asset Efficiency:</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${efficiencyBadge.color}`}>{efficiencyBadge.text}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Financial Leverage:</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${leverageBadge.color}`}>{leverageBadge.text}</span>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Recommendation</h4>
            <div className="text-xs md:text-sm">
              <p>{recommendation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Business Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="group">
              <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8 prose prose-gray max-w-none">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Understanding Business Valuation Methods</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          Business valuation is both an art and a science, requiring careful analysis of financial metrics, market conditions, and qualitative factors. Whether you're selling your business, seeking investors, planning an exit strategy, or simply understanding your company's worth, knowing how valuation works is essential. Professional valuations typically range from 1x to 10x earnings depending on industry, growth, and risk factors.
        </p>

        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-blue-50 rounded-xl p-5">
            <h3 className="font-semibold text-blue-800 mb-2">Income-Based Methods</h3>
            <p className="text-sm text-gray-600 mb-3">Value based on earning potential:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><strong>Earnings Multiple:</strong> Net profit × industry multiple</li>
              <li><strong>SDE Multiple:</strong> Owner's discretionary earnings × multiple</li>
              <li><strong>DCF:</strong> Present value of future cash flows</li>
              <li><strong>Capitalization:</strong> Earnings ÷ cap rate</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-xl p-5">
            <h3 className="font-semibold text-green-800 mb-2">Market-Based Methods</h3>
            <p className="text-sm text-gray-600 mb-3">Value based on comparable sales:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><strong>Revenue Multiple:</strong> Annual revenue × industry factor</li>
              <li><strong>P/E Ratio:</strong> Price-to-earnings comparison</li>
              <li><strong>Comparable Sales:</strong> Similar business transactions</li>
              <li><strong>Guideline Companies:</strong> Public company benchmarks</li>
            </ul>
          </div>
          <div className="bg-purple-50 rounded-xl p-5">
            <h3 className="font-semibold text-purple-800 mb-2">Asset-Based Methods</h3>
            <p className="text-sm text-gray-600 mb-3">Value based on tangible assets:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><strong>Book Value:</strong> Assets minus liabilities</li>
              <li><strong>Liquidation:</strong> Fire-sale asset value</li>
              <li><strong>Replacement Cost:</strong> Cost to recreate business</li>
              <li><strong>Adjusted Book:</strong> Market value of assets</li>
            </ul>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Industry Valuation Multiples</h2>
        <div className="overflow-x-auto mb-4 sm:mb-6 md:mb-8">
          <table className="w-full border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Industry</th>
                <th className="border border-gray-200 px-4 py-3 text-center font-semibold">Revenue Multiple</th>
                <th className="border border-gray-200 px-4 py-3 text-center font-semibold">EBITDA Multiple</th>
                <th className="border border-gray-200 px-4 py-3 text-center font-semibold">SDE Multiple</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-4 py-3">Technology/SaaS</td>
                <td className="border border-gray-200 px-4 py-3 text-center">2.0x - 5.0x</td>
                <td className="border border-gray-200 px-4 py-3 text-center">8x - 15x</td>
                <td className="border border-gray-200 px-4 py-3 text-center">3.0x - 4.5x</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-4 py-3">Healthcare Services</td>
                <td className="border border-gray-200 px-4 py-3 text-center">1.0x - 2.5x</td>
                <td className="border border-gray-200 px-4 py-3 text-center">6x - 10x</td>
                <td className="border border-gray-200 px-4 py-3 text-center">2.5x - 3.5x</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-3">Professional Services</td>
                <td className="border border-gray-200 px-4 py-3 text-center">0.8x - 1.5x</td>
                <td className="border border-gray-200 px-4 py-3 text-center">4x - 8x</td>
                <td className="border border-gray-200 px-4 py-3 text-center">2.0x - 3.0x</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-4 py-3">Manufacturing</td>
                <td className="border border-gray-200 px-4 py-3 text-center">0.5x - 1.2x</td>
                <td className="border border-gray-200 px-4 py-3 text-center">4x - 7x</td>
                <td className="border border-gray-200 px-4 py-3 text-center">2.0x - 3.0x</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-3">Retail</td>
                <td className="border border-gray-200 px-4 py-3 text-center">0.3x - 0.8x</td>
                <td className="border border-gray-200 px-4 py-3 text-center">3x - 5x</td>
                <td className="border border-gray-200 px-4 py-3 text-center">1.5x - 2.5x</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-4 py-3">Restaurants</td>
                <td className="border border-gray-200 px-4 py-3 text-center">0.3x - 0.6x</td>
                <td className="border border-gray-200 px-4 py-3 text-center">2x - 4x</td>
                <td className="border border-gray-200 px-4 py-3 text-center">1.5x - 2.0x</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8 mb-4 sm:mb-6 md:mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Factors That Increase Business Value</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Recurring Revenue:</strong> Subscription models, contracts, and repeat customers provide predictable income</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Diversified Customer Base:</strong> No single customer should represent more than 10-15% of revenue</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Strong Growth Trajectory:</strong> Year-over-year revenue and profit growth above industry average</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Owner Independence:</strong> Business runs successfully without daily owner involvement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Clean Financials:</strong> Audited or reviewed financial statements with clear documentation</span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Factors That Decrease Business Value</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span><strong>Customer Concentration:</strong> Relying on few customers creates significant risk</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span><strong>Owner Dependence:</strong> Business relies heavily on owner's relationships or skills</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span><strong>Declining Revenue:</strong> Negative growth trends signal market or operational issues</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span><strong>High Debt Levels:</strong> Excessive leverage increases financial risk</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span><strong>Industry Decline:</strong> Operating in a shrinking or disrupted market</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h3 className="font-semibold text-amber-800 mb-3">SDE vs EBITDA: Which Multiple to Use?</h3>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-sm text-gray-700">
            <div>
              <p className="font-medium mb-2">SDE (Seller's Discretionary Earnings)</p>
              <p className="mb-2">Best for small businesses under $1M revenue where owner is actively involved:</p>
              <ul className="space-y-1 ml-4">
                <li>• Includes owner's salary and benefits</li>
                <li>• Adds back discretionary expenses</li>
                <li>• Typical multiples: 1.5x - 4x</li>
                <li>• Used for most small business sales</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">EBITDA (Earnings Before Interest, Taxes, Depreciation, Amortization)</p>
              <p className="mb-2">Best for larger businesses with professional management:</p>
              <ul className="space-y-1 ml-4">
                <li>• Assumes manager-run operations</li>
                <li>• Standardized metric for comparisons</li>
                <li>• Typical multiples: 3x - 10x+</li>
                <li>• Used for PE and strategic acquisitions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What is the most accurate business valuation method?</h3>
            <p className="text-gray-600 leading-relaxed">
              There's no single "most accurate" method - the best approach depends on your business type, industry, and circumstances. For profitable operating businesses, income-based methods (earnings multiples, DCF) are typically most relevant. For asset-heavy businesses, asset-based approaches may be more appropriate. Professional valuators often use multiple methods and weight them based on the specific situation, which is why our calculator provides six different valuations.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Why do SaaS companies have higher valuation multiples?</h3>
            <p className="text-gray-600 leading-relaxed">
              SaaS (Software as a Service) companies command premium valuations because of recurring revenue predictability, high gross margins (typically 70-90%), low customer acquisition costs over time, and scalability without proportional cost increases. A SaaS company with 90% recurring revenue and 30% annual growth might command 8-12x revenue, while a traditional business with similar revenue might only get 0.5-1.5x revenue.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How do I increase my business valuation before selling?</h3>
            <p className="text-gray-600 leading-relaxed">
              Start 2-3 years before your planned exit. Focus on: (1) Building recurring revenue streams and long-term contracts, (2) Diversifying your customer base so no single customer exceeds 15% of revenue, (3) Documenting processes and reducing owner dependence, (4) Cleaning up financial statements and eliminating personal expenses, (5) Improving profit margins and demonstrating consistent growth. These changes can increase your multiple by 1-2x.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What is the difference between enterprise value and equity value?</h3>
            <p className="text-gray-600 leading-relaxed">
              Enterprise Value (EV) represents the total value of a business including debt, while Equity Value is what owners actually receive (EV minus debt plus cash). When multiples are applied to EBITDA, they produce Enterprise Value. To determine what sellers receive, subtract outstanding debt and add cash. For example, a business valued at $2M EV with $500K debt and $100K cash has an Equity Value of $1.6M.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How does customer concentration affect valuation?</h3>
            <p className="text-gray-600 leading-relaxed">
              High customer concentration significantly reduces valuation multiples because it represents substantial risk. If your top customer represents 40% of revenue, buyers will discount the valuation by 15-30% due to the risk of losing that customer. Ideally, no single customer should exceed 10% of revenue, and your top 5 customers combined shouldn't exceed 30-40%. Diversification can take years, so start early.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">When should I get a professional business valuation?</h3>
            <p className="text-gray-600 leading-relaxed">
              Consider professional valuation for: selling or buying a business, bringing in investors or partners, estate planning and gifting, divorce proceedings, shareholder disputes, or buy-sell agreements. Professional valuations cost $3,000-$20,000+ depending on complexity and are performed by Certified Business Appraisers (CBAs) or Accredited Senior Appraisers (ASAs). Online calculators like ours provide useful estimates but shouldn't replace professional advice for major transactions.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="business-valuation-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
