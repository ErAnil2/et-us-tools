import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PercentageDecreaseCalculatorClient from './PercentageDecreaseCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'percentage-decrease-calculator',
  category: 'calculators',
  fallback: {
    title: 'Percentage Decrease Calculator - Calculate Percent Decrease | The Economic Times',
    description: 'Calculate percentage decrease between two values. Find percent reduction, discount amounts, and change calculations.',
    keywords: 'percentage decrease calculator, percent decrease, percentage reduction, percent change calculator, discount calculator',
  }
});

export default function PercentageDecreaseCalculatorPage() {
  return <PercentageDecreaseCalculatorClient />;
}
