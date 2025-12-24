import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PercentageDifferenceCalculatorClient from './PercentageDifferenceCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'percentage-difference-calculator',
  category: 'calculators',
  fallback: {
    title: 'Percentage Difference Calculator - Calculate Percent Difference | The Economic Times',
    description: 'Calculate the percentage difference between two values. Find percent change, increase, or decrease with our easy-to-use calculator.',
    keywords: 'percentage difference, percent change, percentage calculator, percent increase, percent decrease, relative change',
  }
});

export default function PercentageDifferenceCalculatorPage() {
  return <PercentageDifferenceCalculatorClient />;
}
