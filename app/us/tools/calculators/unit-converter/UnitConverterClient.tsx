'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface UnitData {
  symbol: string;
  factor: number;
  name: string;
}

interface Category {
  name: string;
  base: string;
  units: { [key: string]: UnitData };
  quickConversions: {
    from: number;
    fromUnit: string;
    toUnit: string;
    label: string;
  }[];
}

interface Units {
  [key: string]: Category;
}

export default function UnitConverterClient() {
  const { getH1, getSubHeading } = usePageSEO('unit-converter');

  const units: Units = {
    length: {
      name: 'Length',
      base: 'meter',
      units: {
        'nanometer': { symbol: 'nm', factor: 1e-9, name: 'Nanometer' },
        'micrometer': { symbol: 'um', factor: 1e-6, name: 'Micrometer' },
        'millimeter': { symbol: 'mm', factor: 0.001, name: 'Millimeter' },
        'centimeter': { symbol: 'cm', factor: 0.01, name: 'Centimeter' },
        'meter': { symbol: 'm', factor: 1, name: 'Meter' },
        'kilometer': { symbol: 'km', factor: 1000, name: 'Kilometer' },
        'inch': { symbol: 'in', factor: 0.0254, name: 'Inch' },
        'foot': { symbol: 'ft', factor: 0.3048, name: 'Foot' },
        'yard': { symbol: 'yd', factor: 0.9144, name: 'Yard' },
        'mile': { symbol: 'mi', factor: 1609.344, name: 'Mile' },
        'nautical-mile': { symbol: 'nmi', factor: 1852, name: 'Nautical Mile' },
        'light-year': { symbol: 'ly', factor: 9.461e15, name: 'Light Year' }
      },
      quickConversions: [
        { from: 1, fromUnit: 'meter', toUnit: 'foot', label: '1 m to ft' },
        { from: 1, fromUnit: 'inch', toUnit: 'centimeter', label: '1 in to cm' },
        { from: 1, fromUnit: 'kilometer', toUnit: 'mile', label: '1 km to mi' },
        { from: 1, fromUnit: 'foot', toUnit: 'meter', label: '1 ft to m' }
      ]
    },

    weight: {
      name: 'Weight/Mass',
      base: 'kilogram',
      units: {
        'milligram': { symbol: 'mg', factor: 1e-6, name: 'Milligram' },
        'gram': { symbol: 'g', factor: 0.001, name: 'Gram' },
        'kilogram': { symbol: 'kg', factor: 1, name: 'Kilogram' },
        'metric-ton': { symbol: 't', factor: 1000, name: 'Metric Ton' },
        'ounce': { symbol: 'oz', factor: 0.0283495, name: 'Ounce' },
        'pound': { symbol: 'lb', factor: 0.453592, name: 'Pound' },
        'stone': { symbol: 'st', factor: 6.35029, name: 'Stone' },
        'us-ton': { symbol: 'ton', factor: 907.185, name: 'US Ton' },
        'carat': { symbol: 'ct', factor: 0.0002, name: 'Carat' }
      },
      quickConversions: [
        { from: 1, fromUnit: 'kilogram', toUnit: 'pound', label: '1 kg to lb' },
        { from: 1, fromUnit: 'pound', toUnit: 'kilogram', label: '1 lb to kg' },
        { from: 100, fromUnit: 'gram', toUnit: 'ounce', label: '100 g to oz' },
        { from: 1, fromUnit: 'stone', toUnit: 'kilogram', label: '1 st to kg' }
      ]
    },

    temperature: {
      name: 'Temperature',
      base: 'celsius',
      units: {
        'celsius': { symbol: 'C', factor: 1, name: 'Celsius' },
        'fahrenheit': { symbol: 'F', factor: 1, name: 'Fahrenheit' },
        'kelvin': { symbol: 'K', factor: 1, name: 'Kelvin' },
        'rankine': { symbol: 'R', factor: 1, name: 'Rankine' }
      },
      quickConversions: [
        { from: 0, fromUnit: 'celsius', toUnit: 'fahrenheit', label: '0C to F' },
        { from: 100, fromUnit: 'celsius', toUnit: 'fahrenheit', label: '100C to F' },
        { from: 32, fromUnit: 'fahrenheit', toUnit: 'celsius', label: '32F to C' },
        { from: 0, fromUnit: 'celsius', toUnit: 'kelvin', label: '0C to K' }
      ]
    },

    area: {
      name: 'Area',
      base: 'square-meter',
      units: {
        'square-millimeter': { symbol: 'mm2', factor: 1e-6, name: 'Square Millimeter' },
        'square-centimeter': { symbol: 'cm2', factor: 1e-4, name: 'Square Centimeter' },
        'square-meter': { symbol: 'm2', factor: 1, name: 'Square Meter' },
        'hectare': { symbol: 'ha', factor: 10000, name: 'Hectare' },
        'square-kilometer': { symbol: 'km2', factor: 1e6, name: 'Square Kilometer' },
        'square-inch': { symbol: 'in2', factor: 0.00064516, name: 'Square Inch' },
        'square-foot': { symbol: 'ft2', factor: 0.092903, name: 'Square Foot' },
        'square-yard': { symbol: 'yd2', factor: 0.836127, name: 'Square Yard' },
        'acre': { symbol: 'ac', factor: 4046.86, name: 'Acre' },
        'square-mile': { symbol: 'mi2', factor: 2.59e6, name: 'Square Mile' }
      },
      quickConversions: [
        { from: 1, fromUnit: 'square-meter', toUnit: 'square-foot', label: '1 m2 to ft2' },
        { from: 1, fromUnit: 'acre', toUnit: 'hectare', label: '1 ac to ha' },
        { from: 1, fromUnit: 'hectare', toUnit: 'acre', label: '1 ha to ac' },
        { from: 100, fromUnit: 'square-foot', toUnit: 'square-meter', label: '100 ft2 to m2' }
      ]
    },

    volume: {
      name: 'Volume',
      base: 'liter',
      units: {
        'milliliter': { symbol: 'ml', factor: 0.001, name: 'Milliliter' },
        'liter': { symbol: 'L', factor: 1, name: 'Liter' },
        'cubic-meter': { symbol: 'm3', factor: 1000, name: 'Cubic Meter' },
        'fluid-ounce-uk': { symbol: 'fl oz (UK)', factor: 0.0284131, name: 'Fluid Ounce (UK)' },
        'pint-uk': { symbol: 'pt (UK)', factor: 0.568261, name: 'Pint (UK)' },
        'gallon-uk': { symbol: 'gal (UK)', factor: 4.54609, name: 'Gallon (UK)' },
        'fluid-ounce-us': { symbol: 'fl oz (US)', factor: 0.0295735, name: 'Fluid Ounce (US)' },
        'cup-us': { symbol: 'cup (US)', factor: 0.236588, name: 'Cup (US)' },
        'pint-us': { symbol: 'pt (US)', factor: 0.473176, name: 'Pint (US)' },
        'quart-us': { symbol: 'qt (US)', factor: 0.946353, name: 'Quart (US)' },
        'gallon-us': { symbol: 'gal (US)', factor: 3.78541, name: 'Gallon (US)' }
      },
      quickConversions: [
        { from: 1, fromUnit: 'liter', toUnit: 'gallon-us', label: '1 L to gal (US)' },
        { from: 1, fromUnit: 'gallon-us', toUnit: 'liter', label: '1 gal to L' },
        { from: 1, fromUnit: 'cup-us', toUnit: 'milliliter', label: '1 cup to ml' },
        { from: 500, fromUnit: 'milliliter', toUnit: 'pint-us', label: '500 ml to pt' }
      ]
    },

    speed: {
      name: 'Speed',
      base: 'meter-per-second',
      units: {
        'meter-per-second': { symbol: 'm/s', factor: 1, name: 'Meter per Second' },
        'kilometer-per-hour': { symbol: 'km/h', factor: 0.277778, name: 'Kilometer per Hour' },
        'mile-per-hour': { symbol: 'mph', factor: 0.44704, name: 'Mile per Hour' },
        'foot-per-second': { symbol: 'ft/s', factor: 0.3048, name: 'Foot per Second' },
        'knot': { symbol: 'kn', factor: 0.514444, name: 'Knot' },
        'mach': { symbol: 'Ma', factor: 343, name: 'Mach (speed of sound)' }
      },
      quickConversions: [
        { from: 100, fromUnit: 'kilometer-per-hour', toUnit: 'mile-per-hour', label: '100 km/h to mph' },
        { from: 60, fromUnit: 'mile-per-hour', toUnit: 'kilometer-per-hour', label: '60 mph to km/h' },
        { from: 10, fromUnit: 'meter-per-second', toUnit: 'kilometer-per-hour', label: '10 m/s to km/h' },
        { from: 1, fromUnit: 'mach', toUnit: 'kilometer-per-hour', label: '1 Ma to km/h' }
      ]
    },

    pressure: {
      name: 'Pressure',
      base: 'pascal',
      units: {
        'pascal': { symbol: 'Pa', factor: 1, name: 'Pascal' },
        'kilopascal': { symbol: 'kPa', factor: 1000, name: 'Kilopascal' },
        'megapascal': { symbol: 'MPa', factor: 1e6, name: 'Megapascal' },
        'bar': { symbol: 'bar', factor: 100000, name: 'Bar' },
        'atmosphere': { symbol: 'atm', factor: 101325, name: 'Atmosphere' },
        'torr': { symbol: 'Torr', factor: 133.322, name: 'Torr' },
        'psi': { symbol: 'psi', factor: 6895, name: 'Pound per Square Inch' },
        'mmhg': { symbol: 'mmHg', factor: 133.322, name: 'Millimeter of Mercury' }
      },
      quickConversions: [
        { from: 1, fromUnit: 'bar', toUnit: 'psi', label: '1 bar to psi' },
        { from: 1, fromUnit: 'atmosphere', toUnit: 'pascal', label: '1 atm to Pa' },
        { from: 30, fromUnit: 'psi', toUnit: 'bar', label: '30 psi to bar' },
        { from: 760, fromUnit: 'mmhg', toUnit: 'atmosphere', label: '760 mmHg to atm' }
      ]
    },

    energy: {
      name: 'Energy',
      base: 'joule',
      units: {
        'joule': { symbol: 'J', factor: 1, name: 'Joule' },
        'kilojoule': { symbol: 'kJ', factor: 1000, name: 'Kilojoule' },
        'calorie': { symbol: 'cal', factor: 4.184, name: 'Calorie' },
        'kilocalorie': { symbol: 'kcal', factor: 4184, name: 'Kilocalorie' },
        'watt-hour': { symbol: 'Wh', factor: 3600, name: 'Watt Hour' },
        'kilowatt-hour': { symbol: 'kWh', factor: 3.6e6, name: 'Kilowatt Hour' },
        'btu': { symbol: 'BTU', factor: 1055.06, name: 'British Thermal Unit' },
        'foot-pound': { symbol: 'ft-lb', factor: 1.35582, name: 'Foot-Pound' }
      },
      quickConversions: [
        { from: 1, fromUnit: 'kilowatt-hour', toUnit: 'joule', label: '1 kWh to J' },
        { from: 1000, fromUnit: 'calorie', toUnit: 'joule', label: '1000 cal to J' },
        { from: 1, fromUnit: 'btu', toUnit: 'kilojoule', label: '1 BTU to kJ' },
        { from: 1, fromUnit: 'kilocalorie', toUnit: 'kilojoule', label: '1 kcal to kJ' }
      ]
    }
  };

  const categoryLabels: { [key: string]: string } = {
    length: 'Length',
    weight: 'Weight',
    temperature: 'Temperature',
    area: 'Area',
    volume: 'Volume',
    speed: 'Speed',
    pressure: 'Pressure',
    energy: 'Energy'
  };

  const [currentCategory, setCurrentCategory] = useState<keyof Units>('length');
  const [fromValue, setFromValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('foot');
  const [toValue, setToValue] = useState('');
  const [precision, setPrecision] = useState('4');

  useEffect(() => {
    const unitKeys = Object.keys(units[currentCategory].units);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1] || unitKeys[0]);
  }, [currentCategory]);

  useEffect(() => {
    convert();
  }, [fromValue, fromUnit, toUnit, precision, currentCategory]);

  const convertTemperature = (value: number, from: string, to: string): number => {
    let celsius: number;
    switch(from) {
      case 'celsius':
        celsius = value;
        break;
      case 'fahrenheit':
        celsius = (value - 32) * 5/9;
        break;
      case 'kelvin':
        celsius = value - 273.15;
        break;
      case 'rankine':
        celsius = (value - 491.67) * 5/9;
        break;
      default:
        celsius = value;
    }

    switch(to) {
      case 'celsius':
        return celsius;
      case 'fahrenheit':
        return celsius * 9/5 + 32;
      case 'kelvin':
        return celsius + 273.15;
      case 'rankine':
        return celsius * 9/5 + 491.67;
      default:
        return celsius;
    }
  };

  const formatResult = (value: number): string => {
    if (isNaN(value) || !isFinite(value)) return 'Invalid';

    const precisionNum = parseInt(precision) || 4;
    if (Math.abs(value) >= 1e10 || (Math.abs(value) < 0.0001 && value !== 0)) {
      return value.toExponential(precisionNum);
    }
    return parseFloat(value.toFixed(precisionNum)).toString();
  };

  const convert = () => {
    const value = parseFloat(fromValue) || 0;
    let result: number;

    if (currentCategory === 'temperature') {
      result = convertTemperature(value, fromUnit, toUnit);
    } else {
      const fromFactor = units[currentCategory].units[fromUnit].factor;
      const toFactor = units[currentCategory].units[toUnit].factor;
      result = (value * fromFactor) / toFactor;
    }

    setToValue(formatResult(result));
  };

  const swapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(toValue.replace(/[^\d.-]/g, ''));
  };

  const handleQuickConversion = (conv: { from: number; fromUnit: string; toUnit: string }) => {
    setFromValue(conv.from.toString());
    setFromUnit(conv.fromUnit);
    setToUnit(conv.toUnit);
  };

  const getConversionTable = () => {
    const fromUnitData = units[currentCategory].units[fromUnit];

    return Object.keys(units[currentCategory].units)
      .filter(unit => unit !== fromUnit)
      .slice(0, 8)
      .map(unit => {
        const unitData = units[currentCategory].units[unit];
        let value: number;

        if (currentCategory === 'temperature') {
          value = convertTemperature(1, fromUnit, unit);
        } else {
          value = fromUnitData.factor / unitData.factor;
        }

        return {
          name: unitData.name,
          symbol: unitData.symbol,
          value: formatResult(value)
        };
      });
  };

  const relatedCalculators = [
    { href: '/us/tools/calculators/length-converter', title: 'Length Converter', description: 'Convert length units' },
    { href: '/us/tools/calculators/weight-converter', title: 'Weight Converter', description: 'Convert weight units' },
    { href: '/us/tools/calculators/temperature-converter', title: 'Temperature Converter', description: 'Convert temperatures' },
    { href: '/us/tools/calculators/currency-converter', title: 'Currency Converter', description: 'Convert currencies' },
    { href: '/us/tools/calculators/area-calculator', title: 'Area Calculator', description: 'Calculate areas' },
    { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages' }
  ];

  const fallbackFaqs = [
    {
    id: '1',
    question: 'What is the difference between metric and imperial units?',
      answer: 'The metric system (SI) is based on multiples of 10 and is used by most countries worldwide. It includes units like meters, kilograms, and liters. The imperial system, used mainly in the US and UK, includes units like feet, pounds, and gallons. The metric system is generally easier to convert within because of its decimal base.',
    order: 1
  },
    {
    id: '2',
    question: 'How do I convert between Celsius and Fahrenheit?',
      answer: 'To convert Celsius to Fahrenheit, multiply by 9/5 and add 32. For example, 20C = (20 x 9/5) + 32 = 68F. To convert Fahrenheit to Celsius, subtract 32 and multiply by 5/9. For example, 68F = (68 - 32) x 5/9 = 20C. Key reference points: water freezes at 0C/32F and boils at 100C/212F.',
    order: 2
  },
    {
    id: '3',
    question: 'What is the relationship between liters and gallons?',
      answer: 'One US gallon equals approximately 3.785 liters, while one UK (imperial) gallon equals approximately 4.546 liters. The UK gallon is about 20% larger than the US gallon. When converting fuel economy, remember that mpg values will differ between US and UK measurements.',
    order: 3
  },
    {
    id: '4',
    question: 'How accurate are these unit conversions?',
      answer: 'Our converter uses standard conversion factors recognized by international standards organizations like NIST and BIPM. The results are accurate to the precision level you select (up to 8 decimal places). For most practical applications, 4 decimal places provide sufficient accuracy.',
    order: 4
  },
    {
    id: '5',
    question: 'What is a nautical mile and how does it differ from a regular mile?',
      answer: 'A nautical mile is based on the circumference of the Earth and equals 1.852 kilometers or about 1.151 regular (statute) miles. It is used in aviation and marine navigation because it corresponds to one minute of latitude. A statute mile is 1.609 kilometers or 5,280 feet.',
    order: 5
  }
  ];

  const conversionTable = getConversionTable();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Unit Converter",
          "description": "Free online unit converter for length, weight, temperature, area, volume, speed, pressure, and energy. Convert between metric and imperial units instantly.",
          "url": "https://calculatorhub.com/us/tools/calculators/unit-converter",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Any",
          "permissions": "browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        })
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": fallbackFaqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calculatorhub.com" },
            { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://calculatorhub.com/us/tools/calculators" },
            { "@type": "ListItem", "position": 3, "name": "Unit Converter", "item": "https://calculatorhub.com/us/tools/calculators/unit-converter" }
          ]
        })
      }} />

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">{getH1('Unit Converter')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert between different units of measurement instantly. Support for length, weight, temperature, area, volume, speed, pressure, and energy.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Category Selector */}

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="unit-converter" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Related Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {relatedCalculators.map((calc) => (
              <Link key={calc.href} href={calc.href}>
                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors h-full">
                  <h3 className="font-medium text-gray-900 text-sm">{calc.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{calc.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
