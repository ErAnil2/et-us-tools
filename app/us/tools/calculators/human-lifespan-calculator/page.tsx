import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import HumanLifespanCalculatorClient from './HumanLifespanCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'human-lifespan-calculator',
  category: 'calculators',
  fallback: {
    title: 'Human Lifespan Calculator | The Economic Times',
    description: 'Free online human lifespan calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function HumanLifespanCalculatorPage() {
  return <HumanLifespanCalculatorClient />;
}
