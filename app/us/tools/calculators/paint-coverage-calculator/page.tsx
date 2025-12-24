import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PaintCoverageCalculatorClient from './PaintCoverageCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'paint-coverage-calculator',
  category: 'calculators',
  fallback: {
    title: 'Paint Coverage Calculator - Calculate Paint Needed for Any Project | The Economic Times',
    description: 'Calculate how much paint you need for rooms, walls, ceilings, and exterior projects. Get accurate paint estimates with coverage rates, coats, and waste factors.',
    keywords: 'paint calculator, paint coverage, wall painting, interior paint, exterior paint, paint estimate, paint quantity',
  }
});

export default function PaintCoverageCalculatorPage() {
  return <PaintCoverageCalculatorClient />;
}
