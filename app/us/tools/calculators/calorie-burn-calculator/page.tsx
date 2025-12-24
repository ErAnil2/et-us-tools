import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CalorieBurnClient from './CalorieBurnClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'calorie-burn-calculator',
  category: 'calculators',
  fallback: {
    title: 'Calorie Burn Calculator - Calculate Calories Burned by Exercise | Free Tool',
    description: 'Free calorie burn calculator to find how many calories you burn during exercise and daily activities. Calculate calories burned by running, walking, cycling, swimming, and 30+ activities.',
    keywords: 'calorie burn calculator, calories burned calculator, exercise calorie calculator, workout calories, MET calculator, running calories, walking calories, how many calories does exercise burn',
  }
});

export default function CalorieBurnPage() {
  return <CalorieBurnClient />;
}
