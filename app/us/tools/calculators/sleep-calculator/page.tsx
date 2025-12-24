import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SleepCalculatorClient from './SleepCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'sleep-calculator',
  category: 'calculators',
  fallback: {
    title: 'Sleep Calculator - Optimal Bedtime & Wake Time Calculator | Calculators101',
    description: 'Calculate optimal sleep and wake times based on sleep cycles. Find the best bedtime for quality rest and wake up refreshed using sleep cycle science.',
    keywords: 'sleep calculator, bedtime calculator, sleep cycle, wake time calculator, sleep schedule, optimal sleep, REM sleep, sleep hygiene',
  }
});

export default function SleepCalculatorPage() {
  return <SleepCalculatorClient />;
}
