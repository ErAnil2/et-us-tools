'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
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

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface Unit {
  name: string;
  symbol: string;
  factor: number;
}

interface UnitDefinitions {
  [category: string]: {
    [key: string]: Unit;
  };
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Unit Converter Calculator?",
    answer: "A Unit Converter Calculator is a mathematical tool that helps you quickly calculate or convert unit converter-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Unit Converter Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Unit Converter Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
    order: 3
  },
  {
    id: '4',
    question: "Can I use this for professional or academic work?",
    answer: "Yes, this calculator is suitable for professional, academic, and personal use. It uses standard formulas that are widely accepted. However, always verify critical calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Is this calculator free?",
    answer: "Yes, this Unit Converter Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function UnitConverterCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('unit-converter-calculator');

  const [currentCategory, setCurrentCategory] = useState('length');
  const [fromValue, setFromValue] = useState(1);
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('foot');
  const [toValue, setToValue] = useState('3.2808');
  const [conversionFormula, setConversionFormula] = useState('1 m = 3.28084 feet');
  const [copied, setCopied] = useState(false);

  const units: UnitDefinitions = {
    length: {
      meter: { name: 'Meter', symbol: 'm', factor: 1 },
      kilometer: { name: 'Kilometer', symbol: 'km', factor: 1000 },
      centimeter: { name: 'Centimeter', symbol: 'cm', factor: 0.01 },
      millimeter: { name: 'Millimeter', symbol: 'mm', factor: 0.001 },
      inch: { name: 'Inch', symbol: 'in', factor: 0.0254 },
      foot: { name: 'Foot', symbol: 'ft', factor: 0.3048 },
      yard: { name: 'Yard', symbol: 'yd', factor: 0.9144 },
      mile: { name: 'Mile', symbol: 'mi', factor: 1609.344 },
      nauticalMile: { name: 'Nautical Mile', symbol: 'nmi', factor: 1852 }
    },
    weight: {
      kilogram: { name: 'Kilogram', symbol: 'kg', factor: 1 },
      gram: { name: 'Gram', symbol: 'g', factor: 0.001 },
      pound: { name: 'Pound', symbol: 'lb', factor: 0.453592 },
      ounce: { name: 'Ounce', symbol: 'oz', factor: 0.0283495 },
      stone: { name: 'Stone', symbol: 'st', factor: 6.35029 },
      ton: { name: 'Ton (US)', symbol: 'ton', factor: 907.185 },
      tonne: { name: 'Tonne (Metric)', symbol: 't', factor: 1000 }
    },
    temperature: {
      celsius: { name: 'Celsius', symbol: '°C', factor: 1 },
      fahrenheit: { name: 'Fahrenheit', symbol: '°F', factor: 1 },
      kelvin: { name: 'Kelvin', symbol: 'K', factor: 1 }
    },
    volume: {
      liter: { name: 'Liter', symbol: 'L', factor: 1 },
      milliliter: { name: 'Milliliter', symbol: 'ml', factor: 0.001 },
      gallon: { name: 'Gallon (US)', symbol: 'gal', factor: 3.78541 },
      quart: { name: 'Quart (US)', symbol: 'qt', factor: 0.946353 },
      pint: { name: 'Pint (US)', symbol: 'pt', factor: 0.473176 },
      cup: { name: 'Cup (US)', symbol: 'cup', factor: 0.236588 },
      fluidOunce: { name: 'Fluid Ounce (US)', symbol: 'fl oz', factor: 0.0295735 },
      tablespoon: { name: 'Tablespoon', symbol: 'tbsp', factor: 0.0147868 },
      teaspoon: { name: 'Teaspoon', symbol: 'tsp', factor: 0.00492892 }
    },
    area: {
      squareMeter: { name: 'Square Meter', symbol: 'm²', factor: 1 },
      squareKilometer: { name: 'Square Kilometer', symbol: 'km²', factor: 1000000 },
      squareCentimeter: { name: 'Square Centimeter', symbol: 'cm²', factor: 0.0001 },
      squareFoot: { name: 'Square Foot', symbol: 'ft²', factor: 0.092903 },
      squareInch: { name: 'Square Inch', symbol: 'in²', factor: 0.00064516 },
      squareYard: { name: 'Square Yard', symbol: 'yd²', factor: 0.836127 },
      acre: { name: 'Acre', symbol: 'ac', factor: 4046.86 },
      hectare: { name: 'Hectare', symbol: 'ha', factor: 10000 }
    },
    speed: {
      meterPerSecond: { name: 'Meter per Second', symbol: 'm/s', factor: 1 },
      kilometerPerHour: { name: 'Kilometer per Hour', symbol: 'km/h', factor: 0.277778 },
      milePerHour: { name: 'Mile per Hour', symbol: 'mph', factor: 0.44704 },
      footPerSecond: { name: 'Foot per Second', symbol: 'ft/s', factor: 0.3048 },
      knot: { name: 'Knot', symbol: 'kn', factor: 0.514444 }
    }
  };

  useEffect(() => {
    convert();
  }, [fromValue, fromUnit, toUnit, currentCategory]);

  const convert = () => {
    if (!fromUnit || !toUnit) return;

    let result: number;

    if (currentCategory === 'temperature') {
      result = convertTemperature(fromValue, fromUnit, toUnit);
    } else {
      const fromFactor = units[currentCategory][fromUnit].factor;
      const toFactor = units[currentCategory][toUnit].factor;
      result = (fromValue * fromFactor) / toFactor;
    }

    setToValue(formatNumber(result));
    updateFormula(fromUnit, toUnit);
  };

  const convertTemperature = (value: number, from: string, to: string): number => {
    let celsius: number;
    switch (from) {
      case 'celsius':
        celsius = value;
        break;
      case 'fahrenheit':
        celsius = (value - 32) * 5/9;
        break;
      case 'kelvin':
        celsius = value - 273.15;
        break;
      default:
        celsius = value;
    }

    switch (to) {
      case 'celsius':
        return celsius;
      case 'fahrenheit':
        return celsius * 9/5 + 32;
      case 'kelvin':
        return celsius + 273.15;
      default:
        return celsius;
    }
  };

  const formatNumber = (num: number): string => {
    if (Math.abs(num) >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (Math.abs(num) >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    } else if (Math.abs(num) >= 1) {
      return num.toFixed(4).replace(/\.?0+$/, '');
    } else if (Math.abs(num) >= 0.0001) {
      return num.toFixed(6).replace(/\.?0+$/, '');
    } else {
      return num.toExponential(2);
    }
  };

  const updateFormula = (fromUnitKey: string, toUnitKey: string) => {
    if (!fromUnitKey || !toUnitKey) return;

    const categoryUnits = units[currentCategory];
    const fromUnitData = categoryUnits[fromUnitKey];
    const toUnitData = categoryUnits[toUnitKey];

    let formula: string;

    if (currentCategory === 'temperature') {
      formula = getTemperatureFormula(fromUnitKey, toUnitKey);
    } else {
      const conversionFactor = fromUnitData.factor / toUnitData.factor;
      formula = `1 ${fromUnitData.symbol} = ${formatNumber(conversionFactor)} ${toUnitData.symbol}`;
    }

    setConversionFormula(formula);
  };

  const getTemperatureFormula = (from: string, to: string): string => {
    if (from === to) return `${from} = ${to}`;

    const formulas: { [key: string]: string } = {
      'celsius-fahrenheit': '°F = °C × 9/5 + 32',
      'fahrenheit-celsius': '°C = (°F - 32) × 5/9',
      'celsius-kelvin': 'K = °C + 273.15',
      'kelvin-celsius': '°C = K - 273.15',
      'fahrenheit-kelvin': 'K = (°F - 32) × 5/9 + 273.15',
      'kelvin-fahrenheit': '°F = (K - 273.15) × 9/5 + 32'
    };

    return formulas[`${from}-${to}`] || 'Complex conversion';
  };

  const selectCategory = (category: string) => {
    setCurrentCategory(category);
    const unitKeys = Object.keys(units[category]);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1] || unitKeys[0]);
  };

  const swapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(parseFloat(toValue) || 0);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(toValue).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };

  const generateQuickConversions = () => {
    const categoryUnits = units[currentCategory];
    const unitKeys = Object.keys(categoryUnits);

    if (unitKeys.length < 2) return null;

    const baseUnit = unitKeys[0];
    const baseUnitData = categoryUnits[baseUnit];
    const testValues = [1, 5, 10, 50, 100];

    return (
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-2 py-2 text-left font-medium text-gray-700">{baseUnitData.symbol}</th>
            {unitKeys.slice(1, 4).map(key => (
              <th key={key} className="px-2 py-2 text-left font-medium text-gray-700">
                {categoryUnits[key].symbol}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {testValues.map(value => (
            <tr key={value} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-2 py-2 font-medium">{value}</td>
              {unitKeys.slice(1, 4).map(key => {
                let convertedValue: number;
                if (currentCategory === 'temperature') {
                  convertedValue = convertTemperature(value, baseUnit, key);
                } else {
                  const baseFactor = categoryUnits[baseUnit].factor;
                  const targetFactor = categoryUnits[key].factor;
                  convertedValue = (value * baseFactor) / targetFactor;
                }
                return (
                  <td key={key} className="px-2 py-2">
                    {formatNumber(convertedValue)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Link href="/us/tools" className="text-blue-600 hover:text-blue-800 text-sm md:text-base">Home</Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600 text-sm md:text-base">Unit Converter Calculator</span>
      </div>

      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">{getH1('Universal Unit Converter')}</h1>
        <p className="text-sm md:text-base text-gray-600">
          Convert between different units of measurement including length, weight, temperature, volume, area, and more
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Calculator */}
        <div className="lg:col-span-2">
          {/* Category Selection & Converter */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              <span>🔄</span> Unit Converter
            </h2>

            {/* Category Selection */}
            <div className="mb-4 md:mb-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Select Category</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => selectCategory('length')}
                  className={`flex flex-col items-center p-2 border-2 rounded-lg transition-colors text-xs ${
                    currentCategory === 'length'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <span className="text-lg mb-1">📏</span>
                  <span className="font-medium">Length</span>
                </button>

                <button
                  onClick={() => selectCategory('weight')}
                  className={`flex flex-col items-center p-2 border-2 rounded-lg transition-colors text-xs ${
                    currentCategory === 'weight'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <span className="text-lg mb-1">⚖️</span>
                  <span className="font-medium">Weight</span>
                </button>

                <button
                  onClick={() => selectCategory('temperature')}
                  className={`flex flex-col items-center p-2 border-2 rounded-lg transition-colors text-xs ${
                    currentCategory === 'temperature'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <span className="text-lg mb-1">🌡️</span>
                  <span className="font-medium">Temp</span>
                </button>

                <button
                  onClick={() => selectCategory('volume')}
                  className={`flex flex-col items-center p-2 border-2 rounded-lg transition-colors text-xs ${
                    currentCategory === 'volume'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <span className="text-lg mb-1">🥤</span>
                  <span className="font-medium">Volume</span>
                </button>

                <button
                  onClick={() => selectCategory('area')}
                  className={`flex flex-col items-center p-2 border-2 rounded-lg transition-colors text-xs ${
                    currentCategory === 'area'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <span className="text-lg mb-1">🏠</span>
                  <span className="font-medium">Area</span>
                </button>

                <button
                  onClick={() => selectCategory('speed')}
                  className={`flex flex-col items-center p-2 border-2 rounded-lg transition-colors text-xs ${
                    currentCategory === 'speed'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <span className="text-lg mb-1">🚗</span>
                  <span className="font-medium">Speed</span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3 md:gap-4 mb-4">
              <div>
                <label htmlFor="fromValue" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">From Value</label>
                <input
                  type="number"
                  id="fromValue"
                  step="0.000001"
                  value={fromValue}
                  onChange={(e) => setFromValue(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="fromUnit" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">From Unit</label>
                <select
                  id="fromUnit"
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(units[currentCategory]).map(([key, unit]) => (
                    <option key={key} value={key}>
                      {unit.name} ({unit.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <button
                onClick={swapUnits}
                className="flex items-center gap-2 px-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
                Swap
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label htmlFor="toValue" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Result</label>
                <div className="relative">
                  <input
                    type="text"
                    id="toValue"
                    readOnly
                    value={toValue}
                    className="w-full px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                  />
                  <button
                    onClick={copyResult}
                    className="absolute right-2 top-2 md:top-2.5 p-1 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Copy result"
                  >
                    {copied ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="toUnit" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">To Unit</label>
                <select
                  id="toUnit"
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(units[currentCategory]).map(([key, unit]) => (
                    <option key={key} value={key}>
                      {unit.name} ({unit.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Conversion Formula */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-xs font-medium text-blue-800 mb-1">Conversion Formula:</div>
              <div className="font-mono text-xs text-blue-700">
                {conversionFormula}
              </div>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Quick Reference Table */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              <span>📊</span> Quick Reference
            </h3>
            <div className="overflow-x-auto">
              {generateQuickConversions()}
            </div>
          </div>
</div>

        {/* Info Sidebar */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border border-blue-200">
            <h3 className="text-base md:text-lg font-bold text-blue-900 mb-2 md:mb-3">📏 Length</h3>
            <div className="space-y-1 text-xs md:text-sm text-blue-800">
              <div>1 inch = 2.54 cm</div>
              <div>1 foot = 30.48 cm</div>
              <div>1 yard = 0.9144 m</div>
              <div>1 mile = 1.609 km</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 md:p-6 border border-green-200">
            <h3 className="text-base md:text-lg font-bold text-green-900 mb-2 md:mb-3">⚖️ Weight</h3>
            <div className="space-y-1 text-xs md:text-sm text-green-800">
              <div>1 oz = 28.35 g</div>
              <div>1 lb = 0.4536 kg</div>
              <div>1 stone = 6.35 kg</div>
              <div>1 ton = 907.2 kg</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 md:p-6 border border-red-200">
            <h3 className="text-base md:text-lg font-bold text-red-900 mb-2 md:mb-3">🌡️ Temperature</h3>
            <div className="space-y-1 text-xs md:text-sm text-red-800">
              <div>0°C = 32°F</div>
              <div>100°C = 212°F</div>
              <div>°F = °C × 9/5 + 32</div>
              <div>°C = (°F - 32) × 5/9</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 md:p-6 border border-purple-200">
            <h3 className="text-base md:text-lg font-bold text-purple-900 mb-2 md:mb-3">🥤 Volume</h3>
            <div className="space-y-1 text-xs md:text-sm text-purple-800">
              <div>1 fl oz = 29.57 ml</div>
              <div>1 cup = 236.6 ml</div>
              <div>1 pint = 473.2 ml</div>
              <div>1 gallon = 3.785 L</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 md:p-6 border border-amber-200">
            <h3 className="text-base md:text-lg font-bold text-amber-900 mb-2 md:mb-3">🏠 Area</h3>
            <div className="space-y-1 text-xs md:text-sm text-amber-800">
              <div>1 sq ft = 0.0929 sq m</div>
              <div>1 sq yd = 0.836 sq m</div>
              <div>1 acre = 4047 sq m</div>
              <div>1 hectare = 10,000 sq m</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-xl p-4 md:p-6 border border-cyan-200">
            <h3 className="text-base md:text-lg font-bold text-cyan-900 mb-2 md:mb-3">🚗 Speed</h3>
            <div className="space-y-1 text-xs md:text-sm text-cyan-800">
              <div>1 mph = 1.609 km/h</div>
              <div>1 knot = 1.852 km/h</div>
              <div>1 m/s = 3.6 km/h</div>
              <div>1 ft/s = 0.3048 m/s</div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Converter Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link
              key={index}
              href={calc.href}
              className={`${calc.color || 'bg-gray-500'} text-white rounded-xl p-6 hover:opacity-90 transition-opacity`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{calc.title}</h3>
                  <p className="text-sm opacity-90">{calc.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="unit-converter-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
