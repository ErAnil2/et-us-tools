import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import HoursToDaysCalculatorClient from './HoursToDaysCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'hours-to-days-calculator',
  category: 'calculators',
  fallback: {
    title: 'Hours to Days Calculator - Convert Hours to Days, Weeks, and Months',
    description: 'Convert hours to days, weeks, months, and other time units. Quick and accurate time conversion calculator.',
    keywords: 'hours to days calculator, time converter, hours to days conversion, time calculator, hours converter',
  }
});

export default function HoursToDaysCalculatorPage() {
  return <HoursToDaysCalculatorClient />;
}
