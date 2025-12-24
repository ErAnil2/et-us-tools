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
  color: string;
  icon: string;
}

interface RentVsBuyCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface CalculationResults {
  totalBuyingCosts: number;
  totalRentingCosts: number;
  netDifference: number;
  monthlyMortgage: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyMaintenance: number;
  totalMonthlyBuy: number;
  currentRent: number;
  homeEquity: number;
  investmentValue: number;
  breakEvenYears: number;
  timePeriod: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Rent Vs Buy Calculator?",
    answer: "A Rent Vs Buy Calculator is a free online tool designed to help you quickly and accurately calculate rent vs buy-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Rent Vs Buy Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Rent Vs Buy Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Rent Vs Buy Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function RentVsBuyCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: RentVsBuyCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('rent-vs-buy-calculator');

  const [homePrice, setHomePrice] = useState<string>('400000');
  const [downPayment, setDownPayment] = useState<string>('80000');
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>('20');
  const [interestRate, setInterestRate] = useState<string>('7.0');
  const [loanTerm, setLoanTerm] = useState<string>('30');
  const [propertyTax, setPropertyTax] = useState<string>('6000');
  const [homeInsurance, setHomeInsurance] = useState<string>('1200');
  const [pmi, setPmi] = useState<string>('200');
  const [maintenance, setMaintenance] = useState<string>('4000');
  const [closingCosts, setClosingCosts] = useState<string>('8000');

  const [monthlyRent, setMonthlyRent] = useState<string>('2500');
  const [rentIncrease, setRentIncrease] = useState<string>('3.0');
  const [rentersInsurance, setRentersInsurance] = useState<string>('200');
  const [securityDeposit, setSecurityDeposit] = useState<string>('2500');

  const [timePeriod, setTimePeriod] = useState<string>('10');
  const [homeAppreciation, setHomeAppreciation] = useState<string>('3.5');
  const [investmentReturn, setInvestmentReturn] = useState<string>('7.0');
  const [taxRate, setTaxRate] = useState<string>('25');

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateMortgagePayment = (principal: number, rate: number, years: number): number => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;

    if (monthlyRate === 0) return principal / numPayments;

    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  const findBreakEvenPoint = (
    homePrice: number,
    downPayment: number,
    interestRate: number,
    loanTerm: number,
    propertyTax: number,
    homeInsurance: number,
    pmi: number,
    maintenance: number,
    monthlyRent: number,
    rentIncrease: number,
    homeAppreciation: number,
    investmentReturn: number
  ): number => {
    for (let years = 1; years <= 30; years++) {
      const loanAmount = homePrice - downPayment;
      let totalBuyCost = downPayment;
      let totalRentCost = 0;
      let mortgageBalance = loanAmount;
      let currentHomeValue = homePrice;
      let currentRent = monthlyRent;

      const monthlyMortgage = calculateMortgagePayment(loanAmount, interestRate, loanTerm);

      for (let year = 1; year <= years; year++) {
        // Buying costs
        const yearlyMortgage = monthlyMortgage * 12;
        totalBuyCost += yearlyMortgage + propertyTax + homeInsurance + (pmi * 12) + maintenance;

        // Calculate equity
        const interestPayments = mortgageBalance * (interestRate / 100);
        const principalPayments = yearlyMortgage - interestPayments;
        mortgageBalance -= principalPayments;
        currentHomeValue *= (1 + homeAppreciation / 100);

        // Renting costs
        totalRentCost += currentRent * 12;
        currentRent *= (1 + rentIncrease / 100);
      }

      const netEquity = (currentHomeValue - mortgageBalance) - (currentHomeValue * 0.07);
      const investmentValue = downPayment * Math.pow(1 + investmentReturn / 100, years);

      if ((totalBuyCost - netEquity) <= (totalRentCost - investmentValue)) {
        return years;
      }
    }
    return 30; // If no break-even found in 30 years
  };

  const calculateResults = () => {
    const homePriceVal = parseFloat(homePrice) || 0;
    const downPaymentVal = parseFloat(downPayment) || 0;
    const downPaymentPercentVal = parseFloat(downPaymentPercent) || 0;
    const interestRateVal = parseFloat(interestRate) || 0;
    const loanTermVal = parseInt(loanTerm) || 30;
    const propertyTaxVal = parseFloat(propertyTax) || 0;
    const homeInsuranceVal = parseFloat(homeInsurance) || 0;
    const pmiVal = parseFloat(pmi) || 0;
    const maintenanceVal = parseFloat(maintenance) || 0;
    const closingCostsVal = parseFloat(closingCosts) || 0;

    const monthlyRentVal = parseFloat(monthlyRent) || 0;
    const rentIncreaseVal = parseFloat(rentIncrease) || 0;
    const rentersInsuranceVal = parseFloat(rentersInsurance) || 0;
    const securityDepositVal = parseFloat(securityDeposit) || 0;

    const timePeriodVal = parseInt(timePeriod) || 10;
    const homeAppreciationVal = parseFloat(homeAppreciation) || 0;
    const investmentReturnVal = parseFloat(investmentReturn) || 0;
    const taxRateVal = parseFloat(taxRate) || 0;

    if (homePriceVal <= 0 || monthlyRentVal <= 0) {
      setResults(null);
      return;
    }

    // Calculate actual down payment
    const actualDownPayment = downPaymentPercentVal > 0 ?
      homePriceVal * (downPaymentPercentVal / 100) : downPaymentVal;

    // Update down payment fields
    setDownPayment(actualDownPayment.toFixed(0));
    setDownPaymentPercent(((actualDownPayment / homePriceVal) * 100).toFixed(1));

    // Calculate loan amount and monthly payment
    const loanAmount = homePriceVal - actualDownPayment;
    const monthlyMortgage = calculateMortgagePayment(loanAmount, interestRateVal, loanTermVal);

    // Calculate monthly carrying costs
    const monthlyTax = propertyTaxVal / 12;
    const monthlyInsurance = (homeInsuranceVal / 12) + pmiVal;
    const monthlyMaintenance = maintenanceVal / 12;
    const totalMonthlyBuy = monthlyMortgage + monthlyTax + monthlyInsurance + monthlyMaintenance;

    // Calculate total costs over time period
    let totalBuyingCosts = actualDownPayment + closingCostsVal;
    let totalRentingCosts = securityDepositVal;
    let homeEquity = 0;
    let currentHomeValue = homePriceVal;
    let currentRent = monthlyRentVal;
    let mortgageBalance = loanAmount;

    // Calculate costs year by year
    for (let year = 1; year <= timePeriodVal; year++) {
      // Buying costs
      const yearlyMortgage = monthlyMortgage * 12;
      const yearlyTax = propertyTaxVal;
      const yearlyInsurance = homeInsuranceVal + (pmiVal * 12);
      const yearlyMaintenance = maintenanceVal;

      totalBuyingCosts += yearlyMortgage + yearlyTax + yearlyInsurance + yearlyMaintenance;

      // Calculate principal paid and equity
      const interestPayments = mortgageBalance * (interestRateVal / 100);
      const principalPayments = yearlyMortgage - interestPayments;
      mortgageBalance -= principalPayments;

      // Home appreciation
      currentHomeValue *= (1 + homeAppreciationVal / 100);

      // Renting costs
      const yearlyRent = currentRent * 12;
      totalRentingCosts += yearlyRent + rentersInsuranceVal;
      currentRent *= (1 + rentIncreaseVal / 100);
    }

    // Calculate home equity (current value - remaining balance)
    homeEquity = currentHomeValue - mortgageBalance;

    // Calculate investment value if renting (down payment invested)
    const investmentValue = actualDownPayment * Math.pow(1 + investmentReturnVal / 100, timePeriodVal);

    // Adjust for selling costs (typically 6-8% of home value)
    const sellingCosts = currentHomeValue * 0.07;
    const netEquity = homeEquity - sellingCosts;

    // Calculate net difference (including opportunity costs)
    const totalBuyNetCost = totalBuyingCosts - netEquity;
    const totalRentNetCost = totalRentingCosts - investmentValue;
    const netDifference = totalBuyNetCost - totalRentNetCost;

    // Calculate break-even point
    const breakEvenYears = findBreakEvenPoint(
      homePriceVal, actualDownPayment, interestRateVal, loanTermVal,
      propertyTaxVal, homeInsuranceVal, pmiVal, maintenanceVal, monthlyRentVal,
      rentIncreaseVal, homeAppreciationVal, investmentReturnVal
    );

    setResults({
      totalBuyingCosts,
      totalRentingCosts,
      netDifference,
      monthlyMortgage,
      monthlyTax,
      monthlyInsurance,
      totalMonthlyBuy,
      currentRent: monthlyRentVal,
      homeEquity: netEquity,
      investmentValue,
      breakEvenYears,
      timePeriod: timePeriodVal
    });
  };

  useEffect(() => {
    calculateResults();
  }, [
    homePrice, downPayment, downPaymentPercent, interestRate, loanTerm,
    propertyTax, homeInsurance, pmi, maintenance, closingCosts,
    monthlyRent, rentIncrease, rentersInsurance, securityDeposit,
    timePeriod, homeAppreciation, investmentReturn, taxRate
  ]);

  const handleDownPaymentChange = (value: string) => {
    setDownPayment(value);
    const homePriceVal = parseFloat(homePrice) || 0;
    if (homePriceVal > 0) {
      const percent = (parseFloat(value) / homePriceVal) * 100;
      setDownPaymentPercent(percent.toFixed(1));
    }
  };

  const handleDownPaymentPercentChange = (value: string) => {
    setDownPaymentPercent(value);
    const homePriceVal = parseFloat(homePrice) || 0;
    const downPaymentAmount = homePriceVal * (parseFloat(value) / 100);
    setDownPayment(downPaymentAmount.toFixed(0));
  };

  const getRecommendation = (): string => {
    if (!results) return 'Enter values to see recommendation';

    let recommendation = '';
    if (results.breakEvenYears <= results.timePeriod) {
      if (results.netDifference < -50000) {
        recommendation = 'Strong case for buying. Significant long-term savings and equity building.';
      } else if (results.netDifference < 0) {
        recommendation = 'Buying appears financially beneficial over this time period.';
      } else {
        recommendation = 'Buying and renting are financially similar. Consider personal factors.';
      }
    } else {
      recommendation = 'Renting may be more cost-effective for your planned time frame.';
    }

    if (results.breakEvenYears > 15) {
      recommendation += ' Consider how long you plan to stay in the home.';
    }

    return recommendation;
  };

  const betterOption = results && results.netDifference < 0 ? 'Buying is Better' : 'Renting is Better';
  const betterColor = results && results.netDifference < 0 ? 'text-blue-600' : 'text-purple-600';

  return (
    <>
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Rent vs Buy Calculator')}</h1>
        <p className="text-lg text-gray-600">Compare the financial impact of renting vs buying a home over time</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Buying Costs */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🏠 Buying Costs</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Home Price</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg">$</span>
                </div>
                <input
                  type="number"
                  value={homePrice}
                  onChange={(e) => setHomePrice(e.target.value)}
                  step="1000"
                  min="0"
                  placeholder="400000"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-lg">$</span>
                  </div>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => handleDownPaymentChange(e.target.value)}
                    step="1000"
                    min="0"
                    placeholder="80000"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={downPaymentPercent}
                    onChange={(e) => handleDownPaymentPercentChange(e.target.value)}
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="20"
                    className="w-full pr-8 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-lg">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                step="0.01"
                min="0"
                placeholder="7.0"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term (years)</label>
              <select
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="30">30 years</option>
                <option value="25">25 years</option>
                <option value="20">20 years</option>
                <option value="15">15 years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Tax (annual)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg">$</span>
                </div>
                <input
                  type="number"
                  value={propertyTax}
                  onChange={(e) => setPropertyTax(e.target.value)}
                  step="100"
                  min="0"
                  placeholder="6000"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Home Insurance (annual)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg">$</span>
                </div>
                <input
                  type="number"
                  value={homeInsurance}
                  onChange={(e) => setHomeInsurance(e.target.value)}
                  step="100"
                  min="0"
                  placeholder="1200"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PMI (monthly, if applicable)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg">$</span>
                </div>
                <input
                  type="number"
                  value={pmi}
                  onChange={(e) => setPmi(e.target.value)}
                  step="10"
                  min="0"
                  placeholder="200"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance & Repairs (annual)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg">$</span>
                </div>
                <input
                  type="number"
                  value={maintenance}
                  onChange={(e) => setMaintenance(e.target.value)}
                  step="100"
                  min="0"
                  placeholder="4000"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Typically 1% of home value annually</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Closing Costs</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg">$</span>
                </div>
                <input
                  type="number"
                  value={closingCosts}
                  onChange={(e) => setClosingCosts(e.target.value)}
                  step="100"
                  min="0"
                  placeholder="8000"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Typically 2-3% of home price</p>
            </div>
          </div>

          {/* Renting Costs */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🏢 Renting Costs</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg">$</span>
                </div>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  step="50"
                  min="0"
                  placeholder="2500"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Rent Increase (%)</label>
              <input
                type="number"
                value={rentIncrease}
                onChange={(e) => setRentIncrease(e.target.value)}
                step="0.1"
                min="0"
                placeholder="3.0"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Renter's Insurance (annual)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg">$</span>
                </div>
                <input
                  type="number"
                  value={rentersInsurance}
                  onChange={(e) => setRentersInsurance(e.target.value)}
                  step="50"
                  min="0"
                  placeholder="200"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Security Deposit</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg">$</span>
                </div>
                <input
                  type="number"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value)}
                  step="100"
                  min="0"
                  placeholder="2500"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Assumptions</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Period (years)</label>
                  <select
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="5">5 years</option>
                    <option value="7">7 years</option>
                    <option value="10">10 years</option>
                    <option value="15">15 years</option>
                    <option value="20">20 years</option>
                    <option value="30">30 years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Home Appreciation Rate (%)</label>
                  <input
                    type="number"
                    value={homeAppreciation}
                    onChange={(e) => setHomeAppreciation(e.target.value)}
                    step="0.1"
                    min="0"
                    placeholder="3.5"
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Investment Return Rate (%)</label>
                  <input
                    type="number"
                    value={investmentReturn}
                    onChange={(e) => setInvestmentReturn(e.target.value)}
                    step="0.1"
                    min="0"
                    placeholder="7.0"
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Return on invested down payment</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    step="1"
                    min="0"
                    placeholder="25"
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">For mortgage interest deduction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Total Cost Comparison Chart */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Total Cost Over Time: Renting vs Buying</h2>

        <div className="overflow-x-auto">
          <svg viewBox="0 0 800 300" className="w-full h-auto">
            {/* Gradients */}
            <defs>
              <linearGradient id="rentVsBuyBuyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="rentVsBuyRentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {results && [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = 20 + 240 - ratio * 240;
              const maxCost = Math.max(results.totalBuyingCosts, results.totalRentingCosts) * 1.1;
              return (
                <g key={ratio}>
                  <line
                    x1={70}
                    y1={y}
                    x2={770}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                  <text
                    x={60}
                    y={y + 5}
                    textAnchor="end"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    ${Math.round(maxCost * ratio / 1000)}K
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {results && Array.from({ length: Math.min(results.timePeriod + 1, 11) }).map((_, i) => {
              const yearStep = Math.ceil(results.timePeriod / 10);
              const year = i * yearStep;
              if (year <= results.timePeriod) {
                return (
                  <text
                    key={i}
                    x={70 + (year / results.timePeriod) * 700}
                    y={280}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    Yr {year}
                  </text>
                );
              }
              return null;
            })}

            {/* Buy cost area */}
            {results && results.timePeriod > 0 && (
              <path
                d={`M 70 260 ${Array.from({ length: results.timePeriod }).map((_, i) => {
                  const x = 70 + ((i + 1) / results.timePeriod) * 700;
                  const buyCost = (results.totalBuyingCosts / results.timePeriod) * (i + 1);
                  const maxCost = Math.max(results.totalBuyingCosts, results.totalRentingCosts) * 1.1;
                  const y = 20 + 240 - (buyCost / maxCost) * 240;
                  return `L ${x} ${y}`;
                }).join(' ')} L 770 260 Z`}
                fill="url(#rentVsBuyBuyGradient)"
                opacity="0.6"
              />
            )}

            {/* Rent cost area */}
            {results && results.timePeriod > 0 && (
              <path
                d={`M 70 260 ${Array.from({ length: results.timePeriod }).map((_, i) => {
                  const x = 70 + ((i + 1) / results.timePeriod) * 700;
                  const rentCost = (results.totalRentingCosts / results.timePeriod) * (i + 1);
                  const maxCost = Math.max(results.totalBuyingCosts, results.totalRentingCosts) * 1.1;
                  const y = 20 + 240 - (rentCost / maxCost) * 240;
                  return `L ${x} ${y}`;
                }).join(' ')} L 770 260 Z`}
                fill="url(#rentVsBuyRentGradient)"
                opacity="0.6"
              />
            )}

            {/* Buy line */}
            {results && results.timePeriod > 0 && (
              <path
                d={`M 70 260 ${Array.from({ length: results.timePeriod }).map((_, i) => {
                  const x = 70 + ((i + 1) / results.timePeriod) * 700;
                  const buyCost = (results.totalBuyingCosts / results.timePeriod) * (i + 1);
                  const maxCost = Math.max(results.totalBuyingCosts, results.totalRentingCosts) * 1.1;
                  const y = 20 + 240 - (buyCost / maxCost) * 240;
                  return `L ${x} ${y}`;
                }).join(' ')}`}
                stroke="#3b82f6"
                strokeWidth="3"
                fill="none"
              />
            )}

            {/* Rent line */}
            {results && results.timePeriod > 0 && (
              <path
                d={`M 70 260 ${Array.from({ length: results.timePeriod }).map((_, i) => {
                  const x = 70 + ((i + 1) / results.timePeriod) * 700;
                  const rentCost = (results.totalRentingCosts / results.timePeriod) * (i + 1);
                  const maxCost = Math.max(results.totalBuyingCosts, results.totalRentingCosts) * 1.1;
                  const y = 20 + 240 - (rentCost / maxCost) * 240;
                  return `L ${x} ${y}`;
                }).join(' ')}`}
                stroke="#8b5cf6"
                strokeWidth="3"
                fill="none"
              />
            )}

            {/* Break-even point marker */}
            {results && results.breakEvenYears <= results.timePeriod && (
              <>
                <line
                  x1={70 + (results.breakEvenYears / results.timePeriod) * 700}
                  y1={20}
                  x2={70 + (results.breakEvenYears / results.timePeriod) * 700}
                  y2={260}
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <text
                  x={70 + (results.breakEvenYears / results.timePeriod) * 700}
                  y={15}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#10b981"
                  fontWeight="bold"
                >
                  Break-even: {results.breakEvenYears}yr
                </text>
              </>
            )}
          </svg>

          {/* Legend */}
          <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Buying Total Cost</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-sm text-gray-600">Renting Total Cost</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" style={{ borderRadius: '2px', borderStyle: 'dashed', border: '2px dashed #10b981', backgroundColor: 'transparent' }}></div>
              <span className="text-sm text-gray-600">Break-even Point</span>
            </div>
          </div>
        </div>
      </div>

      {/* Equity Buildup Chart */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Equity Buildup When Buying</h2>

        <div className="overflow-x-auto">
          <svg viewBox="0 0 800 300" className="w-full h-auto">
            <defs>
              <linearGradient id="rentVsBuyEquityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {results && [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = 20 + 240 - ratio * 240;
              return (
                <g key={ratio}>
                  <line
                    x1={70}
                    y1={y}
                    x2={770}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                  <text
                    x={60}
                    y={y + 5}
                    textAnchor="end"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    ${Math.round((results.homeEquity * 1.2) * ratio / 1000)}K
                  </text>
                </g>
              );
            })}

            {/* X-axis */}
            {results && Array.from({ length: Math.min(results.timePeriod + 1, 11) }).map((_, i) => {
              const yearStep = Math.ceil(results.timePeriod / 10);
              const year = i * yearStep;
              if (year <= results.timePeriod) {
                return (
                  <text
                    key={i}
                    x={70 + (year / results.timePeriod) * 700}
                    y={280}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    Yr {year}
                  </text>
                );
              }
              return null;
            })}

            {/* Equity area */}
            {results && results.timePeriod > 0 && (
              <path
                d={`M 70 260 ${Array.from({ length: results.timePeriod }).map((_, i) => {
                  const x = 70 + ((i + 1) / results.timePeriod) * 700;
                  const equity = (results.homeEquity / results.timePeriod) * (i + 1);
                  const y = 20 + 240 - (equity / (results.homeEquity * 1.2)) * 240;
                  return `L ${x} ${y}`;
                }).join(' ')} L 770 260 Z`}
                fill="url(#rentVsBuyEquityGradient)"
                opacity="0.8"
              />
            )}

            {/* Equity line */}
            {results && results.timePeriod > 0 && (
              <path
                d={`M 70 260 ${Array.from({ length: results.timePeriod }).map((_, i) => {
                  const x = 70 + ((i + 1) / results.timePeriod) * 700;
                  const equity = (results.homeEquity / results.timePeriod) * (i + 1);
                  const y = 20 + 240 - (equity / (results.homeEquity * 1.2)) * 240;
                  return `L ${x} ${y}`;
                }).join(' ')}`}
                stroke="#10b981"
                strokeWidth="3"
                fill="none"
              />
            )}
          </svg>

          <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Home Equity (After Selling Costs)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown Comparison - Side by Side Pie Charts */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Cost Breakdown Comparison</h2>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Buying Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Buying Costs</h3>
            <div className="flex justify-center mb-4">
              <svg viewBox="0 0 200 200" className="w-full max-w-[200px] h-auto">
                {/* Mortgage portion */}
                <circle cx="100" cy="100" r="80" fill="#3b82f6" />

                {/* Taxes, Insurance, Maintenance */}
                {results && (
                  <>
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="transparent"
                      stroke="#f97316"
                      strokeWidth="160"
                      strokeDasharray={`${((results.monthlyTax + results.monthlyInsurance) * 12 * results.timePeriod / results.totalBuyingCosts) * 100 * 5.027} 502.7`}
                      transform="rotate(-90 100 100)"
                    />
                    <circle cx="100" cy="100" r="50" fill="white" />
                    <text x="100" y="95" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#4b5563">
                      {formatCurrency(results.totalBuyingCosts)}
                    </text>
                    <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#6b7280">
                      Total
                    </text>
                  </>
                )}
              </svg>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-xs">Mortgage Payments</span>
                </div>
                <span className="text-xs font-semibold">
                  {results ? formatCurrency(results.monthlyMortgage * 12 * results.timePeriod) : '$0'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span className="text-xs">Taxes & Insurance</span>
                </div>
                <span className="text-xs font-semibold">
                  {results ? formatCurrency((results.monthlyTax + results.monthlyInsurance) * 12 * results.timePeriod) : '$0'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded"></div>
                  <span className="text-xs">Maintenance & Other</span>
                </div>
                <span className="text-xs font-semibold">
                  {results ? formatCurrency(results.totalBuyingCosts - (results.monthlyMortgage * 12 * results.timePeriod) - ((results.monthlyTax + results.monthlyInsurance) * 12 * results.timePeriod)) : '$0'}
                </span>
              </div>
            </div>
          </div>

          {/* Renting Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Renting Costs</h3>
            <div className="flex justify-center mb-4">
              <svg viewBox="0 0 200 200" className="w-full max-w-[200px] h-auto">
                <circle cx="100" cy="100" r="80" fill="#8b5cf6" />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="transparent"
                  stroke="#ec4899"
                  strokeWidth="160"
                  strokeDasharray={`${results && results.totalRentingCosts > 0 ? (200 / results.totalRentingCosts * 100 * 5.027) : 0} 502.7`}
                  transform="rotate(-90 100 100)"
                />
                <circle cx="100" cy="100" r="50" fill="white" />
                {results && (
                  <>
                    <text x="100" y="95" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#4b5563">
                      {formatCurrency(results.totalRentingCosts)}
                    </text>
                    <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#6b7280">
                      Total
                    </text>
                  </>
                )}
              </svg>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span className="text-xs">Rent Payments</span>
                </div>
                <span className="text-xs font-semibold">
                  {results ? formatCurrency(results.totalRentingCosts - 200) : '$0'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-pink-50 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-pink-500 rounded"></div>
                  <span className="text-xs">Renter's Insurance</span>
                </div>
                <span className="text-xs font-semibold">
                  {results ? formatCurrency(parseFloat(rentersInsurance) * results.timePeriod) : '$0'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-teal-50 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-teal-500 rounded"></div>
                  <span className="text-xs">Opportunity Cost</span>
                </div>
                <span className="text-xs font-semibold text-red-600">
                  -{formatCurrency(results?.investmentValue || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Results Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Financial Comparison Results</h3>

        <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8 mb-4 sm:mb-6 md:mb-8">
          {/* Total Costs */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Total Cost Comparison</h4>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {results ? formatCurrency(results.totalBuyingCosts) : '$0'}
                </div>
                <div className="text-blue-700">Total Cost to Buy</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {results ? formatCurrency(results.totalRentingCosts) : '$0'}
                </div>
                <div className="text-purple-700">Total Cost to Rent</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className={`text-2xl font-bold ${betterColor}`}>
                  {results ? formatCurrency(Math.abs(results.netDifference)) : '$0'}
                </div>
                <div className={betterColor}>
                  {results ? betterOption : '--'}
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Payments */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Monthly Payment Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Monthly Mortgage:</span>
                <span className="font-semibold">
                  {results ? formatCurrency(results.monthlyMortgage) : '$0'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Property Tax:</span>
                <span className="font-semibold">
                  {results ? formatCurrency(results.monthlyTax) : '$0'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Insurance + PMI:</span>
                <span className="font-semibold">
                  {results ? formatCurrency(results.monthlyInsurance) : '$0'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Maintenance:</span>
                <span className="font-semibold">
                  {results ? formatCurrency(results.monthlyMaintenance || 0) : '$0'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-t-2 border-gray-300 font-bold">
                <span className="text-gray-800">Total Monthly (Buy):</span>
                <span className="text-blue-600">
                  {results ? formatCurrency(results.totalMonthlyBuy) : '$0'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 font-bold">
                <span className="text-gray-800">Monthly Rent:</span>
                <span className="text-purple-600">
                  {results ? formatCurrency(results.currentRent) : '$0'}
                </span>
              </div>
            </div>
          </div>

          {/* Net Worth Impact */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Net Worth Impact</h4>
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {results ? formatCurrency(results.homeEquity) : '$0'}
                </div>
                <div className="text-orange-700">Home Equity Built</div>
              </div>
              <div className="bg-teal-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-teal-600">
                  {results ? formatCurrency(results.investmentValue) : '$0'}
                </div>
                <div className="text-teal-700">Investment Value (Rent)</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {results ? formatCurrency(Math.abs(results.homeEquity - results.investmentValue)) : '$0'}
                </div>
                <div className="text-yellow-700">Opportunity Cost</div>
              </div>
            </div>
          </div>
        </div>

        {/* Break-even Analysis */}
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Break-even Analysis</h4>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-600">
                {results ? results.breakEvenYears : '0'}
              </div>
              <div className="text-indigo-700">Years to Break Even</div>
              <p className="text-sm text-gray-600 mt-2">Time when buying becomes more cost-effective than renting</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-2">Recommendation</h5>
              <p className="text-gray-700">{getRecommendation()}</p>
            </div>
</div>
        </div>

        {/* Detailed Analysis */}
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h5 className="font-semibold text-blue-800 mb-2">Buying Advantages</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Build equity over time</li>
              <li>• Potential property appreciation</li>
              <li>• Tax deductions available</li>
              <li>• Stability and control</li>
              <li>• Fixed monthly payments</li>
            </ul>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h5 className="font-semibold text-purple-800 mb-2">Renting Advantages</h5>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Lower upfront costs</li>
              <li>• Flexibility to move</li>
              <li>• No maintenance responsibilities</li>
              <li>• Investment opportunity for down payment</li>
              <li>• No property tax or repairs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Assumptions and Factors */}
      <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">Important Considerations</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-yellow-700">
          <div>
            <h4 className="font-semibold mb-2">Financial Factors:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Interest rates and loan terms</li>
              <li>• Down payment amount</li>
              <li>• Property taxes and insurance</li>
              <li>• Home appreciation rates</li>
              <li>• Investment returns on saved money</li>
              <li>• Tax implications and deductions</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Personal Factors:</h4>
            <ul className="space-y-1 text-sm">
              <li>• How long you plan to stay</li>
              <li>• Job stability and income</li>
              <li>• Lifestyle preferences</li>
              <li>• Family size and needs</li>
              <li>• Risk tolerance</li>
              <li>• Maintenance preferences</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-100 rounded-lg p-3 sm:p-4 md:p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Disclaimer</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          This calculator provides estimates based on the information you provide and should be used for educational purposes only.
          Actual costs may vary significantly based on local market conditions, individual circumstances, and economic factors.
          The calculation makes assumptions about future appreciation, investment returns, and other variables that are uncertain.
          Consider consulting with a financial advisor, real estate professional, or mortgage specialist for personalized advice
          before making any major housing decisions.
        </p>
      </div>

    </div>

    {/* MREC Advertisement Banners */}
    {/* Enhanced Related Calculators */}
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6 text-center">Related Math Calculators</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {relatedCalculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className={`${calc.color} rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow duration-300`}
          >
            <div className="flex items-center mb-3">
              <div className="text-xl sm:text-2xl md:text-3xl mr-3">
                {calc.icon === 'percent' ? '%' : '📊'}
              </div>
              <h3 className="text-xl font-bold">{calc.title}</h3>
            </div>
            <p className="text-white/90">{calc.description}</p>
          </Link>
        ))}
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Rent vs Buy: Making the Right Housing Decision</h2>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          The rent vs buy decision is one of the most significant financial choices Americans face, with implications that extend far beyond monthly payments. While conventional wisdom often favors homeownership as wealth-building, the optimal choice depends on numerous factors including local real estate markets, your financial situation, career stability, and life plans. A thorough analysis comparing total costs, opportunity costs, and wealth accumulation potential helps make an informed decision rather than following rules of thumb.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2 text-base">Buying Costs to Consider</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Down payment (3.5-20% of home price)</li>
              <li>• Closing costs (2-5% of loan amount)</li>
              <li>• Monthly mortgage (P&I + taxes + insurance)</li>
              <li>• PMI if down payment &lt; 20%</li>
              <li>• Maintenance (1-2% of home value annually)</li>
              <li>• HOA fees if applicable</li>
            </ul>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800 mb-2 text-base">Renting Costs to Consider</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Monthly rent payments</li>
              <li>• Security deposit (usually 1-2 months)</li>
              <li>• Renter&apos;s insurance ($15-30/month)</li>
              <li>• Annual rent increases (avg 3-5%)</li>
              <li>• Application and move-in fees</li>
              <li>• Opportunity cost of invested savings</li>
            </ul>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">The Break-Even Point</h2>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          The break-even point represents how long you must own a home before buying becomes financially advantageous over renting. This typically ranges from 3-7 years depending on market conditions, transaction costs, and assumptions about appreciation and investment returns. High closing costs and selling expenses (typically 6-10% of home value combined) mean short-term homeownership rarely beats renting. If you&apos;re uncertain about staying in one location for 5+ years, renting often provides better financial flexibility.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Opportunity Cost of Down Payment</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          A critical but often overlooked factor is the opportunity cost of your down payment. A $60,000 down payment invested in the stock market at historical 7% returns grows to approximately $118,000 over 10 years. This investment return must be weighed against home equity gains. In markets with modest appreciation, investing the down payment while renting can actually build more wealth than homeownership, especially when accounting for all ownership costs and the illiquidity of home equity.
        </p>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-5">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">Is it always better to buy than rent?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              No, the optimal choice depends on your specific circumstances. Buying makes sense when you plan to stay 5+ years, have stable income, can afford 20% down to avoid PMI, and live in a market with reasonable price-to-rent ratios. Renting is often better for shorter time horizons, uncertain career situations, expensive markets where price-to-rent ratios exceed 20, or when you prefer flexibility. The &quot;throwing away money on rent&quot; argument ignores that homeowners also &quot;throw away&quot; money on interest, taxes, insurance, and maintenance.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">What is the price-to-rent ratio and how do I use it?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              The price-to-rent ratio divides home purchase price by annual rent for a comparable property. A ratio under 15 generally favors buying, 15-20 is neutral, and over 20 typically favors renting. For example, a $400,000 home with comparable rent of $2,000/month ($24,000/year) has a ratio of 16.7—a borderline case requiring deeper analysis. This quick metric helps identify markets where buying is overpriced relative to renting, common in coastal cities where ratios often exceed 25-30.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">How much should I budget for home maintenance?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Budget 1-2% of your home&apos;s value annually for maintenance and repairs. A $300,000 home requires $3,000-$6,000 per year on average. This covers routine maintenance (HVAC servicing, gutter cleaning, lawn care) plus reserves for major expenses (roof replacement every 20-25 years, HVAC replacement every 15-20 years, appliance replacements). Older homes and those with pools, large yards, or complex systems require higher budgets. Many new homeowners underestimate these costs, leading to financial strain.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">Should I wait for home prices or interest rates to drop?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Timing the housing market is notoriously difficult. While higher interest rates reduce buying power, they also cool price appreciation and reduce competition. Historical data shows that over 10+ year horizons, time in the market matters more than timing. If you plan to stay long-term and can afford current payments comfortably, waiting may not improve your outcome—you&apos;ll pay rent while waiting, and future conditions are unpredictable. Focus on affordability and life circumstances rather than market timing.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">What are the tax benefits of homeownership?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Homeowners can deduct mortgage interest (on loans up to $750,000) and property taxes (up to $10,000 combined with state income taxes) if they itemize deductions. However, the 2017 tax reform nearly doubled the standard deduction, meaning most homeowners no longer benefit from itemizing. The primary residence capital gains exclusion ($250,000 single, $500,000 married) remains valuable for long-term owners with significant appreciation. Calculate whether your deductions exceed the standard deduction before counting on tax savings.
            </p>
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-800 mb-2">How does renting affect my ability to build wealth?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Renting doesn&apos;t prevent wealth building—it redirects it. Disciplined renters who invest the difference between rent and homeownership costs (down payment, maintenance, higher insurance, etc.) can build substantial wealth through diversified investments. The key is actually investing the savings rather than spending them. Stock market investments are more liquid than home equity, offer easier diversification, and historically provide competitive returns. Homeownership forces saving through mortgage principal payments, which benefits those who might not otherwise invest.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="rent-vs-buy-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
    </>
  );
}
