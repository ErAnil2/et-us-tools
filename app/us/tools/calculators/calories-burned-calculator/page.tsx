import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CaloriesBurnedCalculatorClient from './CaloriesBurnedCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'calories-burned-calculator',
  category: 'calculators',
  fallback: {
    title: 'Calories Burned Calculator | The Economic Times',
    description: 'Free online calories burned calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function CaloriesBurnedCalculatorPage() {
  return <CaloriesBurnedCalculatorClient />;
}
