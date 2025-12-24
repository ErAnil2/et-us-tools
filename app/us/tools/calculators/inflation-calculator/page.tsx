import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import InflationCalculatorClient from './InflationCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'inflation-calculator',
  category: 'calculators',
  fallback: {
    title: 'Inflation Calculator - Calculate Purchasing Power & Price Changes | The Economic Times',
    description: 'Calculate how inflation affects purchasing power over time. Compare historical and future prices, analyze cost of living changes with detailed inflation calculations.',
    keywords: 'inflation calculator, purchasing power, cost of living, price changes, historical inflation, CPI calculator, economic calculator',
  }
});

export default function InflationCalculatorPage() {
  return <InflationCalculatorClient />;
}
