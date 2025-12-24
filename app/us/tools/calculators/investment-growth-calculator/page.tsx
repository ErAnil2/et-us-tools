import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import InvestmentGrowthClient from './InvestmentGrowthClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'investment-growth-calculator',
  category: 'calculators',
  fallback: {
    title: 'Investment Growth Calculator - Compound Interest & Portfolio Growth | The Economic Times',
    description: 'Calculate investment growth with compound interest, regular contributions, and inflation adjustments. Visualize your wealth building journey.',
    keywords: 'investment calculator, compound interest calculator, investment growth, portfolio calculator, wealth building calculator',
  }
});

export default function InvestmentGrowthPage() {
  return <InvestmentGrowthClient />;
}
