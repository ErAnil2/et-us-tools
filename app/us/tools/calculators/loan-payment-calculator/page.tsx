import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import LoanPaymentClient from './LoanPaymentClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'loan-payment-calculator',
  category: 'calculators',
  fallback: {
    title: 'Loan Payment Calculator - Monthly Payment & Amortization Schedule | The Economic Times',
    description: 'Calculate loan monthly payments, total interest, and view detailed amortization schedule. Free calculator for auto loans, mortgages, and personal loans with payment breakdown.',
    keywords: 'loan payment calculator, monthly payment calculator, amortization calculator, auto loan calculator, mortgage payment calculator, loan interest calculator',
  }
});

export default function LoanPaymentPage() {
  return <LoanPaymentClient />;
}
