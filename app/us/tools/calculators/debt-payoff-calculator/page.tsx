import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import DebtPayoffClient from './DebtPayoffClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'debt-payoff-calculator',
  category: 'calculators',
  fallback: {
    title: 'Debt Payoff Calculator - Credit Card & Loan Payment Planner | The Economic Times',
    description: 'Calculate how long it takes to pay off debt with different payment strategies. Compare debt avalanche vs snowball methods to save money on interest.',
    keywords: 'debt payoff calculator, credit card calculator, loan payoff, debt snowball, debt avalanche, debt consolidation calculator',
  }
});

export default function DebtPayoffPage() {
  return <DebtPayoffClient />;
}
