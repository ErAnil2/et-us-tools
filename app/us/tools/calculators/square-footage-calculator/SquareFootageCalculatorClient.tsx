'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface AreaItem {
  id: number;
  length: number;
  width: number;
}

const conversionFactors: Record<string, number> = {
  ft: 1,
  in: 1/12,
  m: 3.28084,
  cm: 0.0328084
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Square Footage Calculator?",
    answer: "A Square Footage Calculator helps you calculate dates, times, or durations quickly. Whether you need to find the difference between dates or calculate future/past dates, this tool provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is the date calculation?",
    answer: "Our calculator accounts for leap years, varying month lengths, and other calendar complexities to provide accurate results. It uses the Gregorian calendar system.",
    order: 2
  },
  {
    id: '3',
    question: "What date formats are supported?",
    answer: "The calculator accepts common date formats and displays results in an easy-to-understand format. Simply enter dates in the format shown in the input fields.",
    order: 3
  },
  {
    id: '4',
    question: "Can I calculate dates far in the future or past?",
    answer: "Yes, the calculator can handle dates spanning many years. It's useful for planning, historical research, or any date-related calculations you need.",
    order: 4
  },
  {
    id: '5',
    question: "Is timezone considered in calculations?",
    answer: "Date calculations are based on calendar dates. For time-specific calculations, ensure you're considering your local timezone for the most accurate results.",
    order: 5
  }
];

export default function SquareFootageCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('square-footage-calculator');

  const [shape, setShape] = useState('rectangle');
  const [length, setLength] = useState(12);
  const [lengthUnit, setLengthUnit] = useState('ft');
  const [width, setWidth] = useState(10);
  const [widthUnit, setWidthUnit] = useState('ft');
  const [triangleBase, setTriangleBase] = useState(8);
  const [triangleBaseUnit, setTriangleBaseUnit] = useState('ft');
  const [triangleHeight, setTriangleHeight] = useState(6);
  const [triangleHeightUnit, setTriangleHeightUnit] = useState('ft');
  const [circleRadius, setCircleRadius] = useState(5);
  const [circleUnit, setCircleUnit] = useState('ft');
  const [circleType, setCircleType] = useState('radius');
  const [areaItems, setAreaItems] = useState<AreaItem[]>([{ id: 1, length: 10, width: 8 }]);
  const [results, setResults] = useState<{
    areaFt2: number;
    perimeter: number;
    summary: string;
  }>({ areaFt2: 0, perimeter: 0, summary: '' });

  const convertToFeet = (value: number, unit: string) => {
    return value * conversionFactors[unit];
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const formatCurrency = (min: number, max: number) => {
    return `$${formatNumber(min, 0)} - $${formatNumber(max, 0)}`;
  };

  const calculateArea = () => {
    let areaFt2 = 0;
    let perimeter = 0;
    let summary = '';

    switch(shape) {
      case 'rectangle':
        const lengthFt = convertToFeet(length, lengthUnit);
        const widthFt = convertToFeet(width, widthUnit);
        areaFt2 = lengthFt * widthFt;
        perimeter = 2 * (lengthFt + widthFt);
        summary = `${formatNumber(lengthFt)} ft × ${formatNumber(widthFt)} ft = ${formatNumber(areaFt2)} sq ft`;
        break;

      case 'triangle':
        const baseFt = convertToFeet(triangleBase, triangleBaseUnit);
        const heightFt = convertToFeet(triangleHeight, triangleHeightUnit);
        areaFt2 = (baseFt * heightFt) / 2;
        summary = `(${formatNumber(baseFt)} ft × ${formatNumber(heightFt)} ft) ÷ 2 = ${formatNumber(areaFt2)} sq ft`;
        break;

      case 'circle':
        const circleValueFt = convertToFeet(circleRadius, circleUnit);
        const radius = circleType === 'radius' ? circleValueFt : circleValueFt / 2;
        areaFt2 = Math.PI * radius * radius;
        perimeter = 2 * Math.PI * radius;
        summary = `π × ${formatNumber(radius)}² = ${formatNumber(areaFt2)} sq ft`;
        break;

      case 'multiple':
        let totalArea = 0;
        const areas: string[] = [];
        areaItems.forEach((item) => {
          const itemArea = item.length * item.width;
          totalArea += itemArea;
          areas.push(`${formatNumber(itemArea)}`);
        });
        areaFt2 = totalArea;
        summary = `${areas.join(' + ')} = ${formatNumber(totalArea)} sq ft`;
        break;
    }

    setResults({ areaFt2, perimeter, summary });
  };

  useEffect(() => {
    calculateArea();
  }, [shape, length, lengthUnit, width, widthUnit, triangleBase, triangleBaseUnit,
      triangleHeight, triangleHeightUnit, circleRadius, circleUnit, circleType, areaItems]);

  const getFormula = () => {
    switch(shape) {
      case 'rectangle':
        return 'Area = Length × Width';
      case 'triangle':
        return 'Area = (Base × Height) ÷ 2';
      case 'circle':
        return 'Area = π × r²';
      case 'multiple':
        return 'Area = Sum of all areas';
      default:
        return 'Area = Length × Width';
    }
  };

  const addArea = () => {
    const newId = Math.max(...areaItems.map(item => item.id), 0) + 1;
    setAreaItems([...areaItems, { id: newId, length: 10, width: 8 }]);
  };

  const removeArea = (id: number) => {
    if (areaItems.length > 1) {
      setAreaItems(areaItems.filter(item => item.id !== id));
    }
  };

  const updateAreaItem = (id: number, field: 'length' | 'width', value: number) => {
    setAreaItems(areaItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const applyRoomPreset = (presetLength: number, presetWidth: number) => {
    setLength(presetLength);
    setWidth(presetWidth);
    setLengthUnit('ft');
    setWidthUnit('ft');
    setShape('rectangle');
  };

  const flooringNeeded = results.areaFt2 * 1.1;

  const ResultsPanel = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
        <div className="flex items-center justify-center mb-3">
          <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"></path>
          </svg>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-600">{formatNumber(results.areaFt2)} sq ft</div>
          <div className="text-sm text-gray-600 mt-1">Total Area</div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
          </svg>
          Unit Conversions
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Square Inches</span>
            <span className="font-semibold">{formatNumber(results.areaFt2 * 144, 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Square Meters</span>
            <span className="font-semibold">{formatNumber(results.areaFt2 * 0.092903)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Square Yards</span>
            <span className="font-semibold">{formatNumber(results.areaFt2 / 9)}</span>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
          <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
          Material Estimates
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Flooring (10% waste)</span>
            <span className="font-semibold">{formatNumber(flooringNeeded, 0)} sq ft</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Paint (covers 350 sq ft)</span>
            <span className="font-semibold">{formatNumber(results.areaFt2 / 350)} gal</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">12&quot; × 12&quot; Tiles</span>
            <span className="font-semibold">{formatNumber(flooringNeeded, 0)} tiles</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
          <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Cost Estimates
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Carpet</span>
            <span className="font-semibold">{formatCurrency(results.areaFt2 * 2, results.areaFt2 * 5)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Hardwood</span>
            <span className="font-semibold">{formatCurrency(results.areaFt2 * 3, results.areaFt2 * 8)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tile</span>
            <span className="font-semibold">{formatCurrency(results.areaFt2 * 1, results.areaFt2 * 15)}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2">*Prices vary by quality and region</div>
      </div>
{results.perimeter > 0 && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center">
            <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Perimeter
          </h4>
          <div className="text-lg font-semibold text-gray-800">{formatNumber(results.perimeter)} ft</div>
          <div className="text-xs text-gray-500 mt-1">For baseboard, trim calculations</div>
        </div>
      )}

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Calculation</h4>
        <div className="text-xs text-gray-600 font-mono">{results.summary}</div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      {/* Header */}
      <header className="text-center mb-6 md:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{getH1('Square Footage Calculator')}</h1>
        <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
          Calculate area in square feet for rooms, floors, and spaces. Supports multiple shapes and unit conversions.
        </p>
      </header>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 md:gap-8 mb-6 md:mb-8">
        <div className="lg:grid lg:gap-3 sm:gap-4 md:gap-6" style={{gridTemplateColumns: '1fr 350px'}}>
          {/* Left Column - Input Form */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="space-y-4">
              {/* Shape Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"></path>
                    </svg>
                    Select Shape
                  </span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <label className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${shape === 'rectangle' ? 'border-amber-500 bg-amber-50' : 'border-gray-300'}`}>
                    <input type="radio" name="shape" value="rectangle" className="mr-2" checked={shape === 'rectangle'} onChange={(e) => setShape(e.target.value)} />
                    <span className="text-sm font-medium">Rectangle</span>
                  </label>
                  <label className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${shape === 'triangle' ? 'border-amber-500 bg-amber-50' : 'border-gray-300'}`}>
                    <input type="radio" name="shape" value="triangle" className="mr-2" checked={shape === 'triangle'} onChange={(e) => setShape(e.target.value)} />
                    <span className="text-sm font-medium">Triangle</span>
                  </label>
                  <label className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${shape === 'circle' ? 'border-amber-500 bg-amber-50' : 'border-gray-300'}`}>
                    <input type="radio" name="shape" value="circle" className="mr-2" checked={shape === 'circle'} onChange={(e) => setShape(e.target.value)} />
                    <span className="text-sm font-medium">Circle</span>
                  </label>
                  <label className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${shape === 'multiple' ? 'border-amber-500 bg-amber-50' : 'border-gray-300'}`}>
                    <input type="radio" name="shape" value="multiple" className="mr-2" checked={shape === 'multiple'} onChange={(e) => setShape(e.target.value)} />
                    <span className="text-sm font-medium">Multiple</span>
                  </label>
                </div>
              </div>

              {/* Rectangle Section */}
              {shape === 'rectangle' && (
                <div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="inline-flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                          </svg>
                          Length
                        </span>
                      </label>
                      <div className="flex">
                        <input type="number" value={length} onChange={(e) => setLength(parseFloat(e.target.value) || 0)} className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none" min="0" step="0.25" />
                        <select value={lengthUnit} onChange={(e) => setLengthUnit(e.target.value)} className="w-20 px-2 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                          <option value="ft">ft</option>
                          <option value="in">in</option>
                          <option value="m">m</option>
                          <option value="cm">cm</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="inline-flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                          </svg>
                          Width
                        </span>
                      </label>
                      <div className="flex">
                        <input type="number" value={width} onChange={(e) => setWidth(parseFloat(e.target.value) || 0)} className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none" min="0" step="0.25" />
                        <select value={widthUnit} onChange={(e) => setWidthUnit(e.target.value)} className="w-20 px-2 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                          <option value="ft">ft</option>
                          <option value="in">in</option>
                          <option value="m">m</option>
                          <option value="cm">cm</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Triangle Section */}
              {shape === 'triangle' && (
                <div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Base</label>
                      <div className="flex">
                        <input type="number" value={triangleBase} onChange={(e) => setTriangleBase(parseFloat(e.target.value) || 0)} className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none" min="0" step="0.25" />
                        <select value={triangleBaseUnit} onChange={(e) => setTriangleBaseUnit(e.target.value)} className="w-20 px-2 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                          <option value="ft">ft</option>
                          <option value="in">in</option>
                          <option value="m">m</option>
                          <option value="cm">cm</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                      <div className="flex">
                        <input type="number" value={triangleHeight} onChange={(e) => setTriangleHeight(parseFloat(e.target.value) || 0)} className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none" min="0" step="0.25" />
                        <select value={triangleHeightUnit} onChange={(e) => setTriangleHeightUnit(e.target.value)} className="w-20 px-2 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                          <option value="ft">ft</option>
                          <option value="in">in</option>
                          <option value="m">m</option>
                          <option value="cm">cm</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Circle Section */}
              {shape === 'circle' && (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Measurement Type</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input type="radio" name="circleType" value="radius" className="mr-2" checked={circleType === 'radius'} onChange={(e) => setCircleType(e.target.value)} />
                        <span className="text-sm">Radius</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="circleType" value="diameter" className="mr-2" checked={circleType === 'diameter'} onChange={(e) => setCircleType(e.target.value)} />
                        <span className="text-sm">Diameter</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {circleType === 'radius' ? 'Radius' : 'Diameter'}
                    </label>
                    <div className="flex">
                      <input type="number" value={circleRadius} onChange={(e) => setCircleRadius(parseFloat(e.target.value) || 0)} className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none" min="0" step="0.25" />
                      <select value={circleUnit} onChange={(e) => setCircleUnit(e.target.value)} className="w-20 px-2 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                        <option value="ft">ft</option>
                        <option value="in">in</option>
                        <option value="m">m</option>
                        <option value="cm">cm</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Multiple Areas Section */}
              {shape === 'multiple' && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-semibold text-gray-900">Areas to Add</h4>
                    <button type="button" onClick={addArea} className="px-3 py-1.5 text-sm bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors">
                      + Add Area
                    </button>
                  </div>

                  <div className="space-y-3">
                    {areaItems.map((item, index) => (
                      <div key={item.id} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Area {index + 1}</span>
                          <button type="button" onClick={() => removeArea(item.id)} className="text-red-600 hover:text-red-800 text-sm">
                            Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input type="number" value={item.length} onChange={(e) => updateAreaItem(item.id, 'length', parseFloat(e.target.value) || 0)} className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500" placeholder="Length (ft)" />
                          <input type="number" value={item.width} onChange={(e) => updateAreaItem(item.id, 'width', parseFloat(e.target.value) || 0)} className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500" placeholder="Width (ft)" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    Quick Presets
                  </span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <button type="button" onClick={() => applyRoomPreset(10, 10)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-amber-50 hover:border-amber-500 transition-colors">
                    <div className="font-semibold">Small Bedroom</div>
                    <div className="text-xs text-gray-500">10&apos; × 10&apos;</div>
                  </button>
                  <button type="button" onClick={() => applyRoomPreset(12, 10)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-amber-50 hover:border-amber-500 transition-colors">
                    <div className="font-semibold">Bedroom</div>
                    <div className="text-xs text-gray-500">12&apos; × 10&apos;</div>
                  </button>
                  <button type="button" onClick={() => applyRoomPreset(16, 12)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-amber-50 hover:border-amber-500 transition-colors">
                    <div className="font-semibold">Living Room</div>
                    <div className="text-xs text-gray-500">16&apos; × 12&apos;</div>
                  </button>
                  <button type="button" onClick={() => applyRoomPreset(14, 10)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-amber-50 hover:border-amber-500 transition-colors">
                    <div className="font-semibold">Kitchen</div>
                    <div className="text-xs text-gray-500">14&apos; × 10&apos;</div>
                  </button>
                  <button type="button" onClick={() => applyRoomPreset(8, 6)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-amber-50 hover:border-amber-500 transition-colors">
                    <div className="font-semibold">Bathroom</div>
                    <div className="text-xs text-gray-500">8&apos; × 6&apos;</div>
                  </button>
                  <button type="button" onClick={() => applyRoomPreset(24, 20)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-amber-50 hover:border-amber-500 transition-colors">
                    <div className="font-semibold">Garage</div>
                    <div className="text-xs text-gray-500">24&apos; × 20&apos;</div>
                  </button>
                </div>
              </div>

              {/* Formula Display */}
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                <div className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                  Formula
                </div>
                <div className="font-mono text-sm text-gray-800">{getFormula()}</div>
              </div>
            </div>

            {/* Results Panel - Mobile Only */}
            <div className="lg:hidden mt-6">
              <ResultsPanel />
            </div>
          </div>

          {/* Right Column - Results (Desktop Only) */}
          <div className="hidden lg:block" style={{width: '350px'}}>
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 lg:sticky lg:top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                Area Results
              </h3>
              <ResultsPanel />
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards Section */}

      <div className="mt-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding Square Footage</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Basic Formulas Card */}
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Basic Formulas</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Rectangle:</strong> Length × Width</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Triangle:</strong> (Base × Height) ÷ 2</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Circle:</strong> π × radius²</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Square:</strong> Side × Side</span>
              </li>
            </ul>
          </div>

          {/* Unit Conversions Card */}
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Quick Conversions</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>1 sq ft = 144 square inches</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>1 sq ft = 0.0929 square meters</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>9 sq ft = 1 square yard</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>43,560 sq ft = 1 acre</span>
              </li>
            </ul>
          </div>

          {/* Common Applications Card */}
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Common Uses</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Flooring:</strong> Calculate materials needed</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Painting:</strong> Estimate paint quantity</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Real Estate:</strong> Compare property sizes</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Renovation:</strong> Plan project costs</span>
              </li>
            </ul>
          </div>

          {/* Material Waste Factors Card */}
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Waste Factors</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Carpet/Vinyl:</strong> Add 5-10% waste</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Tile (straight):</strong> Add 10% waste</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Tile (diagonal):</strong> Add 15% waste</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span><strong>Hardwood:</strong> Add 5-8% waste</span>
              </li>
            </ul>
          </div>

          {/* Measurement Tips Card */}
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Measurement Tips</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>Measure at floor level, not walls</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>Round up to nearest inch or foot</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>Measure twice, order once</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>Account for doorways and closets</span>
              </li>
            </ul>
          </div>

          {/* Average Room Sizes Card */}
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Average Sizes</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex justify-between">
                <span className="text-gray-700">Master Bedroom</span>
                <span className="font-semibold">200-300 sq ft</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-700">Guest Bedroom</span>
                <span className="font-semibold">100-200 sq ft</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-700">Living Room</span>
                <span className="font-semibold">200-400 sq ft</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-700">Kitchen</span>
                <span className="font-semibold">100-200 sq ft</span>
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
                <svg className="w-5 h-5 text-amber-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                How do I calculate square footage for an irregular room?
              </span>
              <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="px-3 sm:px-4 md:px-6 py-4 bg-gray-50 text-gray-600 text-sm border-t border-gray-200">
              Break the room into regular shapes (rectangles, triangles, or circles). Measure and calculate the area of each section separately, then add them together. Use our &quot;Multiple Areas&quot; option to easily calculate complex spaces.
            </div>
          </details>

          <details className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
            <summary className="px-3 sm:px-4 md:px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <span className="flex items-center">
                <svg className="w-5 h-5 text-amber-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                How much extra flooring should I buy?
              </span>
              <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="px-3 sm:px-4 md:px-6 py-4 bg-gray-50 text-gray-600 text-sm border-t border-gray-200">
              Add 10% for straight installations and 15% for diagonal patterns. This accounts for cutting waste, mistakes, and future repairs. For rooms with many corners or irregular shapes, consider adding 15-20%.
            </div>
          </details>

          <details className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
            <summary className="px-3 sm:px-4 md:px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <span className="flex items-center">
                <svg className="w-5 h-5 text-amber-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                How many gallons of paint do I need per square foot?
              </span>
              <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="px-3 sm:px-4 md:px-6 py-4 bg-gray-50 text-gray-600 text-sm border-t border-gray-200">
              One gallon of paint typically covers 350-400 square feet with one coat. For accurate estimates, divide your wall square footage by 350. Remember to account for multiple coats (usually 2) and primer if needed.
            </div>
          </details>

          <details className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
            <summary className="px-3 sm:px-4 md:px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <span className="flex items-center">
                <svg className="w-5 h-5 text-amber-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Do I include closets in square footage calculations?
              </span>
              <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="px-3 sm:px-4 md:px-6 py-4 bg-gray-50 text-gray-600 text-sm border-t border-gray-200">
              For real estate purposes, yes - closets are included in a room&apos;s square footage if they have a minimum ceiling height of 7 feet. For flooring projects, include closets if you&apos;re installing flooring in them.
            </div>
          </details>

          <details className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
            <summary className="px-3 sm:px-4 md:px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <span className="flex items-center">
                <svg className="w-5 h-5 text-amber-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                What&apos;s the difference between square feet and linear feet?
              </span>
              <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="px-3 sm:px-4 md:px-6 py-4 bg-gray-50 text-gray-600 text-sm border-t border-gray-200">
              Square feet measure area (length × width), while linear feet measure length only. Use square feet for flooring, paint, and carpet. Use linear feet for baseboards, crown molding, and trim. The perimeter shown in our calculator is measured in linear feet.
            </div>
          </details>
        </div>
      </div>

      {/* SEO Content */}
      <div className="mt-8 mb-4 sm:mb-6 md:mb-8 bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How to Calculate Square Footage</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Calculating square footage is essential for flooring, painting, and renovation projects. For rectangular areas, multiply length by width. For complex spaces, break them into simple shapes and add the areas together. Our calculator handles multiple shapes and provides material estimates and cost calculations.
        </p>
      </div>
{/* Related Calculators */}
      <div className="mt-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Math Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="block">
              <div className={`${calc.color} rounded-lg p-4 text-white hover:opacity-90 transition-opacity`}>
                <h3 className="font-semibold mb-1">{calc.title}</h3>
                <p className="text-sm opacity-90">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="square-footage-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
