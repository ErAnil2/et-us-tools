import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import AutoLoanCalculatorClient from './AutoLoanCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'auto-loan-calculator',
  category: 'calculators',
  fallback: {
    title: 'Auto Loan Calculator - Car Payment & Interest Calculator | The Economic Times',
    description: 'Calculate auto loan payments, total interest, and compare financing options. Find the best car loan terms for your budget.',
    keywords: 'auto loan calculator, car payment calculator, vehicle financing, car loan interest, monthly payment calculator',
  }
});

export default function AutoLoanCalculatorPage() {
  return <AutoLoanCalculatorClient />;
}
