import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import WaistToHipRatioCalculatorClient from './WaistToHipRatioCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'waist-to-hip-ratio-calculator',
  category: 'calculators',
  fallback: {
    title: 'Waist to Hip Ratio Calculator - WHR Body Shape & Health Risk',
    description: 'Calculate your waist-to-hip ratio to assess body fat distribution and health risks. Understand your body shape and cardiovascular risk factors.',
    keywords: '',
  }
});

export default function WaistToHipRatioCalculatorPage() {
  return <WaistToHipRatioCalculatorClient />;
}
