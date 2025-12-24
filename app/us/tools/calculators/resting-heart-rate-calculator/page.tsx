import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import RestingHeartRateCalculatorClient from './RestingHeartRateCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'resting-heart-rate-calculator',
  category: 'calculators',
  fallback: {
    title: 'Resting Heart Rate Calculator - RHR Analysis & Health Assessment',
    description: 'Calculate and analyze your resting heart rate with age and fitness level comparisons. Understand what your RHR means for your health.',
    keywords: '',
  }
});

export default function RestingHeartRateCalculatorPage() {
  return <RestingHeartRateCalculatorClient />;
}
