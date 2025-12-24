'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorMobileMrec2 } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface Results {
  dwellingCoverage: number;
  personalProperty: number;
  liability: number;
  riskScore: number;
  homeAge: number;
  finalPremium: number;
  monthlyPremium: number;
  discountAmount: number;
}

const riskFactors = {
  homeType: {
    'single-family': 1.0,
    'townhouse': 0.9,
    'condo': 0.8,
    'mobile': 1.5,
  },
  location: {
    'urban': 1.2,
    'suburban': 1.0,
    'rural': 0.8,
  },
  security: {
    'none': 1.0,
    'basic': 0.95,
    'advanced': 0.85,
    'comprehensive': 0.75,
  },
  age: {
    'new': 0.8, // < 10 years
    'modern': 0.9, // 10-30 years
    'older': 1.1, // 30-50 years
    'old': 1.3, // > 50 years
  },
};

const statePremiumFactors: { [key: string]: number } = {
  'low-risk': 0.7,
  'moderate-risk': 1.0,
  'high-risk': 1.8,
  'very-high-risk': 2.5,
};

const creditFactors: { [key: string]: number } = {
  'excellent': 0.8,
  'very-good': 0.9,
  'good': 1.0,
  'fair': 1.3,
  'poor': 1.6,
};

const claimsFactors: { [key: string]: number } = {
  'none': 1.0,
  'minor': 1.2,
  'major': 1.5,
  'multiple': 2.0,
};

const deductibleFactors: { [key: number]: number } = {
  500: 1.3,
  1000: 1.0,
  2500: 0.8,
  5000: 0.7,
  10000: 0.6,
};

const bundleDiscounts: { [key: string]: number } = {
  'none': 0,
  'auto': 0.15,
  'multi': 0.25,
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Home Insurance Calculator?",
    answer: "A Home Insurance Calculator is a free online tool designed to help you quickly and accurately calculate home insurance-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Home Insurance Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Home Insurance Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Home Insurance Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function HomeInsuranceCalculatorClient() {
  const [homeValue, setHomeValue] = useState<number>(300000);
  const [rebuildCost, setRebuildCost] = useState<number>(250000);
  const [squareFeet, setSquareFeet] = useState<number>(2000);
  const [homeType, setHomeType] = useState<string>('single-family');
  const [yearBuilt, setYearBuilt] = useState<number>(2000);
  const [locationType, setLocationType] = useState<string>('suburban');
  const [state, setState] = useState<string>('moderate-risk');
  const [deductible, setDeductible] = useState<number>(1000);
  const [securityFeatures, setSecurityFeatures] = useState<string>('basic');
  const [creditScore, setCreditScore] = useState<string>('very-good');
  const [claimsHistory, setClaimsHistory] = useState<string>('none');
  const [bundleDiscount, setBundleDiscount] = useState<string>('auto');

  const [results, setResults] = useState<Results | null>(null);

  useEffect(() => {
    calculateInsurance();
  }, [
    homeValue,
    rebuildCost,
    squareFeet,
    homeType,
    yearBuilt,
    locationType,
    state,
    deductible,
    securityFeatures,
    creditScore,
    claimsHistory,
    bundleDiscount,
  ]);

  const calculateInsurance = () => {
    const currentYear = new Date().getFullYear();
    const homeAge = currentYear - yearBuilt;

    const dwellingCoverage = Math.max(rebuildCost, homeValue * 0.8);
    const personalProperty = dwellingCoverage * 0.7;
    const liability = Math.max(300000, homeValue * 0.5);

    // Calculate risk score
    let riskScore = 1.0;
    riskScore *= riskFactors.homeType[homeType as keyof typeof riskFactors.homeType] || 1.0;
    riskScore *= riskFactors.location[locationType as keyof typeof riskFactors.location] || 1.0;
    riskScore *= riskFactors.security[securityFeatures as keyof typeof riskFactors.security] || 1.0;

    if (homeAge < 10) riskScore *= riskFactors.age.new;
    else if (homeAge < 30) riskScore *= riskFactors.age.modern;
    else if (homeAge < 50) riskScore *= riskFactors.age.older;
    else riskScore *= riskFactors.age.old;

    // Calculate premium
    const basePremiumRate = 4.5; // per $1000
    let annualPremium = (dwellingCoverage / 1000) * basePremiumRate;
    annualPremium *= statePremiumFactors[state] || 1.0;
    annualPremium *= creditFactors[creditScore] || 1.0;
    annualPremium *= claimsFactors[claimsHistory] || 1.0;
    annualPremium *= deductibleFactors[deductible] || 1.0;

    const discount = bundleDiscounts[bundleDiscount] || 0;
    const discountAmount = annualPremium * discount;
    const finalPremium = annualPremium - discountAmount;

    setResults({
      dwellingCoverage,
      personalProperty,
      liability,
      riskScore,
      homeAge,
      finalPremium,
      monthlyPremium: finalPremium / 12,
      discountAmount,
    });
  };

  const getRiskLevel = (riskScore: number): string => {
    return riskScore > 1.3 ? 'High' : riskScore > 1.1 ? 'Moderate' : 'Low';
  };

  const getRiskColor = (riskScore: number): string => {
    return riskScore > 1.2 ? 'red' : riskScore > 1.0 ? 'yellow' : 'green';
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      {/* Header */}
      <header className="text-center mb-6 md:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
          Home Insurance Calculator
        </h1>
        <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
          Estimate your home insurance coverage needs and premiums.
        </p>
      </header>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 md:gap-8 mb-6 md:mb-8" style={{ gridTemplateColumns: '1fr', maxWidth: '100%' }}>
        <div className="lg:grid lg:gap-3 sm:gap-4 md:gap-6" style={{ gridTemplateColumns: '1fr 350px' }}>
          {/* Left Column - Input Form */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    Home Value ($)
                  </span>
                </label>
                <input
                  type="number"
                  value={homeValue}
                  onChange={(e) => setHomeValue(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    Rebuilding Cost ($)
                  </span>
                </label>
                <input
                  type="number"
                  value={rebuildCost}
                  onChange={(e) => setRebuildCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                    </svg>
                    Square Footage
                  </span>
                </label>
                <input
                  type="number"
                  value={squareFeet}
                  onChange={(e) => setSquareFeet(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    Home Type
                  </span>
                </label>
                <select
                  value={homeType}
                  onChange={(e) => setHomeType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="single-family">Single Family Home</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="condo">Condominium</option>
                  <option value="mobile">Mobile Home</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Year Built
                  </span>
                </label>
                <input
                  type="number"
                  value={yearBuilt}
                  onChange={(e) => setYearBuilt(parseInt(e.target.value) || 2000)}
                  min="1800"
                  max="2025"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Location Type
                  </span>
                </label>
                <select
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="urban">Urban</option>
                  <option value="suburban">Suburban</option>
                  <option value="rural">Rural</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                    </svg>
                    State/Region
                  </span>
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="low-risk">Low Risk State</option>
                  <option value="moderate-risk">Moderate Risk</option>
                  <option value="high-risk">High Risk</option>
                  <option value="very-high-risk">Very High Risk</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Deductible ($)
                  </span>
                </label>
                <select
                  value={deductible}
                  onChange={(e) => setDeductible(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="500">$500</option>
                  <option value="1000">$1,000</option>
                  <option value="2500">$2,500</option>
                  <option value="5000">$5,000</option>
                  <option value="10000">$10,000</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    Security Features
                  </span>
                </label>
                <select
                  value={securityFeatures}
                  onChange={(e) => setSecurityFeatures(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="none">None</option>
                  <option value="basic">Basic (Smoke Detectors)</option>
                  <option value="advanced">Advanced (Security System)</option>
                  <option value="comprehensive">Comprehensive (Smart Home)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Credit Score Range
                  </span>
                </label>
                <select
                  value={creditScore}
                  onChange={(e) => setCreditScore(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="excellent">Excellent (800+)</option>
                  <option value="very-good">Very Good (740-799)</option>
                  <option value="good">Good (670-739)</option>
                  <option value="fair">Fair (580-669)</option>
                  <option value="poor">Poor (Below 580)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    Claims History
                  </span>
                </label>
                <select
                  value={claimsHistory}
                  onChange={(e) => setClaimsHistory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="none">No Claims (5+ years)</option>
                  <option value="minor">Minor Claims (1-2)</option>
                  <option value="major">Major Claims (1)</option>
                  <option value="multiple">Multiple Claims</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                    Bundle Discounts
                  </span>
                </label>
                <select
                  value={bundleDiscount}
                  onChange={(e) => setBundleDiscount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="none">No Bundling</option>
                  <option value="auto">Auto + Home Bundle</option>
                  <option value="multi">Multi-Policy Bundle</option>
                </select>
              </div>
            </div>

            {/* Results Panel - Mobile Only (below inputs) */}
            <div className="lg:hidden mt-6">
              {results && (
                <div className="space-y-4" dangerouslySetInnerHTML={{ __html: generateResultsHTML(results) }} />
              )}
            </div>
          </div>

          {/* Right Column - Results (Desktop Only) */}
          <div className="hidden lg:block" style={{ width: '350px' }}>
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 lg:sticky lg:top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                Insurance Results
              </h3>
              {results ? (
                <div className="space-y-4" dangerouslySetInnerHTML={{ __html: generateResultsHTML(results) }} />
              ) : (
                <div className="text-center text-gray-400 py-4 sm:py-6 md:py-8">
                  <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                  <p className="text-sm">Adjust values to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards Section */}
      <div className="mt-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding Home Insurance</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Coverage Types Card */}
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Coverage Types</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Dwelling:</strong> Covers your home&apos;s structure and attached structures</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Personal Property:</strong> Protects belongings like furniture and electronics</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Liability:</strong> Covers legal costs if someone is injured on your property</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Loss of Use:</strong> Pays for temporary housing if your home is uninhabitable</span>
              </li>
            </ul>
          </div>

          {/* Premium Factors Card */}
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Premium Factors</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Location:</strong> High-risk areas (hurricanes, earthquakes) cost more</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Home Age:</strong> Older homes typically have higher premiums</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Claims History:</strong> Previous claims increase your rates</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Credit Score:</strong> Better credit often means lower premiums</span>
              </li>
            </ul>
          </div>

          {/* Money-Saving Tips Card */}
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Save Money</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Bundle Policies:</strong> Save 15-25% by combining with auto insurance</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Increase Deductible:</strong> Higher deductibles lower your premiums</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Security Systems:</strong> Alarms and smart home devices reduce risk</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Shop Around:</strong> Compare quotes annually for best rates</span>
              </li>
            </ul>
          </div>

          {/* Common Exclusions Card */}
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Not Covered</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Floods:</strong> Requires separate flood insurance policy</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Earthquakes:</strong> Needs separate earthquake coverage</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Normal Wear:</strong> Maintenance and gradual deterioration</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Business Use:</strong> Home-based business equipment and liability</span>
              </li>
            </ul>
          </div>

          {/* Deductible Guide Card */}
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Choosing a Deductible</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Low Deductible:</strong> Higher premiums but less out-of-pocket costs</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>High Deductible:</strong> Lower premiums but more upfront costs for claims</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Recommended:</strong> Choose a deductible you can afford in an emergency</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Typical Range:</strong> Most homeowners choose $1,000 - $2,500</span>
              </li>
            </ul>
          </div>

          {/* When to Review Policy Card */}
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">When to Review</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Annually:</strong> Review coverage limits and compare rates yearly</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Renovations:</strong> Update coverage after major home improvements</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Big Purchases:</strong> Add coverage for expensive items over $1,500</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Life Changes:</strong> Marriage, children, or retirement may affect needs</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="mt-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>

        <div className="space-y-4">
          <details className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
            <summary className="px-3 sm:px-4 md:px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <span className="flex items-center">
                <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                How much home insurance coverage do I need?
              </span>
              <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="px-3 sm:px-4 md:px-6 py-4 bg-gray-50 text-gray-600 text-sm border-t border-gray-200">
              Your dwelling coverage should equal the cost to rebuild your home (not its market value). Personal property coverage is typically 50-70% of dwelling coverage. Liability coverage should be at least $300,000, but consider $500,000 or more if you have significant assets.
            </div>
          </details>

          <details className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
            <summary className="px-3 sm:px-4 md:px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <span className="flex items-center">
                <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                What&apos;s the difference between actual cash value and replacement cost?
              </span>
              <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="px-3 sm:px-4 md:px-6 py-4 bg-gray-50 text-gray-600 text-sm border-t border-gray-200">
              Replacement cost coverage pays to replace your belongings at current prices, while actual cash value deducts depreciation. For example, a 5-year-old TV might cost $1,000 to replace, but its actual cash value might only be $400. Replacement cost coverage is more expensive but provides better protection.
            </div>
          </details>

          <details className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
            <summary className="px-3 sm:px-4 md:px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <span className="flex items-center">
                <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Do I need additional coverage for expensive items?
              </span>
              <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="px-3 sm:px-4 md:px-6 py-4 bg-gray-50 text-gray-600 text-sm border-t border-gray-200">
              Yes, standard policies have limits for jewelry, art, collectibles, and electronics. If you own items worth more than $1,500-$2,500 each, consider adding a scheduled personal property endorsement or &quot;floater&quot; to fully cover these items without a deductible.
            </div>
          </details>

          <details className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
            <summary className="px-3 sm:px-4 md:px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <span className="flex items-center">
                <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Will filing a claim increase my premiums?
              </span>
              <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="px-3 sm:px-4 md:px-6 py-4 bg-gray-50 text-gray-600 text-sm border-t border-gray-200">
              Usually yes. Filing a claim, especially for preventable damage, often leads to higher premiums or policy non-renewal. Consider paying out of pocket for small claims under $2,000. Save your insurance for major disasters and avoid filing multiple claims within a short period.
            </div>
          </details>
        </div>
      </div>
    </div>
  );

  function generateResultsHTML(results: Results): string {
    const riskLevel = getRiskLevel(results.riskScore);
    const riskColor = getRiskColor(results.riskScore);

    return `
      <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
        <div class="flex items-center justify-center mb-3">
          <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="text-center mb-4">
          <div class="text-3xl font-bold text-purple-600">$${Math.round(results.finalPremium).toLocaleString()}</div>
          <div class="text-sm text-gray-600 mt-1">Annual Premium</div>
        </div>
        <div class="bg-white rounded p-3 text-center">
          <div class="text-xl font-semibold text-gray-900">$${Math.round(results.monthlyPremium).toLocaleString()}</div>
          <div class="text-xs text-gray-600">per month</div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 border border-gray-200">
        <h4 class="font-semibold text-gray-900 mb-3 text-sm flex items-center">
          <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          Recommended Coverage
        </h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 flex items-center">
              <svg class="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Dwelling
            </span>
            <span class="font-semibold">$${(results.dwellingCoverage / 1000).toFixed(0)}K</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 flex items-center">
              <svg class="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              Personal Property
            </span>
            <span class="font-semibold">$${(results.personalProperty / 1000).toFixed(0)}K</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 flex items-center">
              <svg class="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Liability
            </span>
            <span class="font-semibold">$${(results.liability / 1000).toFixed(0)}K</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 border border-gray-200">
        <h4 class="font-semibold text-gray-900 mb-3 text-sm flex items-center">
          <svg class="w-4 h-4 mr-2 text-${riskColor}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          Risk Assessment
        </h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 flex items-center">
              <svg class="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Home Age
            </span>
            <span class="font-semibold">${results.homeAge} years</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 flex items-center">
              <svg class="w-3 h-3 mr-1 text-${riskColor}-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              Risk Level
            </span>
            <span class="font-semibold text-${riskColor}-600">
              ${riskLevel}
            </span>
          </div>
          ${
            results.discountAmount > 0
              ? `
          <div class="flex justify-between items-center pt-2 border-t border-gray-200">
            <span class="text-gray-600 flex items-center">
              <svg class="w-3 h-3 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              Annual Savings
            </span>
            <span class="font-semibold text-green-600">$${Math.round(results.discountAmount).toLocaleString()}</span>
          </div>
          `
              : ''
          }
        
      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="home-insurance-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
      </div>
      </div>
    `;
  }
}
