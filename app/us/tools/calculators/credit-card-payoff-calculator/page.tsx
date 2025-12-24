import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CreditCardPayoffCalculatorClient from './CreditCardPayoffCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'credit-card-payoff-calculator',
  category: 'calculators',
  fallback: {
    title: 'Credit Card Payoff Calculator - Calculate Debt Payoff Time | The Economic Times',
    description: 'Calculate how long it will take to pay off your credit card debt. Find monthly payment needed and total interest paid.',
    keywords: 'credit card payoff calculator, debt payoff calculator, credit card calculator, debt repayment',
  }
});

export default function CreditCardPayoffCalculatorPage() {
  return <CreditCardPayoffCalculatorClient />;
}
