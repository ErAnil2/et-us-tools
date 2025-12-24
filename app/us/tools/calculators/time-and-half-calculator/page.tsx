import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import TimeAndHalfCalculatorClient from './TimeAndHalfCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'time-and-half-calculator',
  category: 'calculators',
  fallback: {
    title: 'Time and Half Calculator - Calculate Overtime Pay | The Economic Times',
    description: 'Calculate overtime pay at time and half rates. Determine your total pay with regular hours, overtime hours, and double time calculations.',
    keywords: 'time and half calculator, overtime pay calculator, time and a half, overtime rate calculator, wage calculator',
  }
});

export default function TimeAndHalfCalculatorPage() {
  return <TimeAndHalfCalculatorClient />;
}
