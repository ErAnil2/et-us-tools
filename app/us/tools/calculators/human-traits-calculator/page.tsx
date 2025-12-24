import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import HumanTraitsCalculatorClient from './HumanTraitsCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'human-traits-calculator',
  category: 'calculators',
  fallback: {
    title: 'Human Traits Calculator | The Economic Times',
    description: 'Free online human traits calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function HumanTraitsCalculatorPage() {
  return <HumanTraitsCalculatorClient />;
}
