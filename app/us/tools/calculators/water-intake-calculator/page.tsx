import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import WaterIntakeCalculatorClient from './WaterIntakeCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'water-intake-calculator',
  category: 'calculators',
  fallback: {
    title: 'Water Intake Calculator - Daily Hydration Needs | Free Tool',
    description: 'Free water intake calculator to find your optimal daily hydration. Calculate personalized water needs based on weight, activity level, climate, and health conditions.',
    keywords: 'water intake calculator, daily water calculator, hydration calculator, how much water should I drink, water consumption calculator, hydration needs',
  }
});

export default function WaterIntakeCalculatorPage() {
  return <WaterIntakeCalculatorClient />;
}
