'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface ConcreteClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

// Fallback FAQs for SEO
const fallbackFaqs = [
  {
    id: 'faq-1',
    question: 'How do I calculate the amount of concrete I need?',
    answer: 'To calculate concrete, multiply the length × width × thickness (in feet) to get cubic feet, then divide by 27 to convert to cubic yards. For example, a 10x10 foot slab that is 4 inches thick needs: 10 × 10 × 0.33 = 33 cubic feet ÷ 27 = 1.22 cubic yards.',
    order: 1
  },
  {
    id: 'faq-2',
    question: 'How many bags of concrete do I need for a 10x10 slab?',
    answer: 'For a 10x10 foot slab with 4-inch thickness, you need approximately 1.23 cubic yards or about 56 bags of 80-lb concrete mix. Always add 10% extra for waste and spillage.',
    order: 2
  },
  {
    id: 'faq-3',
    question: 'What is the standard thickness for a concrete driveway?',
    answer: 'The standard thickness for a residential concrete driveway is 4 inches for regular passenger vehicles. For heavier vehicles like RVs or trucks, 5-6 inches is recommended. Commercial driveways typically require 6-8 inches.',
    order: 3
  },
  {
    id: 'faq-4',
    question: 'How much does a yard of concrete cost?',
    answer: 'Ready-mix concrete typically costs $120-$150 per cubic yard delivered. For DIY projects using bags, expect to pay $4-6 per 80-lb bag, which covers about 0.6 cubic feet. A full cubic yard using bags would cost approximately $270-400.',
    order: 4
  },
  {
    id: 'faq-5',
    question: 'How long does concrete take to cure?',
    answer: 'Concrete reaches about 70% of its strength in 7 days and full strength in 28 days. You can walk on it after 24-48 hours and drive on it after 7 days. Keep it moist during the first week for optimal curing.',
    order: 5
  },
  {
    id: 'faq-6',
    question: 'Should I add rebar to my concrete slab?',
    answer: 'Rebar or wire mesh reinforcement is recommended for driveways, patios over 4 inches thick, and any load-bearing slabs. For small sidewalks and patios with proper base preparation, reinforcement is optional but adds durability.',
    order: 6
  }
];

export default function ConcreteClient({ relatedCalculators = defaultRelatedCalculators }: ConcreteClientProps) {
  // Firebase SEO data
  const { getH1, getSubHeading, faqSchema } = usePageSEO('concrete-calculator');
  const [shape, setShape] = useState('slab');
  const [length, setLength] = useState(20);
  const [width, setWidth] = useState(10);
  const [thickness, setThickness] = useState(4);
  const [diameter, setDiameter] = useState(12);
  const [circularThickness, setCircularThickness] = useState(4);
  const [wasteFactor, setWasteFactor] = useState(10);
  const [bagSize, setBagSize] = useState(60);
  const [bagCost, setBagCost] = useState(4.50);

  // Calculated values
  const [volumeYards, setVolumeYards] = useState(0);
  const [volumeFeet, setVolumeFeet] = useState(0);
  const [surfaceArea, setSurfaceArea] = useState(0);
  const [bagsNeeded, setBagsNeeded] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [projectSummary, setProjectSummary] = useState<string[]>([]);

  useEffect(() => {
    calculateConcrete();
  }, [shape, length, width, thickness, diameter, circularThickness, wasteFactor, bagSize, bagCost]);

  const getBagVolume = (size: number): number => {
    switch(size) {
      case 40: return 0.30;
      case 60: return 0.45;
      case 80: return 0.60;
      default: return 0.45;
    }
  };

  const calculateConcrete = () => {
    let volume = 0;
    let surface = 0;
    let summary: string[] = [];

    if (shape === 'slab' || shape === 'footing') {
      if (length > 0 && width > 0 && thickness > 0) {
        const thicknessInFeet = thickness / 12;
        volume = length * width * thicknessInFeet;
        surface = length * width;
        summary.push(`${length}' × ${width}' × ${thickness}" ${shape === 'slab' ? 'concrete slab' : 'footing'}`);
      }
    } else if (shape === 'circular') {
      if (diameter > 0 && circularThickness > 0) {
        const radius = diameter / 2;
        const thicknessInFeet = circularThickness / 12;
        volume = Math.PI * radius * radius * thicknessInFeet;
        surface = Math.PI * radius * radius;
        summary.push(`${diameter}' diameter × ${circularThickness}" circular slab`);
      }
    }

    if (volume <= 0) {
      resetResults();
      return;
    }

    // Add waste factor
    const volumeWithWaste = volume * (1 + wasteFactor / 100);
    const volumeInYards = volumeWithWaste / 27;

    // Calculate bags needed
    const bagVolume = getBagVolume(bagSize);
    const bagsRequired = Math.ceil(volumeWithWaste / bagVolume);
    const weight = bagsRequired * bagSize;
    const cost = bagsRequired * bagCost;

    setVolumeYards(volumeInYards);
    setVolumeFeet(volumeWithWaste);
    setSurfaceArea(surface);
    setBagsNeeded(bagsRequired);
    setTotalWeight(weight);
    setTotalCost(cost);

    summary.push(`${bagsRequired} bags of ${bagSize} lb concrete mix`);
    summary.push(`${wasteFactor}% waste factor included`);
    setProjectSummary(summary);
  };

  const resetResults = () => {
    setVolumeYards(0);
    setVolumeFeet(0);
    setSurfaceArea(0);
    setBagsNeeded(0);
    setTotalWeight(0);
    setTotalCost(0);
    setProjectSummary(['Enter dimensions to see project summary']);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 py-4 sm:py-6 md:py-8 px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Concrete Calculator",
            "description": "Calculate concrete volume in cubic yards and feet, estimate bags needed, and get project cost estimates for slabs, footings, and patios.",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
      {/* Mobile MREC2 - Before FAQs */}

      <CalculatorMobileMrec2 />


      {/* FAQ Schema */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <article className="max-w-[1180px] mx-auto">
        {/* Header */}
        <header className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {getH1('Concrete Calculator')}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            {getSubHeading('Calculate concrete volume, bags needed, and project cost for slabs, footings, and more')}
          </p>
        </header>

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Project Dimensions</h2>

            {/* Shape Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Shape</label>
              <select
                value={shape}
                onChange={(e) => setShape(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="slab">Rectangular Slab</option>
                <option value="footing">Square Footing</option>
                <option value="circular">Circular Slab</option>
                <option value="steps">Steps/Stairs</option>
              </select>
            </div>

            {/* Dimensions for Rectangular Slab */}
            {(shape === 'slab' || shape === 'footing') && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Length (ft)</label>
                    <input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      placeholder="e.g., 20"
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Width (ft)</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      placeholder="e.g., 10"
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thickness (inches)</label>
                  <input
                    type="number"
                    value={thickness}
                    onChange={(e) => setThickness(parseFloat(e.target.value) || 0)}
                    step="0.25"
                    placeholder="e.g., 4"
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {/* Circular Dimensions */}
            {shape === 'circular' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diameter (ft)</label>
                  <input
                    type="number"
                    value={diameter}
                    onChange={(e) => setDiameter(parseFloat(e.target.value) || 0)}
                    step="0.1"
                    placeholder="e.g., 12"
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thickness (inches)</label>
                  <input
                    type="number"
                    value={circularThickness}
                    onChange={(e) => setCircularThickness(parseFloat(e.target.value) || 0)}
                    step="0.25"
                    placeholder="e.g., 4"
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Waste Factor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Waste Factor (%)</label>
              <select
                value={wasteFactor}
                onChange={(e) => setWasteFactor(parseInt(e.target.value))}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="5">5% - Experienced contractor</option>
                <option value="10">10% - Standard recommendation</option>
                <option value="15">15% - DIY/complex shapes</option>
                <option value="20">20% - First-time DIY</option>
              </select>
            </div>

            {/* Concrete Specifications */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Concrete Specifications</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-blue-700 mb-1">Bag Size</label>
                  <select
                    value={bagSize}
                    onChange={(e) => setBagSize(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="40">40 lb bag (0.30 cu ft)</option>
                    <option value="60">60 lb bag (0.45 cu ft)</option>
                    <option value="80">80 lb bag (0.60 cu ft)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-blue-700 mb-1">Cost per Bag ($)</label>
                  <input
                    type="number"
                    value={bagCost}
                    onChange={(e) => setBagCost(parseFloat(e.target.value) || 0)}
                    step="0.01"
                    placeholder="e.g., 4.50"
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Concrete Requirements</h3>

            <div className="space-y-4">
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{volumeYards.toFixed(2)}</div>
                <div className="text-green-700">Cubic Yards Needed</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Volume (cubic feet):</span>
                  <span className="font-semibold">{volumeFeet.toFixed(1)} cu ft</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Surface Area:</span>
                  <span className="font-semibold">{surfaceArea.toFixed(0)} sq ft</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Bags Required:</span>
                  <span className="font-semibold text-blue-600">{bagsNeeded} bags</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Total Weight:</span>
                  <span className="font-semibold">{totalWeight.toLocaleString()} lbs</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Estimated Cost:</span>
                  <span className="font-semibold text-green-600">${totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Project Summary</h4>
              <div className="text-yellow-700 space-y-1 text-sm">
                {projectSummary.map((item, index) => (
                  <div key={index}>• {item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Information Section */}
      <div className="bg-purple-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Concrete Calculation Guide</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-purple-700">
          <div>
            <h4 className="font-semibold mb-2">Common Concrete Thickness:</h4>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Sidewalks:</strong> 4 inches</li>
              <li>• <strong>Driveways:</strong> 4-6 inches</li>
              <li>• <strong>Garage floors:</strong> 4-6 inches</li>
              <li>• <strong>Basement floors:</strong> 4 inches</li>
              <li>• <strong>Patios:</strong> 4 inches</li>
              <li>• <strong>Footings:</strong> 8-12 inches</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Concrete Mix Coverage:</h4>
            <ul className="space-y-1 text-sm">
              <li>• <strong>40 lb bag:</strong> ~0.30 cubic feet</li>
              <li>• <strong>60 lb bag:</strong> ~0.45 cubic feet</li>
              <li>• <strong>80 lb bag:</strong> ~0.60 cubic feet</li>
              <li>• <strong>1 cubic yard:</strong> = 27 cubic feet</li>
              <li>• <strong>Rule of thumb:</strong> Add 5-10% waste</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">Concrete Pour Tips</h3>
        <div className="grid md:grid-cols-3 gap-4 text-yellow-700">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Before You Start</h4>
            <ul className="text-sm space-y-1">
              <li>• Check local building codes</li>
              <li>• Call 811 for utility location</li>
              <li>• Prepare proper sub-base</li>
              <li>• Have tools ready</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">During Pour</h4>
            <ul className="text-sm space-y-1">
              <li>• Work in manageable sections</li>
              <li>• Level and screed immediately</li>
              <li>• Float surface smooth</li>
              <li>• Add control joints</li>
            </ul>
          </div>
<div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">After Pour</h4>
            <ul className="text-sm space-y-1">
              <li>• Keep moist for 7 days</li>
              <li>• Cover in extreme weather</li>
              <li>• Wait 28 days for full cure</li>
              <li>• Seal if desired</li>
            </ul>
          </div>
        </div>
      </div>

        {/* FAQ Section */}
        <FirebaseFAQs pageId="concrete-calculator" fallbackFaqs={fallbackFaqs} />
      {/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedCalculators.map((calc, index) => (
              <Link key={index} href={calc.href} className="group">
                <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {calc.title}
                  </h3>
                  <p className="text-sm text-gray-600">{calc.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
