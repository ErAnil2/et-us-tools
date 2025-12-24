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
  color: string;
  icon: string;
}

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Punnett Square Calculator?",
    answer: "A Punnett Square Calculator is a free online tool designed to help you quickly and accurately calculate punnett square-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Punnett Square Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Punnett Square Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Punnett Square Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function PunnettSquareCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('punnett-square-calculator');

  const [parent1Genotype, setParent1Genotype] = useState('Aa');
  const [parent2Genotype, setParent2Genotype] = useState('Aa');
  const [traitName, setTraitName] = useState('Eye Color');
  const [dominantTrait, setDominantTrait] = useState('Brown Eyes');
  const [recessiveTrait, setRecessiveTrait] = useState('Blue Eyes');
  const [offspringCount, setOffspringCount] = useState(100);

  const [showResults, setShowResults] = useState(false);
  const [punnettSquareHTML, setPunnettSquareHTML] = useState('');
  const [dominantRatio, setDominantRatio] = useState(75);
  const [recessiveRatio, setRecessiveRatio] = useState(25);
  const [resultsHTML, setResultsHTML] = useState('');

  // Update trait descriptions based on selection
  useEffect(() => {
    const traitDescriptions: { [key: string]: { dominant: string; recessive: string } } = {
      'Eye Color': { dominant: 'Brown Eyes', recessive: 'Blue Eyes' },
      'Hair Color': { dominant: 'Dark Hair', recessive: 'Light Hair' },
      'Height': { dominant: 'Tall', recessive: 'Short' },
      'Blood Type': { dominant: 'Type A/B', recessive: 'Type O' },
      'Seed Shape': { dominant: 'Round Seeds', recessive: 'Wrinkled Seeds' }
    };

    const selected = traitDescriptions[traitName];
    if (selected) {
      setDominantTrait(selected.dominant);
      setRecessiveTrait(selected.recessive);
    }
  }, [traitName]);

  // Initialize with default calculation
  useEffect(() => {
    calculatePunnett();
  }, []);

  const calculatePunnett = () => {
    // Generate all possible combinations
    const p1Alleles = parent1Genotype.split('');
    const p2Alleles = parent2Genotype.split('');
    const combinations: string[] = [];

    for (let i = 0; i < p1Alleles.length; i++) {
      for (let j = 0; j < p2Alleles.length; j++) {
        const combo = [p1Alleles[i], p2Alleles[j]].sort().join('');
        combinations.push(combo);
      }
    }

    // Calculate frequencies
    const genotypeCounts: { [key: string]: number } = {};
    combinations.forEach(combo => {
      genotypeCounts[combo] = (genotypeCounts[combo] || 0) + 1;
    });

    const totalCombos = combinations.length;
    const genotypeFreqs: { [key: string]: number } = {};
    Object.keys(genotypeCounts).forEach(genotype => {
      genotypeFreqs[genotype] = (genotypeCounts[genotype] / totalCombos) * 100;
    });

    // Calculate phenotypes
    const phenotypes: { [key: string]: number } = {};
    Object.keys(genotypeFreqs).forEach(genotype => {
      const phenotype = genotype.includes('A') ? dominantTrait : recessiveTrait;
      phenotypes[phenotype] = (phenotypes[phenotype] || 0) + genotypeFreqs[genotype];
    });

    // Calculate expected offspring numbers
    const expectedOffspring: { [key: string]: number } = {};
    Object.keys(genotypeFreqs).forEach(genotype => {
      expectedOffspring[genotype] = Math.round((genotypeFreqs[genotype] / 100) * offspringCount);
    });

    displayResults({
      parent1: parent1Genotype,
      parent2: parent2Genotype,
      traitName,
      dominantTrait,
      recessiveTrait,
      combinations,
      genotypeFreqs,
      phenotypes,
      offspringCount,
      expectedOffspring
    });
  };

  const displayResults = (results: any) => {
    // Update Punnett Square Display
    let punnettSquare = '<div class="grid grid-cols-3 gap-2 max-w-sm mx-auto text-center text-sm">';

    // Headers
    punnettSquare += `<div></div><div class="font-semibold text-blue-600">${results.parent2[0]}</div><div class="font-semibold text-blue-600">${results.parent2[1] || results.parent2[0]}</div>`;

    // Rows
    const p1Alleles = results.parent1.split('');
    const p2Alleles = results.parent2.split('');

    for (let i = 0; i < p1Alleles.length; i++) {
      punnettSquare += `<div class="font-semibold text-blue-600">${p1Alleles[i]}</div>`;
      for (let j = 0; j < p2Alleles.length; j++) {
        const combo = [p1Alleles[i], p2Alleles[j]].sort().join('');
        punnettSquare += `<div class="border border-gray-300 p-2 bg-blue-50 font-mono">${combo}</div>`;
      }
    }

    punnettSquare += '</div>';
    setPunnettSquareHTML(punnettSquare);

    // Update sidebar ratios
    const dominantPercentage = Object.entries(results.phenotypes).find(([phenotype]) => phenotype === results.dominantTrait)?.[1] as number || 0;
    const recessivePercentage = Object.entries(results.phenotypes).find(([phenotype]) => phenotype === results.recessiveTrait)?.[1] as number || 0;

    setDominantRatio(dominantPercentage);
    setRecessiveRatio(recessivePercentage);

    // Show detailed results
    const detailedHTML = `
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-blue-50 rounded-lg p-6">
          <h4 class="text-lg font-semibold text-blue-900 mb-4">Genotype Ratios</h4>
          <div class="space-y-2">
            ${Object.entries(results.genotypeFreqs).map(([genotype, freq]) => `
              <div class="flex justify-between">
                <span class="font-medium font-mono">${genotype}:</span>
                <span>${(freq as number).toFixed(1)}%</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="bg-green-50 rounded-lg p-6">
          <h4 class="text-lg font-semibold text-green-900 mb-4">Phenotype Ratios</h4>
          <div class="space-y-2">
            ${Object.entries(results.phenotypes).map(([phenotype, freq]) => `
              <div class="flex justify-between">
                <span class="font-medium">${phenotype}:</span>
                <span>${(freq as number).toFixed(1)}%</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="mt-6 bg-gray-50 rounded-lg p-6">
        <h4 class="text-lg font-semibold text-gray-900 mb-4">Expected Offspring (n=${results.offspringCount})</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          ${Object.entries(results.expectedOffspring).map(([genotype, count]) => `
            <div>
              <div class="text-2xl font-bold text-blue-600">${count}</div>
              <div class="text-sm text-gray-600 font-mono">${genotype}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h5 class="font-semibold text-yellow-800 mb-2">🧬 Genetic Insights</h5>
        <ul class="text-sm text-yellow-700 space-y-1">
          <li>• This follows Mendelian inheritance patterns</li>
          <li>• Dominant alleles (A) mask recessive alleles (a)</li>
          <li>• Each parent contributes one allele randomly</li>
          <li>• Real traits often involve multiple genes</li>
        </ul>
      </div>
    `;

    setResultsHTML(detailedHTML);
    setShowResults(true);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{getH1('Punnett Square Calculator')}</h1>
        <p className="text-xl text-gray-600">Calculate genetic inheritance probabilities and explore Mendelian genetics</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
        {/* Calculator Section */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">

          {/* Genetic Cross Calculator */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">🧬 Mendelian Genetics Calculator</h3>

            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-blue-800">Parent Genotypes</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent 1 Genotype</label>
                    <select
                      id="parent1-genotype"
                      value={parent1Genotype}
                      onChange={(e) => setParent1Genotype(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="AA">AA (Homozygous Dominant)</option>
                      <option value="Aa">Aa (Heterozygous)</option>
                      <option value="aa">aa (Homozygous Recessive)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent 2 Genotype</label>
                    <select
                      id="parent2-genotype"
                      value={parent2Genotype}
                      onChange={(e) => setParent2Genotype(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="AA">AA (Homozygous Dominant)</option>
                      <option value="Aa">Aa (Heterozygous)</option>
                      <option value="aa">aa (Homozygous Recessive)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-green-800">Trait Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trait Name</label>
                    <select
                      id="trait-name"
                      value={traitName}
                      onChange={(e) => setTraitName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Eye Color">Eye Color</option>
                      <option value="Hair Color">Hair Color</option>
                      <option value="Height">Height</option>
                      <option value="Blood Type">Blood Type</option>
                      <option value="Seed Shape">Seed Shape (Peas)</option>
                      <option value="Custom">Custom Trait</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Offspring</label>
                    <input
                      type="number"
                      id="offspring-count"
                      value={offspringCount}
                      onChange={(e) => setOffspringCount(parseInt(e.target.value) || 100)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="1"
                      max="10000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dominant Trait</label>
                    <input
                      type="text"
                      id="dominant-trait"
                      value={dominantTrait}
                      onChange={(e) => setDominantTrait(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Brown Eyes"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recessive Trait</label>
                    <input
                      type="text"
                      id="recessive-trait"
                      value={recessiveTrait}
                      onChange={(e) => setRecessiveTrait(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Blue Eyes"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={calculatePunnett}
                className="w-full bg-blue-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-lg hover:bg-blue-700 transition"
              >
                Generate Punnett Square
              </button>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Understanding Punnett Squares */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding Punnett Squares</h3>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Basic Genetics Terms</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Gene: Unit of heredity</li>
                    <li>• Allele: Version of a gene</li>
                    <li>• Genotype: Genetic makeup (AA, Aa, aa)</li>
                    <li>• Phenotype: Observable traits</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Dominance Patterns</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Dominant: Expressed when present (A)</li>
                    <li>• Recessive: Only expressed in pairs (aa)</li>
                    <li>• Heterozygous: Two different alleles (Aa)</li>
                    <li>• Homozygous: Two identical alleles (AA, aa)</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Common Examples</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Brown eyes (dominant) vs Blue eyes (recessive)</li>
                    <li>• Dark hair (dominant) vs Light hair (recessive)</li>
                    <li>• Round seeds (dominant) vs Wrinkled seeds (recessive)</li>
                    <li>• Type A/B blood (dominant) vs Type O (recessive)</li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Applications</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Plant and animal breeding</li>
                    <li>• Medical genetics counseling</li>
                    <li>• Understanding inheritance patterns</li>
                    <li>• Predicting offspring characteristics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Punnett Square Display */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Punnett Square</h3>
            <div
              id="punnett-square-display"
              className="text-center p-4 bg-gray-50 rounded"
              dangerouslySetInnerHTML={{ __html: punnettSquareHTML || '<p class="text-gray-500">Click "Generate Punnett Square" to see results</p>' }}
            />
          </div>

          {/* Results Display */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Results</h3>
            <div id="results-summary" className="space-y-3">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600" id="dominant-ratio">{dominantRatio.toFixed(1)}%</div>
                <div className="text-xs text-blue-700">Dominant Phenotype</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-600" id="recessive-ratio">{recessiveRatio.toFixed(1)}%</div>
                <div className="text-xs text-orange-700">Recessive Phenotype</div>
              </div>
            </div>
          </div>

          {/* Genetics Reference */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-blue-800 mb-3">🧬 Genetics Facts</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div>• Each parent contributes one allele</div>
              <div>• 50% chance for each allele</div>
              <div>• Dominant masks recessive traits</div>
              <div>• Mendel's Laws govern inheritance</div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-green-800 mb-3">💡 Quick Tips</h3>
            <div className="space-y-2 text-sm text-green-700">
              <div>• AA × AA = 100% AA offspring</div>
              <div>• AA × aa = 100% Aa offspring</div>
              <div>• Aa × Aa = 1:2:1 ratio</div>
              <div>• aa × aa = 100% aa offspring</div>
            </div>
          </div>
        </div>
</div>

      {showResults && (
        <div id="detailed-results" className="mt-8">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Detailed Results</h3>
            <div
              id="results-content"
              dangerouslySetInnerHTML={{ __html: resultsHTML }}
            />
          </div>
        </div>
      )}

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 text-center">Related Genetics Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {relatedCalculators.map((calc, index) => (
            <Link
              key={index}
              href={calc.href}
              className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-3 sm:p-4 md:p-6 border-l-4"
              style={{ borderLeftColor: calc.color.replace('bg-', '#') }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">{calc.title}</h3>
              <p className="text-gray-600 text-sm">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="punnett-square-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
