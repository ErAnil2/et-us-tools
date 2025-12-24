import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import StepsToCaloriesCalculatorClient from './StepsToCaloriesCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'steps-to-calories-calculator',
  category: 'calculators',
  fallback: {
    title: 'Steps to Calories Calculator - Convert Steps to Calories Burned | The Economic Times',
    description: 'Free steps to calories calculator to estimate calories burned from walking. Calculate calories from daily steps based on weight, pace, and activity level with detailed analytics.',
    keywords: 'steps to calories calculator, steps calories burned, walking calories calculator, pedometer calories, fitness tracker calories, MET calculator',
  }
});

export default function StepsToCaloriesCalculatorPage() {
  return <StepsToCaloriesCalculatorClient />;
}
