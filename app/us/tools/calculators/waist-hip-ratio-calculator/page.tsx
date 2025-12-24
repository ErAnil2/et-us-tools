import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import WaistHipRatioCalculatorClient from './WaistHipRatioCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'waist-hip-ratio-calculator',
  category: 'calculators',
  fallback: {
    title: 'Waist-to-Hip Ratio Calculator - Body Fat Distribution & Health Risk | Free Tool',
    description: 'Free waist-to-hip ratio calculator to assess body fat distribution and health risk. Calculate your WHR with gender-specific health standards and personalized recommendations.',
    keywords: 'waist to hip ratio calculator, WHR calculator, body fat distribution, health risk calculator, waist measurement, hip measurement, apple shape, pear shape, body shape calculator',
  }
});

export default function WaistHipRatioCalculatorPage() {
  return <WaistHipRatioCalculatorClient />;
}
