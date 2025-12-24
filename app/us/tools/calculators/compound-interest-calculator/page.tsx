import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CompoundInterestCalculatorClient from './CompoundInterestCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'compound-interest-calculator',
  category: 'calculators',
  fallback: {
    title: 'Compound Interest Calculator - Calculate Investment Growth | The Economic Times',
    description: 'Calculate compound interest and see how your investments grow over time. Includes monthly contributions and detailed breakdown.',
    keywords: 'compound interest calculator, investment growth calculator, compound returns, interest calculator',
  }
});

export default function CompoundInterestCalculatorPage() {
  return <CompoundInterestCalculatorClient />;
}
