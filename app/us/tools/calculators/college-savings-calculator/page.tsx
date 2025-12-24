import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CollegeSavingsClient from './CollegeSavingsClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'college-savings-calculator',
  category: 'calculators',
  fallback: {
    title: 'College Savings Calculator - Plan Education Expenses with 529 Plans | The Economic Times',
    description: 'Calculate college savings with our comprehensive calculator. Plan for education expenses, analyze 529 plans, and project future college costs with inflation.',
    keywords: 'college savings calculator, 529 plan calculator, education savings, college cost calculator, education expenses planning',
  }
});

export default function CollegeSavingsPage() {
  return <CollegeSavingsClient />;
}
