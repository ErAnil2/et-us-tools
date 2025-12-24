'use client';

import { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface PlanData {
  premium: number;
  coverage: number;
  deductible: number;
}

interface PremiumMultipliers {
  familySize: { [key: number]: number };
  state: { [key: string]: number };
  planType: { [key: string]: PlanData };
  tobacco: { [key: string]: number };
  health: { [key: string]: number };
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Health Insurance Cost Calculator?",
    answer: "A Health Insurance Cost Calculator is a health and fitness tool that helps you calculate health insurance cost-related metrics. It provides quick estimates to help you understand and track your health status.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Health Insurance Cost Calculator?",
    answer: "This calculator provides estimates based on standard formulas. While useful for general guidance, it should not replace professional medical advice. Consult a healthcare provider for personalized recommendations.",
    order: 2
  },
  {
    id: '3',
    question: "Is this calculator suitable for everyone?",
    answer: "This calculator is designed for general adult use. Results may vary for children, pregnant women, athletes, or individuals with specific health conditions. Consult a healthcare professional for personalized advice.",
    order: 3
  },
  {
    id: '4',
    question: "How often should I use this calculator?",
    answer: "You can use this calculator as often as needed to track changes. For health metrics, weekly or monthly tracking is typically recommended to observe meaningful trends.",
    order: 4
  },
  {
    id: '5',
    question: "What should I do with my results?",
    answer: "Use the results as a starting point for understanding your health insurance cost status. If results indicate concerns, or for personalized advice, consult with a healthcare professional.",
    order: 5
  }
];

export default function HealthInsuranceCostCalculatorClient() {
  // Cost Estimator inputs
  const [age, setAge] = useState<number>(35);
  const [familySize, setFamilySize] = useState<number>(1);
  const [state, setState] = useState<string>('average-cost');
  const [healthStatus, setHealthStatus] = useState<string>('excellent');
  const [annualIncome, setAnnualIncome] = useState<number>(60000);
  const [planType, setPlanType] = useState<string>('silver');
  const [tobacco, setTobacco] = useState<string>('no');
  const [doctorVisits, setDoctorVisits] = useState<string>('average');

  // Plan Comparison inputs
  const [compareAge, setCompareAge] = useState<number>(35);
  const [usageLevel, setUsageLevel] = useState<string>('medium');

  // Deductible Analysis inputs
  const [monthlyPremium, setMonthlyPremium] = useState<number>(350);
  const [annualDeductible, setAnnualDeductible] = useState<number>(3000);
  const [coinsurance, setCoinsurance] = useState<number>(20);
  const [maxOOP, setMaxOOP] = useState<number>(8700);
  const [expectedCosts, setExpectedCosts] = useState<number>(5000);
  const [copay, setCopay] = useState<number>(30);

  // Results
  const [sidebarHTML, setSidebarHTML] = useState<string>(
    '<p class="text-sm text-gray-600">Calculate your health insurance costs to see personalized results here.</p>'
  );
  const [deductibleResultsHTML, setDeductibleResultsHTML] = useState<string>('');

  const premiumMultipliers: PremiumMultipliers = {
    familySize: { 1: 1.0, 2: 2.1, 3: 2.8, 4: 3.2, 5: 3.6 },
    state: {
      'low-cost': 0.8,
      'average-cost': 1.0,
      'high-cost': 1.4,
      'very-high-cost': 1.8,
    },
    planType: {
      bronze: { premium: 0.8, coverage: 0.6, deductible: 6500 },
      silver: { premium: 1.0, coverage: 0.7, deductible: 4000 },
      gold: { premium: 1.3, coverage: 0.8, deductible: 2000 },
      platinum: { premium: 1.6, coverage: 0.9, deductible: 1000 },
    },
    tobacco: { no: 1.0, yes: 1.5 },
    health: { excellent: 1.0, good: 1.1, fair: 1.3, poor: 1.6 },
  };

  const getAgeMultiplier = (ageValue: number): number => {
    if (ageValue <= 21) return 0.85;
    if (ageValue <= 25) return 0.9;
    if (ageValue <= 30) return 0.95;
    if (ageValue <= 35) return 1.0;
    if (ageValue <= 40) return 1.1;
    if (ageValue <= 45) return 1.2;
    if (ageValue <= 50) return 1.4;
    if (ageValue <= 55) return 1.6;
    if (ageValue <= 60) return 2.0;
    return 2.5;
  };

  const calculateHealthCosts = () => {
    // Base premium calculation (individual silver plan)
    const basePremium = 450; // Monthly base premium
    let monthlyPremiumCalc = basePremium;

    // Apply multipliers
    monthlyPremiumCalc *= getAgeMultiplier(age);
    monthlyPremiumCalc *= premiumMultipliers.familySize[familySize] || 1;
    monthlyPremiumCalc *= premiumMultipliers.state[state] || 1;
    monthlyPremiumCalc *= premiumMultipliers.planType[planType]?.premium || 1;
    monthlyPremiumCalc *= premiumMultipliers.tobacco[tobacco] || 1;
    monthlyPremiumCalc *= premiumMultipliers.health[healthStatus] || 1;

    const annualPremium = monthlyPremiumCalc * 12;

    // Calculate potential subsidies (simplified)
    const fpl2024 = 14580; // Federal Poverty Level for individual
    const fplForFamily = fpl2024 + (familySize - 1) * 5140;
    const incomeAsPercentOfFPL = (annualIncome / fplForFamily) * 100;

    let subsidy = 0;
    if (incomeAsPercentOfFPL <= 150) subsidy = annualPremium * 0.85;
    else if (incomeAsPercentOfFPL <= 200) subsidy = annualPremium * 0.65;
    else if (incomeAsPercentOfFPL <= 250) subsidy = annualPremium * 0.45;
    else if (incomeAsPercentOfFPL <= 300) subsidy = annualPremium * 0.25;
    else if (incomeAsPercentOfFPL <= 400) subsidy = annualPremium * 0.1;

    const netAnnualPremium = Math.max(0, annualPremium - subsidy);

    // Calculate expected out-of-pocket costs
    const deductible = premiumMultipliers.planType[planType]?.deductible || 4000;
    const coverage = premiumMultipliers.planType[planType]?.coverage || 0.7;

    const visitCosts: { [key: string]: number } = {
      low: 800,
      average: 2000,
      high: 4000,
    };
    const expectedMedicalCosts =
      (visitCosts[doctorVisits] || 2000) * (premiumMultipliers.health[healthStatus] || 1);

    let outOfPocket = 0;
    if (expectedMedicalCosts <= deductible) {
      outOfPocket = expectedMedicalCosts;
    } else {
      outOfPocket = deductible + (expectedMedicalCosts - deductible) * (1 - coverage);
    }
    outOfPocket = Math.min(outOfPocket, 8700); // Max out-of-pocket limit

    const totalAnnualCost = netAnnualPremium + outOfPocket;

    displayHealthCostResults({
      monthlyPremium: monthlyPremiumCalc,
      annualPremium,
      subsidy,
      netAnnualPremium,
      deductible,
      expectedMedicalCosts,
      outOfPocket,
      totalAnnualCost,
      incomeAsPercentOfFPL,
      planType,
    });
  };

  const comparePlans = () => {
    const usageCosts: { [key: string]: number } = { low: 1000, medium: 3000, high: 8000 };
    const expectedCostsCompare = usageCosts[usageLevel] || 3000;

    const plans = ['bronze', 'silver', 'gold', 'platinum'];
    const results: any[] = [];

    plans.forEach((plan) => {
      const planData = premiumMultipliers.planType[plan];
      if (!planData) return;

      const monthlyPremiumCalc = 450 * getAgeMultiplier(compareAge) * (planData.premium || 1);
      const annualPremium = monthlyPremiumCalc * 12;

      let outOfPocket = 0;
      if (expectedCostsCompare <= (planData.deductible || 0)) {
        outOfPocket = expectedCostsCompare;
      } else {
        outOfPocket =
          (planData.deductible || 0) +
          (expectedCostsCompare - (planData.deductible || 0)) * (1 - (planData.coverage || 0.7));
      }
      outOfPocket = Math.min(outOfPocket, 8700);

      const totalCost = annualPremium + outOfPocket;

      results.push({
        name: plan.charAt(0).toUpperCase() + plan.slice(1),
        monthlyPremium: monthlyPremiumCalc,
        annualPremium,
        deductible: planData.deductible || 0,
        coverage: (planData.coverage || 0.7) * 100,
        outOfPocket,
        totalCost,
      });
    });

    displayPlanComparison(results, expectedCostsCompare);
  };

  const analyzeDeductible = () => {
    const annualPremium = monthlyPremium * 12;

    // Calculate scenarios with different usage levels
    const scenarios = [
      { name: 'Low Usage', costs: 1000 },
      { name: 'Medium Usage', costs: 3000 },
      { name: 'High Usage', costs: expectedCosts },
      { name: 'Very High Usage', costs: 15000 },
    ];

    const analysisResults = scenarios.map((scenario) => {
      let patientPays = 0;

      if (scenario.costs <= annualDeductible) {
        patientPays = scenario.costs;
      } else {
        patientPays = annualDeductible + (scenario.costs - annualDeductible) * (coinsurance / 100);
      }

      patientPays = Math.min(patientPays, maxOOP);
      const totalCost = annualPremium + patientPays;

      return {
        name: scenario.name,
        medicalCosts: scenario.costs,
        patientPays,
        insurancePays: Math.max(0, scenario.costs - patientPays),
        totalCost,
      };
    });

    displayDeductibleAnalysis({
      monthlyPremium,
      annualPremium,
      deductible: annualDeductible,
      coinsurance,
      maxOOP,
      scenarios: analysisResults,
    });
  };

  const displayHealthCostResults = (results: any) => {
    const resultsHTML = `
      <div class="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4 border border-blue-200">
        <h4 class="font-semibold text-blue-900 mb-3 text-sm">💰 Annual Cost Summary</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-blue-800">Monthly Premium:</span>
            <strong class="text-blue-900">$${(results.monthlyPremium || 0).toFixed(0)}</strong>
          </div>
          <div class="flex justify-between">
            <span class="text-blue-800">Annual Premium:</span>
            <strong class="text-blue-900">$${(results.annualPremium || 0).toFixed(0)}</strong>
          </div>
          ${
            results.subsidy > 0
              ? `
            <div class="flex justify-between">
              <span class="text-blue-800">Potential Subsidy:</span>
              <strong class="text-green-600">-$${(results.subsidy || 0).toFixed(0)}</strong>
            </div>
            <div class="border-t border-blue-300 pt-2 mt-2">
              <div class="flex justify-between">
                <span class="text-blue-900 font-medium">Net Premium:</span>
                <strong class="text-blue-900">$${(results.netAnnualPremium || 0).toFixed(0)}</strong>
              </div>
            </div>
          `
              : ''
          }
          <div class="border-t border-blue-300 pt-2 mt-2">
            <div class="flex justify-between">
              <span class="text-blue-800">Deductible:</span>
              <strong class="text-blue-900">$${(results.deductible || 0).toLocaleString()}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-800">Expected OOP:</span>
              <strong class="text-blue-900">$${(results.outOfPocket || 0).toFixed(0)}</strong>
            </div>
          </div>
          <div class="bg-blue-600 text-white rounded-lg p-3 mt-3 text-center">
            <div class="text-xs mb-1">Total Annual Cost</div>
            <div class="text-2xl font-bold">$${(results.totalAnnualCost || 0).toFixed(0)}</div>
          </div>
        </div>
      </div>

      ${
        results.subsidy > 0
          ? `
        <div class="bg-green-50 border border-green-300 rounded-lg p-3">
          <div class="text-xs font-semibold text-green-800 mb-1">💚 Subsidy Eligible</div>
          <div class="text-xs text-green-700">Your income qualifies for subsidies. Apply during open enrollment.</div>
        </div>
      `
          : ''
      }

      <div class="bg-amber-50 border border-amber-300 rounded-lg p-3">
        <div class="text-xs font-semibold text-amber-800 mb-2">💡 Recommendations</div>
        <ul class="text-xs text-amber-700 space-y-1">
          ${results.planType === 'bronze' && results.expectedMedicalCosts > 3000 ? '<li>• Consider Silver/Gold for higher usage</li>' : ''}
          ${results.totalAnnualCost > results.netAnnualPremium * 1.5 ? '<li>• Lower deductible may save money</li>' : ''}
          <li>• Use in-network providers</li>
          <li>• Preventive care is 100% covered</li>
        </ul>
      </div>
    `;

    setSidebarHTML(resultsHTML);
  };

  const displayPlanComparison = (results: any[], expectedCostsValue: number) => {
    const bestValue = results.reduce((best, current) =>
      current.totalCost < best.totalCost ? current : best
    );

    let resultsHTML = `
      <div class="bg-gradient-to-br from-purple-50 to-pink-100 rounded-lg p-4 border border-purple-200">
        <h4 class="font-semibold text-purple-900 mb-3 text-sm">🏆 Best Plan for You</h4>
        <div class="bg-white rounded-lg p-3 mb-3">
          <div class="font-bold text-lg text-purple-900 text-center mb-2">${bestValue.name}</div>
          <div class="space-y-1 text-xs">
            <div class="flex justify-between">
              <span class="text-gray-600">Monthly:</span>
              <strong>$${(bestValue.monthlyPremium || 0).toFixed(0)}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Deductible:</span>
              <strong>$${(bestValue.deductible || 0).toLocaleString()}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Out-of-Pocket:</span>
              <strong>$${(bestValue.outOfPocket || 0).toFixed(0)}</strong>
            </div>
            <div class="border-t pt-2 mt-2">
              <div class="flex justify-between">
                <span class="font-medium">Total Annual:</span>
                <strong class="text-lg text-purple-900">$${(bestValue.totalCost || 0).toFixed(0)}</strong>
              </div>
            </div>
          </div>
        </div>
        <div class="text-xs text-purple-700">
          Saves $${(Math.max(...results.map((p) => p.totalCost || 0)) - (bestValue.totalCost || 0)).toFixed(0)} vs most expensive
        </div>
      </div>

      <div class="space-y-2">
        <div class="text-xs font-semibold text-gray-700">All Plans Comparison:</div>
    `;

    results.forEach((plan) => {
      const isBest = plan.name === bestValue.name;
      resultsHTML += `
        <div class="bg-gray-50 rounded-lg p-2 ${isBest ? 'ring-2 ring-purple-400' : ''}">
          <div class="flex justify-between items-center text-xs">
            <div>
              <div class="font-semibold ${isBest ? 'text-purple-900' : 'text-gray-700'}">${plan.name} ${isBest ? '⭐' : ''}</div>
              <div class="text-gray-600">${plan.coverage || 0}% coverage</div>
            </div>
            <div class="text-right">
              <div class="font-bold ${isBest ? 'text-purple-900' : 'text-gray-900'}">$${(plan.totalCost || 0).toFixed(0)}</div>
              <div class="text-gray-500">annually</div>
            </div>
          </div>
        </div>
      `;
    });

    resultsHTML += `
      </div>
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-3">
        <div class="text-xs text-blue-700">Based on $${(expectedCostsValue || 0).toLocaleString()} expected annual medical costs</div>
      </div>
    `;

    setSidebarHTML(resultsHTML);
  };

  const displayDeductibleAnalysis = (results: any) => {
    const resultsHTML = `
      <div class="bg-white rounded-lg border border-gray-200">
        <h4 class="text-lg font-semibold text-gray-900 mb-4 px-4 pt-4">📊 Analysis Results</h4>

        <div class="grid md:grid-cols-2 gap-4 px-4 pb-4">
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <h5 class="font-semibold text-blue-900 mb-3 text-sm">Plan Details</h5>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-blue-800">Monthly Premium:</span>
                <strong class="text-blue-900">$${(results.monthlyPremium || 0).toFixed(0)}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-800">Annual Premium:</span>
                <strong class="text-blue-900">$${(results.annualPremium || 0).toFixed(0)}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-800">Deductible:</span>
                <strong class="text-blue-900">$${(results.deductible || 0).toLocaleString()}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-800">Coinsurance:</span>
                <strong class="text-blue-900">${results.coinsurance || 0}%</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-800">Max Out-of-Pocket:</span>
                <strong class="text-blue-900">$${(results.maxOOP || 0).toLocaleString()}</strong>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <h5 class="font-semibold text-green-900 mb-3 text-sm">Key Insights</h5>
            <div class="space-y-2 text-sm text-green-800">
              <div>💡 Deductible kicks in at <strong>$${(results.deductible || 0).toLocaleString()}</strong> in medical costs</div>
              <div>📈 After deductible, you pay <strong>${results.coinsurance || 0}%</strong> of costs</div>
              <div>🛡️ Maximum annual cost: <strong>$${((results.annualPremium || 0) + (results.maxOOP || 0)).toFixed(0)}</strong></div>
            </div>
          </div>
        </div>

        <div class="px-4 pb-4">
          <h5 class="font-semibold text-gray-900 mb-3">Cost by Usage Level</h5>
          <div class="space-y-2">
            ${(results.scenarios || [])
              .map(
                (scenario: any) => `
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <div class="font-semibold text-gray-900">${scenario.name}</div>
                    <div class="text-sm text-gray-600">Medical Costs: $${(scenario.medicalCosts || 0).toLocaleString()}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-xs text-gray-600">Total Annual Cost</div>
                    <div class="text-xl font-bold text-gray-900">$${(scenario.totalCost || 0).toFixed(0)}</div>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div class="bg-red-50 rounded p-2">
                    <div class="text-xs text-red-700">You Pay</div>
                    <div class="font-semibold text-red-900">$${(scenario.patientPays || 0).toFixed(0)}</div>
                  </div>
                  <div class="bg-green-50 rounded p-2">
                    <div class="text-xs text-green-700">Insurance Pays</div>
                    <div class="font-semibold text-green-900">$${(scenario.insurancePays || 0).toFixed(0)}</div>
                  </div>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="bg-amber-50 border-t border-amber-200 p-4">
          <h5 class="font-semibold text-amber-900 mb-2">💡 Understanding Your Deductible</h5>
          <ul class="text-sm text-amber-800 space-y-1">
            <li>• Higher deductibles mean lower premiums but more upfront costs</li>
            <li>• If you rarely need care, high-deductible plans can save money</li>
            <li>• For chronic conditions, lower deductibles typically provide better value</li>
            <li>• Consider pairing high-deductible plans with Health Savings Accounts (HSA)</li>
          </ul>
        </div>
      </div>
    `;

    setDeductibleResultsHTML(resultsHTML);
  };

  // Initialize on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateHealthCosts();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Health Insurance Cost Calculator</h1>
        <p className="text-xl text-gray-600">
          Estimate health insurance costs and compare plan options
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="flex flex-col lg:flex-row gap-3 sm:gap-5 md:gap-8">
        <div className="lg:w-2/3 space-y-3 sm:space-y-4 md:space-y-6">
          {/* Cost Estimator Section */}
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cost Estimator</h2>
            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                  min="18"
                  max="99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Family Size</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={familySize}
                  onChange={(e) => setFamilySize(parseInt(e.target.value))}
                >
                  <option value="1">Individual</option>
                  <option value="2">Couple</option>
                  <option value="3">Family of 3</option>
                  <option value="4">Family of 4</option>
                  <option value="5">Family of 5+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Region
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="low-cost">Low Cost States (AL, MS, TN)</option>
                  <option value="average-cost">Average Cost States</option>
                  <option value="high-cost">High Cost States (NY, CA, MA)</option>
                  <option value="very-high-cost">Very High Cost (AK, HI)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={healthStatus}
                  onChange={(e) => setHealthStatus(e.target.value)}
                >
                  <option value="excellent">Excellent Health</option>
                  <option value="good">Good Health</option>
                  <option value="fair">Fair Health (minor conditions)</option>
                  <option value="poor">Poor Health (chronic conditions)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Income ($)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan Type Preference
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value)}
                >
                  <option value="bronze">Bronze (Lower Premium, Higher Deductible)</option>
                  <option value="silver">Silver (Balanced)</option>
                  <option value="gold">Gold (Higher Premium, Lower Deductible)</option>
                  <option value="platinum">Platinum (Highest Premium, Lowest Deductible)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tobacco Use
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={tobacco}
                  onChange={(e) => setTobacco(e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Doctor Visits
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={doctorVisits}
                  onChange={(e) => setDoctorVisits(e.target.value)}
                >
                  <option value="low">1-2 visits per year</option>
                  <option value="average">3-5 visits per year</option>
                  <option value="high">6+ visits per year</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculateHealthCosts}
              className="w-full mt-6 bg-blue-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Calculate Health Insurance Costs
            </button>
          </div>

          {/* Plan Comparison Section */}
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Compare Plan Types</h3>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-center mb-3 text-orange-600">Bronze</h4>
                  <div className="space-y-2 text-sm">
                    <div>Coverage: 60%</div>
                    <div>Deductible: $6,000+</div>
                    <div>Max Out-of-Pocket: $8,700</div>
                    <div className="font-semibold text-green-600">Lowest Premium</div>
                    <div className="text-xs text-gray-600 mt-2">
                      Good for: Healthy individuals, emergency protection
                    </div>
                  </div>
                </div>

                <div className="border-2 border-blue-500 rounded-lg p-4">
                  <h4 className="font-semibold text-center mb-3 text-blue-600">Silver</h4>
                  <div className="space-y-2 text-sm">
                    <div>Coverage: 70%</div>
                    <div>Deductible: $4,000</div>
                    <div>Max Out-of-Pocket: $8,700</div>
                    <div className="font-semibold text-blue-600">Moderate Premium</div>
                    <div className="text-xs text-gray-600 mt-2">
                      Good for: Most people, balanced cost/coverage
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-center mb-3 text-yellow-600">Gold</h4>
                  <div className="space-y-2 text-sm">
                    <div>Coverage: 80%</div>
                    <div>Deductible: $2,000</div>
                    <div>Max Out-of-Pocket: $8,700</div>
                    <div className="font-semibold text-orange-600">Higher Premium</div>
                    <div className="text-xs text-gray-600 mt-2">
                      Good for: Frequent healthcare users
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-center mb-3 text-purple-600">Platinum</h4>
                  <div className="space-y-2 text-sm">
                    <div>Coverage: 90%</div>
                    <div>Deductible: $1,000</div>
                    <div>Max Out-of-Pocket: $8,700</div>
                    <div className="font-semibold text-red-600">Highest Premium</div>
                    <div className="text-xs text-gray-600 mt-2">
                      Good for: Chronic conditions, high usage
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Age</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={compareAge}
                    onChange={(e) => setCompareAge(parseInt(e.target.value) || 18)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Healthcare Usage
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={usageLevel}
                    onChange={(e) => setUsageLevel(e.target.value)}
                  >
                    <option value="low">Low ($1,000 annually)</option>
                    <option value="medium">Medium ($3,000 annually)</option>
                    <option value="high">High ($8,000 annually)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={comparePlans}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Compare All Plans
              </button>
            </div>
          </div>

          {/* Deductible Analysis Section */}
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Deductible Impact Analysis</h3>

              <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Premium ($)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={monthlyPremium}
                    onChange={(e) => setMonthlyPremium(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Deductible ($)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={annualDeductible}
                    onChange={(e) => setAnnualDeductible(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coinsurance (%)
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={coinsurance}
                    onChange={(e) => setCoinsurance(parseFloat(e.target.value))}
                  >
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Out-of-Pocket ($)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={maxOOP}
                    onChange={(e) => setMaxOOP(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Annual Medical Costs ($)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={expectedCosts}
                    onChange={(e) => setExpectedCosts(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor Visit Copay ($)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={copay}
                    onChange={(e) => setCopay(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <button
                onClick={analyzeDeductible}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Analyze Deductible Impact
              </button>

              {deductibleResultsHTML && (
                <div className="mt-6">
                  <div dangerouslySetInnerHTML={{ __html: deductibleResultsHTML }} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:w-1/3 space-y-3 sm:space-y-4 md:space-y-6">
          {/* Results Sidebar */}
          <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 Your Results</h3>
            <div className="space-y-4">
              <div dangerouslySetInnerHTML={{ __html: sidebarHTML }} />
            </div>
          </div>

          {/* Quick Guide */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-4 md:p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Quick Guide</h3>

            <div className="space-y-3 text-sm text-blue-800">
              <div>
                <strong>Premium:</strong> Monthly payment
              </div>
              <div>
                <strong>Deductible:</strong> Amount before coverage starts
              </div>
              <div>
                <strong>Copay:</strong> Fixed cost per visit
              </div>
              <div>
                <strong>Coinsurance:</strong> % you pay after deductible
              </div>
              <div>
                <strong>Out-of-pocket max:</strong> Annual spending limit
              </div>
            </div>
          </div>

          {/* Average Costs */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 sm:p-4 md:p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-4">💰 2024 Average Costs</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex justify-between">
                <span>Individual Bronze:</span>
                <strong>$350/mo</strong>
              </div>
              <div className="flex justify-between">
                <span>Individual Silver:</span>
                <strong>$450/mo</strong>
              </div>
              <div className="flex justify-between">
                <span>Family Silver:</span>
                <strong>$1,200/mo</strong>
              </div>
              <div className="flex justify-between">
                <span>Avg Deductible:</span>
                <strong>$4,000</strong>
              </div>
            </div>
          </div>

          {/* Plan Types */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 sm:p-4 md:p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">
              🏥 Choosing the Right Plan
            </h3>
            <div className="space-y-2 text-sm text-purple-800">
              <div>
                <strong>Bronze:</strong> Healthy, rarely see doctor
              </div>
              <div>
                <strong>Silver:</strong> Occasional healthcare needs
              </div>
              <div>
                <strong>Gold:</strong> Frequent healthcare use
              </div>
              <div>
                <strong>Platinum:</strong> Chronic conditions
              </div>
            </div>
          </div>

          {/* Cost-Saving Tips */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 sm:p-4 md:p-6 border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-900 mb-4">💡 Cost-Saving Tips</h3>
            <ul className="space-y-1 text-sm text-amber-800">
              <li>• Use preventive care (free)</li>
              <li>• Stay in-network</li>
              <li>• Consider HSA with HDHP</li>
              <li>• Generic medications</li>
              <li>• Telemedicine options</li>
              <li>• Annual enrollment review</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="health-insurance-cost-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
