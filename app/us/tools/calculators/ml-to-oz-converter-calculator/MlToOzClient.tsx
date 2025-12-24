'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color: string;
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

export default function MlToOzClient() {
  const { getH1, getSubHeading } = usePageSEO('ml-to-oz-converter-calculator');

  const [fromValue, setFromValue] = useState<string>('100');
  const [fromUnit, setFromUnit] = useState<string>('ml');
  const [toUnit, setToUnit] = useState<string>('us-oz');
  const [result, setResult] = useState<number>(0);

  const convert = (value: number, fromUnitVal: string, toUnitVal: string): number => {
    if (fromUnitVal === toUnitVal) return value;

    let mL: number;
    if (fromUnitVal === 'ml') {
      mL = value;
    } else if (fromUnitVal === 'us-oz') {
      mL = value * US_FL_OZ_TO_ML;
    } else {
      mL = value * UK_FL_OZ_TO_ML;
    }

    if (toUnitVal === 'ml') {
      return mL;
    } else if (toUnitVal === 'us-oz') {
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
    } else if (fromUnit === 'ml' && toUnit === 'us-oz') {
      return `${value} mL / 29.5735 = ${result.toFixed(2)} US fl oz`;
    } else if (fromUnit === 'ml' && toUnit === 'uk-oz') {
      return `${value} mL / 28.4131 = ${result.toFixed(2)} UK fl oz`;
    } else if (fromUnit === 'us-oz' && toUnit === 'ml') {
      return `${value} US fl oz x 29.5735 = ${result.toFixed(2)} mL`;
    } else if (fromUnit === 'uk-oz' && toUnit === 'ml') {
      return `${value} UK fl oz x 28.4131 = ${result.toFixed(2)} mL`;
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

  const swapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(result.toFixed(2));
  };

  const handlePresetClick = (value: string, unit: string) => {
    setFromUnit(unit);
    setToUnit(unit === 'ml' ? 'us-oz' : 'ml');
    setFromValue(value);
  };

  const toLabel = getUnitLabel(toUnit);

  const relatedCalculators = [
    { href: '/us/tools/calculators/oz-ml-converter-calculator', title: 'OZ to ML Converter', description: 'Convert oz to ml' },
    { href: '/us/tools/calculators/cooking-measurement-converter', title: 'Cooking Converter', description: 'Kitchen conversions' },
    { href: '/us/tools/calculators/unit-converter', title: 'Unit Converter', description: 'Convert all units' },
    { href: '/us/tools/calculators/weight-converter', title: 'Weight Converter', description: 'Convert weights' },
    { href: '/us/tools/calculators/temperature-converter', title: 'Temperature Converter', description: 'Convert temperatures' },
    { href: '/us/tools/calculators/length-converter', title: 'Length Converter', description: 'Convert lengths' }
  ];

  const fallbackFaqs = [
    {
    id: '1',
    question: 'How many ml in 1 fluid ounce?',
      answer: 'One US fluid ounce equals 29.5735 mL, while one UK (Imperial) fluid ounce equals 28.4131 mL. The US fluid ounce is slightly larger than the UK fluid ounce. For quick approximation, 1 fl oz is about 30 mL.',
    order: 1
  },
    {
    id: '2',
    question: 'What is the difference between US and UK fluid ounces?',
      answer: 'US fluid ounces (29.5735 mL) are based on the US customary system, while UK fluid ounces (28.4131 mL) are based on the Imperial system. The difference is about 4%, which can matter in precise measurements like medicine or baking.',
    order: 2
  },
    {
    id: '3',
    question: 'How do I convert milliliters to fluid ounces?',
      answer: 'To convert mL to US fluid ounces, divide by 29.5735. For UK fluid ounces, divide by 28.4131. For example, 100 mL = 100 / 29.5735 = 3.38 US fl oz.',
    order: 3
  },
    {
    id: '4',
    question: 'Why is mL used instead of fluid ounces in medicine?',
      answer: 'Milliliters are the standard for medicine because the metric system is more precise and universal. Using mL reduces confusion between US and UK measurements and allows for more accurate dosing, especially for medications where small differences matter.',
    order: 4
  },
    {
    id: '5',
    question: 'How many mL in a cup?',
      answer: 'A US cup equals approximately 237 mL (8 US fluid ounces), while a UK cup equals approximately 284 mL (10 UK fluid ounces). When following recipes, always check which measurement system is being used.',
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
          "name": "ML to OZ Converter",
          "description": "Free milliliters to fluid ounces converter. Convert mL to US and UK fluid ounces for cooking, medicine, and beverage measurements.",
          "url": "https://calculatorhub.com/us/tools/calculators/ml-to-oz-converter-calculator",
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
            { "@type": "ListItem", "position": 3, "name": "ML to OZ Converter", "item": "https://calculatorhub.com/us/tools/calculators/ml-to-oz-converter-calculator" }
          ]
        })
      }} />

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">{getH1('Milliliters to Ounces Converter')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert milliliters to fluid ounces for cooking, medicine, and beverage measurements. Supports both US and UK fluid ounces.
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
        <FirebaseFAQs pageId="ml-to-oz-converter-calculator" fallbackFaqs={fallbackFaqs} />
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
