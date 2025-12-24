import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import AgeInDaysCalculatorClient from './AgeInDaysCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'age-in-days-calculator',
  category: 'calculators',
  fallback: {
    title: 'Age in Days Calculator - Calculate Your Exact Age in Days',
    description: 'Calculate your exact age in days, hours, minutes, and seconds. Find out how many days you have been alive with precise calculations.',
    keywords: 'age in days, days old calculator, age calculator days, how many days old, exact age calculator, days alive calculator',
  }
});

export default function AgeInDaysCalculatorPage() {
  return <AgeInDaysCalculatorClient />;
}
