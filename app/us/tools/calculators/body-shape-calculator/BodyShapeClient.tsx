'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: "What are the different body shape types?",
    answer: "The five main body shapes are: 1) Hourglass - balanced bust and hips with a defined waist, 2) Pear/Triangle - hips wider than bust with a defined waist, 3) Apple/Round - weight concentrated in the midsection with broader shoulders, 4) Rectangle/Straight - similar bust, waist, and hip measurements with minimal waist definition, and 5) Inverted Triangle - broader shoulders than hips with an athletic upper body. Each shape has unique characteristics and different clothing styles that complement it best.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is a body shape calculator?",
    answer: "Body shape calculators provide a good general indication of your body type based on measurements, typically with 80-90% accuracy. However, they use simplified algorithms and may not account for all individual variations like muscle distribution, bone structure, or asymmetry. For the most accurate assessment, include shoulder measurements and ensure your measurements are taken correctly at the fullest part of the bust, narrowest part of the waist, and widest part of the hips.",
    order: 2
  },
  {
    id: '3',
    question: "Can my body shape change over time?",
    answer: "Yes, body shape can change due to weight fluctuations, muscle gain or loss, pregnancy, hormonal changes, and aging. While bone structure remains constant, the distribution of fat and muscle can shift. For example, strength training can help create more definition in a rectangle shape, while significant weight loss might reveal an underlying hourglass or pear shape. However, your fundamental skeletal structure and natural fat distribution patterns remain relatively consistent.",
    order: 3
  },
  {
    id: '4',
    question: "What is the most common body shape?",
    answer: "Research suggests that the rectangle (straight) body shape is the most common, representing about 46% of women. Pear shapes account for approximately 20%, apple shapes about 14%, hourglass shapes about 8%, and inverted triangle shapes about 12%. However, these percentages vary by ethnicity, age, and geographic region. It's important to remember that all body shapes are normal and healthy.",
    order: 4
  },
  {
    id: '5',
    question: "How do I take accurate body measurements for the calculator?",
    answer: "To measure accurately: 1) Use a flexible measuring tape, 2) Wear minimal clothing, 3) Stand straight with feet together, 4) Bust - measure at the fullest part, usually across the nipples, 5) Waist - measure at the narrowest point, typically above the belly button, 6) Hips - measure at the widest part of your buttocks, 7) Shoulders (optional) - measure from one shoulder point to the other across the back. Take each measurement 2-3 times and use the average for best accuracy.",
    order: 5
  },
  {
    id: '6',
    question: "Does body shape affect health and fitness?",
    answer: "While body shape itself doesn't determine health, certain shapes may indicate fat distribution patterns that can affect health risks. Apple shapes (central adiposity) carry higher risk for cardiovascular disease and diabetes compared to pear shapes (peripheral fat). However, overall body composition, fitness level, and healthy habits matter more than shape alone. Any body shape can be healthy with proper nutrition, regular exercise, and maintaining a healthy body fat percentage.",
    order: 6
  }
];
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface BodyShapeClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const shapeData = {
  hourglass: {
    name: 'Hourglass',
    description: 'Balanced bust and hips with defined waist',
    characteristics: ['Bust and hips similar size', 'Narrow defined waist', 'Curvy silhouette', 'Balanced proportions'],
    style: ['Wrap dresses', 'Belted styles', 'Fitted clothing', 'V-necklines'],
    celebrities: 'Scarlett Johansson, Kim Kardashian, Marilyn Monroe'
  },
  pear: {
    name: 'Pear/Triangle',
    description: 'Hips wider than bust',
    characteristics: ['Wider hips than shoulders', 'Smaller bust', 'Defined waist', 'Weight gain in lower body'],
    style: ['A-line skirts', 'Boat necklines', 'Bright colored tops', 'Dark bottom colors'],
    celebrities: 'Beyoncé, Jennifer Lopez, Shakira'
  },
  apple: {
    name: 'Apple/Round',
    description: 'Weight concentrated in midsection',
    characteristics: ['Broader shoulders', 'Fuller midsection', 'Slimmer legs', 'Less defined waist'],
    style: ['Empire waistlines', 'V-neck tops', 'A-line dresses', 'Structured jackets'],
    celebrities: 'Drew Barrymore, Queen Latifah'
  },
  rectangle: {
    name: 'Rectangle/Straight',
    description: 'Similar bust, waist, and hip measurements',
    characteristics: ['Balanced proportions', 'Athletic build', 'Minimal waist definition', 'Straight silhouette'],
    style: ['Peplum tops', 'Ruffled details', 'Belts to create curves', 'Layered clothing'],
    celebrities: 'Cameron Diaz, Kate Hudson, Natalie Portman'
  },
  invertedTriangle: {
    name: 'Inverted Triangle',
    description: 'Broader shoulders than hips',
    characteristics: ['Wide shoulders', 'Smaller hips', 'Athletic upper body', 'Narrow lower body'],
    style: ['Wide-leg pants', 'A-line skirts', 'V-necks', 'Avoid shoulder pads'],
    celebrities: 'Angelina Jolie, Renée Zellweger'
  }
};

export default function BodyShapeClient({ relatedCalculators = defaultRelatedCalculators }: BodyShapeClientProps) {
  const { getH1, getSubHeading } = usePageSEO('body-shape-calculator');

  const [bust, setBust] = useState(36);
  const [waist, setWaist] = useState(28);
  const [hips, setHips] = useState(38);
  const [unit, setUnit] = useState('in');
  const [includeShoulders, setIncludeShoulders] = useState(false);
  const [shoulders, setShoulders] = useState(40);

  const [bodyShape, setBodyShape] = useState('hourglass');
  const [bustWaistRatio, setBustWaistRatio] = useState(0);
  const [hipWaistRatio, setHipWaistRatio] = useState(0);
  const [bustHipRatio, setBustHipRatio] = useState(0);

  useEffect(() => {
    determineBodyShape();
  }, [bust, waist, hips, shoulders, includeShoulders]);

  const determineBodyShape = () => {
    const bwRatio = bust / waist;
    const hwRatio = hips / waist;
    const bhRatio = bust / hips;

    setBustWaistRatio(bwRatio);
    setHipWaistRatio(hwRatio);
    setBustHipRatio(bhRatio);

    // Determine body shape based on ratios
    const bustHipDiff = Math.abs(bust - hips);
    const shoulderHipDiff = includeShoulders ? Math.abs(shoulders - hips) : 0;

    let shape = 'rectangle';

    if (bwRatio >= 1.25 && hwRatio >= 1.25 && bustHipDiff <= 3) {
      shape = 'hourglass';
    } else if (hips > bust && (hips - bust) >= 2) {
      shape = 'pear';
    } else if (bust > hips && (bust - hips) >= 2) {
      shape = 'invertedTriangle';
    } else if (includeShoulders && shoulders > hips && (shoulders - hips) >= 3) {
      shape = 'invertedTriangle';
    } else if (waist >= bust * 0.75 && waist >= hips * 0.75) {
      shape = 'apple';
    }

    setBodyShape(shape);
  };

  const currentShape = shapeData[bodyShape as keyof typeof shapeData];

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Link href="/us/tools" className="text-blue-600 hover:text-blue-800 text-sm md:text-base">
          Home
        </Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600 text-sm md:text-base">Body Shape Calculator</span>
      </div>

      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">{getH1('Body Shape Calculator Online')}</h1>
        <p className="text-sm md:text-lg text-gray-600">
          Determine your body type based on measurements and get personalized style recommendations
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Body Measurements</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bust/Chest</label>
                <input
                  type="number"
                  value={bust}
                  onChange={(e) => setBust(parseFloat(e.target.value) || 0)}
                  step="0.5"
                  min="20"
                  max="60"
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Measure at fullest part</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Waist</label>
                <input
                  type="number"
                  value={waist}
                  onChange={(e) => setWaist(parseFloat(e.target.value) || 0)}
                  step="0.5"
                  min="20"
                  max="50"
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Narrowest point</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hips</label>
                <input
                  type="number"
                  value={hips}
                  onChange={(e) => setHips(parseFloat(e.target.value) || 0)}
                  step="0.5"
                  min="20"
                  max="60"
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Widest point</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit of Measurement</label>
              <div className="flex space-x-4">
                {['in', 'cm'].map((u) => (
                  <label key={u} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={unit === u}
                      onChange={() => setUnit(u)}
                      className="mr-2"
                    />
                    <span>{u === 'in' ? 'Inches' : 'Centimeters'}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Additional Measurements (Optional)</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeShoulders}
                    onChange={(e) => setIncludeShoulders(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-blue-700">Include shoulder width for more accuracy</label>
                </div>

                {includeShoulders && (
                  <div>
                    <label className="block text-xs text-blue-700 mb-1">Shoulder Width</label>
                    <input
                      type="number"
                      value={shoulders}
                      onChange={(e) => setShoulders(parseFloat(e.target.value) || 0)}
                      step="0.5"
                      min="20"
                      max="60"
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3">Style Tips for Your Shape</h4>
              <div className="text-sm text-green-700 space-y-1">
                {currentShape.style.map((tip, i) => (
                  <div key={i}>• {tip}</div>
                ))}
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-3">Celebrity Examples</h4>
              <div className="text-sm text-purple-700">{currentShape.celebrities}</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Body Shape Analysis</h3>

            <div className="space-y-4">
              <div className="bg-blue-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-blue-800">Your Body Shape</span>
                  <span className="text-xs text-blue-600">Based on ratios</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{currentShape.name}</div>
                <div className="text-xs text-blue-700 mt-1">{currentShape.description}</div>
              </div>

              <div className="bg-purple-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-purple-800">Measurement Ratios</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-700">Bust to Waist:</span>
                    <span className="font-semibold text-purple-600">{bustWaistRatio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Hip to Waist:</span>
                    <span className="font-semibold text-purple-600">{hipWaistRatio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Bust to Hip:</span>
                    <span className="font-semibold text-purple-600">{bustHipRatio.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Shape Characteristics</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  {currentShape.characteristics.map((char, i) => (
                    <div key={i}>• {char}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Health Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="group">
              <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Body Shapes: Complete Guide to Body Types</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          Understanding your body shape is about more than just clothing choices - it's about celebrating your unique proportions and making informed decisions about fashion, fitness, and overall wellness. Body shape classification helps identify your natural proportions based on the relationship between your shoulders, bust, waist, and hips. While genetics largely determine your body type, factors like muscle development, body fat percentage, and lifestyle can influence how your shape presents.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
            <h3 className="font-semibold text-pink-800 mb-2 text-sm">The Five Main Shapes</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Hourglass - balanced, curvy</li>
              <li>• Pear/Triangle - lower body emphasis</li>
              <li>• Apple/Round - midsection fullness</li>
              <li>• Rectangle - straight silhouette</li>
              <li>• Inverted Triangle - broad shoulders</li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2 text-sm">Key Measurements</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Bust at fullest point</li>
              <li>• Waist at narrowest point</li>
              <li>• Hips at widest point</li>
              <li>• Shoulders (optional for accuracy)</li>
              <li>• Ratios determine shape classification</li>
            </ul>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2 text-sm">Why It Matters</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Personalized clothing recommendations</li>
              <li>• Better-fitting wardrobe choices</li>
              <li>• Understanding proportions</li>
              <li>• Tailored fitness goals</li>
              <li>• Body confidence and acceptance</li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">The Five Body Shape Types Explained</h3>
        <div className="space-y-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-100">
            <h4 className="font-semibold text-pink-800 mb-2">Hourglass Shape</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Characteristics:</strong> Bust and hips are nearly equal in size with a well-defined, significantly smaller waist. The waist-to-hip and waist-to-bust ratios are typically 0.75 or lower. Weight gain is distributed evenly throughout the body.
            </p>
            <p className="text-sm text-gray-600">
              <strong>Best Clothing Styles:</strong> Wrap dresses, fitted tops, belted waistlines, pencil skirts, and V-necklines that emphasize the balanced proportions and defined waist.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-green-800 mb-2">Pear/Triangle Shape</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Characteristics:</strong> Hips are noticeably wider than bust and shoulders, with a defined waist. Weight tends to accumulate in the hips, thighs, and buttocks. This is one of the most common body shapes.
            </p>
            <p className="text-sm text-gray-600">
              <strong>Best Clothing Styles:</strong> A-line skirts, boat necklines, embellished or bright-colored tops, darker bottom colors, and styles that draw attention upward.
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-100">
            <h4 className="font-semibold text-orange-800 mb-2">Apple/Round Shape</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Characteristics:</strong> Weight concentrates in the midsection with broader shoulders and a fuller bust. The waist is less defined, and legs are often slimmer. This shape carries more weight in the upper body.
            </p>
            <p className="text-sm text-gray-600">
              <strong>Best Clothing Styles:</strong> Empire waistlines, V-neck tops, A-line dresses, structured jackets, and styles that create vertical lines and define the waist.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2">Rectangle/Straight Shape</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Characteristics:</strong> Bust, waist, and hips are similar in measurement with minimal waist definition. Athletic build with straight sides. The most common body shape, representing about 46% of women.
            </p>
            <p className="text-sm text-gray-600">
              <strong>Best Clothing Styles:</strong> Peplum tops, belts to create curves, ruffled details, wrap styles, and clothing that adds dimension to create the illusion of curves.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2">Inverted Triangle Shape</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Characteristics:</strong> Shoulders and bust are noticeably broader than hips. Athletic upper body with narrower lower body. Common among athletes and swimmers.
            </p>
            <p className="text-sm text-gray-600">
              <strong>Best Clothing Styles:</strong> Wide-leg pants, A-line skirts, V-necks, styles that add volume to the lower body, and avoiding shoulder pads or boat necklines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Measure Accurately</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Use proper tools:</strong> Flexible measuring tape, not a rigid ruler</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Minimal clothing:</strong> Wear form-fitting clothes or undergarments only</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Stand naturally:</strong> Feet together, arms at sides, relaxed posture</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Bust measurement:</strong> Measure around the fullest part, typically across nipples</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Waist measurement:</strong> Find your natural waist (narrowest point, usually above belly button)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Hip measurement:</strong> Measure at the widest part of your buttocks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Multiple readings:</strong> Take each measurement 2-3 times and average for accuracy</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Factors That Influence Body Shape</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Genetics:</strong> Bone structure and fat distribution patterns are largely inherited</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Hormones:</strong> Estrogen, testosterone, and cortisol affect fat storage locations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Age:</strong> Metabolism and hormone changes alter body composition over time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Body fat %:</strong> Overall adiposity affects how prominently shape characteristics show</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Muscle mass:</strong> Strength training can alter proportions and create definition</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Pregnancy:</strong> Can temporarily or permanently change body proportions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Lifestyle:</strong> Diet, exercise, and activity levels influence body composition</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Body Shape and Health Considerations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Fat Distribution Matters</h4>
            <p className="text-xs text-gray-600">Central adiposity (apple shape) carries higher cardiovascular and metabolic disease risk than peripheral fat distribution (pear shape). Waist circumference is an important health marker regardless of shape.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">All Shapes Can Be Healthy</h4>
            <p className="text-xs text-gray-600">Your body shape doesn't determine your health status. Regular exercise, balanced nutrition, maintaining healthy body fat percentage, and metabolic markers matter more than shape classification alone.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Shape-Specific Fitness</h4>
            <p className="text-xs text-gray-600">Different shapes may benefit from tailored workout approaches. Apple shapes should focus on core strength, pear shapes on total body training, and rectangle shapes on muscle building for definition.</p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section */}
      <div className="mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="body-shape-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
