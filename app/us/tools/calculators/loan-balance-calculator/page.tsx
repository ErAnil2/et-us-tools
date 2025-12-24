import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import LoanBalanceCalculatorClient from './LoanBalanceCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'loan-balance-calculator',
  category: 'calculators',
  fallback: {
    title: 'Loan Balance Calculator - Calculate Remaining Loan Balance',
    description: 'Calculate your remaining loan balance with principal, interest breakdown, and payment history analysis.',
    keywords: 'loan balance calculator, remaining balance calculator, loan payoff calculator, mortgage balance, principal balance',
  }
});

export default function LoanBalanceCalculatorPage() {
  return <LoanBalanceCalculatorClient />;
}
