import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BMICalculatorClient from './BMICalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'bmi-calculator',
  category: 'calculators',
  fallback: {
    title: 'BMI Calculator - Body Mass Index Calculator | The Economic Times',
    description: 'Calculate your BMI (Body Mass Index) and understand your weight status. Get personalized health insights and recommendations.',
    keywords: 'bmi calculator, body mass index, weight status, health calculator, obesity calculator',
  }
});

export default function BMICalculatorPage() {
  return <BMICalculatorClient />;
}
