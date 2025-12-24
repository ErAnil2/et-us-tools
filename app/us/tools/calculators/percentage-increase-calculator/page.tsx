import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PercentageIncreaseCalculatorClient from './PercentageIncreaseCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'percentage-increase-calculator',
  category: 'calculators',
  fallback: {
    title: 'Percentage Increase Calculator - Calculate Percent Change | The Economic Times',
    description: 'Calculate percentage increase, decrease, and change between two values. Free online calculator with step-by-step explanations.',
    keywords: 'percentage increase, percent change, percentage decrease calculator, math calculator',
  }
});

export default function PercentageIncreaseCalculatorPage() {
  return <PercentageIncreaseCalculatorClient />;
}
