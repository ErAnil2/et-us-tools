import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import StepsToMilesCalculatorClient from './StepsToMilesCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'steps-to-miles-calculator',
  category: 'calculators',
  fallback: {
    title: 'Steps to Miles Calculator - Convert Walking Steps to Distance | Calculators101',
    description: 'Convert daily steps to miles and kilometers. Calculate walking distance from step count with customizable stride length. Perfect for fitness tracking.',
    keywords: '',
  }
});

export default function StepsToMilesCalculatorPage() {
  return <StepsToMilesCalculatorClient />;
}
