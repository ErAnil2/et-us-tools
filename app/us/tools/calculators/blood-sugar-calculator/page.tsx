import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BloodSugarCalculatorClient from './BloodSugarCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'blood-sugar-calculator',
  category: 'calculators',
  fallback: {
    title: 'Blood Sugar Calculator - Glucose Level Converter | The Economic Times',
    description: 'Convert blood sugar levels between mg/dL and mmol/L. Check if your glucose levels are normal, prediabetic, or diabetic.',
    keywords: 'blood sugar calculator, glucose calculator, diabetes calculator, blood glucose converter',
  }
});

export default function BloodSugarCalculatorPage() {
  return <BloodSugarCalculatorClient />;
}
