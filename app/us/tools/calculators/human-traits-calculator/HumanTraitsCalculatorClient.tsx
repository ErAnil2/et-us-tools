'use client';

import { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface TraitPrediction {
  mostLikely: string;
  probabilities: Record<string, number>;
}

interface Predictions {
  eyes: TraitPrediction;
  hair: TraitPrediction;
  'hair-type': TraitPrediction;
  height: TraitPrediction;
  skin: TraitPrediction;
  blood: TraitPrediction;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Human Traits Calculator?",
    answer: "A Human Traits Calculator is a free online tool designed to help you quickly and accurately calculate human traits-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Human Traits Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Human Traits Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Human Traits Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function HumanTraitsCalculatorClient() {
  // Parent 1 traits
  const [p1Eyes, setP1Eyes] = useState<string>('brown');
  const [p1Hair, setP1Hair] = useState<string>('black');
  const [p1HairType, setP1HairType] = useState<string>('wavy');
  const [p1Height, setP1Height] = useState<string>('average');
  const [p1Skin, setP1Skin] = useState<string>('medium');
  const [p1Blood, setP1Blood] = useState<string>('A');

  // Parent 2 traits
  const [p2Eyes, setP2Eyes] = useState<string>('blue');
  const [p2Hair, setP2Hair] = useState<string>('blonde');
  const [p2HairType, setP2HairType] = useState<string>('straight');
  const [p2Height, setP2Height] = useState<string>('average');
  const [p2Skin, setP2Skin] = useState<string>('light');
  const [p2Blood, setP2Blood] = useState<string>('O');

  // Predictions
  const [predictions, setPredictions] = useState<Predictions | null>(null);
  const [showDetailedResults, setShowDetailedResults] = useState<boolean>(false);

  // Dominance hierarchies (simplified genetic model)
  const dominanceHierarchy: Record<string, string[]> = {
    eyes: ['brown', 'hazel', 'green', 'blue', 'gray'],
    hair: ['black', 'brown', 'red', 'blonde'],
    'hair-type': ['curly', 'wavy', 'straight'],
    height: ['tall', 'average', 'short'],
    skin: ['dark', 'medium', 'light'],
    blood: ['AB', 'A', 'B', 'O']
  };

  // Calculate trait probabilities
  const calculateTraitProbabilities = (trait: string, p1Trait: string, p2Trait: string, hierarchy: string[]): Record<string, number> => {
    const probabilities: Record<string, number> = {};

    if (trait === 'blood') {
      // Special case for blood types (simplified ABO system)
      const bloodCombinations: Record<string, Record<string, Record<string, number>>> = {
        'A': { 'A': { 'A': 75, 'O': 25 }, 'B': { 'A': 25, 'B': 25, 'AB': 25, 'O': 25 }, 'AB': { 'A': 50, 'B': 25, 'AB': 25 }, 'O': { 'A': 50, 'O': 50 } },
        'B': { 'A': { 'A': 25, 'B': 25, 'AB': 25, 'O': 25 }, 'B': { 'B': 75, 'O': 25 }, 'AB': { 'A': 25, 'B': 50, 'AB': 25 }, 'O': { 'B': 50, 'O': 50 } },
        'AB': { 'A': { 'A': 50, 'B': 25, 'AB': 25 }, 'B': { 'A': 25, 'B': 50, 'AB': 25 }, 'AB': { 'A': 25, 'B': 25, 'AB': 50 }, 'O': { 'A': 50, 'B': 50 } },
        'O': { 'A': { 'A': 50, 'O': 50 }, 'B': { 'B': 50, 'O': 50 }, 'AB': { 'A': 50, 'B': 50 }, 'O': { 'O': 100 } }
      };
      return bloodCombinations[p1Trait]?.[p2Trait] || { 'O': 100 };
    } else if (trait === 'height' || trait === 'skin') {
      // Polygenic traits - more complex inheritance
      if (p1Trait === p2Trait) {
        probabilities[p1Trait] = 60;
        // Add adjacent categories with lower probabilities
        const index = hierarchy.indexOf(p1Trait);
        if (index > 0) probabilities[hierarchy[index - 1]] = 20;
        if (index < hierarchy.length - 1) probabilities[hierarchy[index + 1]] = 20;
      } else {
        // Blending inheritance approximation
        const midIndex = Math.floor((hierarchy.indexOf(p1Trait) + hierarchy.indexOf(p2Trait)) / 2);
        const midTrait = hierarchy[midIndex];

        probabilities[p1Trait] = 25;
        probabilities[p2Trait] = 25;
        probabilities[midTrait] = 50;
      }
    } else {
      // Simple Mendelian inheritance
      const p1Index = hierarchy.indexOf(p1Trait);
      const p2Index = hierarchy.indexOf(p2Trait);

      if (p1Trait === p2Trait) {
        probabilities[p1Trait] = 100;
      } else {
        // Dominant trait determination
        const dominantIndex = Math.min(p1Index, p2Index);
        const dominantTrait = hierarchy[dominantIndex];
        const recessiveTrait = hierarchy[Math.max(p1Index, p2Index)];

        if (dominantIndex === p1Index && dominantIndex === p2Index) {
          probabilities[dominantTrait] = 100;
        } else if (dominantIndex < Math.max(p1Index, p2Index)) {
          probabilities[dominantTrait] = 75;
          probabilities[recessiveTrait] = 25;
        } else {
          probabilities[p1Trait] = 50;
          probabilities[p2Trait] = 50;
        }
      }
    }

    return probabilities;
  };

  // Predict traits
  const predictTraits = () => {
    const traits = ['eyes', 'hair', 'hair-type', 'height', 'skin', 'blood'];
    const parent1: Record<string, string> = {
      eyes: p1Eyes,
      hair: p1Hair,
      'hair-type': p1HairType,
      height: p1Height,
      skin: p1Skin,
      blood: p1Blood
    };

    const parent2: Record<string, string> = {
      eyes: p2Eyes,
      hair: p2Hair,
      'hair-type': p2HairType,
      height: p2Height,
      skin: p2Skin,
      blood: p2Blood
    };

    // Predict child traits using simplified Mendelian genetics
    const newPredictions: any = {};
    traits.forEach(trait => {
      const hierarchy = dominanceHierarchy[trait];
      const probabilities = calculateTraitProbabilities(trait, parent1[trait], parent2[trait], hierarchy);

      // Find most likely trait
      const mostLikely = Object.entries(probabilities)
        .reduce((a, b) => probabilities[a[0]] > probabilities[b[0]] ? a : b)[0];

      newPredictions[trait] = {
        mostLikely: mostLikely,
        probabilities: probabilities
      };
    });

    setPredictions(newPredictions as Predictions);
    setShowDetailedResults(true);
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    predictTraits();
  }, [p1Eyes, p1Hair, p1HairType, p1Height, p1Skin, p1Blood, p2Eyes, p2Hair, p2HairType, p2Height, p2Skin, p2Blood]);

  // Capitalize first letter
  const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Get blood type display
  const getBloodTypeDisplay = (): string => {
    if (!predictions) return 'A or O';
    const bloodProbs = predictions.blood.probabilities;
    const bloodTypes = Object.keys(bloodProbs).filter(type => bloodProbs[type] > 0);
    return bloodTypes.join(' or ');
  };

  // Trait names mapping
  const traitNames: Record<string, string> = {
    eyes: 'Eye Color',
    hair: 'Hair Color',
    'hair-type': 'Hair Type',
    height: 'Height',
    skin: 'Skin Tone',
    blood: 'Blood Type'
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Human Traits Calculator</h1>
        <p className="text-xl text-gray-600">Predict genetic traits in children based on parent characteristics</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
        {/* Calculator Section */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
          {/* Parent Traits Input */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">👫 Parent Traits</h3>

            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Parent 1 */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-blue-800">Parent 1 Traits</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Eye Color</label>
                    <select value={p1Eyes} onChange={(e) => setP1Eyes(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="brown">Brown</option>
                      <option value="hazel">Hazel</option>
                      <option value="green">Green</option>
                      <option value="blue">Blue</option>
                      <option value="gray">Gray</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hair Color</label>
                    <select value={p1Hair} onChange={(e) => setP1Hair(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="black">Black</option>
                      <option value="brown">Brown</option>
                      <option value="blonde">Blonde</option>
                      <option value="red">Red</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hair Type</label>
                    <select value={p1HairType} onChange={(e) => setP1HairType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="straight">Straight</option>
                      <option value="wavy">Wavy</option>
                      <option value="curly">Curly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height Category</label>
                    <select value={p1Height} onChange={(e) => setP1Height(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="short">Short (&lt; 5&apos;4&quot;)</option>
                      <option value="average">Average (5&apos;4&quot; - 6&apos;0&quot;)</option>
                      <option value="tall">Tall (&gt; 6&apos;0&quot;)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skin Tone</label>
                    <select value={p1Skin} onChange={(e) => setP1Skin(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="light">Light</option>
                      <option value="medium">Medium</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                    <select value={p1Blood} onChange={(e) => setP1Blood(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="A">Type A</option>
                      <option value="B">Type B</option>
                      <option value="AB">Type AB</option>
                      <option value="O">Type O</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Parent 2 */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-green-800">Parent 2 Traits</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Eye Color</label>
                    <select value={p2Eyes} onChange={(e) => setP2Eyes(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="brown">Brown</option>
                      <option value="hazel">Hazel</option>
                      <option value="green">Green</option>
                      <option value="blue">Blue</option>
                      <option value="gray">Gray</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hair Color</label>
                    <select value={p2Hair} onChange={(e) => setP2Hair(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="black">Black</option>
                      <option value="brown">Brown</option>
                      <option value="blonde">Blonde</option>
                      <option value="red">Red</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hair Type</label>
                    <select value={p2HairType} onChange={(e) => setP2HairType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="straight">Straight</option>
                      <option value="wavy">Wavy</option>
                      <option value="curly">Curly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height Category</label>
                    <select value={p2Height} onChange={(e) => setP2Height(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="short">Short (&lt; 5&apos;4&quot;)</option>
                      <option value="average">Average (5&apos;4&quot; - 6&apos;0&quot;)</option>
                      <option value="tall">Tall (&gt; 6&apos;0&quot;)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skin Tone</label>
                    <select value={p2Skin} onChange={(e) => setP2Skin(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="light">Light</option>
                      <option value="medium">Medium</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                    <select value={p2Blood} onChange={(e) => setP2Blood(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="A">Type A</option>
                      <option value="B">Type B</option>
                      <option value="AB">Type AB</option>
                      <option value="O">Type O</option>
                    </select>
                  </div>
                </div>
              </div>

              <button onClick={predictTraits} className="w-full bg-blue-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-lg hover:bg-blue-700 transition">
                Predict Child Traits
              </button>
            </div>
          </div>

          {/* Understanding Human Genetics */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding Human Genetics</h3>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Dominant Traits</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Brown/Dark eyes</li>
                    <li>• Dark hair colors</li>
                    <li>• Curly hair texture</li>
                    <li>• Darker skin tones</li>
                    <li>• Type A/B blood</li>
                    <li>• Taller height (polygenic)</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Recessive Traits</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Blue/Light eyes</li>
                    <li>• Blonde/Red hair</li>
                    <li>• Straight hair texture</li>
                    <li>• Lighter skin tones</li>
                    <li>• Type O blood</li>
                    <li>• Shorter height (polygenic)</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Complex Inheritance</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Height: Multiple genes (polygenic)</li>
                    <li>• Eye color: Multiple genes interaction</li>
                    <li>• Skin color: Polygenic inheritance</li>
                    <li>• Intelligence: Highly polygenic</li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Important Notes</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Predictions are simplified estimates</li>
                    <li>• Real genetics is more complex</li>
                    <li>• Environmental factors matter</li>
                    <li>• Consult genetic counselors for medical traits</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Trait Predictions */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Predicted Child Traits</h3>
            {predictions && (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-700">Most Likely Eye Color</div>
                  <div className="text-lg font-bold text-blue-600">{capitalizeFirst(predictions.eyes.mostLikely)}</div>
                  <div className="text-xs text-blue-600">{predictions.eyes.probabilities[predictions.eyes.mostLikely]}% probability</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-700">Most Likely Hair Color</div>
                  <div className="text-lg font-bold text-green-600">{capitalizeFirst(predictions.hair.mostLikely)}</div>
                  <div className="text-xs text-green-600">{predictions.hair.probabilities[predictions.hair.mostLikely]}% probability</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-700">Most Likely Hair Type</div>
                  <div className="text-lg font-bold text-purple-600">{capitalizeFirst(predictions['hair-type'].mostLikely)}</div>
                  <div className="text-xs text-purple-600">{predictions['hair-type'].probabilities[predictions['hair-type'].mostLikely]}% probability</div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Predictions */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Other Traits</h3>
            {predictions && (
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-xs text-gray-600">Height:</span>
                  <span className="font-bold text-sm">{capitalizeFirst(predictions.height.mostLikely)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-xs text-gray-600">Skin Tone:</span>
                  <span className="font-bold text-sm">{capitalizeFirst(predictions.skin.mostLikely)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-xs text-gray-600">Blood Type:</span>
                  <span className="font-bold text-sm">{getBloodTypeDisplay()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Genetics Facts */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-blue-800 mb-3">🧬 Genetics Facts</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div>• Eye color involves multiple genes</div>
              <div>• Two brown-eyed parents can have blue-eyed child</div>
              <div>• Red hair is the rarest hair color</div>
              <div>• Height is 80% genetic, 20% environmental</div>
            </div>
          </div>

          {/* Inheritance Patterns */}
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-green-800 mb-3">📊 Inheritance</h3>
            <div className="space-y-2 text-sm text-green-700">
              <div>• Simple dominance (ABO blood types)</div>
              <div>• Incomplete dominance (hair texture)</div>
              <div>• Polygenic traits (height, skin color)</div>
              <div>• X-linked traits (color blindness)</div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <h3 className="text-lg font-bold text-yellow-800 mb-3">⚠️ Disclaimer</h3>
            <div className="space-y-2 text-sm text-yellow-700">
              <div>• Simplified genetic model</div>
              <div>• For educational purposes only</div>
              <div>• Consult geneticist for medical traits</div>
              <div>• Environmental factors not included</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="human-traits-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* Detailed Results */}
      {predictions && showDetailedResults && (
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Detailed Trait Analysis</h3>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {/* Parent Traits */}
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-4">Parent Traits</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-blue-800 mb-2">Parent 1</h5>
                    <div className="text-sm mb-1">
                      <span className="text-blue-700">Eye Color:</span>
                      <span className="font-medium capitalize ml-1">{p1Eyes}</span>
                    </div>
                    <div className="text-sm mb-1">
                      <span className="text-blue-700">Hair Color:</span>
                      <span className="font-medium capitalize ml-1">{p1Hair}</span>
                    </div>
                    <div className="text-sm mb-1">
                      <span className="text-blue-700">Hair Type:</span>
                      <span className="font-medium capitalize ml-1">{p1HairType}</span>
                    </div>
                    <div className="text-sm mb-1">
                      <span className="text-blue-700">Height:</span>
                      <span className="font-medium capitalize ml-1">{p1Height}</span>
                    </div>
                    <div className="text-sm mb-1">
                      <span className="text-blue-700">Skin Tone:</span>
                      <span className="font-medium capitalize ml-1">{p1Skin}</span>
                    </div>
                    <div className="text-sm mb-1">
                      <span className="text-blue-700">Blood Type:</span>
                      <span className="font-medium capitalize ml-1">{p1Blood}</span>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-800 mb-2">Parent 2</h5>
                    <div className="text-sm mb-1">
                      <span className="text-blue-700">Eye Color:</span>
                      <span className="font-medium capitalize ml-1">{p2Eyes}</span>
                    </div>
                    <div className="text-sm mb-1">
                      <span className="text-blue-700">Hair Color:</span>
                      <span className="font-medium capitalize ml-1">{p2Hair}</span>
                    </div>
                    <div className="text-sm mb-1">
                      <span className="text-blue-700">Hair Type:</span>
                      <span className="font-medium capitalize ml-1">{p2HairType}</span>
                    </div>
                    <div className="text-sm mb-1">
                      <span className="text-blue-700">Height:</span>
                      <span className="font-medium capitalize ml-1">{p2Height}</span>
                    </div>
                    <div className="text-sm mb-1">
                      <span className="text-blue-700">Skin Tone:</span>
                      <span className="font-medium capitalize ml-1">{p2Skin}</span>
                    </div>
                    <div className="text-sm mb-1">
                      <span className="text-blue-700">Blood Type:</span>
                      <span className="font-medium capitalize ml-1">{p2Blood}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Predicted Child Traits */}
              <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6">
                <h4 className="text-lg font-semibold text-green-900 mb-4">Predicted Child Traits</h4>
                <div className="space-y-3">
                  {Object.entries(predictions).map(([trait, prediction]) => (
                    <div key={trait}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-green-800">{traitNames[trait]}:</span>
                        <span className="font-semibold capitalize">{prediction.mostLikely}</span>
                      </div>
                      <div className="text-sm text-green-700">
                        {Object.entries(prediction.probabilities)
                          .filter(([_, prob]) => prob > 0)
                          .map(([traitValue, prob]) => (
                            <span key={traitValue} className="inline-block mr-3 capitalize">{traitValue}: {prob}%</span>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Genetic Inheritance Patterns */}
            <div className="mt-6 bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h4 className="text-lg font-semibold text-purple-900 mb-4">Genetic Inheritance Patterns</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-semibold text-purple-800 mb-2">Simple Dominance</h5>
                  <ul className="text-purple-700 space-y-1">
                    <li>• Eye color (brown &gt; blue)</li>
                    <li>• Hair color (dark &gt; light)</li>
                    <li>• Hair texture (curly &gt; straight)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-purple-800 mb-2">Complex Inheritance</h5>
                  <ul className="text-purple-700 space-y-1">
                    <li>• Height (polygenic - multiple genes)</li>
                    <li>• Skin color (polygenic)</li>
                    <li>• Blood type (codominance)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Important Disclaimers */}
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h5 className="font-semibold text-yellow-800 mb-2">⚠️ Important Disclaimers</h5>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• This is a simplified model - real genetics is more complex</li>
                <li>• Many traits involve multiple genes (polygenic inheritance)</li>
                <li>• Environmental factors also influence trait expression</li>
                <li>• Predictions are estimates based on basic dominance patterns</li>
                <li>• For medical genetic traits, consult with a genetic counselor</li>
                <li>• Eye color can change during childhood</li>
                <li>• Epigenetic factors can modify gene expression</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
