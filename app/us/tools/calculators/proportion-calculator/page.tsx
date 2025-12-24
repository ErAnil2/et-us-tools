import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ProportionCalculatorClient from './ProportionCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'proportion-calculator',
  category: 'calculators',
  fallback: {
    title: 'Proportion Calculator - Solve Ratios and Cross Multiplication',
    description: 'Calculate proportions, ratios, and cross multiplication problems. Solve for missing values in proportional relationships with step-by-step solutions.',
    keywords: 'proportion calculator, ratio calculator, cross multiplication, proportion solver, math calculator',
  }
});

export default function ProportionCalculatorPage() {
  return <ProportionCalculatorClient />;
}
