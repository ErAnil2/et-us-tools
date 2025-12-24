import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PPFCalculatorClient from './PPFCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'ppf-calculator',
  category: 'calculators',
  fallback: {
    title: 'PPF Calculator - Calculate Public Provident Fund Returns | The Economic Times',
    description: 'Plan your PPF investments and calculate returns with our PPF Calculator. Get detailed year-wise breakdown and tax benefits of Public Provident Fund.',
    keywords: 'PPF calculator, public provident fund calculator, PPF returns, PPF investment, tax saving calculator, PPF maturity calculator',
  }
});

export default function PPFCalculatorPage() {
  return <PPFCalculatorClient />;
}
