import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SimpleInterestClient from './SimpleInterestClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'simple-interest-calculator',
  category: 'calculators',
  fallback: {
    title: 'Simple Interest Calculator - Calculate Simple Interest & Compare Compound | The Economic Times',
    description: 'Calculate simple interest with our comprehensive calculator. Compare with compound interest, analyze rate impact, and understand when simple interest applies with visual charts.',
    keywords: 'simple interest calculator, interest calculator, simple interest formula, SI calculator, investment calculator, loan interest, compound interest comparison',
  }
});

export default function SimpleInterestPage() {
  return <SimpleInterestClient />;
}
