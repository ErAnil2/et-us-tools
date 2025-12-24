import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import WeightGainCalculatorClient from './WeightGainCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'weight-gain-calculator',
  category: 'calculators',
  fallback: {
    title: 'Weight Gain Calculator - Calories & Macros for Muscle Building | Free Tool',
    description: 'Free weight gain calculator to find calories and macros needed for healthy weight gain. Calculate your calorie surplus, protein needs, and timeline to reach your goal weight.',
    keywords: 'weight gain calculator, calorie surplus calculator, muscle gain calculator, bulking calculator, how many calories to gain weight, mass gain calculator, lean bulk calculator',
  }
});

export default function WeightGainCalculatorPage() {
  return <WeightGainCalculatorClient />;
}
