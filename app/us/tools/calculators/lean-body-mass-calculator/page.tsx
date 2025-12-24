import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import LeanBodyMassCalculatorClient from './LeanBodyMassCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'lean-body-mass-calculator',
  category: 'calculators',
  fallback: {
    title: 'Lean Body Mass Calculator | The Economic Times',
    description: 'Free online lean body mass calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function LeanBodyMassCalculatorPage() {
  return <LeanBodyMassCalculatorClient />;
}
