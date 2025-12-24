'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

// Types for results
interface PunnettResults {
  parent1: string;
  parent2: string;
  traitName: string;
  dominantTrait: string;
  recessiveTrait: string;
  combinations: string[];
  genotypeFreqs: { [key: string]: number };
  phenotypes: { [key: string]: number };
  offspringCount: number;
  expectedOffspring: { [key: string]: number };
}

interface DNAResults {
  organism: string;
  genomeSize: number;
  chromosomes: number;
  geneCount: number;
  gcContent: number;
  atContent: string;
  avgChromosomeSize: number;
  genesPerChromosome: number;
  avgGeneSize: number;
  proteinCodingPercent: number;
  sequenceAnalysis: any;
}

interface HardyWeinbergResults {
  initialP: number;
  initialQ: number;
  genotypesHW: { AA: number; Aa: number; aa: number };
  expectedNumbers: { AA: number; Aa: number; aa: number };
  populationSize: number;
  evolutionData: any[];
  selectionCoeff: number;
  mutationRate: number;
}

interface TraitResults {
  parent1: { [key: string]: string };
  parent2: { [key: string]: string };
  predictions: { [key: string]: { mostLikely: string; probabilities: { [key: string]: number } } };
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Genetics Calculator?",
    answer: "A Genetics Calculator is a free online tool designed to help you quickly and accurately calculate genetics-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Genetics Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Genetics Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Genetics Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function GeneticsCalculatorClient() {
  // Active tab
  const [activeTab, setActiveTab] = useState<string>('punnett');

  // Punnett Square inputs
  const [parent1Genotype, setParent1Genotype] = useState<string>('Aa');
  const [parent2Genotype, setParent2Genotype] = useState<string>('Aa');
  const [traitName, setTraitName] = useState<string>('Eye Color');
  const [dominantTrait, setDominantTrait] = useState<string>('Brown Eyes');
  const [recessiveTrait, setRecessiveTrait] = useState<string>('Blue Eyes');
  const [offspringCount, setOffspringCount] = useState<number>(100);

  // DNA inputs
  const [organism, setOrganism] = useState<string>('human');
  const [genomeSize, setGenomeSize] = useState<number>(3200000000);
  const [chromosomes, setChromosomes] = useState<number>(46);
  const [geneCount, setGeneCount] = useState<number>(20000);
  const [gcContent, setGcContent] = useState<number>(41);
  const [dnaSequence, setDnaSequence] = useState<string>('ATCGATCGATCGTAGCTACGATCGTAGC');

  // Hardy-Weinberg inputs
  const [alleleAFreq, setAlleleAFreq] = useState<number>(0.6);
  const [alleleaFreq, setAlleleaFreq] = useState<number>(0.4);
  const [populationSize, setPopulationSize] = useState<number>(1000);
  const [generations, setGenerations] = useState<number>(5);
  const [selectionCoeff, setSelectionCoeff] = useState<number>(0);
  const [mutationRate, setMutationRate] = useState<number>(0.0001);

  // Human traits inputs
  const [p1Eyes, setP1Eyes] = useState<string>('brown');
  const [p1Hair, setP1Hair] = useState<string>('black');
  const [p1HairType, setP1HairType] = useState<string>('straight');
  const [p1Height, setP1Height] = useState<string>('average');
  const [p2Eyes, setP2Eyes] = useState<string>('blue');
  const [p2Hair, setP2Hair] = useState<string>('blonde');
  const [p2HairType, setP2HairType] = useState<string>('straight');
  const [p2Height, setP2Height] = useState<string>('average');

  // Results
  const [showResults, setShowResults] = useState<boolean>(false);
  const [resultsHTML, setResultsHTML] = useState<string>('');

  // Update allele q when p changes
  useEffect(() => {
    setAlleleaFreq(parseFloat((1 - alleleAFreq).toFixed(3)));
  }, [alleleAFreq]);

  // Update organism-specific values
  useEffect(() => {
    const organisms: { [key: string]: any } = {
      human: { genome: 3200000000, chromosomes: 46, genes: 20000, gc: 41 },
      mouse: { genome: 2700000000, chromosomes: 40, genes: 22000, gc: 42 },
      'fruit-fly': { genome: 143000000, chromosomes: 8, genes: 14000, gc: 42 },
      yeast: { genome: 12100000, chromosomes: 32, genes: 6000, gc: 38 },
      ecoli: { genome: 4600000, chromosomes: 1, genes: 4300, gc: 51 }
    };

    const selected = organisms[organism];
    if (selected) {
      setGenomeSize(selected.genome);
      setChromosomes(selected.chromosomes);
      setGeneCount(selected.genes);
      setGcContent(selected.gc);
    }
  }, [organism]);

  // Update trait descriptions
  useEffect(() => {
    const traitDescriptions: { [key: string]: { dominant: string; recessive: string } } = {
      'Eye Color': { dominant: 'Brown Eyes', recessive: 'Blue Eyes' },
      'Hair Color': { dominant: 'Dark Hair', recessive: 'Light Hair' },
      Height: { dominant: 'Tall', recessive: 'Short' },
      'Blood Type': { dominant: 'Type A/B', recessive: 'Type O' },
      'Seed Shape': { dominant: 'Round Seeds', recessive: 'Wrinkled Seeds' }
    };

    const selected = traitDescriptions[traitName];
    if (selected) {
      setDominantTrait(selected.dominant);
      setRecessiveTrait(selected.recessive);
    }
  }, [traitName]);

  const calculatePunnett = () => {
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
    combinations.forEach((combo) => {
      genotypeCounts[combo] = (genotypeCounts[combo] || 0) + 1;
    });

    const totalCombos = combinations.length;
    const genotypeFreqs: { [key: string]: number } = {};
    Object.keys(genotypeCounts).forEach((genotype) => {
      genotypeFreqs[genotype] = (genotypeCounts[genotype] / totalCombos) * 100;
    });

    // Calculate phenotypes
    const phenotypes: { [key: string]: number } = {};
    Object.keys(genotypeFreqs).forEach((genotype) => {
      const phenotype = genotype.includes('A') ? dominantTrait : recessiveTrait;
      phenotypes[phenotype] = (phenotypes[phenotype] || 0) + genotypeFreqs[genotype];
    });

    // Calculate expected offspring numbers
    const expectedOffspring: { [key: string]: number } = {};
    Object.keys(genotypeFreqs).forEach((genotype) => {
      expectedOffspring[genotype] = Math.round((genotypeFreqs[genotype] / 100) * offspringCount);
    });

    displayPunnettResults({
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

  const analyzeDNA = () => {
    const cleanedSequence = dnaSequence.toUpperCase().replace(/[^ATCG]/g, '');

    let sequenceAnalysis = null;
    if (cleanedSequence.length > 0) {
      const baseCount = {
        A: (cleanedSequence.match(/A/g) || []).length,
        T: (cleanedSequence.match(/T/g) || []).length,
        C: (cleanedSequence.match(/C/g) || []).length,
        G: (cleanedSequence.match(/G/g) || []).length
      };
      const totalBases = cleanedSequence.length;
      const calculatedGC = ((baseCount.G + baseCount.C) / totalBases * 100).toFixed(1);

      sequenceAnalysis = {
        length: totalBases,
        baseCount,
        gcContent: calculatedGC,
        atContent: (100 - parseFloat(calculatedGC)).toFixed(1),
        molecularWeight: totalBases * 650
      };
    }

    const avgChromosomeSize = Math.round(genomeSize / chromosomes);
    const genesPerChromosome = Math.round(geneCount / chromosomes);
    const avgGeneSize = Math.round(genomeSize / geneCount);
    const atContent = (100 - gcContent).toFixed(1);

    const proteinCodingPercent =
      organism === 'human' ? 2 : organism === 'yeast' ? 70 : organism === 'ecoli' ? 85 : 20;

    displayDNAResults({
      organism,
      genomeSize,
      chromosomes,
      geneCount,
      gcContent,
      atContent,
      avgChromosomeSize,
      genesPerChromosome,
      avgGeneSize,
      proteinCodingPercent,
      sequenceAnalysis
    });
  };

  const calculateHardyWeinberg = () => {
    const p = alleleAFreq;
    const q = 1 - p;

    const genotypesHW = {
      AA: p * p,
      Aa: 2 * p * q,
      aa: q * q
    };

    const expectedNumbers = {
      AA: Math.round(genotypesHW.AA * populationSize),
      Aa: Math.round(genotypesHW.Aa * populationSize),
      aa: Math.round(genotypesHW.aa * populationSize)
    };

    const evolutionData: any[] = [];
    let currentP = p;

    for (let gen = 0; gen <= generations; gen++) {
      let currentQ = 1 - currentP;

      if (selectionCoeff > 0) {
        const aaFitness = 1 - selectionCoeff;
        const newQ =
          (currentQ * currentQ * aaFitness + currentQ * currentP) /
          (currentP * currentP + 2 * currentP * currentQ + currentQ * currentQ * aaFitness);
        currentQ = newQ;
        currentP = 1 - currentQ;
      }

      if (mutationRate > 0) {
        currentP = currentP * (1 - mutationRate) + currentQ * mutationRate;
        currentQ = 1 - currentP;
      }

      evolutionData.push({
        generation: gen,
        p: currentP,
        q: currentQ,
        AA: currentP * currentP,
        Aa: 2 * currentP * currentQ,
        aa: currentQ * currentQ
      });
    }

    displayHardyWeinbergResults({
      initialP: p,
      initialQ: q,
      genotypesHW,
      expectedNumbers,
      populationSize,
      evolutionData,
      selectionCoeff,
      mutationRate
    });
  };

  const predictTraits = () => {
    const traits = ['eyes', 'hair', 'hair-type', 'height'];
    const parent1: { [key: string]: string } = {
      eyes: p1Eyes,
      hair: p1Hair,
      'hair-type': p1HairType,
      height: p1Height
    };
    const parent2: { [key: string]: string } = {
      eyes: p2Eyes,
      hair: p2Hair,
      'hair-type': p2HairType,
      height: p2Height
    };

    const dominanceHierarchy: { [key: string]: string[] } = {
      eyes: ['brown', 'hazel', 'green', 'blue', 'gray'],
      hair: ['black', 'brown', 'blonde', 'red'],
      'hair-type': ['curly', 'wavy', 'straight'],
      height: ['tall', 'average', 'short']
    };

    const predictions: { [key: string]: { mostLikely: string; probabilities: { [key: string]: number } } } = {};
    traits.forEach((trait) => {
      const hierarchy = dominanceHierarchy[trait];
      const p1Index = hierarchy.indexOf(parent1[trait]);
      const p2Index = hierarchy.indexOf(parent2[trait]);

      const dominantIndex = Math.min(p1Index, p2Index);
      const dominantTraitValue = hierarchy[dominantIndex];

      const probabilities: { [key: string]: number } = {};
      if (parent1[trait] === parent2[trait]) {
        probabilities[parent1[trait]] = 100;
      } else {
        if (dominantIndex === p1Index) {
          probabilities[parent1[trait]] = 75;
          probabilities[parent2[trait]] = 25;
        } else {
          probabilities[parent2[trait]] = 75;
          probabilities[parent1[trait]] = 25;
        }
      }

      predictions[trait] = {
        mostLikely: dominantTraitValue,
        probabilities: probabilities
      };
    });

    displayTraitResults({ parent1, parent2, predictions });
  };

  const displayPunnettResults = (results: PunnettResults) => {
    const p1Alleles = results.parent1.split('');
    const p2Alleles = results.parent2.split('');

    let punnettSquare = '<div class="bg-gray-50 rounded-lg p-4 mb-4"><h5 class="font-semibold mb-3">Punnett Square</h5>';
    punnettSquare += '<div class="grid grid-cols-3 gap-2 max-w-sm mx-auto text-center">';

    punnettSquare += `<div></div><div class="font-semibold">${results.parent2[0]}</div><div class="font-semibold">${
      results.parent2[1] || results.parent2[0]
    }</div>`;

    for (let i = 0; i < p1Alleles.length; i++) {
      punnettSquare += `<div class="font-semibold">${p1Alleles[i]}</div>`;
      for (let j = 0; j < p2Alleles.length; j++) {
        const combo = [p1Alleles[i], p2Alleles[j]].sort().join('');
        punnettSquare += `<div class="border border-gray-300 p-2 bg-blue-50">${combo}</div>`;
      }
    }

    punnettSquare += '</div></div>';

    const html = `
      ${punnettSquare}
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-blue-50 rounded-lg p-6">
          <h4 class="text-lg font-semibold text-blue-900 mb-4">Genotype Ratios</h4>
          <div class="space-y-2">
            ${Object.entries(results.genotypeFreqs)
              .map(
                ([genotype, freq]) => `
              <div class="flex justify-between">
                <span class="font-medium">${genotype}:</span>
                <span>${freq.toFixed(1)}%</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
        <div class="bg-green-50 rounded-lg p-6">
          <h4 class="text-lg font-semibold text-green-900 mb-4">Phenotype Ratios</h4>
          <div class="space-y-2">
            ${Object.entries(results.phenotypes)
              .map(
                ([phenotype, freq]) => `
              <div class="flex justify-between">
                <span class="font-medium">${phenotype}:</span>
                <span>${freq.toFixed(1)}%</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
      <div class="mt-6 bg-gray-50 rounded-lg p-6">
        <h4 class="text-lg font-semibold text-gray-900 mb-4">Expected Offspring (n=${results.offspringCount})</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          ${Object.entries(results.expectedOffspring)
            .map(
              ([genotype, count]) => `
            <div>
              <div class="text-2xl font-bold text-blue-600">${count}</div>
              <div class="text-sm text-gray-600">${genotype}</div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
      <div class="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h5 class="font-semibold text-yellow-800 mb-2">Genetic Insights</h5>
        <ul class="text-sm text-yellow-700 space-y-1">
          <li>• This follows Mendelian inheritance patterns</li>
          <li>• Dominant alleles (A) mask recessive alleles (a)</li>
          <li>• Each parent contributes one allele randomly</li>
          <li>• Real traits often involve multiple genes</li>
        </ul>
      </div>
    `;

    setResultsHTML(html);
    setShowResults(true);
  };

  const displayDNAResults = (results: DNAResults) => {
    const html = `
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-blue-50 rounded-lg p-6">
          <h4 class="text-lg font-semibold text-blue-900 mb-4">Genome Statistics</h4>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-blue-800">Organism:</span>
              <span class="font-semibold capitalize">${results.organism}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-800">Genome Size:</span>
              <span class="font-semibold">${results.genomeSize.toLocaleString()} bp</span>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-800">Chromosomes:</span>
              <span class="font-semibold">${results.chromosomes}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-800">Estimated Genes:</span>
              <span class="font-semibold">${results.geneCount.toLocaleString()}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-800">Avg Chromosome Size:</span>
              <span class="font-semibold">${results.avgChromosomeSize.toLocaleString()} bp</span>
            </div>
          </div>
        </div>
        <div class="bg-green-50 rounded-lg p-6">
          <h4 class="text-lg font-semibold text-green-900 mb-4">Composition Analysis</h4>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-green-800">GC Content:</span>
              <span class="font-semibold">${results.gcContent}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-green-800">AT Content:</span>
              <span class="font-semibold">${results.atContent}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-green-800">Avg Gene Size:</span>
              <span class="font-semibold">${results.avgGeneSize.toLocaleString()} bp</span>
            </div>
            <div class="flex justify-between">
              <span class="text-green-800">Genes per Chromosome:</span>
              <span class="font-semibold">${results.genesPerChromosome}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-green-800">Protein-coding:</span>
              <span class="font-semibold">~${results.proteinCodingPercent}%</span>
            </div>
          </div>
        </div>
      </div>
      ${
        results.sequenceAnalysis
          ? `
      <div class="mt-6 bg-purple-50 rounded-lg p-6">
        <h4 class="text-lg font-semibold text-purple-900 mb-4">Sequence Analysis</h4>
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-purple-800">Sequence Length:</span>
                <span class="font-semibold">${results.sequenceAnalysis.length} bp</span>
              </div>
              <div class="flex justify-between">
                <span class="text-purple-800">Calculated GC:</span>
                <span class="font-semibold">${results.sequenceAnalysis.gcContent}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-purple-800">Molecular Weight:</span>
                <span class="font-semibold">${results.sequenceAnalysis.molecularWeight.toLocaleString()} Da</span>
              </div>
            </div>
          </div>
          <div>
            <h5 class="font-semibold text-purple-800 mb-2">Base Composition</h5>
            <div class="grid grid-cols-4 gap-2 text-center text-sm">
              ${Object.entries(results.sequenceAnalysis.baseCount)
                .map(
                  ([base, count]) => `
                <div>
                  <div class="font-bold text-purple-600">${count}</div>
                  <div class="text-purple-700">${base}</div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        </div>
      </div>
      `
          : ''
      }
      <div class="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h5 class="font-semibold text-yellow-800 mb-2">DNA Insights</h5>
        <ul class="text-sm text-yellow-700 space-y-1">
          <li>• GC content affects DNA stability and melting temperature</li>
          <li>• Higher GC content = more stable DNA structure</li>
          <li>• Gene density varies greatly between organisms</li>
          <li>• Non-coding DNA includes regulatory elements and "junk" DNA</li>
          <li>• Chromosome number doesn't correlate with complexity</li>
        </ul>
      </div>
    `;

    setResultsHTML(html);
    setShowResults(true);
  };

  const displayHardyWeinbergResults = (results: HardyWeinbergResults) => {
    let evolutionChart = '';
    if (results.evolutionData.length > 1) {
      evolutionChart = `
        <div class="mt-6 bg-gray-50 rounded-lg p-4">
          <h5 class="font-semibold mb-2">Allele Frequency Over Time</h5>
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
                  .slice(0, 6)
                  .map(
                    (data) => `
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

    const html = `
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-blue-50 rounded-lg p-6">
          <h4 class="text-lg font-semibold text-blue-900 mb-4">Hardy-Weinberg Equilibrium</h4>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-blue-800">Allele A frequency (p):</span>
              <span class="font-semibold">${results.initialP.toFixed(3)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-800">Allele a frequency (q):</span>
              <span class="font-semibold">${results.initialQ.toFixed(3)}</span>
            </div>
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
        <h5 class="font-semibold text-yellow-800 mb-2">Population Genetics Insights</h5>
        <ul class="text-sm text-yellow-700 space-y-1">
          <li>• Hardy-Weinberg equilibrium assumes ideal conditions</li>
          <li>• Real populations deviate due to selection, mutation, drift, and migration</li>
          <li>• Allele frequencies remain constant without evolutionary forces</li>
          ${results.selectionCoeff > 0 ? '<li>• Selection against aa genotype changes allele frequencies</li>' : ''}
          ${results.mutationRate > 0 ? '<li>• Mutation introduces new genetic variation</li>' : ''}
          <li>• Small populations experience genetic drift</li>
        </ul>
      </div>
    `;

    setResultsHTML(html);
    setShowResults(true);
  };

  const displayTraitResults = (results: TraitResults) => {
    const traitNames: { [key: string]: string } = {
      eyes: 'Eye Color',
      hair: 'Hair Color',
      'hair-type': 'Hair Type',
      height: 'Height'
    };

    const html = `
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-blue-50 rounded-lg p-6">
          <h4 class="text-lg font-semibold text-blue-900 mb-4">Parent Traits</h4>
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <h5 class="font-semibold text-blue-800 mb-2">Parent 1</h5>
                ${Object.entries(results.parent1)
                  .map(
                    ([trait, value]) => `
                  <div class="text-sm">
                    <span class="text-blue-700">${traitNames[trait]}:</span>
                    <span class="font-medium capitalize">${value}</span>
                  </div>
                `
                  )
                  .join('')}
              </div>
              <div>
                <h5 class="font-semibold text-blue-800 mb-2">Parent 2</h5>
                ${Object.entries(results.parent2)
                  .map(
                    ([trait, value]) => `
                  <div class="text-sm">
                    <span class="text-blue-700">${traitNames[trait]}:</span>
                    <span class="font-medium capitalize">${value}</span>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>
        <div class="bg-green-50 rounded-lg p-6">
          <h4 class="text-lg font-semibold text-green-900 mb-4">Predicted Child Traits</h4>
          <div class="space-y-3">
            ${Object.entries(results.predictions)
              .map(
                ([trait, prediction]) => `
              <div>
                <div class="flex justify-between items-center mb-1">
                  <span class="font-medium text-green-800">${traitNames[trait]}:</span>
                  <span class="font-semibold capitalize">${prediction.mostLikely}</span>
                </div>
                <div class="text-sm text-green-700">
                  ${Object.entries(prediction.probabilities)
                    .map(([traitValue, prob]) => `<span class="inline-block mr-3 capitalize">${traitValue}: ${prob}%</span>`)
                    .join('')}
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
      <div class="mt-6 bg-purple-50 rounded-lg p-6">
        <h4 class="text-lg font-semibold text-purple-900 mb-4">Trait Inheritance Patterns</h4>
        <div class="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 class="font-semibold text-purple-800 mb-2">Typically Dominant</h5>
            <ul class="text-purple-700 space-y-1">
              <li>• Brown/Dark eyes</li>
              <li>• Dark hair</li>
              <li>• Curly hair</li>
              <li>• Tallness</li>
            </ul>
          </div>
          <div>
            <h5 class="font-semibold text-purple-800 mb-2">Typically Recessive</h5>
            <ul class="text-purple-700 space-y-1">
              <li>• Blue/Light eyes</li>
              <li>• Blonde/Red hair</li>
              <li>• Straight hair</li>
              <li>• Shorter stature</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h5 class="font-semibold text-yellow-800 mb-2">Important Disclaimers</h5>
        <ul class="text-sm text-yellow-700 space-y-1">
          <li>• This is a simplified model - real traits are often polygenic</li>
          <li>• Environmental factors also influence trait expression</li>
          <li>• Predictions are based on basic dominance patterns</li>
          <li>• Actual inheritance can be more complex (incomplete dominance, codominance)</li>
          <li>• For medical traits, consult with a genetic counselor</li>
        </ul>
      </div>
    `;

    setResultsHTML(html);
    setShowResults(true);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Genetics Calculator</h1>
        <p className="text-xl text-gray-600">Explore DNA, inheritance patterns, and genetic probabilities</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="flex flex-col lg:flex-row gap-3 sm:gap-5 md:gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
            <div className="mb-3 sm:mb-4 md:mb-6">
              <div className="flex border-b overflow-x-auto">
                <button
                  onClick={() => setActiveTab('punnett')}
                  className={`px-2 py-2 font-semibold whitespace-nowrap ${
                    activeTab === 'punnett'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Punnett Square
                </button>
                <button
                  onClick={() => setActiveTab('dna')}
                  className={`px-2 py-2 font-semibold whitespace-nowrap ${
                    activeTab === 'dna'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  DNA Content
                </button>
                <button
                  onClick={() => setActiveTab('hardy')}
                  className={`px-2 py-2 font-semibold whitespace-nowrap ${
                    activeTab === 'hardy'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Hardy-Weinberg
                </button>
                <button
                  onClick={() => setActiveTab('traits')}
                  className={`px-2 py-2 font-semibold whitespace-nowrap ${
                    activeTab === 'traits'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Human Traits
                </button>
              </div>
            </div>

            {/* Punnett Square Tab */}
            {activeTab === 'punnett' && (
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Mendelian Genetics - Monohybrid Cross</h3>

                <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parent 1 Genotype</label>
                    <select
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parent 2 Genotype</label>
                    <select
                      value={parent2Genotype}
                      onChange={(e) => setParent2Genotype(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="AA">AA (Homozygous Dominant)</option>
                      <option value="Aa">Aa (Heterozygous)</option>
                      <option value="aa">aa (Homozygous Recessive)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trait Name</label>
                    <select
                      value={traitName}
                      onChange={(e) => setTraitName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dominant Trait</label>
                    <input
                      type="text"
                      value={dominantTrait}
                      onChange={(e) => setDominantTrait(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Brown Eyes"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recessive Trait</label>
                    <input
                      type="text"
                      value={recessiveTrait}
                      onChange={(e) => setRecessiveTrait(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Blue Eyes"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Offspring</label>
                    <input
                      type="number"
                      value={offspringCount}
                      onChange={(e) => setOffspringCount(parseInt(e.target.value) || 100)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="10000"
                    />
                  </div>
                </div>

                <button
                  onClick={calculatePunnett}
                  className="w-full bg-blue-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Generate Punnett Square
                </button>
              </div>
            )}

            {/* DNA Content Tab */}
            {activeTab === 'dna' && (
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">DNA & Genome Analysis</h3>

                <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organism</label>
                    <select
                      value={organism}
                      onChange={(e) => setOrganism(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="human">Human</option>
                      <option value="mouse">Mouse</option>
                      <option value="fruit-fly">Fruit Fly</option>
                      <option value="yeast">Yeast</option>
                      <option value="ecoli">E. coli</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Genome Size (base pairs)</label>
                    <input
                      type="number"
                      value={genomeSize}
                      onChange={(e) => setGenomeSize(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Total genome size"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Chromosomes</label>
                    <input
                      type="number"
                      value={chromosomes}
                      onChange={(e) => setChromosomes(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Gene Count</label>
                    <input
                      type="number"
                      value={geneCount}
                      onChange={(e) => setGeneCount(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GC Content (%)</label>
                    <input
                      type="number"
                      value={gcContent}
                      onChange={(e) => setGcContent(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">DNA Sequence (sample)</label>
                    <textarea
                      value={dnaSequence}
                      onChange={(e) => setDnaSequence(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="ATCGATCGATCG..."
                    />
                  </div>
                </div>

                <button
                  onClick={analyzeDNA}
                  className="w-full bg-blue-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Analyze DNA
                </button>
              </div>
            )}

            {/* Hardy-Weinberg Tab */}
            {activeTab === 'hardy' && (
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Hardy-Weinberg Equilibrium</h3>

                <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frequency of Allele A (p)</label>
                    <input
                      type="number"
                      value={alleleAFreq}
                      onChange={(e) => setAlleleAFreq(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="1"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frequency of Allele a (q)</label>
                    <input
                      type="number"
                      value={alleleaFreq}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="1"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Population Size</label>
                    <input
                      type="number"
                      value={populationSize}
                      onChange={(e) => setPopulationSize(parseInt(e.target.value) || 1000)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Generations</label>
                    <input
                      type="number"
                      value={generations}
                      onChange={(e) => setGenerations(parseInt(e.target.value) || 5)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Selection Coefficient (s)</label>
                    <input
                      type="number"
                      value={selectionCoeff}
                      onChange={(e) => setSelectionCoeff(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="1"
                      step="0.01"
                      placeholder="0 = no selection"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mutation Rate (μ)</label>
                    <input
                      type="number"
                      value={mutationRate}
                      onChange={(e) => setMutationRate(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="0.1"
                      step="0.0001"
                      placeholder="Per generation"
                    />
                  </div>
                </div>

                <button
                  onClick={calculateHardyWeinberg}
                  className="w-full bg-blue-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Calculate Equilibrium
                </button>
              </div>
            )}

            {/* Human Traits Tab */}
            {activeTab === 'traits' && (
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Human Genetic Traits Predictor</h3>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Parent 1 Traits</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Eye Color</label>
                      <select
                        value={p1Eyes}
                        onChange={(e) => setP1Eyes(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="brown">Brown</option>
                        <option value="hazel">Hazel</option>
                        <option value="green">Green</option>
                        <option value="blue">Blue</option>
                        <option value="gray">Gray</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hair Color</label>
                      <select
                        value={p1Hair}
                        onChange={(e) => setP1Hair(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="black">Black</option>
                        <option value="brown">Brown</option>
                        <option value="blonde">Blonde</option>
                        <option value="red">Red</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hair Type</label>
                      <select
                        value={p1HairType}
                        onChange={(e) => setP1HairType(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="straight">Straight</option>
                        <option value="wavy">Wavy</option>
                        <option value="curly">Curly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                      <select
                        value={p1Height}
                        onChange={(e) => setP1Height(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="short">{`Short (< 5'4")`}</option>
                        <option value="average">{`Average (5'4" - 6'0")`}</option>
                        <option value="tall">{`Tall (> 6'0")`}</option>
                      </select>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-800 pt-4">Parent 2 Traits</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Eye Color</label>
                      <select
                        value={p2Eyes}
                        onChange={(e) => setP2Eyes(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="brown">Brown</option>
                        <option value="hazel">Hazel</option>
                        <option value="green">Green</option>
                        <option value="blue">Blue</option>
                        <option value="gray">Gray</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hair Color</label>
                      <select
                        value={p2Hair}
                        onChange={(e) => setP2Hair(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="black">Black</option>
                        <option value="brown">Brown</option>
                        <option value="blonde">Blonde</option>
                        <option value="red">Red</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hair Type</label>
                      <select
                        value={p2HairType}
                        onChange={(e) => setP2HairType(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="straight">Straight</option>
                        <option value="wavy">Wavy</option>
                        <option value="curly">Curly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                      <select
                        value={p2Height}
                        onChange={(e) => setP2Height(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="short">{`Short (< 5'4")`}</option>
                        <option value="average">{`Average (5'4" - 6'0")`}</option>
                        <option value="tall">{`Tall (> 6'0")`}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  onClick={predictTraits}
                  className="w-full bg-blue-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Predict Child Traits
                </button>
              </div>
            )}

            {showResults && (
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Results</h3>
                <div dangerouslySetInnerHTML={{ __html: resultsHTML }} />
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6 sticky top-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Genetics Guide</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Basic Genetics Terms</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <strong>Gene:</strong> Unit of heredity
                  </div>
                  <div>
                    <strong>Allele:</strong> Version of a gene
                  </div>
                  <div>
                    <strong>Genotype:</strong> Genetic makeup (AA, Aa, aa)
                  </div>
                  <div>
                    <strong>Phenotype:</strong> Observable traits
                  </div>
                  <div>
                    <strong>Dominant:</strong> Expressed when present
                  </div>
                  <div>
                    <strong>Recessive:</strong> Only expressed in pairs
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">DNA Facts</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Human genome: ~3.2 billion base pairs</li>
                  <li>• 99.9% identical between humans</li>
                  <li>• Only ~2% codes for proteins</li>
                  <li>• 23 pairs of chromosomes</li>
                  <li>• ~20,000-25,000 genes</li>
                  <li>• DNA is 99.9% the same in all humans</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Hardy-Weinberg Conditions</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• No mutations</li>
                  <li>• Random mating</li>
                  <li>• No gene flow</li>
                  <li>• Large population size</li>
                  <li>• No selection</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Common Dominant Traits</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• Brown eyes</div>
                  <div>• Dark hair</div>
                  <div>• Curly hair</div>
                  <div>• Dimples</div>
                  <div>• Widow's peak</div>
                  <div>• Free earlobes</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Common Recessive Traits</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• Blue eyes</div>
                  <div>• Blonde hair</div>
                  <div>• Straight hair</div>
                  <div>• No dimples</div>
                  <div>• Straight hairline</div>
                  <div>• Attached earlobes</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Genetic Disorders</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <strong>Autosomal Recessive:</strong>
                  </div>
                  <div className="pl-2">• Cystic fibrosis</div>
                  <div className="pl-2">• Sickle cell anemia</div>
                  <div>
                    <strong>Autosomal Dominant:</strong>
                  </div>
                  <div className="pl-2">• Huntington's disease</div>
                  <div className="pl-2">• Marfan syndrome</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Applications</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Medical genetics</li>
                  <li>• Plant breeding</li>
                  <li>• Animal breeding</li>
                  <li>• Evolution studies</li>
                  <li>• Forensic science</li>
                  <li>• Conservation biology</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      
      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="genetics-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
      </div>
    </div>
  );
}
