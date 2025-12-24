import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CalorieCalculatorClient from './CalorieCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'calorie-calculator',
  category: 'calculators',
  fallback: {
    title: 'Calorie Calculator - Calculate Daily Calorie Needs & TDEE | Free Online Tool',
    description: 'Free calorie calculator to find your daily calorie needs based on age, gender, height, weight, and activity level. Calculate BMR, TDEE, and macros for weight loss, maintenance, or muscle gain.',
    keywords: 'calorie calculator, daily calorie needs, TDEE calculator, calorie intake calculator, BMR calculator, weight loss calculator, macro calculator, how many calories should I eat',
  }
});

export default function CalorieCalculatorPage() {
  return <CalorieCalculatorClient />;
}
