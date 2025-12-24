import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import TargetHeartRateCalculatorClient from './TargetHeartRateCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'target-heart-rate-calculator',
  category: 'calculators',
  fallback: {
    title: 'Target Heart Rate Calculator - Training Zones & Max HR | Free Tool',
    description: 'Free target heart rate calculator to find your training zones using the Karvonen formula. Calculate max heart rate, fat burn zone, cardio zone, and personalized training ranges.',
    keywords: 'target heart rate calculator, heart rate zones, max heart rate, fat burning zone, cardio zone, Karvonen formula, training heart rate, exercise intensity, heart rate reserve',
  }
});

export default function TargetHeartRateCalculatorPage() {
  return <TargetHeartRateCalculatorClient />;
}
