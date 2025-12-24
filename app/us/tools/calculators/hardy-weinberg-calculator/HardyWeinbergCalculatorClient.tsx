'use client';

import { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface EvolutionData {
  generation: number;
  p: number;
  q: number;
  AA: number;
  Aa: number;
  aa: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Hardy Weinberg Calculator?",
    answer: "A Hardy Weinberg Calculator is a free online tool designed to help you quickly and accurately calculate hardy weinberg-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Hardy Weinberg Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Hardy Weinberg Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Hardy Weinberg Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function HardyWeinbergCalculatorClient() {
  // Allele frequencies
  const [alleleAFreq, setAlleleAFreq] = useState<number>(0.6);
  const [alleleaFreq, setAlleleaFreq] = useState<number>(0.4);

  // Population parameters
  const [populationSize, setPopulationSize] = useState<number>(1000);
  const [generations, setGenerations] = useState<number>(5);

  // Evolutionary forces
  const [selectionCoeff, setSelectionCoeff] = useState<number>(0);
  const [mutationRate, setMutationRate] = useState<number>(0.0001);
  const [migrationRate, setMigrationRate] = useState<number>(0);
  const [migrantFreq, setMigrantFreq] = useState<number>(0.5);

  // Results
  const [equilibriumStatus, setEquilibriumStatus] = useState<string>('In Equilibrium');
  const [AAfreq, setAAfreq] = useState<number>(0.36);
  const [Aafreq, setAafreq] = useState<number>(0.48);
  const [aafreq, setaafreq] = useState<number>(0.16);
  const [AAcount, setAAcount] = useState<number>(360);
  const [Aacount, setAacount] = useState<number>(480);
  const [aacount, setaacount] = useState<number>(160);

  // Evolution indicators
  const [selectionIndicator, setSelectionIndicator] = useState<string>('• No selection detected');
  const [mutationIndicator, setMutationIndicator] = useState<string>('• Minimal mutation effect');
  const [migrationIndicator, setMigrationIndicator] = useState<string>('• No migration');
  const [driftIndicator, setDriftIndicator] = useState<string>('• Large population (N=1000)');

  // Detailed results
  const [showDetailedResults, setShowDetailedResults] = useState<boolean>(false);
  const [detailedResultsHTML, setDetailedResultsHTML] = useState<string>('');

  // Auto-calculate q when p changes
  useEffect(() => {
    const q = Math.max(0, Math.min(1, 1 - alleleAFreq));
    setAlleleaFreq(parseFloat(q.toFixed(3)));
  }, [alleleAFreq]);

  // Update sidebar display in real-time
  useEffect(() => {
    const p = alleleAFreq;
    const q = 1 - p;

    // Calculate genotype frequencies
    const AA_freq = p * p;
    const Aa_freq = 2 * p * q;
    const aa_freq = q * q;

    // Update sidebar values
    setAAfreq(AA_freq);
    setAafreq(Aa_freq);
    setaafreq(aa_freq);

    setAAcount(Math.round(AA_freq * populationSize));
    setAacount(Math.round(Aa_freq * populationSize));
    setaacount(Math.round(aa_freq * populationSize));

    // Update evolutionary force indicators
    setSelectionIndicator(
      selectionCoeff > 0
        ? `• Selection against aa (s=${selectionCoeff})`
        : '• No selection detected'
    );
    setMutationIndicator(
      mutationRate > 0 ? `• Mutation rate: ${mutationRate}` : '• Minimal mutation effect'
    );
    setMigrationIndicator(
      migrationRate > 0
        ? `• Migration rate: ${(migrationRate * 100).toFixed(1)}%`
        : '• No migration'
    );

    const populationCategory =
      populationSize >= 1000 ? 'Large' : populationSize >= 100 ? 'Medium' : 'Small';
    setDriftIndicator(`• ${populationCategory} population (N=${populationSize})`);

    // Determine equilibrium status
    const hasEvolutionaryForces =
      selectionCoeff > 0 || mutationRate > 0 || migrationRate > 0 || populationSize < 100;
    setEquilibriumStatus(hasEvolutionaryForces ? 'Evolving' : 'In Equilibrium');
  }, [alleleAFreq, populationSize, selectionCoeff, mutationRate, migrationRate]);

  // Calculate Hardy-Weinberg equilibrium
  const calculateHardyWeinberg = () => {
    const p = alleleAFreq;
    const q = 1 - p;

    // Calculate genotype frequencies under Hardy-Weinberg equilibrium
    const genotypesHW = {
      AA: p * p,
      Aa: 2 * p * q,
      aa: q * q,
    };

    // Calculate expected numbers in population
    const expectedNumbers = {
      AA: Math.round(genotypesHW.AA * populationSize),
      Aa: Math.round(genotypesHW.Aa * populationSize),
      aa: Math.round(genotypesHW.aa * populationSize),
    };

    // Simulate evolution with selection, mutation, and migration
    const evolutionData: EvolutionData[] = [];
    let currentP = p;

    for (let gen = 0; gen <= generations; gen++) {
      let currentQ = 1 - currentP;

      // Apply selection (simplified - affects aa genotype)
      if (selectionCoeff > 0) {
        const aaFitness = 1 - selectionCoeff;
        const AAfreq = currentP * currentP;
        const Aafreq = 2 * currentP * currentQ;
        const aafreq = currentQ * currentQ;

        const meanFitness = AAfreq + Aafreq + aafreq * aaFitness;
        const newAAfreq = AAfreq / meanFitness;
        const newAafreq = Aafreq / meanFitness;
        const newaafreq = (aafreq * aaFitness) / meanFitness;

        currentP = newAAfreq + newAafreq / 2;
        currentQ = 1 - currentP;
      }

      // Apply mutation (A → a)
      if (mutationRate > 0) {
        currentP = currentP * (1 - mutationRate);
        currentQ = 1 - currentP;
      }

      // Apply migration
      if (migrationRate > 0) {
        currentP = currentP * (1 - migrationRate) + migrantFreq * migrationRate;
        currentQ = 1 - currentP;
      }

      evolutionData.push({
        generation: gen,
        p: currentP,
        q: currentQ,
        AA: currentP * currentP,
        Aa: 2 * currentP * currentQ,
        aa: currentQ * currentQ,
      });
    }

    displayResults({
      initialP: p,
      initialQ: q,
      genotypesHW,
      expectedNumbers,
      populationSize,
      evolutionData,
      selectionCoeff,
      mutationRate,
      migrationRate,
      migrantFreq,
      generations,
    });
  };

  // Display detailed results
  const displayResults = (results: any) => {
    let evolutionChart = '';
    if (results.evolutionData.length > 1) {
      evolutionChart = `
        <div class="mt-6 bg-gray-50 rounded-lg p-4">
          <h5 class="font-semibold mb-2">Allele Frequency Evolution Over Time</h5>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-1">Generation</th>
                  <th class="text-right py-1">p (A)</th>
                  <th class="text-right py-1">q (a)</th>
                  <th class="text-right py-1">AA freq</th>
                  <th class="text-right py-1">Aa freq</th>
                  <th class="text-right py-1">aa freq</th>
                </tr>
              </thead>
              <tbody>
                ${results.evolutionData
                  .slice(0, Math.min(10, results.generations + 1))
                  .map(
                    (data: EvolutionData) => `
                  <tr class="border-b border-gray-200">
                    <td class="py-1">${data.generation}</td>
                    <td class="text-right py-1">${data.p.toFixed(3)}</td>
                    <td class="text-right py-1">${data.q.toFixed(3)}</td>
                    <td class="text-right py-1">${(data.AA * 100).toFixed(1)}%</td>
                    <td class="text-right py-1">${(data.Aa * 100).toFixed(1)}%</td>
                    <td class="text-right py-1">${(data.aa * 100).toFixed(1)}%</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    const finalData = results.evolutionData[results.evolutionData.length - 1];
    const hasEvolved = Math.abs(finalData.p - results.initialP) > 0.001;

    const resultsHTML = `
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-blue-50 rounded-lg p-6">
          <h4 class="text-lg font-semibold text-blue-900 mb-4">Hardy-Weinberg Equilibrium</h4>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-blue-800">Initial Allele A frequency (p):</span>
              <span class="font-semibold">${results.initialP.toFixed(3)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-800">Initial Allele a frequency (q):</span>
              <span class="font-semibold">${results.initialQ.toFixed(3)}</span>
            </div>
            ${
              hasEvolved
                ? `
            <div class="border-t pt-2">
              <div class="flex justify-between">
                <span class="text-blue-800">Final p (after ${results.generations} gen):</span>
                <span class="font-semibold">${finalData.p.toFixed(3)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-800">Final q (after ${results.generations} gen):</span>
                <span class="font-semibold">${finalData.q.toFixed(3)}</span>
              </div>
            </div>
            `
                : ''
            }
            <div class="border-t pt-2">
              <div class="text-sm text-blue-700 font-medium mb-1">Expected Genotype Frequencies:</div>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span>AA (p²):</span>
                  <span class="font-semibold">${(results.genotypesHW.AA * 100).toFixed(1)}%</span>
                </div>
                <div class="flex justify-between">
                  <span>Aa (2pq):</span>
                  <span class="font-semibold">${(results.genotypesHW.Aa * 100).toFixed(1)}%</span>
                </div>
                <div class="flex justify-between">
                  <span>aa (q²):</span>
                  <span class="font-semibold">${(results.genotypesHW.aa * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-green-50 rounded-lg p-6">
          <h4 class="text-lg font-semibold text-green-900 mb-4">Population Numbers (n=${results.populationSize})</h4>
          <div class="space-y-3">
            <div class="grid grid-cols-3 gap-2 text-center">
              <div>
                <div class="text-2xl font-bold text-green-600">${results.expectedNumbers.AA}</div>
                <div class="text-sm text-gray-600">AA individuals</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-blue-600">${results.expectedNumbers.Aa}</div>
                <div class="text-sm text-gray-600">Aa individuals</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-red-600">${results.expectedNumbers.aa}</div>
                <div class="text-sm text-gray-600">aa individuals</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${evolutionChart}

      <div class="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h5 class="font-semibold text-yellow-800 mb-2">📊 Population Genetics Insights</h5>
        <ul class="text-sm text-yellow-700 space-y-1">
          <li>• Hardy-Weinberg equilibrium assumes ideal conditions</li>
          <li>• Real populations deviate due to selection, mutation, drift, and migration</li>
          <li>• Allele frequencies remain constant without evolutionary forces</li>
          ${results.selectionCoeff > 0 ? '<li>• Selection against aa genotype changes allele frequencies</li>' : ''}
          ${results.mutationRate > 0 ? '<li>• Mutation introduces new genetic variation</li>' : ''}
          ${results.migrationRate > 0 ? '<li>• Migration can introduce new alleles to the population</li>' : ''}
          <li>• Small populations experience genetic drift</li>
          ${hasEvolved ? `<li>• <strong>Population has evolved:</strong> allele frequencies changed from p=${results.initialP.toFixed(3)} to p=${finalData.p.toFixed(3)}</li>` : '<li>• Population remains in Hardy-Weinberg equilibrium</li>'}
        </ul>
      </div>
    `;

    setDetailedResultsHTML(resultsHTML);
    setShowDetailedResults(true);
  };

  // Initialize with default values
  useEffect(() => {
    calculateHardyWeinberg();
  }, []);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Hardy-Weinberg Calculator
        </h1>
        <p className="text-xl text-gray-600">
          Analyze population genetics, allele frequencies, and evolutionary forces
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
        {/* Calculator Section */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
          {/* Hardy-Weinberg Parameters */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
              📊 Hardy-Weinberg Equilibrium
            </h3>

            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-blue-800">Allele Frequencies</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency of Allele A (p)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={alleleAFreq}
                      onChange={(e) => setAlleleAFreq(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="1"
                      step="0.01"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Dominant allele frequency (0-1)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency of Allele a (q)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      value={alleleaFreq}
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Recessive allele frequency (calculated as 1-p)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-green-800">Population Parameters</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Population Size
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={populationSize}
                      onChange={(e) => setPopulationSize(parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Generations
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={generations}
                      onChange={(e) => setGenerations(parseInt(e.target.value) || 1)}
                      min="1"
                      max="50"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-purple-800">Evolutionary Forces</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Selection Coefficient (s)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={selectionCoeff}
                      onChange={(e) => setSelectionCoeff(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="1"
                      step="0.01"
                      placeholder="0 = no selection"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Selection against aa genotype (0-1)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mutation Rate (μ)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={mutationRate}
                      onChange={(e) => setMutationRate(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="0.1"
                      step="0.0001"
                      placeholder="Per generation"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      A→a mutation rate per generation
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Migration Rate (m)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={migrationRate}
                      onChange={(e) => setMigrationRate(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="1"
                      step="0.01"
                      placeholder="0 = no migration"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Proportion of migrants per generation
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Migrant Allele Freq (pm)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={migrantFreq}
                      onChange={(e) => setMigrantFreq(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="1"
                      step="0.01"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Allele A frequency in migrants
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={calculateHardyWeinberg}
                className="w-full bg-blue-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-lg hover:bg-blue-700 transition"
              >
                Calculate Hardy-Weinberg Equilibrium
              </button>
            </div>
          </div>

          {/* Understanding Hardy-Weinberg */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
              Understanding Hardy-Weinberg
            </h3>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Hardy-Weinberg Equation</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div className="font-mono text-lg">p² + 2pq + q² = 1</div>
                    <div>• p² = frequency of AA genotype</div>
                    <div>• 2pq = frequency of Aa genotype</div>
                    <div>• q² = frequency of aa genotype</div>
                    <div>• p + q = 1</div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Key Assumptions</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• No mutations</li>
                    <li>• Random mating</li>
                    <li>• No gene flow (migration)</li>
                    <li>• Large population size</li>
                    <li>• No natural selection</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Evolutionary Forces</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>
                      • <strong>Selection:</strong> Differential reproduction
                    </li>
                    <li>
                      • <strong>Mutation:</strong> New allele creation
                    </li>
                    <li>
                      • <strong>Migration:</strong> Gene flow between populations
                    </li>
                    <li>
                      • <strong>Genetic drift:</strong> Random sampling effects
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Applications</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Population genetics studies</li>
                    <li>• Conservation biology</li>
                    <li>• Medical genetics</li>
                    <li>• Evolutionary biology research</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Current Equilibrium */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Hardy-Weinberg Equilibrium</h3>
            <div className="space-y-3">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{equilibriumStatus}</div>
                <div className="text-xs text-blue-700">Population Status</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-xs text-gray-600">p (A frequency):</span>
                  <span className="font-bold text-sm">{alleleAFreq.toFixed(3)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-xs text-gray-600">q (a frequency):</span>
                  <span className="font-bold text-sm">{alleleaFreq.toFixed(3)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Genotype Frequencies */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Genotype Frequencies</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-sm font-medium">AA (p²):</span>
                <span className="font-bold text-sm">{(AAfreq * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-sm font-medium">Aa (2pq):</span>
                <span className="font-bold text-sm">{(Aafreq * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <span className="text-sm font-medium">aa (q²):</span>
                <span className="font-bold text-sm">{(aafreq * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Population Numbers */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Expected Numbers</h3>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <div className="text-lg font-bold text-green-600">{AAcount}</div>
                <div className="text-xs text-gray-600">AA individuals</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">{Aacount}</div>
                <div className="text-xs text-gray-600">Aa individuals</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">{aacount}</div>
                <div className="text-xs text-gray-600">aa individuals</div>
              </div>
            </div>
          </div>

          {/* Hardy-Weinberg Facts */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-blue-800 mb-3">📊 HW Facts</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div>• Equilibrium reached in 1 generation</div>
              <div>• Frequencies remain constant</div>
              <div>• Predicts genotype from allele frequencies</div>
              <div>• Baseline for detecting evolution</div>
            </div>
          </div>

          {/* Evolution Indicators */}
          <div className="bg-purple-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-purple-800 mb-3">🧬 Evolution Factors</h3>
            <div className="space-y-2 text-sm text-purple-700">
              <div>{selectionIndicator}</div>
              <div>{mutationIndicator}</div>
              <div>{migrationIndicator}</div>
              <div>{driftIndicator}</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="hardy-weinberg-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {showDetailedResults && (
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
              Detailed Analysis Results
            </h3>
            <div dangerouslySetInnerHTML={{ __html: detailedResultsHTML }} />
          </div>
        </div>
      )}
    </div>
  );
}
