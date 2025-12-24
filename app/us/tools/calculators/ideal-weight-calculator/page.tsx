import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import IdealWeightCalculatorClient from './IdealWeightCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'ideal-weight-calculator',
  category: 'calculators',
  fallback: {
    title: 'Ideal Weight Calculator - Find Your Ideal Body Weight | Free Tool',
    description: 'Free ideal weight calculator using 4 scientific formulas (Hamwi, Devine, Robinson, Miller). Calculate your ideal body weight based on height, gender, and frame size. Get BMI-based healthy weight range.',
    keywords: 'ideal weight calculator, ideal body weight, IBW calculator, healthy weight range, Hamwi formula, Devine formula, Robinson formula, Miller formula, target weight calculator, frame size weight',
  }
});

export default function IdealWeightCalculatorPage() {
  return <IdealWeightCalculatorClient />;
}
