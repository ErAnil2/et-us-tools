import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import WaterWeightCalculatorClient from './WaterWeightCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'water-weight-calculator',
  category: 'calculators',
  fallback: {
    title: 'Water Weight Calculator - Track Water Retention and Loss',
    description: 'Calculate water weight fluctuations, retention causes, and healthy hydration levels. Track water weight changes for better health monitoring.',
    keywords: '',
  }
});

export default function WaterWeightCalculatorPage() {
  return <WaterWeightCalculatorClient />;
}
