import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BodyFatPercentageClient from './BodyFatPercentageClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'body-fat-percentage-calculator',
  category: 'calculators',
  fallback: {
    title: 'Body Fat Percentage Calculator - Multiple Methods | The Economic Times',
    description: 'Calculate body fat percentage using Navy Method, Jackson-Pollock, and BMI-based formulas. Compare results and track your fitness progress.',
    keywords: 'body fat calculator, body fat percentage, navy method, jackson pollock formula, fitness calculator, body composition',
  }
});

export default function BodyFatPercentagePage() {
  return <BodyFatPercentageClient />;
}
