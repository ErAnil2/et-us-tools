import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MortgageRefinanceClient from './MortgageRefinanceClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'mortgage-refinance-calculator',
  category: 'calculators',
  fallback: {
    title: 'Mortgage Refinance Calculator - Should You Refinance? | The Economic Times',
    description: 'Calculate potential savings from refinancing your mortgage. Compare current vs new loan terms and find break-even point.',
    keywords: 'mortgage refinance, refinancing calculator, mortgage savings, loan comparison, refinance break even',
  }
});

export default function MortgageRefinancePage() {
  return <MortgageRefinanceClient />;
}
