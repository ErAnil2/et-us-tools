import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PercentageCalculatorClient from './PercentageCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'percentage-calculator',
  category: 'calculators',
  fallback: {
    title: 'Percentage Calculator - Calculate Percentages Online | Free Tool',
    description: 'Free percentage calculator for all your math needs. Calculate percentages, increases, decreases, changes, and more. Includes formulas, examples, and quick reference tables.',
    keywords: 'percentage calculator, percent calculator, percentage change, percentage increase, percentage decrease, calculate percentage, percent of number, what percent is',
  }
});

export default function PercentageCalculatorPage() {
  return <PercentageCalculatorClient />;
}
