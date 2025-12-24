import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ReversePercentageCalculatorClient from './ReversePercentageCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'reverse-percentage-calculator',
  category: 'calculators',
  fallback: {
    title: 'Reverse Percentage Calculator - Find Original Value | The Economic Times',
    description: 'Calculate the original value from a percentage result. Find what number a percentage came from with our free reverse percentage calculator.',
    keywords: 'reverse percentage calculator, find original value, percentage backwards, original price calculator',
  }
});

export default function ReversePercentageCalculatorPage() {
  return <ReversePercentageCalculatorClient />;
}
