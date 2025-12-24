import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BMRCalculatorClient from './BMRCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'bmr-calculator',
  category: 'calculators',
  fallback: {
    title: 'BMR Calculator - Basal Metabolic Rate Calculator',
    description: 'Calculate your Basal Metabolic Rate (BMR) and daily calorie needs. Find out how many calories you burn at rest.',
    keywords: 'BMR calculator, basal metabolic rate, metabolism calculator, calorie burn, TDEE calculator',
  }
});

export default function BMRCalculatorPage() {
  return <BMRCalculatorClient />;
}
