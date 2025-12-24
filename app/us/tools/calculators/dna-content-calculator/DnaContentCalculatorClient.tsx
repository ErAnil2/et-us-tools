'use client';

import { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface BaseCount {
  A: number;
  T: number;
  C: number;
  G: number;
}

interface SequenceAnalysis {
  length: number;
  baseCount: BaseCount;
  gcContent: string;
  atContent: string;
  molecularWeight: number;
  meltingTemp: number;
}

interface OrganismData {
  genome: number;
  chromosomes: number;
  genes: number;
  gc: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Dna Content Calculator?",
    answer: "A Dna Content Calculator is a free online tool designed to help you quickly and accurately calculate dna content-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Dna Content Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Dna Content Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Dna Content Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function DnaContentCalculatorClient() {
  const [organism, setOrganism] = useState('human');
  const [genomeSize, setGenomeSize] = useState(3200000000);
  const [chromosomes, setChromosomes] = useState(46);
  const [geneCount, setGeneCount] = useState(20000);
  const [gcContent, setGcContent] = useState(41);
  const [dnaSequence, setDnaSequence] = useState('ATCGATCGATCGTAGCTACGATCGTAGC');
  const [showResults, setShowResults] = useState(false);
  const [sequenceAnalysis, setSequenceAnalysis] = useState<SequenceAnalysis | null>(null);

  const organisms: { [key: string]: OrganismData } = {
    human: { genome: 3200000000, chromosomes: 46, genes: 20000, gc: 41 },
    mouse: { genome: 2700000000, chromosomes: 40, genes: 22000, gc: 42 },
    'fruit-fly': { genome: 143000000, chromosomes: 8, genes: 14000, gc: 42 },
    yeast: { genome: 12100000, chromosomes: 32, genes: 6000, gc: 38 },
    ecoli: { genome: 4600000, chromosomes: 1, genes: 4300, gc: 51 },
    arabidopsis: { genome: 157000000, chromosomes: 10, genes: 27000, gc: 36 }
  };

  const formatGenomeSize = (size: number): string => {
    if (size >= 1e9) return (size / 1e9).toFixed(1) + ' Gb';
    if (size >= 1e6) return (size / 1e6).toFixed(1) + ' Mb';
    if (size >= 1e3) return (size / 1e3).toFixed(1) + ' kb';
    return size + ' bp';
  };

  const getProteinCodingPercent = (org: string): number => {
    const percentages: { [key: string]: number } = {
      human: 2,
      mouse: 2.5,
      'fruit-fly': 25,
      yeast: 70,
      ecoli: 85,
      arabidopsis: 30
    };
    return percentages[org] || 20;
  };

  const calculateMeltingTemp = (gcCount: number, totalLength: number): number => {
    if (totalLength < 14) {
      // For short oligonucleotides
      return 2 * (totalLength - gcCount) + 4 * gcCount;
    } else {
      // For longer sequences (simplified)
      return 64.9 + 41 * (gcCount - 16.4) / totalLength;
    }
  };

  const handleOrganismChange = (org: string) => {
    setOrganism(org);
    const selected = organisms[org];
    if (selected) {
      setGenomeSize(selected.genome);
      setChromosomes(selected.chromosomes);
      setGeneCount(selected.genes);
      setGcContent(selected.gc);
    }
  };

  const analyzeDNA = () => {
    const cleanSequence = dnaSequence.toUpperCase().replace(/[^ATCG]/g, '');

    // Analyze sequence if provided
    let analysis: SequenceAnalysis | null = null;
    if (cleanSequence.length > 0) {
      const baseCount: BaseCount = {
        A: (cleanSequence.match(/A/g) || []).length,
        T: (cleanSequence.match(/T/g) || []).length,
        C: (cleanSequence.match(/C/g) || []).length,
        G: (cleanSequence.match(/G/g) || []).length
      };
      const totalBases = cleanSequence.length;
      const calculatedGC = ((baseCount.G + baseCount.C) / totalBases * 100).toFixed(1);

      analysis = {
        length: totalBases,
        baseCount,
        gcContent: calculatedGC,
        atContent: (100 - parseFloat(calculatedGC)).toFixed(1),
        molecularWeight: totalBases * 650, // Approximate molecular weight per base pair
        meltingTemp: calculateMeltingTemp(baseCount.G + baseCount.C, totalBases)
      };
    }

    setSequenceAnalysis(analysis);
    setShowResults(true);
  };

  useEffect(() => {
    analyzeDNA();
  }, []);

  // Calculated values
  const avgChromosomeSize = Math.round(genomeSize / chromosomes);
  const genesPerChromosome = Math.round(geneCount / chromosomes);
  const avgGeneSize = Math.round(genomeSize / geneCount);
  const atContent = (100 - gcContent).toFixed(1);
  const proteinCodingPercent = getProteinCodingPercent(organism);
  const proteinCodingBases = Math.round(genomeSize * proteinCodingPercent / 100);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">DNA Content Calculator</h1>
        <p className="text-xl text-gray-600">Analyze DNA sequences, genome composition, and molecular properties</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
        {/* Calculator Section */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
          {/* Genome Information */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">🧬 Genome Analysis</h3>

            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-blue-800">Organism Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organism</label>
                    <select
                      value={organism}
                      onChange={(e) => handleOrganismChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="human">Human</option>
                      <option value="mouse">Mouse</option>
                      <option value="fruit-fly">Fruit Fly (Drosophila)</option>
                      <option value="yeast">Yeast (S. cerevisiae)</option>
                      <option value="ecoli">E. coli</option>
                      <option value="arabidopsis">Arabidopsis</option>
                      <option value="custom">Custom Organism</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Genome Size (base pairs)</label>
                    <input
                      type="number"
                      value={genomeSize}
                      onChange={(e) => setGenomeSize(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Total genome size"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Chromosomes</label>
                    <input
                      type="number"
                      value={chromosomes}
                      onChange={(e) => setChromosomes(parseInt(e.target.value) || 1)}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Gene Count</label>
                    <input
                      type="number"
                      value={geneCount}
                      onChange={(e) => setGeneCount(parseInt(e.target.value) || 1)}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GC Content (%)</label>
                    <input
                      type="number"
                      value={gcContent}
                      onChange={(e) => setGcContent(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-green-800">DNA Sequence Analysis</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DNA Sequence (optional)</label>
                  <textarea
                    value={dnaSequence}
                    onChange={(e) => setDnaSequence(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={4}
                    placeholder="Enter DNA sequence (ATCG only)..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter DNA sequence to analyze base composition and calculate molecular weight</p>
                </div>
              </div>

              <button
                onClick={analyzeDNA}
                className="w-full bg-blue-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-lg hover:bg-blue-700 transition"
              >
                Analyze DNA Content
              </button>
            </div>
          </div>

          {/* Understanding DNA Content */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding DNA Content</h3>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">DNA Basics</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• DNA is made of 4 bases: A, T, G, C</li>
                    <li>• Base pairs: A-T and G-C</li>
                    <li>• Double helix structure</li>
                    <li>• Stores genetic information</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">GC Content Importance</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Higher GC = more stable DNA</li>
                    <li>• Affects melting temperature</li>
                    <li>• Varies between organisms</li>
                    <li>• Important for PCR design</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Genome Sizes</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Human: ~3.2 billion bp</li>
                    <li>• E. coli: ~4.6 million bp</li>
                    <li>• Yeast: ~12 million bp</li>
                    <li>• Paris japonica: ~150 billion bp</li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Applications</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Genome sequencing projects</li>
                    <li>• Comparative genomics</li>
                    <li>• Molecular cloning</li>
                    <li>• Evolutionary studies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Genome Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-xs text-gray-600">Organism:</span>
                <span className="font-bold text-sm capitalize">{organism.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-xs text-gray-600">Genome Size:</span>
                <span className="font-bold text-sm">{formatGenomeSize(genomeSize)}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-xs text-gray-600">Chromosomes:</span>
                <span className="font-bold text-sm">{chromosomes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-xs text-gray-600">Genes:</span>
                <span className="font-bold text-sm">~{geneCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-xs text-gray-600">GC Content:</span>
                <span className="font-bold text-sm">{gcContent}%</span>
              </div>
            </div>
          </div>

          {/* DNA Facts */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-blue-800 mb-3">🧬 DNA Facts</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div>• Human DNA: 99.9% identical between individuals</div>
              <div>• Only ~2% codes for proteins</div>
              <div>• 23 pairs of chromosomes</div>
              <div>• ~3.2 billion base pairs</div>
            </div>
          </div>

          {/* Molecular Properties */}
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-green-800 mb-3">🔬 Molecular Properties</h3>
            <div className="space-y-2 text-sm text-green-700">
              <div>• Avg molecular weight: 650 Da per bp</div>
              <div>• GC bonds: 3 hydrogen bonds</div>
              <div>• AT bonds: 2 hydrogen bonds</div>
              <div>• Major and minor grooves</div>
            </div>
          </div>

          {/* Quick Calculations */}
          <div className="bg-purple-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-purple-800 mb-3">⚡ Quick Calculations</h3>
            <div className="space-y-2 text-sm text-purple-700">
              <div>• Avg chromosome size: {formatGenomeSize(avgChromosomeSize)}</div>
              <div>• Genes per chromosome: ~{genesPerChromosome.toLocaleString()}</div>
              <div>• Avg gene size: {formatGenomeSize(avgGeneSize)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="dna-content-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* Detailed Results */}
      {showResults && (
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Detailed Analysis Results</h3>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-4">Genome Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-800">Organism:</span>
                    <span className="font-semibold capitalize">{organism.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Genome Size:</span>
                    <span className="font-semibold">{genomeSize.toLocaleString()} bp</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Chromosomes:</span>
                    <span className="font-semibold">{chromosomes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Estimated Genes:</span>
                    <span className="font-semibold">{geneCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Avg Chromosome Size:</span>
                    <span className="font-semibold">{avgChromosomeSize.toLocaleString()} bp</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6">
                <h4 className="text-lg font-semibold text-green-900 mb-4">Composition Analysis</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-green-800">GC Content:</span>
                    <span className="font-semibold">{gcContent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-800">AT Content:</span>
                    <span className="font-semibold">{atContent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-800">Avg Gene Size:</span>
                    <span className="font-semibold">{avgGeneSize.toLocaleString()} bp</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-800">Genes per Chromosome:</span>
                    <span className="font-semibold">{genesPerChromosome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-800">Protein-coding:</span>
                    <span className="font-semibold">~{proteinCodingPercent}% ({proteinCodingBases.toLocaleString()} bp)</span>
                  </div>
                </div>
              </div>
            </div>

            {sequenceAnalysis && (
              <div className="mt-6 bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6">
                <h4 className="text-lg font-semibold text-purple-900 mb-4">Sequence Analysis</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-purple-800">Sequence Length:</span>
                        <span className="font-semibold">{sequenceAnalysis.length} bp</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-800">Calculated GC:</span>
                        <span className="font-semibold">{sequenceAnalysis.gcContent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-800">Molecular Weight:</span>
                        <span className="font-semibold">{sequenceAnalysis.molecularWeight.toLocaleString()} Da</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-800">Est. Melting Temp:</span>
                        <span className="font-semibold">{sequenceAnalysis.meltingTemp.toFixed(1)}°C</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-purple-800 mb-2">Base Composition</h5>
                    <div className="grid grid-cols-4 gap-2 text-center text-sm">
                      {Object.entries(sequenceAnalysis.baseCount).map(([base, count]) => (
                        <div key={base}>
                          <div className="font-bold text-purple-600">{count}</div>
                          <div className="text-purple-700">{base}</div>
                          <div className="text-xs text-purple-600">{((count/sequenceAnalysis.length)*100).toFixed(1)}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h5 className="font-semibold text-yellow-800 mb-2">🧬 DNA Insights</h5>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• GC content affects DNA stability and melting temperature</li>
                <li>• Higher GC content = more stable DNA structure</li>
                <li>• Gene density varies greatly between organisms</li>
                <li>• Non-coding DNA includes regulatory elements and repetitive sequences</li>
                <li>• Chromosome number doesn't correlate with organism complexity</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
