import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MortgagePaymentCalculatorClient from './MortgagePaymentCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'mortgage-payment-calculator',
  category: 'calculators',
  fallback: {
    title: 'Mortgage Payment Calculator - Home Loan Payment with PMI & Taxes',
    description: 'Calculate mortgage payments including PMI, property taxes, insurance, and HOA fees. Compare loan terms and analyze affordability with detailed payment breakdown.',
    keywords: 'mortgage payment calculator, home loan calculator, mortgage payment, PMI calculator, property tax calculator, mortgage affordability',
  }
});

export default function MortgagePaymentCalculatorPage() {
  return <MortgagePaymentCalculatorClient />;
}
