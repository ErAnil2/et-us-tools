import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import DestinyNumberCalculatorClient from './DestinyNumberCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'destiny-number-calculator',
  category: 'calculators',
  fallback: {
    title: 'Destiny Number Calculator | The Economic Times',
    description: 'Free online destiny number calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function DestinyNumberCalculatorPage() {
  return <DestinyNumberCalculatorClient />;
}
