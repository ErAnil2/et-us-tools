import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import KilometersToMilesCalculatorClient from './KilometersToMilesCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'kilometers-to-miles-calculator',
  category: 'calculators',
  fallback: {
    title: 'Kilometers To Miles Calculator | The Economic Times',
    description: 'Free online kilometers to miles calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function KilometersToMilesCalculatorPage() {
  return <KilometersToMilesCalculatorClient />;
}
