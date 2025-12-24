import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import WalkingCalorieCalculatorClient from './WalkingCalorieCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'walking-calorie-calculator',
  category: 'calculators',
  fallback: {
    title: 'Walking Calorie Calculator - Calories Burned Walking | The Economic Times',
    description: 'Calculate calories burned while walking. Find out how many calories you burn based on distance, time, weight, and walking speed with personalized insights.',
    keywords: 'walking calorie calculator, calories burned walking, walking calories, steps to calories, MET values, exercise calculator',
  }
});

export default function WalkingCalorieCalculatorPage() {
  return <WalkingCalorieCalculatorClient />;
}
