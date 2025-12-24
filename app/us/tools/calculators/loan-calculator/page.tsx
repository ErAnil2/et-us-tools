import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import LoanCalculatorClient from './LoanCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'loan-calculator',
  category: 'calculators',
  fallback: {
    title: 'Loan Calculator - Calculate Monthly Loan Payments | The Economic Times',
    description: 'Calculate your loan payments, total interest, and amortization schedule. Compare different loan terms and interest rates.',
    keywords: 'loan calculator, monthly payment calculator, loan payment, interest calculator, amortization calculator',
  }
});

export default function LoanCalculatorPage() {
  return <LoanCalculatorClient />;
}
