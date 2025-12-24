import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import NPSCalculatorClient from './NPSCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'nps-calculator',
  category: 'calculators',
  fallback: {
    title: 'NPS Calculator - Calculate National Pension System Returns | The Economic Times',
    description: 'Calculate NPS retirement corpus and pension with our comprehensive calculator. Plan your retirement with National Pension System projections.',
    keywords: 'nps calculator, national pension system calculator, retirement calculator, pension calculator, nps returns',
  }
});

export default function NPSCalculatorPage() {
  return <NPSCalculatorClient />;
}
