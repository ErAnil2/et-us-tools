import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import HomeLoanClient from './HomeLoanClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'home-loan-calculator',
  category: 'calculators',
  fallback: {
    title: 'Home Loan Calculator - Calculate Mortgage EMI & Payments | The Economic Times',
    description: 'Calculate home loan EMI, mortgage payments, and amortization schedule. Compare different loan scenarios and find the best home loan options.',
    keywords: 'home loan calculator, mortgage calculator, home loan EMI, mortgage payment calculator, home loan interest rate',
  }
});

export default function HomeLoanPage() {
  return <HomeLoanClient />;
}
