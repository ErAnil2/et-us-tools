import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PersonalLoanClient from './PersonalLoanClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'personal-loan-calculator',
  category: 'calculators',
  fallback: {
    title: 'Personal Loan Calculator - Calculate Personal Loan EMI & Payments | The Economic Times',
    description: 'Calculate personal loan EMI, monthly payments with our comprehensive personal loan calculator. Compare loan scenarios and find the best personal loan options.',
    keywords: 'personal loan calculator, personal loan EMI, loan payment calculator, unsecured loan calculator, personal loan rates',
  }
});

export default function PersonalLoanPage() {
  return <PersonalLoanClient />;
}
