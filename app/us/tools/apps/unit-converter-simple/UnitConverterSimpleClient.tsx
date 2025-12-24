'use client';

import { MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';
import { useState, useEffect } from 'react';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: 'How accurate are the conversions?',
    answer: 'Our conversions use precise mathematical formulas and are accurate to multiple decimal places. For most practical purposes, the results are exact. Scientific and engineering calculations can rely on these conversions.',
    order: 1
  },
  {
    id: '2',
    question: 'What unit categories are supported?',
    answer: 'We support length, weight/mass, temperature, volume, area, speed, time, and data storage conversions. Each category includes both metric and imperial units commonly used worldwide.',
    order: 2
  },
  {
    id: '3',
    question: 'How do temperature conversions work?',
    answer: 'Temperature conversions use the standard formulas: Celsius to Fahrenheit (C × 9/5 + 32), Fahrenheit to Celsius ((F - 32) × 5/9), and Kelvin conversions add or subtract 273.15 from Celsius.',
    order: 3
  },
  {
    id: '4',
    question: 'Can I convert between metric and imperial?',
    answer: 'Yes! You can freely convert between metric (meters, kilograms, liters) and imperial (feet, pounds, gallons) units. The converter handles all cross-system conversions automatically.',
    order: 4
  },
  {
    id: '5',
    question: 'Why are there two types of gallons?',
    answer: 'US gallons (3.785 liters) and UK/Imperial gallons (4.546 liters) differ in size. Our converter includes both so you can choose the correct one for your needs.',
    order: 5
  },
  {
    id: '6',
    question: 'Is this tool free to use?',
    answer: 'Yes, completely free with no limits! All conversions happen instantly in your browser. No sign-up required, no ads blocking functionality, and no data is collected.',
    order: 6
  }
];

type Category = 'length' | 'weight' | 'temperature' | 'volume' | 'area' | 'speed' | 'time' | 'data';

interface UnitDefinition {
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

const unitCategories: Record<Category, { name: string; icon: string; baseUnit: string; units: Record<string, UnitDefinition> }> = {
  length: {
    name: 'Length',
    icon: '📏',
    baseUnit: 'meter',
    units: {
      meter: { name: 'Meter', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
      kilometer: { name: 'Kilometer', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      centimeter: { name: 'Centimeter', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      millimeter: { name: 'Millimeter', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      mile: { name: 'Mile', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      yard: { name: 'Yard', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      foot: { name: 'Foot', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      inch: { name: 'Inch', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    }
  },
  weight: {
    name: 'Weight',
    icon: '⚖️',
    baseUnit: 'kilogram',
    units: {
      kilogram: { name: 'Kilogram', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
      gram: { name: 'Gram', symbol: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      milligram: { name: 'Milligram', symbol: 'mg', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      pound: { name: 'Pound', symbol: 'lb', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
      ounce: { name: 'Ounce', symbol: 'oz', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      ton: { name: 'Metric Ton', symbol: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      stone: { name: 'Stone', symbol: 'st', toBase: (v) => v * 6.35029, fromBase: (v) => v / 6.35029 },
    }
  },
  temperature: {
    name: 'Temperature',
    icon: '🌡️',
    baseUnit: 'celsius',
    units: {
      celsius: { name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
      fahrenheit: { name: 'Fahrenheit', symbol: '°F', toBase: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
      kelvin: { name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    }
  },
  volume: {
    name: 'Volume',
    icon: '🧪',
    baseUnit: 'liter',
    units: {
      liter: { name: 'Liter', symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
      milliliter: { name: 'Milliliter', symbol: 'mL', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      cubicMeter: { name: 'Cubic Meter', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      gallon: { name: 'US Gallon', symbol: 'gal', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      quart: { name: 'US Quart', symbol: 'qt', toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
      pint: { name: 'US Pint', symbol: 'pt', toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
      cup: { name: 'US Cup', symbol: 'cup', toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
      fluidOunce: { name: 'Fluid Ounce', symbol: 'fl oz', toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
    }
  },
  area: {
    name: 'Area',
    icon: '📐',
    baseUnit: 'squareMeter',
    units: {
      squareMeter: { name: 'Square Meter', symbol: 'm²', toBase: (v) => v, fromBase: (v) => v },
      squareKilometer: { name: 'Square Kilometer', symbol: 'km²', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
      hectare: { name: 'Hectare', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
      acre: { name: 'Acre', symbol: 'ac', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
      squareFoot: { name: 'Square Foot', symbol: 'ft²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      squareYard: { name: 'Square Yard', symbol: 'yd²', toBase: (v) => v * 0.836127, fromBase: (v) => v / 0.836127 },
      squareMile: { name: 'Square Mile', symbol: 'mi²', toBase: (v) => v * 2589988, fromBase: (v) => v / 2589988 },
    }
  },
  speed: {
    name: 'Speed',
    icon: '🚀',
    baseUnit: 'meterPerSecond',
    units: {
      meterPerSecond: { name: 'Meter/Second', symbol: 'm/s', toBase: (v) => v, fromBase: (v) => v },
      kilometerPerHour: { name: 'Kilometer/Hour', symbol: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      milePerHour: { name: 'Mile/Hour', symbol: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      knot: { name: 'Knot', symbol: 'kn', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
      footPerSecond: { name: 'Foot/Second', symbol: 'ft/s', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    }
  },
  time: {
    name: 'Time',
    icon: '⏱️',
    baseUnit: 'second',
    units: {
      second: { name: 'Second', symbol: 's', toBase: (v) => v, fromBase: (v) => v },
      millisecond: { name: 'Millisecond', symbol: 'ms', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      minute: { name: 'Minute', symbol: 'min', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      hour: { name: 'Hour', symbol: 'hr', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      day: { name: 'Day', symbol: 'd', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      week: { name: 'Week', symbol: 'wk', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
      month: { name: 'Month (30d)', symbol: 'mo', toBase: (v) => v * 2592000, fromBase: (v) => v / 2592000 },
      year: { name: 'Year (365d)', symbol: 'yr', toBase: (v) => v * 31536000, fromBase: (v) => v / 31536000 },
    }
  },
  data: {
    name: 'Data',
    icon: '💾',
    baseUnit: 'byte',
    units: {
      byte: { name: 'Byte', symbol: 'B', toBase: (v) => v, fromBase: (v) => v },
      kilobyte: { name: 'Kilobyte', symbol: 'KB', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      megabyte: { name: 'Megabyte', symbol: 'MB', toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
      gigabyte: { name: 'Gigabyte', symbol: 'GB', toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 },
      terabyte: { name: 'Terabyte', symbol: 'TB', toBase: (v) => v * 1099511627776, fromBase: (v) => v / 1099511627776 },
      bit: { name: 'Bit', symbol: 'b', toBase: (v) => v / 8, fromBase: (v) => v * 8 },
      kilobit: { name: 'Kilobit', symbol: 'Kb', toBase: (v) => v * 128, fromBase: (v) => v / 128 },
      megabit: { name: 'Megabit', symbol: 'Mb', toBase: (v) => v * 131072, fromBase: (v) => v / 131072 },
    }
  }
};

export default function UnitConverterSimpleClient() {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('foot');
  const [inputValue, setInputValue] = useState('1');
  const [result, setResult] = useState('');

  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('unit-converter-simple');

  const webAppSchema = generateWebAppSchema(
    'Unit Converter - Free Online Measurement Converter',
    'Free online unit converter for length, weight, temperature, volume, area, speed, time, and data. Convert between metric and imperial units instantly.',
    'https://economictimes.indiatimes.com/us/tools/apps/unit-converter-simple',
    'Utility'
  );

  useEffect(() => {
    convert();
  }, [inputValue, fromUnit, toUnit, category]);

  useEffect(() => {
    // Reset units when category changes
    const units = Object.keys(unitCategories[category].units);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
    setInputValue('1');
  }, [category]);

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult('');
      return;
    }

    const categoryData = unitCategories[category];
    const fromDef = categoryData.units[fromUnit];
    const toDef = categoryData.units[toUnit];

    if (!fromDef || !toDef) {
      setResult('');
      return;
    }

    // Convert to base unit, then to target unit
    const baseValue = fromDef.toBase(value);
    const resultValue = toDef.fromBase(baseValue);

    // Format result
    if (Math.abs(resultValue) < 0.0001 || Math.abs(resultValue) >= 1000000) {
      setResult(resultValue.toExponential(6));
    } else {
      setResult(resultValue.toLocaleString(undefined, { maximumFractionDigits: 6 }));
    }
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    setInputValue(result.replace(/,/g, ''));
  };

  const currentCategory = unitCategories[category];
  const units = Object.entries(currentCategory.units);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-100 to-cyan-100 px-6 py-3 rounded-full mb-4">
          <span className="text-2xl">🔄</span>
          <span className="text-teal-600 font-semibold">Unit Converter</span>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
          {getH1('Unit Converter')}
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Convert between different units of measurement instantly. Supports length, weight, temperature, volume, area, speed, time, and data.')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Category Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {(Object.keys(unitCategories) as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-3 rounded-xl font-medium transition-all ${
              category === cat
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
            }`}
          >
            <span className="mr-2">{unitCategories[cat].icon}</span>
            {unitCategories[cat].name}
          </button>
        ))}
      </div>

      {/* Converter */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-end">
          {/* From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-teal-500"
            >
              {units.map(([key, unit]) => (
                <option key={key} value={key}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-4 text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-center"
              placeholder="Enter value"
            />
            <div className="text-center mt-2 text-gray-500">
              {currentCategory.units[fromUnit]?.symbol}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapUnits}
              className="p-4 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 transition-colors"
            >
              ⇄
            </button>
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-teal-500"
            >
              {units.map(([key, unit]) => (
                <option key={key} value={key}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
            <div className="w-full p-4 text-2xl font-bold bg-teal-50 border border-teal-200 rounded-lg text-center text-teal-700">
              {result || '0'}
            </div>
            <div className="text-center mt-2 text-gray-500">
              {currentCategory.units[toUnit]?.symbol}
            </div>
          </div>
        </div>

        {/* Conversion Formula */}
        {inputValue && result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
            <span className="text-gray-600">
              {inputValue} {currentCategory.units[fromUnit]?.symbol} = {result} {currentCategory.units[toUnit]?.symbol}
            </span>
          </div>
        )}
      </div>

      {/* Quick Reference */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Reference: {currentCategory.name}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {units.slice(0, 8).map(([key, unit]) => (
            <div key={key} className="bg-white rounded-lg p-3 text-center">
              <div className="font-semibold text-teal-700">{unit.symbol}</div>
              <div className="text-sm text-gray-600">{unit.name}</div>
            </div>
          ))}
        </div>
      </div>

      

      {/* Mobile MREC2 - Before FAQs */}


      

      <GameAppMobileMrec2 />



      

      {/* FAQs Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="unit-converter-simple" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
