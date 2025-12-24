import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BabyCostCalculatorClient from './BabyCostCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'baby-cost-calculator',
  category: 'calculators',
  fallback: {
    title: 'Baby Cost Calculator - First Year Baby Expenses & Budget Planner | The Economic Times',
    description: 'Calculate the total cost of having a baby in the first year. Comprehensive breakdown of medical, gear, childcare, feeding, diapers, and all baby expenses.',
    keywords: 'baby cost calculator, first year baby expenses, newborn costs, baby budget planner, pregnancy costs, childcare expenses, baby gear costs',
  }
});

export default function BabyCostCalculatorPage() {
  return <BabyCostCalculatorClient />;
}
