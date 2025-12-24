import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import HardyWeinbergCalculatorClient from './HardyWeinbergCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'hardy-weinberg-calculator',
  category: 'calculators',
  fallback: {
    title: 'Hardy Weinberg Calculator | The Economic Times',
    description: 'Free online hardy weinberg calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function HardyWeinbergCalculatorPage() {
  return <HardyWeinbergCalculatorClient />;
}
