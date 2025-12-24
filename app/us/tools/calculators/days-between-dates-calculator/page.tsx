import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import DaysBetweenDatesClient from './DaysBetweenDatesClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'days-between-dates-calculator',
  category: 'calculators',
  fallback: {
    title: 'Days Between Dates Calculator - Calculate Date Difference | Calculators101',
    description: 'Calculate the number of days between two dates. Find duration in days, weeks, months, and years. Perfect for planning events, tracking time, and project management.',
    keywords: 'days between dates, date calculator, date difference, time calculator, duration calculator, date range',
  }
});

export default function DaysBetweenDatesPage() {
  return <DaysBetweenDatesClient />;
}
