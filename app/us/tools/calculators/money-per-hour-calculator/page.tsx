import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MoneyPerHourClient from './MoneyPerHourClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'money-per-hour-calculator',
  category: 'calculators',
  fallback: {
    title: 'Money Per Hour Calculator - Calculate Hourly Earnings Rate | The Economic Times',
    description: 'Free money per hour calculator to determine your true hourly earning rate from any income source. Calculate earnings per hour for jobs, projects, and investments.',
    keywords: '',
  }
});

export default function MoneyPerHourPage() {
  return <MoneyPerHourClient />;
}
