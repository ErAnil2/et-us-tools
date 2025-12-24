import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import STCGCalculatorClient from './STCGCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'stcg-calculator',
  category: 'calculators',
  fallback: {
    title: 'STCG Calculator - Short Term Capital Gains Tax Calculator | The Economic Times',
    description: 'Calculate your short-term capital gains tax with our comprehensive STCG calculator. Understand tax implications on stocks, crypto, and other investments held less than a year.',
    keywords: 'STCG calculator, short term capital gains tax, capital gains calculator, stock tax calculator',
  }
});

export default function STCGCalculatorPage() {
  return <STCGCalculatorClient />;
}
