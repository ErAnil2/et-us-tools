import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CapitalGainsCalculatorClient from './CapitalGainsCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'capital-gains-calculator',
  category: 'calculators',
  fallback: {
    title: 'Capital Gains Calculator - Calculate Investment Gains & Tax | The Economic Times',
    description: 'Calculate capital gains on investments. Estimate short-term and long-term capital gains tax.',
    keywords: 'capital gains calculator, investment tax calculator, capital gains tax, stock profit calculator',
  }
});

export default function CapitalGainsCalculatorPage() {
  return <CapitalGainsCalculatorClient />;
}
