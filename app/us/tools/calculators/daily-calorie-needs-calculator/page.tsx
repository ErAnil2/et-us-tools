import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import DailyCalorieNeedsCalculatorClient from './DailyCalorieNeedsCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'daily-calorie-needs-calculator',
  category: 'calculators',
  fallback: {
    title: 'Daily Calorie Needs Calculator - TDEE & BMR Calculator | The Economic Times',
    description: 'Calculate your daily calorie needs with our free TDEE and BMR calculator. Get personalized calorie targets for weight loss, maintenance, or muscle gain.',
    keywords: '',
  }
});

export default function DailyCalorieNeedsCalculatorPage() {
  return <DailyCalorieNeedsCalculatorClient />;
}
