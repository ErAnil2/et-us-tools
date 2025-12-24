import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CompleteNumerologyProfileCalculatorClient from './CompleteNumerologyProfileCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'complete-numerology-profile-calculator',
  category: 'calculators',
  fallback: {
    title: 'Complete Numerology Profile Calculator | The Economic Times',
    description: 'Free online complete numerology profile calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function CompleteNumerologyProfileCalculatorPage() {
  return <CompleteNumerologyProfileCalculatorClient />;
}
