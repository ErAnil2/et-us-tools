import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CAGRCalculatorClient from './CAGRCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'cagr-calculator',
  category: 'calculators',
  fallback: {
    title: 'CAGR Calculator - Compound Annual Growth Rate | The Economic Times',
    description: 'Calculate Compound Annual Growth Rate (CAGR) for investments. Measure investment performance over time.',
    keywords: 'CAGR calculator, compound annual growth rate, investment calculator, growth rate calculator',
  }
});

export default function CAGRCalculatorPage() {
  return <CAGRCalculatorClient />;
}
