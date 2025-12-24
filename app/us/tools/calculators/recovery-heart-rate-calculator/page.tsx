import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import RecoveryHeartRateCalculatorClient from './RecoveryHeartRateCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'recovery-heart-rate-calculator',
  category: 'calculators',
  fallback: {
    title: 'Recovery Heart Rate Calculator - Measure Fitness Level and Recovery',
    description: 'Calculate your heart rate recovery after exercise to assess cardiovascular fitness and training effectiveness. Track recovery metrics for better health.',
    keywords: '',
  }
});

export default function RecoveryHeartRateCalculatorPage() {
  return <RecoveryHeartRateCalculatorClient />;
}
