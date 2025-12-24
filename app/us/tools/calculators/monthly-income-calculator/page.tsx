import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MonthlyIncomeClient from './MonthlyIncomeClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'monthly-income-calculator',
  category: 'calculators',
  fallback: {
    title: 'Monthly Income Calculator - Calculate Monthly Salary from Annual or Hourly | The Economic Times',
    description: 'Free monthly income calculator to convert annual salary or hourly wage to monthly income. Calculate your monthly earnings with our easy-to-use calculator.',
    keywords: '',
  }
});

export default function MonthlyIncomePage() {
  return <MonthlyIncomeClient />;
}
