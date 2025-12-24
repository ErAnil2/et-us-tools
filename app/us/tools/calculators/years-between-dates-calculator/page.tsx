import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import YearsBetweenDatesCalculatorClient from './YearsBetweenDatesCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'years-between-dates-calculator',
  category: 'calculators',
  fallback: {
    title: 'Years Between Dates Calculator - Calculate Date Difference | The Economic Times',
    description: 'Calculate the number of years, months, and days between two dates. Find age, anniversaries, time periods, and date differences with precision.',
    keywords: 'years between dates, date difference, age calculator, time period, date calculator, anniversary calculator',
  }
});

export default function YearsBetweenDatesCalculatorPage() {
  return <YearsBetweenDatesCalculatorClient />;
}
