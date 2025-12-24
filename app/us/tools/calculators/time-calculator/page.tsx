import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import TimeCalculatorClient from './TimeCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'time-calculator',
  category: 'calculators',
  fallback: {
    title: 'Time Calculator - Add & Subtract Time | Free Online Tool',
    description: 'Free time calculator to add and subtract hours, minutes, and seconds. Calculate time differences, work hours, and convert between time formats instantly.',
    keywords: 'time calculator, add time, subtract time, time duration, hours calculator, time math, work hours, decimal hours',
  }
});

export default function TimeCalculatorPage() {
  return <TimeCalculatorClient />;
}
