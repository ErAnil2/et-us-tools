import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import StatisticsCalculatorClient from './StatisticsCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'statistics-calculator',
  category: 'calculators',
  fallback: {
    title: 'Statistics Calculator - Mean, Median, Mode, Standard Deviation | Free Tool',
    description: 'Free statistics calculator with mean, median, mode, standard deviation, variance, quartiles, and distribution analysis. Step-by-step calculations for sample and population data.',
    keywords: 'statistics calculator, mean median mode, standard deviation, variance, descriptive statistics, data analysis, quartiles, IQR, skewness',
  }
});

export default function StatisticsCalculatorPage() {
  return <StatisticsCalculatorClient />;
}
