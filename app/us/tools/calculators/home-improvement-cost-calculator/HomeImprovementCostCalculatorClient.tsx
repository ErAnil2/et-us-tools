'use client';

import { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface FieldConfig {
  id: string;
  label: string;
  type: 'number' | 'select';
  value?: any;
  min?: number;
  max?: number;
  options?: Array<{ value: string; label: string; size?: number }>;
}

interface ProjectConfig {
  fields: FieldConfig[];
  costs: any;
  descriptions?: { [key: string]: string };
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Home Improvement Cost Calculator?",
    answer: "A Home Improvement Cost Calculator is a free online tool designed to help you quickly and accurately calculate home improvement cost-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Home Improvement Cost Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Home Improvement Cost Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Home Improvement Cost Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function HomeImprovementCostCalculatorClient() {
  // Input states
  const [projectType, setProjectType] = useState<string>('kitchen');
  const [qualityLevel, setQualityLevel] = useState<string>('mid');
  const [laborType, setLaborType] = useState<string>('professional');
  const [locationFactor, setLocationFactor] = useState<number>(1.0);
  const [contingency, setContingency] = useState<number>(10);

  // Dynamic field states
  const [dynamicFieldValues, setDynamicFieldValues] = useState<{ [key: string]: any }>({});
  const [customPriceMin, setCustomPriceMin] = useState<number>(8);
  const [customPriceMax, setCustomPriceMax] = useState<number>(12);
  const [showCustomPrice, setShowCustomPrice] = useState<boolean>(false);

  // Results
  const [resultsHTML, setResultsHTML] = useState<string>('');

  const projectConfigs: { [key: string]: ProjectConfig } = {
    kitchen: {
      fields: [
        {
          id: 'kitchenSize',
          label: 'Kitchen Size (sq ft)',
          type: 'number',
          value: 150,
          min: 50,
          max: 500,
        },
      ],
      costs: {
        budget: [50, 100],
        mid: [100, 200],
        high: [200, 400],
        luxury: [400, 800],
      },
      descriptions: {
        budget: 'Stock cabinets, laminate counters, basic appliances ($50-100/sq ft)',
        mid: 'Semi-custom cabinets, granite/quartz, mid-range appliances ($100-200/sq ft)',
        high: 'Custom cabinets, premium stone, high-end appliances ($200-400/sq ft)',
        luxury: 'Designer cabinets, exotic materials, luxury appliances ($400+/sq ft)',
      },
    },
    bathroom: {
      fields: [
        {
          id: 'bathroomSize',
          label: 'Bathroom Size',
          type: 'select',
          value: 'medium',
          options: [
            { value: 'small', label: 'Small (40 sq ft)', size: 40 },
            { value: 'medium', label: 'Medium (75 sq ft)', size: 75 },
            { value: 'large', label: 'Large (100+ sq ft)', size: 100 },
          ],
        },
      ],
      costs: {
        budget: { small: 4000, medium: 8000, large: 12000 },
        mid: { small: 10000, medium: 20000, large: 30000 },
        high: { small: 20000, medium: 40000, large: 60000 },
        luxury: { small: 35000, medium: 70000, large: 100000 },
      },
      descriptions: {
        budget: 'Basic fixtures, ceramic tile, standard vanity ($100-200/sq ft)',
        mid: 'Quality fixtures, porcelain tile, custom vanity ($200-400/sq ft)',
        high: 'Designer fixtures, natural stone, luxury finishes ($400-600/sq ft)',
        luxury: 'Premium everything, spa features, high-end materials ($600+/sq ft)',
      },
    },
    flooring: {
      fields: [
        {
          id: 'flooringArea',
          label: 'Area (sq ft)',
          type: 'number',
          value: 1000,
          min: 100,
          max: 5000,
        },
        {
          id: 'flooringType',
          label: 'Flooring Type',
          type: 'select',
          value: 'vinyl',
          options: [
            { value: 'laminate', label: 'Laminate ($3-8/sq ft)' },
            { value: 'vinyl', label: 'Vinyl/LVP ($4-10/sq ft)' },
            { value: 'carpet', label: 'Carpet ($2-10/sq ft)' },
            { value: 'hardwood', label: 'Hardwood ($6-20/sq ft)' },
            { value: 'tile', label: 'Tile ($5-15/sq ft)' },
            { value: 'custom', label: 'Custom (Enter Your Own Price)' },
          ],
        },
      ],
      costs: {
        laminate: [3, 8],
        vinyl: [4, 10],
        carpet: [2, 10],
        hardwood: [6, 20],
        tile: [5, 15],
        custom: [0, 0],
      },
    },
    roofing: {
      fields: [
        {
          id: 'roofArea',
          label: 'Roof Area (sq ft)',
          type: 'number',
          value: 2000,
          min: 500,
          max: 10000,
        },
        {
          id: 'roofType',
          label: 'Roofing Material',
          type: 'select',
          value: 'asphalt',
          options: [
            { value: 'asphalt', label: 'Asphalt Shingles ($3.50-5.50/sq ft)' },
            { value: 'metal', label: 'Metal Roofing ($7-12/sq ft)' },
            { value: 'tile', label: 'Tile ($10-18/sq ft)' },
            { value: 'slate', label: 'Slate ($15-30/sq ft)' },
            { value: 'custom', label: 'Custom (Enter Your Own Price)' },
          ],
        },
      ],
      costs: {
        asphalt: [3.5, 5.5],
        metal: [7, 12],
        tile: [10, 18],
        slate: [15, 30],
        custom: [0, 0],
      },
    },
    painting: {
      fields: [
        {
          id: 'paintArea',
          label: 'Total Area (sq ft)',
          type: 'number',
          value: 2000,
          min: 200,
          max: 10000,
        },
      ],
      costs: {
        budget: [1.5, 2.5],
        mid: [2.5, 4],
        high: [4, 6],
        luxury: [6, 10],
      },
      descriptions: {
        budget: 'Basic paint, 1 coat, DIY-friendly ($1.50-2.50/sq ft)',
        mid: 'Quality paint, 2 coats, prep work included ($2.50-4/sq ft)',
        high: 'Premium paint, detailed prep, specialty finishes ($4-6/sq ft)',
        luxury: 'Designer paints, faux finishes, extensive prep ($6-10/sq ft)',
      },
    },
    deck: {
      fields: [
        {
          id: 'deckSize',
          label: 'Deck Size (sq ft)',
          type: 'number',
          value: 300,
          min: 100,
          max: 1000,
        },
        {
          id: 'deckMaterial',
          label: 'Deck Material',
          type: 'select',
          value: 'composite',
          options: [
            { value: 'pressure', label: 'Pressure-Treated Wood ($15-25/sq ft)' },
            { value: 'composite', label: 'Composite ($30-45/sq ft)' },
            { value: 'cedar', label: 'Cedar/Redwood ($35-50/sq ft)' },
            { value: 'pvc', label: 'PVC ($40-60/sq ft)' },
            { value: 'custom', label: 'Custom (Enter Your Own Price)' },
          ],
        },
      ],
      costs: {
        pressure: [15, 25],
        composite: [30, 45],
        cedar: [35, 50],
        pvc: [40, 60],
        custom: [0, 0],
      },
    },
    windows: {
      fields: [
        {
          id: 'windowCount',
          label: 'Number of Windows',
          type: 'number',
          value: 10,
          min: 1,
          max: 50,
        },
        {
          id: 'windowType',
          label: 'Window Type',
          type: 'select',
          value: 'vinyl',
          options: [
            { value: 'vinyl', label: 'Vinyl ($300-700/window)' },
            { value: 'wood', label: 'Wood ($500-1000/window)' },
            { value: 'fiberglass', label: 'Fiberglass ($500-1200/window)' },
            { value: 'custom', label: 'Custom (Enter Your Own Price)' },
          ],
        },
      ],
      costs: {
        vinyl: [300, 700],
        wood: [500, 1000],
        fiberglass: [500, 1200],
        custom: [0, 0],
      },
    },
    siding: {
      fields: [
        {
          id: 'sidingArea',
          label: 'Area (sq ft)',
          type: 'number',
          value: 2000,
          min: 500,
          max: 10000,
        },
        {
          id: 'sidingType',
          label: 'Siding Type',
          type: 'select',
          value: 'vinyl',
          options: [
            { value: 'vinyl', label: 'Vinyl ($3-8/sq ft)' },
            { value: 'fiber', label: 'Fiber Cement ($6-12/sq ft)' },
            { value: 'wood', label: 'Wood ($8-15/sq ft)' },
            { value: 'brick', label: 'Brick Veneer ($10-20/sq ft)' },
            { value: 'custom', label: 'Custom (Enter Your Own Price)' },
          ],
        },
      ],
      costs: {
        vinyl: [3, 8],
        fiber: [6, 12],
        wood: [8, 15],
        brick: [10, 20],
        custom: [0, 0],
      },
    },
  };

  // Initialize dynamic fields when project type changes
  useEffect(() => {
    const config = projectConfigs[projectType];
    const initialValues: { [key: string]: any } = {};

    config.fields.forEach((field) => {
      if (field.value !== undefined) {
        initialValues[field.id] = field.value;
      }
    });

    setDynamicFieldValues(initialValues);
    setShowCustomPrice(false);
  }, [projectType]);

  // Calculate costs
  useEffect(() => {
    calculateCost();
  }, [
    projectType,
    qualityLevel,
    laborType,
    locationFactor,
    contingency,
    dynamicFieldValues,
    customPriceMin,
    customPriceMax,
  ]);

  const calculateCost = () => {
    const config = projectConfigs[projectType];
    let baseCost = 0;

    // Calculate base cost based on project type
    if (projectType === 'kitchen') {
      const size = parseFloat(dynamicFieldValues.kitchenSize) || 150;
      const costRange = config.costs[qualityLevel];
      const avgCost = (costRange[0] + costRange[1]) / 2;
      baseCost = size * avgCost;
    } else if (projectType === 'bathroom') {
      const size = dynamicFieldValues.bathroomSize || 'medium';
      baseCost = config.costs[qualityLevel][size];
    } else if (projectType === 'flooring') {
      const area = parseFloat(dynamicFieldValues.flooringArea) || 1000;
      const type = dynamicFieldValues.flooringType || 'vinyl';
      let costRange = config.costs[type];

      if (type === 'custom') {
        costRange = [customPriceMin, customPriceMax];
      }

      const avgCost = (costRange[0] + costRange[1]) / 2;
      baseCost = area * avgCost;
    } else if (projectType === 'roofing') {
      const area = parseFloat(dynamicFieldValues.roofArea) || 2000;
      const type = dynamicFieldValues.roofType || 'asphalt';
      let costRange = config.costs[type];

      if (type === 'custom') {
        costRange = [customPriceMin, customPriceMax];
      }

      const avgCost = (costRange[0] + costRange[1]) / 2;
      baseCost = area * avgCost;
    } else if (projectType === 'painting') {
      const area = parseFloat(dynamicFieldValues.paintArea) || 2000;
      const costRange = config.costs[qualityLevel];
      const avgCost = (costRange[0] + costRange[1]) / 2;
      baseCost = area * avgCost;
    } else if (projectType === 'deck') {
      const size = parseFloat(dynamicFieldValues.deckSize) || 300;
      const material = dynamicFieldValues.deckMaterial || 'composite';
      let costRange = config.costs[material];

      if (material === 'custom') {
        costRange = [customPriceMin, customPriceMax];
      }

      const avgCost = (costRange[0] + costRange[1]) / 2;
      baseCost = size * avgCost;
    } else if (projectType === 'windows') {
      const count = parseFloat(dynamicFieldValues.windowCount) || 10;
      const type = dynamicFieldValues.windowType || 'vinyl';
      let costRange = config.costs[type];

      if (type === 'custom') {
        costRange = [customPriceMin, customPriceMax];
      }

      const avgCost = (costRange[0] + costRange[1]) / 2;
      baseCost = count * avgCost;
    } else if (projectType === 'siding') {
      const area = parseFloat(dynamicFieldValues.sidingArea) || 2000;
      const type = dynamicFieldValues.sidingType || 'vinyl';
      let costRange = config.costs[type];

      if (type === 'custom') {
        costRange = [customPriceMin, customPriceMax];
      }

      const avgCost = (costRange[0] + costRange[1]) / 2;
      baseCost = area * avgCost;
    }

    // Calculate materials and labor
    let materialsCost = baseCost * 0.6;
    let laborCost = laborType === 'professional' ? baseCost * 0.4 : 0;

    // Apply location factor
    materialsCost *= locationFactor;
    laborCost *= locationFactor;

    const totalCost = materialsCost + laborCost;
    const permitsCost = totalCost * 0.05;
    const contingencyCost = totalCost * (contingency / 100);
    const totalWithExtras = totalCost + permitsCost + contingencyCost;

    // Generate results HTML
    const html = `
      <div class="space-y-4">
        <!-- Total Cost -->
        <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div class="text-sm text-blue-600 mb-1">Total Project Cost</div>
          <div class="text-4xl font-bold text-blue-700">$${formatNumber(totalCost)}</div>
          <div class="text-xs text-blue-600 mt-2">$${formatNumber(totalCost * 0.8)} - $${formatNumber(totalCost * 1.2)} range</div>
        </div>

        <!-- Cost Breakdown -->
        <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div class="text-sm font-semibold text-green-900 mb-3">Cost Breakdown</div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-green-700">Materials:</span>
              <span class="font-semibold text-green-900">$${formatNumber(materialsCost)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-green-700">Labor:</span>
              <span class="font-semibold text-green-900">$${formatNumber(laborCost)}</span>
            </div>
          </div>
        </div>

        <!-- Additional Costs -->
        <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div class="text-sm font-semibold text-purple-900 mb-3">Additional Costs</div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-purple-700">Permits & Fees (5%):</span>
              <span class="font-semibold text-purple-900">$${formatNumber(permitsCost)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-purple-700">Contingency (${contingency}%):</span>
              <span class="font-semibold text-purple-900">$${formatNumber(contingencyCost)}</span>
            </div>
            <div class="border-t border-purple-300 pt-2 mt-2 flex justify-between">
              <span class="font-semibold text-purple-900">Total with Extras:</span>
              <span class="font-bold text-purple-900">$${formatNumber(totalWithExtras)}</span>
            </div>
          </div>
        </div>

        <!-- Financing -->
        <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div class="text-sm font-semibold text-orange-900 mb-3">
            <svg class="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Financing Options
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-orange-700">12 months (6% APR):</span>
              <span class="font-semibold text-orange-900">$${formatNumber(calculateMonthlyPayment(totalWithExtras, 6, 12))}/mo</span>
            </div>
            <div class="flex justify-between">
              <span class="text-orange-700">24 months (7% APR):</span>
              <span class="font-semibold text-orange-900">$${formatNumber(calculateMonthlyPayment(totalWithExtras, 7, 24))}/mo</span>
            </div>
            <div class="flex justify-between">
              <span class="text-orange-700">60 months (8% APR):</span>
              <span class="font-semibold text-orange-900">$${formatNumber(calculateMonthlyPayment(totalWithExtras, 8, 60))}/mo</span>
            </div>
          </div>
        </div>

        <!-- Tips -->
        <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <div class="text-sm text-yellow-800">
              <strong>Pro Tip:</strong> Get 3+ contractor quotes. Schedule during off-season for 10-20% savings. ${laborType === 'professional' ? 'DIY demolition can save $1,000-3,000.' : 'Consider hiring pros for complex work.'}
            </div>
          </div>
        </div>
      </div>
    `;

    setResultsHTML(html);
  };

  const calculateMonthlyPayment = (principal: number, annualRate: number, months: number): number => {
    const monthlyRate = annualRate / 100 / 12;
    if (monthlyRate === 0) return principal / months;
    return (
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
      (Math.pow(1 + monthlyRate, months) - 1)
    );
  };

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString();
  };

  const handleDynamicFieldChange = (fieldId: string, value: any) => {
    setDynamicFieldValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    // Check if custom option is selected
    const customFields = ['flooringType', 'roofType', 'deckMaterial', 'windowType', 'sidingType'];
    if (customFields.includes(fieldId) && value === 'custom') {
      setShowCustomPrice(true);
      // Set default values based on field
      if (fieldId === 'windowType') {
        setCustomPriceMin(400);
        setCustomPriceMax(800);
      } else if (fieldId === 'deckMaterial') {
        setCustomPriceMin(20);
        setCustomPriceMax(40);
      } else {
        setCustomPriceMin(8);
        setCustomPriceMax(12);
      }
    } else if (customFields.includes(fieldId)) {
      setShowCustomPrice(false);
    }
  };

  const getQualityDescription = (): string => {
    const config = projectConfigs[projectType];
    if (config.descriptions && config.descriptions[qualityLevel]) {
      return config.descriptions[qualityLevel];
    }

    const descriptions: { [key: string]: string } = {
      budget: 'Economy materials and basic finishes',
      mid: 'Standard quality materials and finishes',
      high: 'Premium materials and designer finishes',
      luxury: 'Luxury materials and custom everything',
    };
    return descriptions[qualityLevel] || '';
  };

  const getCustomUnitLabel = (): string => {
    const fieldId = Object.keys(dynamicFieldValues).find(
      (key) => dynamicFieldValues[key] === 'custom'
    );

    if (fieldId === 'windowType') return '$/window';
    return '$/sq ft';
  };

  const config = projectConfigs[projectType];

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Hero Section */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Home Improvement Cost Calculator</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Estimate renovation costs for kitchen, bathroom, flooring, roofing, painting, and more.
          Budget your home improvement projects accurately.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator */}
      <div className="lg:grid lg:gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8" style={{ gridTemplateColumns: '1fr 350px' }}>
        {/* Left Column - Input Form */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Details</h2>

          <div className="space-y-4">
            {/* Project Type */}
            <div>
              <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-1">
                <svg
                  className="inline-block w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  ></path>
                </svg>
                Project Type
              </label>
              <select
                id="projectType"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="kitchen">Kitchen Renovation</option>
                <option value="bathroom">Bathroom Renovation</option>
                <option value="flooring">Flooring</option>
                <option value="roofing">Roofing</option>
                <option value="painting">Interior Painting</option>
                <option value="deck">Deck/Patio</option>
                <option value="windows">Windows Replacement</option>
                <option value="siding">Siding</option>
              </select>
            </div>

            {/* Dynamic Fields */}
            {config.fields.map((field) => (
              <div key={field.id}>
                {field.type === 'number' ? (
                  <>
                    <label
                      htmlFor={field.id}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      <svg
                        className="inline-block w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        ></path>
                      </svg>
                      {field.label}
                    </label>
                    <input
                      type="number"
                      id={field.id}
                      value={dynamicFieldValues[field.id] || field.value}
                      onChange={(e) =>
                        handleDynamicFieldChange(field.id, parseFloat(e.target.value) || 0)
                      }
                      min={field.min}
                      max={field.max}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </>
                ) : (
                  <>
                    <label
                      htmlFor={field.id}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      <svg
                        className="inline-block w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 12h16M4 18h16"
                        ></path>
                      </svg>
                      {field.label}
                    </label>
                    <select
                      id={field.id}
                      value={dynamicFieldValues[field.id] || field.value}
                      onChange={(e) => handleDynamicFieldChange(field.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            ))}

            {/* Custom Price Fields */}
            {showCustomPrice && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="customPriceMin" className="block text-sm font-medium text-gray-700 mb-1">
                      Min Price ({getCustomUnitLabel()})
                    </label>
                    <input
                      type="number"
                      id="customPriceMin"
                      value={customPriceMin}
                      onChange={(e) => setCustomPriceMin(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="customPriceMax" className="block text-sm font-medium text-gray-700 mb-1">
                      Max Price ({getCustomUnitLabel()})
                    </label>
                    <input
                      type="number"
                      id="customPriceMax"
                      value={customPriceMax}
                      onChange={(e) => setCustomPriceMax(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Enter your custom price range {getCustomUnitLabel()}
                </p>
              </div>
            )}

            {/* Quality Level */}
            <div>
              <label htmlFor="qualityLevel" className="block text-sm font-medium text-gray-700 mb-1">
                <svg
                  className="inline-block w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  ></path>
                </svg>
                Quality Level
              </label>
              <select
                id="qualityLevel"
                value={qualityLevel}
                onChange={(e) => setQualityLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="budget">Budget</option>
                <option value="mid">Mid-Range</option>
                <option value="high">High-End</option>
                <option value="luxury">Luxury</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">{getQualityDescription()}</p>
            </div>

            {/* Labor Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <svg
                  className="inline-block w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
                Labor & Installation
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="laborType"
                    value="diy"
                    checked={laborType === 'diy'}
                    onChange={(e) => setLaborType(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">DIY (Materials Only)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="laborType"
                    value="professional"
                    checked={laborType === 'professional'}
                    onChange={(e) => setLaborType(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Professional Installation</span>
                </label>
              </div>
            </div>

            {/* Location Cost Factor */}
            <div>
              <label htmlFor="locationFactor" className="block text-sm font-medium text-gray-700 mb-1">
                <svg
                  className="inline-block w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                Location Cost Factor
              </label>
              <select
                id="locationFactor"
                value={locationFactor}
                onChange={(e) => setLocationFactor(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="0.8">Low Cost Area (Rural, -20%)</option>
                <option value="1.0">Average Cost Area (Suburban)</option>
                <option value="1.2">High Cost Area (Major Cities, +20%)</option>
                <option value="1.5">Very High Cost (NYC, SF, LA, +50%)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Costs vary significantly by geographic location
              </p>
            </div>

            {/* Contingency */}
            <div>
              <label htmlFor="contingency" className="block text-sm font-medium text-gray-700 mb-1">
                <svg
                  className="inline-block w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
                Contingency Budget (%)
              </label>
              <input
                type="number"
                id="contingency"
                value={contingency}
                onChange={(e) => setContingency(parseFloat(e.target.value) || 10)}
                min="5"
                max="30"
                step="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Reserve 10-20% for unexpected costs</p>
            </div>
          </div>

          {/* Mobile Results */}
          <div className="lg:hidden mt-6">
            <div dangerouslySetInnerHTML={{ __html: resultsHTML }} />
          </div>
        </div>

        {/* Right Column - Results (Desktop Only) */}
        <div className="hidden lg:block" style={{ width: '350px' }}>
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 lg:sticky lg:top-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Estimate</h3>
            <div dangerouslySetInnerHTML={{ __html: resultsHTML }} />
          </div>
        </div>
      </div>

      {/* Information Cards - Abbreviated for space */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <div className="bg-blue-100 rounded-lg p-2 mr-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Kitchen Renovations</h3>
              <p className="text-sm text-gray-600">
                Average kitchen remodel: $25k-$50k. Budget: $50-100/sq ft. Mid-range: $100-200/sq
                ft. High-end: $200-400/sq ft. Includes cabinets, countertops, appliances, flooring.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <div className="bg-green-100 rounded-lg p-2 mr-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                ></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Bathroom Renovations</h3>
              <p className="text-sm text-gray-600">
                Average bathroom remodel: $10k-$30k. Small bath: $5k-$15k. Master bath: $15k-$50k.
                Includes fixtures, tile, vanity, plumbing. Plumbing relocation adds 20-40%.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <div className="bg-purple-100 rounded-lg p-2 mr-3">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
                ></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Flooring Costs</h3>
              <p className="text-sm text-gray-600">
                Laminate: $3-8/sq ft. Vinyl/LVP: $4-10/sq ft. Carpet: $2-10/sq ft. Hardwood:
                $6-20/sq ft. Tile: $5-15/sq ft. Installation adds $2-8/sq ft depending on
                complexity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="home-improvement-cost-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
