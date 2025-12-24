import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ShiftCalculatorClient from './ShiftCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'shift-calculator',
  category: 'calculators',
  fallback: {
    title: 'Shift Calculator - Calculate Work Shift Schedules | The Economic Times',
    description: 'Calculate work shift schedules, break times, and rotations. Plan your work shifts efficiently with our easy-to-use shift calculator.',
    keywords: 'shift calculator, work schedule calculator, shift planner, break time calculator, rotation schedule',
  }
});

export default function ShiftCalculatorPage() {
  return <ShiftCalculatorClient />;
}
