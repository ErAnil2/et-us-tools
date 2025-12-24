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
const US_FL_OZ_TO_ML = 29.5735;
const UK_FL_OZ_TO_ML = 28.4131;

export default function OzMlConverterCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('oz-ml-converter-calculator');

  const [fromValue, setFromValue] = useState<string>('8');
  const [fromUnit, setFromUnit] = useState<string>('us-oz');
  const [toUnit, setToUnit] = useState<string>('ml');
  const [result, setResult] = useState<number>(0);

  const convert = (value: number, from: string, to: string): number => {
    if (from === to) return value;

    let mL: number;
    if (from === 'ml') {
      mL = value;
    } else if (from === 'us-oz') {
      mL = value * US_FL_OZ_TO_ML;
    } else {
      mL = value * UK_FL_OZ_TO_ML;
    }

    if (to === 'ml') {
      return mL;
    } else if (to === 'us-oz') {
      return mL / US_FL_OZ_TO_ML;
    } else {
      return mL / UK_FL_OZ_TO_ML;
    }
  };

  const getUnitLabel = (unit: string): string => {
    switch (unit) {
      case 'ml': return 'mL';
      case 'us-oz': return 'US fl oz';
      case 'uk-oz': return 'UK fl oz';
      default: return unit;
    }
  };

  const getFormula = (): string => {
    const value = parseFloat(fromValue) || 0;

    if (fromUnit === toUnit) {
      return 'Same unit - no conversion needed';
    } else if (fromUnit === 'us-oz' && toUnit === 'ml') {
      return `${value} US fl oz x 29.5735 = ${result.toFixed(2)} mL`;
    } else if (fromUnit === 'uk-oz' && toUnit === 'ml') {
      return `${value} UK fl oz x 28.4131 = ${result.toFixed(2)} mL`;
    } else if (fromUnit === 'ml' && toUnit === 'us-oz') {
      return `${value} mL / 29.5735 = ${result.toFixed(2)} US fl oz`;
    } else if (fromUnit === 'ml' && toUnit === 'uk-oz') {
      return `${value} mL / 28.4131 = ${result.toFixed(2)} UK fl oz`;
    } else if (fromUnit === 'us-oz' && toUnit === 'uk-oz') {
      return `${value} US fl oz x 29.5735 / 28.4131 = ${result.toFixed(2)} UK fl oz`;
    } else if (fromUnit === 'uk-oz' && toUnit === 'us-oz') {
      return `${value} UK fl oz x 28.4131 / 29.5735 = ${result.toFixed(2)} US fl oz`;
    }
    return '';
  };

  useEffect(() => {
    const value = parseFloat(fromValue) || 0;
    const converted = convert(value, fromUnit, toUnit);
    setResult(converted);
  }, [fromValue, fromUnit, toUnit]);

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(result.toFixed(2));
  };

  const handlePresetClick = (value: string, unit: string) => {
    setFromUnit(unit);
    setToUnit(unit === 'ml' ? 'us-oz' : 'ml');
    setFromValue(value);
  };

  const toLabel = getUnitLabel(toUnit);

  const relatedCalculators = [
    { href: '/us/tools/calculators/ml-to-oz-converter-calculator', title: 'ML to OZ Converter', description: 'Convert ml to oz' },
    { href: '/us/tools/calculators/cooking-measurement-converter', title: 'Cooking Converter', description: 'Kitchen conversions' },
    { href: '/us/tools/calculators/unit-converter', title: 'Unit Converter', description: 'Convert all units' },
    { href: '/us/tools/calculators/weight-converter', title: 'Weight Converter', description: 'Convert weights' },
    { href: '/us/tools/calculators/temperature-converter', title: 'Temperature Converter', description: 'Convert temperatures' },
    { href: '/us/tools/calculators/length-converter', title: 'Length Converter', description: 'Convert lengths' }
  ];

  const fallbackFaqs = [
    {
    id: '1',
    question: 'How many mL in 1 US fluid ounce?',
      answer: 'One US fluid ounce equals exactly 29.5735 mL. For quick mental math, you can round to 30 mL per fluid ounce, which is accurate enough for most cooking purposes.',
    order: 1
  },
    {
    id: '2',
    question: 'How many mL in 8 fluid ounces (1 cup)?',
      answer: 'Eight US fluid ounces equal approximately 237 mL. This is the standard US cup measurement. UK cups are larger at about 284 mL (10 UK fluid ounces).',
    order: 2
  },
    {
    id: '3',
    question: 'What is the difference between fluid ounces and ounces?',
      answer: 'Fluid ounces (fl oz) measure volume, while ounces (oz) measure weight. One fluid ounce of water weighs approximately one ounce, but this relationship does not hold for other liquids with different densities.',
    order: 3
  },
    {
    id: '4',
    question: 'Why are US and UK fluid ounces different?',
      answer: 'The US customary system and Imperial system developed independently. The US fluid ounce (29.5735 mL) is based on the wine gallon, while the UK fluid ounce (28.4131 mL) is based on the Imperial gallon, resulting in a 4% difference.',
    order: 4
  },
    {
    id: '5',
    question: 'How do I convert fluid ounces to mL?',
      answer: 'To convert US fluid ounces to mL, multiply by 29.5735. For UK fluid ounces, multiply by 28.4131. For example, 8 US fl oz x 29.5735 = 236.59 mL.',
    order: 5
  }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "OZ to ML Converter",
          "description": "Free fluid ounces to milliliters converter. Convert US and UK fluid ounces to mL for cooking, medicine, and science.",
          "url": "https://calculatorhub.com/us/tools/calculators/oz-ml-converter-calculator",
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
            { "@type": "ListItem", "position": 3, "name": "OZ to ML Converter", "item": "https://calculatorhub.com/us/tools/calculators/oz-ml-converter-calculator" }
          ]
        })
      }} />

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">{getH1('Ounces to Milliliters Converter')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert fluid ounces to milliliters with precision for cooking, medicine, and science. Supports both US and UK fluid ounces.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Converter Card */}

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="oz-ml-converter-calculator" fallbackFaqs={fallbackFaqs} />
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
