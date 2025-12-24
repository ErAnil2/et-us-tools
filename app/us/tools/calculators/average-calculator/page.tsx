import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import AverageCalculatorClient from './AverageCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'average-calculator',
  category: 'calculators',
  fallback: {
    title: 'Average Calculator - Mean, Median, Mode & Weighted Average | Free Tool',
    description: 'Free average calculator for mean, median, mode, weighted average, geometric mean, and harmonic mean. Includes variance, standard deviation, and complete statistical analysis.',
    keywords: 'average calculator, mean calculator, median calculator, mode calculator, weighted average, geometric mean, harmonic mean, standard deviation, variance, statistics calculator',
  }
});

export default function AverageCalculatorPage() {
  return <AverageCalculatorClient />;
}
