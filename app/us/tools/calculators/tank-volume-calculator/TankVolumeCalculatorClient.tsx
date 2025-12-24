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

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];
const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Tank Volume Calculator?",
    answer: "A Tank Volume Calculator is a mathematical tool that helps you quickly calculate or convert tank volume-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Tank Volume Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Tank Volume Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
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
    answer: "Yes, this Tank Volume Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function TankVolumeCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('tank-volume-calculator');

  const [tankType, setTankType] = useState('cylinder');
  const [length, setLength] = useState(10);
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(5);
  const [diameter, setDiameter] = useState(6);
  const [unit, setUnit] = useState('feet');

  const [results, setResults] = useState({
    volumeCubicFeet: 0,
    volumeGallons: 0,
    volumeLiters: 0,
    volumeCubicMeters: 0
  });

  useEffect(() => {
    calculateVolume();
  }, [tankType, length, width, height, diameter, unit]);

  const calculateVolume = () => {
    let volumeCubicFeet = 0;
    const radius = diameter / 2;

    // Convert to feet if needed
    let conversionFactor = 1;
    if (unit === 'inches') conversionFactor = 1 / 12;
    else if (unit === 'meters') conversionFactor = 3.28084;
    else if (unit === 'centimeters') conversionFactor = 0.0328084;

    const l = length * conversionFactor;
    const w = width * conversionFactor;
    const h = height * conversionFactor;
    const r = radius * conversionFactor;
    const d = diameter * conversionFactor;

    switch (tankType) {
      case 'cylinder':
        // Horizontal cylinder: V = π × r² × length
        volumeCubicFeet = Math.PI * Math.pow(r, 2) * l;
        break;
      case 'cylinderVertical':
        // Vertical cylinder: V = π × r² × height
        volumeCubicFeet = Math.PI * Math.pow(r, 2) * h;
        break;
      case 'rectangular':
        // Rectangular: V = length × width × height
        volumeCubicFeet = l * w * h;
        break;
      case 'sphere':
        // Sphere: V = (4/3) × π × r³
        volumeCubicFeet = (4 / 3) * Math.PI * Math.pow(r, 3);
        break;
      case 'cone':
        // Cone: V = (1/3) × π × r² × height
        volumeCubicFeet = (1 / 3) * Math.PI * Math.pow(r, 2) * h;
        break;
      case 'capsule':
        // Capsule: V = π × r² × (length + (4/3) × r)
        volumeCubicFeet = Math.PI * Math.pow(r, 2) * (l + (4 / 3) * r);
        break;
    }

    setResults({
      volumeCubicFeet,
      volumeGallons: volumeCubicFeet * 7.48052,
      volumeLiters: volumeCubicFeet * 28.3168,
      volumeCubicMeters: volumeCubicFeet * 0.0283168
    });
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals }).format(num);
  };

  const relatedCalculators = [
    { href: '/us/tools/calculators/volume-calculator', title: 'Volume Calculator', description: 'Calculate volumes', color: 'bg-blue-600' },
    { href: '/us/tools/calculators/area-calculator', title: 'Area Calculator', description: 'Calculate areas', color: 'bg-green-600' },
    { href: '/us/tools/calculators/cylinder-volume-calculator', title: 'Cylinder Volume', description: 'Calculate cylinder volume', color: 'bg-purple-600' },
    { href: '/us/tools/calculators/unit-converter', title: 'Unit Converter', description: 'Convert units', color: 'bg-orange-500' },
    { href: '/us/tools/calculators/circumference-calculator', title: 'Circumference', description: 'Calculate circumference', color: 'bg-teal-600' },
    { href: '/us/tools/calculators/square-footage-calculator', title: 'Square Footage', description: 'Calculate square footage', color: 'bg-red-500' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Tank Volume Calculator')}</h1>
        <p className="text-lg text-gray-600">Calculate the volume capacity of various tank shapes</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tank Dimensions</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tank Type</label>
              <select
                value={tankType}
                onChange={(e) => setTankType(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option value="cylinder">Horizontal Cylinder</option>
                <option value="cylinderVertical">Vertical Cylinder</option>
                <option value="rectangular">Rectangular</option>
                <option value="sphere">Sphere</option>
                <option value="cone">Cone</option>
                <option value="capsule">Capsule</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit of Measurement</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option value="feet">Feet</option>
                <option value="inches">Inches</option>
                <option value="meters">Meters</option>
                <option value="centimeters">Centimeters</option>
              </select>
            </div>

            {(tankType === 'cylinder' || tankType === 'cylinderVertical' || tankType === 'sphere' || tankType === 'cone' || tankType === 'capsule') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diameter: {diameter} {unit}</label>
                <input
                  type="number"
                  value={diameter}
                  onChange={(e) => setDiameter(Number(e.target.value))}
                  className="w-full px-4 py-3 border rounded-lg"
                  min="0"
                  step="0.1"
                />
              </div>
            )}

            {(tankType === 'cylinder' || tankType === 'capsule') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Length: {length} {unit}</label>
                <input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full px-4 py-3 border rounded-lg"
                  min="0"
                  step="0.1"
                />
              </div>
            )}

            {(tankType === 'cylinderVertical' || tankType === 'cone' || tankType === 'rectangular') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height: {height} {unit}</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full px-4 py-3 border rounded-lg"
                  min="0"
                  step="0.1"
                />
              </div>
            )}

            {tankType === 'rectangular' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Length: {length} {unit}</label>
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full px-4 py-3 border rounded-lg"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Width: {width} {unit}</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full px-4 py-3 border rounded-lg"
                    min="0"
                    step="0.1"
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Tank Capacity</h2>

            <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 mb-4">
              <div className="text-sm text-blue-600 mb-1">Total Volume</div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700">{formatNumber(results.volumeGallons)} gal</div>
              <div className="text-sm text-blue-600 mt-2">{formatNumber(results.volumeCubicFeet)} cubic feet</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Cubic Feet</span>
                <span className="font-semibold text-gray-800">{formatNumber(results.volumeCubicFeet)} ft³</span>
              </div>
              <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-700">US Gallons</span>
                <span className="font-bold text-blue-800">{formatNumber(results.volumeGallons)} gal</span>
              </div>
              <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-green-700">Liters</span>
                <span className="font-bold text-green-800">{formatNumber(results.volumeLiters)} L</span>
              </div>
              <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-purple-700">Cubic Meters</span>
                <span className="font-bold text-purple-800">{formatNumber(results.volumeCubicMeters)} m³</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Volume Formulas</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Cylinder:</strong> V = π × r² × h</p>
                <p><strong>Rectangular:</strong> V = l × w × h</p>
                <p><strong>Sphere:</strong> V = (4/3) × π × r³</p>
                <p><strong>Cone:</strong> V = (1/3) × π × r² × h</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">🛢️</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="tank-volume-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
</div>
  );
}
