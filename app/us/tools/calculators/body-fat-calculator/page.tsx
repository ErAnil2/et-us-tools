import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BodyFatCalculatorClient from './BodyFatCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'body-fat-calculator',
  category: 'calculators',
  fallback: {
    title: 'Body Fat Calculator - Calculate Body Fat Percentage | The Economic Times',
    description: 'Calculate your body fat percentage using the US Navy method or BMI-based formula. Get accurate body composition analysis and health insights.',
    keywords: 'body fat calculator, body fat percentage, fitness calculator, body composition, US Navy method, lean body mass',
  }
});

export default function BodyFatCalculatorPage() {
  return <BodyFatCalculatorClient />;
}
