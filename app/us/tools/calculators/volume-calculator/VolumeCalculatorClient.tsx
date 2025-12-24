'use client';

import { useState, useEffect } from 'react';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import Link from 'next/link';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface VolumeCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface ShapeInput {
  name: string;
  label: string;
  value: string;
  unit: string;
}

interface CalculationResult {
  volume: number;
  surfaceArea: number;
}

interface ShapeConfig {
  title: string;
  formula: string;
  inputs: ShapeInput[];
  calculate: (inputs: Record<string, string>) => CalculationResult;
}

interface ShapeInfo {
  info: string;
  apps: string;
}

type ShapeType = 'cube' | 'sphere' | 'cylinder' | 'cone' | 'rectangular' | 'pyramid' | 'triangular' | 'ellipsoid' | 'torus' | 'hemisphere';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Volume Calculator?",
    answer: "A Volume Calculator is a mathematical tool that helps you quickly calculate or convert volume-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Volume Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Volume Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
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
    answer: "Yes, this Volume Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function VolumeCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: VolumeCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('volume-calculator');

  const [selectedShape, setSelectedShape] = useState<ShapeType>('cube');
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [volumeResult, setVolumeResult] = useState<number>(125);
  const [surfaceArea, setSurfaceArea] = useState<number>(150);
  const [formula, setFormula] = useState<string>('V = a³');
  const [formulaDescription, setFormulaDescription] = useState<string>('Cube Volume');
  const [currentShapeInfo, setCurrentShapeInfo] = useState<string>('Cube - All sides equal');
  const [shapeApplications, setShapeApplications] = useState<string>('Boxes, dice, building blocks');

  const shapes: Record<ShapeType, ShapeConfig> = {
    cube: {
      title: 'Cube Volume',
      formula: 'V = a³',
      inputs: [
        { name: 'side', label: 'Side Length (a)', value: '5', unit: 'cm' }
      ],
      calculate: (inputs) => {
        const a = parseFloat(inputs.side) || 0;
        return {
          volume: Math.pow(a, 3),
          surfaceArea: 6 * Math.pow(a, 2)
        };
      }
    },
    sphere: {
      title: 'Sphere Volume',
      formula: 'V = (4/3) × π × r³',
      inputs: [
        { name: 'radius', label: 'Radius (r)', value: '3', unit: 'cm' }
      ],
      calculate: (inputs) => {
        const r = parseFloat(inputs.radius) || 0;
        return {
          volume: (4/3) * Math.PI * Math.pow(r, 3),
          surfaceArea: 4 * Math.PI * Math.pow(r, 2)
        };
      }
    },
    cylinder: {
      title: 'Cylinder Volume',
      formula: 'V = π × r² × h',
      inputs: [
        { name: 'radius', label: 'Radius (r)', value: '3', unit: 'cm' },
        { name: 'height', label: 'Height (h)', value: '8', unit: 'cm' }
      ],
      calculate: (inputs) => {
        const r = parseFloat(inputs.radius) || 0;
        const h = parseFloat(inputs.height) || 0;
        return {
          volume: Math.PI * Math.pow(r, 2) * h,
          surfaceArea: 2 * Math.PI * r * (r + h)
        };
      }
    },
    cone: {
      title: 'Cone Volume',
      formula: 'V = (1/3) × π × r² × h',
      inputs: [
        { name: 'radius', label: 'Base Radius (r)', value: '4', unit: 'cm' },
        { name: 'height', label: 'Height (h)', value: '6', unit: 'cm' }
      ],
      calculate: (inputs) => {
        const r = parseFloat(inputs.radius) || 0;
        const h = parseFloat(inputs.height) || 0;
        const s = Math.sqrt(r * r + h * h);
        return {
          volume: (1/3) * Math.PI * Math.pow(r, 2) * h,
          surfaceArea: Math.PI * r * (r + s)
        };
      }
    },
    rectangular: {
      title: 'Rectangular Prism Volume',
      formula: 'V = l × w × h',
      inputs: [
        { name: 'length', label: 'Length (l)', value: '6', unit: 'cm' },
        { name: 'width', label: 'Width (w)', value: '4', unit: 'cm' },
        { name: 'height', label: 'Height (h)', value: '3', unit: 'cm' }
      ],
      calculate: (inputs) => {
        const l = parseFloat(inputs.length) || 0;
        const w = parseFloat(inputs.width) || 0;
        const h = parseFloat(inputs.height) || 0;
        return {
          volume: l * w * h,
          surfaceArea: 2 * (l * w + w * h + h * l)
        };
      }
    },
    pyramid: {
      title: 'Square Pyramid Volume',
      formula: 'V = (1/3) × a² × h',
      inputs: [
        { name: 'base', label: 'Base Side (a)', value: '4', unit: 'cm' },
        { name: 'height', label: 'Height (h)', value: '6', unit: 'cm' }
      ],
      calculate: (inputs) => {
        const a = parseFloat(inputs.base) || 0;
        const h = parseFloat(inputs.height) || 0;
        const s = Math.sqrt((a/2) * (a/2) + h * h);
        return {
          volume: (1/3) * a * a * h,
          surfaceArea: a * a + 2 * a * s
        };
      }
    },
    triangular: {
      title: 'Triangular Prism Volume',
      formula: 'V = (1/2) × b × h × l',
      inputs: [
        { name: 'base', label: 'Triangle Base (b)', value: '4', unit: 'cm' },
        { name: 'height', label: 'Triangle Height (h)', value: '3', unit: 'cm' },
        { name: 'length', label: 'Prism Length (l)', value: '8', unit: 'cm' }
      ],
      calculate: (inputs) => {
        const b = parseFloat(inputs.base) || 0;
        const h = parseFloat(inputs.height) || 0;
        const l = parseFloat(inputs.length) || 0;
        const triangleArea = 0.5 * b * h;
        const trianglePerimeter = b + Math.sqrt(h*h + (b/2)*(b/2)) * 2;
        return {
          volume: triangleArea * l,
          surfaceArea: 2 * triangleArea + trianglePerimeter * l
        };
      }
    },
    ellipsoid: {
      title: 'Ellipsoid Volume',
      formula: 'V = (4/3) × π × a × b × c',
      inputs: [
        { name: 'a', label: 'Semi-axis A', value: '3', unit: 'cm' },
        { name: 'b', label: 'Semi-axis B', value: '4', unit: 'cm' },
        { name: 'c', label: 'Semi-axis C', value: '5', unit: 'cm' }
      ],
      calculate: (inputs) => {
        const a = parseFloat(inputs.a) || 0;
        const b = parseFloat(inputs.b) || 0;
        const c = parseFloat(inputs.c) || 0;
        return {
          volume: (4/3) * Math.PI * a * b * c,
          surfaceArea: 4 * Math.PI * Math.pow((Math.pow(a*b, 1.6) + Math.pow(a*c, 1.6) + Math.pow(b*c, 1.6))/3, 1/1.6)
        };
      }
    },
    torus: {
      title: 'Torus Volume',
      formula: 'V = 2π² × R × r²',
      inputs: [
        { name: 'major', label: 'Major Radius (R)', value: '5', unit: 'cm' },
        { name: 'minor', label: 'Minor Radius (r)', value: '2', unit: 'cm' }
      ],
      calculate: (inputs) => {
        const R = parseFloat(inputs.major) || 0;
        const r = parseFloat(inputs.minor) || 0;
        return {
          volume: 2 * Math.PI * Math.PI * R * r * r,
          surfaceArea: 4 * Math.PI * Math.PI * R * r
        };
      }
    },
    hemisphere: {
      title: 'Hemisphere Volume',
      formula: 'V = (2/3) × π × r³',
      inputs: [
        { name: 'radius', label: 'Radius (r)', value: '4', unit: 'cm' }
      ],
      calculate: (inputs) => {
        const r = parseFloat(inputs.radius) || 0;
        return {
          volume: (2/3) * Math.PI * Math.pow(r, 3),
          surfaceArea: 3 * Math.PI * Math.pow(r, 2)
        };
      }
    }
  };

  const shapeInfoData: Record<ShapeType, ShapeInfo> = {
    cube: { info: "Cube - All sides equal", apps: "Boxes, dice, building blocks" },
    sphere: { info: "Sphere - Perfect round shape", apps: "Balls, planets, bubbles" },
    cylinder: { info: "Cylinder - Circular base with height", apps: "Cans, pipes, tanks" },
    cone: { info: "Cone - Circular base tapering to point", apps: "Ice cream cones, traffic cones" },
    rectangular: { info: "Rectangular Prism - Box shape", apps: "Rooms, containers, books" },
    pyramid: { info: "Square Pyramid - Square base to point", apps: "Egyptian pyramids, roofs" },
    triangular: { info: "Triangular Prism - Triangle cross-section", apps: "Prisms, architectural supports" },
    ellipsoid: { info: "Ellipsoid - Stretched sphere", apps: "Eggs, rugby balls" },
    torus: { info: "Torus - Donut shape", apps: "Donuts, tires, rings" },
    hemisphere: { info: "Hemisphere - Half sphere", apps: "Domes, bowls, igloos" }
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const convertVolume = (volumeCm3: number) => {
    return {
      cm3: volumeCm3,
      in3: volumeCm3 / 16.387,
      ft3: volumeCm3 / 28316.8,
      l: volumeCm3 / 1000
    };
  };

  const calculateVolume = () => {
    const shape = shapes[selectedShape];
    const result = shape.calculate(inputValues);
    setVolumeResult(result.volume);
    setSurfaceArea(result.surfaceArea);
  };

  const updateInputFields = () => {
    const shape = shapes[selectedShape];
    setFormula(shape.formula);
    setFormulaDescription(shape.title);

    const info = shapeInfoData[selectedShape];
    setCurrentShapeInfo(info.info);
    setShapeApplications(info.apps);

    const newInputs: Record<string, string> = {};
    shape.inputs.forEach(input => {
      newInputs[input.name] = input.value;
    });
    setInputValues(newInputs);
  };

  const setShapeCategory = (category: string) => {
    const categoryShapes: Record<string, ShapeType[]> = {
      basic: ['cube', 'sphere', 'cylinder', 'cone'],
      prism: ['rectangular', 'triangular', 'pyramid'],
      round: ['sphere', 'cylinder', 'torus', 'hemisphere'],
      advanced: ['ellipsoid', 'torus', 'hemisphere', 'triangular']
    };

    if (categoryShapes[category]) {
      const firstShape = categoryShapes[category][0];
      setSelectedShape(firstShape);
    }
  };

  const setExampleValues = (size: string) => {
    const examples: Record<string, Record<ShapeType, Record<string, string>>> = {
      small: {
        cube: { side: '3' },
        sphere: { radius: '2' },
        cylinder: { radius: '2', height: '4' },
        cone: { radius: '2', height: '6' },
        rectangular: { length: '3', width: '2', height: '4' },
        pyramid: { base: '3', height: '5' },
        triangular: { base: '3', height: '2', length: '5' },
        ellipsoid: { a: '2', b: '3', c: '4' },
        torus: { major: '3', minor: '1' },
        hemisphere: { radius: '3' }
      },
      medium: {
        cube: { side: '10' },
        sphere: { radius: '8' },
        cylinder: { radius: '5', height: '12' },
        cone: { radius: '6', height: '15' },
        rectangular: { length: '12', width: '8', height: '10' },
        pyramid: { base: '10', height: '15' },
        triangular: { base: '8', height: '6', length: '12' },
        ellipsoid: { a: '6', b: '8', c: '10' },
        torus: { major: '8', minor: '3' },
        hemisphere: { radius: '10' }
      },
      large: {
        cube: { side: '50' },
        sphere: { radius: '25' },
        cylinder: { radius: '20', height: '40' },
        cone: { radius: '15', height: '30' },
        rectangular: { length: '50', width: '30', height: '25' },
        pyramid: { base: '40', height: '60' },
        triangular: { base: '30', height: '20', length: '40' },
        ellipsoid: { a: '20', b: '25', c: '30' },
        torus: { major: '25', minor: '8' },
        hemisphere: { radius: '30' }
      },
      random: {
        cube: { side: Math.floor(Math.random() * 20 + 5).toString() },
        sphere: { radius: Math.floor(Math.random() * 15 + 3).toString() },
        cylinder: {
          radius: Math.floor(Math.random() * 10 + 2).toString(),
          height: Math.floor(Math.random() * 20 + 5).toString()
        },
        cone: {
          radius: Math.floor(Math.random() * 12 + 3).toString(),
          height: Math.floor(Math.random() * 25 + 8).toString()
        },
        rectangular: {
          length: Math.floor(Math.random() * 15 + 5).toString(),
          width: Math.floor(Math.random() * 12 + 3).toString(),
          height: Math.floor(Math.random() * 18 + 4).toString()
        },
        pyramid: {
          base: Math.floor(Math.random() * 20 + 5).toString(),
          height: Math.floor(Math.random() * 30 + 10).toString()
        },
        triangular: {
          base: Math.floor(Math.random() * 15 + 3).toString(),
          height: Math.floor(Math.random() * 12 + 2).toString(),
          length: Math.floor(Math.random() * 20 + 5).toString()
        },
        ellipsoid: {
          a: Math.floor(Math.random() * 12 + 3).toString(),
          b: Math.floor(Math.random() * 15 + 4).toString(),
          c: Math.floor(Math.random() * 18 + 5).toString()
        },
        torus: {
          major: Math.floor(Math.random() * 15 + 5).toString(),
          minor: Math.floor(Math.random() * 5 + 1).toString()
        },
        hemisphere: {
          radius: Math.floor(Math.random() * 20 + 3).toString()
        }
      }
    };

    const values = examples[size][selectedShape];
    if (values) {
      setInputValues(values);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    updateInputFields();
  }, [selectedShape]);

  useEffect(() => {
    calculateVolume();
  }, [inputValues, selectedShape]);

  const shape = shapes[selectedShape];
  const volumeConverted = convertVolume(volumeResult);
  const gridClass = shape.inputs.length > 2 ? 'grid-cols-1' : 'md:grid-cols-2';

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{getH1('Volume Calculator')}</h1>
        <p className="text-xl text-gray-600">Calculate the volume of 3D shapes with step-by-step formulas</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
        {/* Calculator Section */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">

          {/* Shape Selection Calculator */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">📐 3D Shape Volume Calculator</h3>

            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-blue-800">Shape & Units Selection</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="shapeSelect" className="block text-sm font-medium text-gray-700 mb-1">Select Shape</label>
                    <select
                      id="shapeSelect"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedShape}
                      onChange={(e) => setSelectedShape(e.target.value as ShapeType)}
                    >
                      <option value="cube">Cube</option>
                      <option value="sphere">Sphere</option>
                      <option value="cylinder">Cylinder</option>
                      <option value="cone">Cone</option>
                      <option value="rectangular">Rectangular Prism</option>
                      <option value="pyramid">Square Pyramid</option>
                      <option value="triangular">Triangular Prism</option>
                      <option value="ellipsoid">Ellipsoid</option>
                      <option value="torus">Torus (Donut)</option>
                      <option value="hemisphere">Hemisphere</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="unitSelect" className="block text-sm font-medium text-gray-700 mb-1">Input Units</label>
                    <select id="unitSelect" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="cm">Centimeters (cm)</option>
                      <option value="m">Meters (m)</option>
                      <option value="in">Inches (in)</option>
                      <option value="ft">Feet (ft)</option>
                      <option value="mm">Millimeters (mm)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4" id="inputFieldsContainer">
                <h4 className="font-semibold mb-3 text-green-800">Shape Dimensions</h4>
                <div id="inputFields">
                  <div className={`grid ${gridClass} gap-4`}>
                    {shape.inputs.map(input => (
                      <div key={input.name}>
                        <label htmlFor={input.name} className="block text-sm font-medium text-gray-700 mb-1">{input.label}</label>
                        <input
                          type="number"
                          id={input.name}
                          name={input.name}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={inputValues[input.name] || ''}
                          onChange={(e) => handleInputChange(input.name, e.target.value)}
                          min="0"
                          step="0.01"
                          placeholder={`Enter ${input.label.toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={calculateVolume}
                className="w-full bg-blue-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-lg hover:bg-blue-700 transition"
              >
                Calculate Volume
              </button>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Quick Examples & Categories */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">📋 Quick Examples & Categories</h3>

            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-purple-800">Shape Categories</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition" onClick={() => setShapeCategory('basic')}>Basic Shapes</button>
                  <button className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition" onClick={() => setShapeCategory('prism')}>Prisms</button>
                  <button className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition" onClick={() => setShapeCategory('round')}>Round Objects</button>
                  <button className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition" onClick={() => setShapeCategory('advanced')}>Advanced</button>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-orange-800">Quick Examples</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-3 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition" onClick={() => setExampleValues('small')}>Small Object</button>
                  <button className="px-3 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition" onClick={() => setExampleValues('medium')}>Medium Object</button>
                  <button className="px-3 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition" onClick={() => setExampleValues('large')}>Large Object</button>
                  <button className="px-3 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition" onClick={() => setExampleValues('random')}>Random Values</button>
                </div>
              </div>
            </div>
          </div>

          {/* Formula Information */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding Volume Formulas</h3>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Current Formula</h4>
                <p className="text-lg font-mono text-blue-600 mb-2">{formula}</p>
                <p className="text-sm text-blue-700">{formulaDescription}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Common Shapes</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Cube: V = a³</li>
                    <li>• Sphere: V = (4/3)πr³</li>
                    <li>• Cylinder: V = πr²h</li>
                    <li>• Cone: V = (1/3)πr²h</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Volume Units</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• cm³ (cubic centimeters)</li>
                    <li>• m³ (cubic meters)</li>
                    <li>• in³ (cubic inches)</li>
                    <li>• ft³ (cubic feet)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
</div>

        {/* Results Sidebar */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Primary Results */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Volume Results</h3>

            <div className="grid grid-cols-1 gap-2 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{formatNumber(volumeResult)}</div>
                <div className="text-xs text-blue-700">{formulaDescription} (cm³)</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-sm font-bold text-green-600">{formatNumber(surfaceArea)} cm²</div>
                <div className="text-xs text-green-700">Surface Area</div>
              </div>
            </div>
          </div>

          {/* Unit Conversions */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Unit Conversions</h3>

            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-blue-50 rounded">
                <span className="text-sm text-blue-700">Cubic Centimeters:</span>
                <span className="font-semibold text-blue-800">{formatNumber(volumeConverted.cm3)} cm³</span>
              </div>
              <div className="flex justify-between p-2 bg-green-50 rounded">
                <span className="text-sm text-green-700">Cubic Inches:</span>
                <span className="font-semibold text-green-800">{formatNumber(volumeConverted.in3)} in³</span>
              </div>
              <div className="flex justify-between p-2 bg-purple-50 rounded">
                <span className="text-sm text-purple-700">Cubic Feet:</span>
                <span className="font-semibold text-purple-800">{formatNumber(volumeConverted.ft3, 6)} ft³</span>
              </div>
              <div className="flex justify-between p-2 bg-orange-50 rounded">
                <span className="text-sm text-orange-700">Liters:</span>
                <span className="font-semibold text-orange-800">{formatNumber(volumeConverted.l, 3)} L</span>
              </div>
            </div>
          </div>

          {/* Quick Shape Info */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Shape Information</h3>
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-800 mb-1">Current Shape</div>
                <div className="text-xs text-blue-700">{currentShapeInfo}</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-800 mb-1">Applications</div>
                <div className="text-xs text-green-700">{shapeApplications}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Calculate Volume</h2>
        <p className="text-gray-700">
          Volume calculations are essential in many fields including engineering, construction, and science. Our volume calculator supports multiple 3D shapes with accurate formulas. Simply select your shape, enter the dimensions, and get instant results in multiple units including cubic centimeters, cubic inches, and liters.
        </p>
      </div>

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Math Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className={`${calc.color} text-white rounded-lg p-4 hover:opacity-90 transition`}
            >
              <h3 className="font-bold text-lg mb-1">{calc.title}</h3>
              <p className="text-sm opacity-90">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="volume-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
