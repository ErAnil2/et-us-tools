import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MortgagePointsCalculatorClient from './MortgagePointsCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'mortgage-points-calculator',
  category: 'calculators',
  fallback: {
    title: 'Mortgage Points Calculator - Should You Buy Points? Break-Even Analysis | The Economic Times',
    description: 'Calculate whether buying mortgage points is worth it with our comprehensive break-even analysis. Compare costs, savings, and determine the optimal points strategy.',
    keywords: 'mortgage points calculator, discount points calculator, mortgage break even calculator, buy down points, mortgage rate reduction',
  }
});

export default function MortgagePointsCalculatorPage() {
  return <MortgagePointsCalculatorClient />;
}
