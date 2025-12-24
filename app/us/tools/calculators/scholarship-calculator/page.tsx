import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ScholarshipCalculatorClient from './ScholarshipCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'scholarship-calculator',
  category: 'calculators',
  fallback: {
    title: 'Scholarship Calculator - Calculate Education Funding and Financial Aid',
    description: 'Calculate scholarship amounts, education costs, and funding gaps. Plan college financing with merit-based and need-based scholarships.',
    keywords: 'scholarship calculator, education funding, college costs, financial aid calculator, student financing',
  }
});

export default function ScholarshipCalculatorPage() {
  return <ScholarshipCalculatorClient />;
}
