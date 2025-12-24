import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CalorieDeficitClient from './CalorieDeficitClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'calorie-deficit-calculator',
  category: 'calculators',
  fallback: {
    title: 'Calorie Deficit Calculator - Calculate Weight Loss Calories | Free Tool',
    description: 'Free calorie deficit calculator to find how many calories to eat for weight loss. Calculate your TDEE, optimal deficit, macros, and weight loss timeline. Safe and effective results.',
    keywords: 'calorie deficit calculator, weight loss calculator, how many calories to lose weight, TDEE calculator, calorie calculator for weight loss, deficit diet calculator, safe calorie deficit',
  }
});

export default function CalorieDeficitPage() {
  return <CalorieDeficitClient />;
}
