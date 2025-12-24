import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MarathonTimeCalculatorClient from './MarathonTimeCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'marathon-time-calculator',
  category: 'calculators',
  fallback: {
    title: 'Marathon Time Calculator - Pace Calculator and Race Time Predictor',
    description: 'Calculate marathon finish times, pace per mile/km, split times, and race predictions. Plan your marathon training and race strategy.',
    keywords: '',
  }
});

export default function MarathonTimeCalculatorPage() {
  return <MarathonTimeCalculatorClient />;
}
