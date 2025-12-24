import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PercentageChangeCalculatorClient from './PercentageChangeCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'percentage-change-calculator',
  category: 'calculators',
  fallback: {
    title: 'Percentage Change Calculator - Calculate Percent Increase and Decrease | The Economic Times',
    description: 'Free percentage change calculator to find percent increase, decrease, and difference between two values. Calculate growth rates and percentage changes.',
    keywords: 'percentage change calculator, percent change calculator, percentage increase calculator, percentage decrease calculator, growth rate calculator',
  }
});

export default function PercentageChangeCalculatorPage() {
  return <PercentageChangeCalculatorClient />;
}
