import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import HeightCalculatorClient from './HeightCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'height-calculator',
  category: 'calculators',
  fallback: {
    title: 'Height Calculator | The Economic Times',
    description: 'Free online height calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function HeightCalculatorPage() {
  return <HeightCalculatorClient />;
}
