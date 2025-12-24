import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CreditScoreSimulatorClient from './CreditScoreSimulatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'credit-score-simulator',
  category: 'calculators',
  fallback: {
    title: 'Credit Score Simulator | The Economic Times',
    description: 'Free online credit score simulator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function CreditScoreSimulatorPage() {
  return <CreditScoreSimulatorClient />;
}
