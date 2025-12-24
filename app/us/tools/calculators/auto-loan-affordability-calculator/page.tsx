import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import AutoLoanAffordabilityClient from './AutoLoanAffordabilityClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'auto-loan-affordability-calculator',
  category: 'calculators',
  fallback: {
    title: 'Auto Loan Affordability Calculator - How Much Car Can I Afford? | The Economic Times',
    description: 'Calculate how much car you can afford based on your income, expenses, and debt. Get personalized recommendations for your auto loan budget.',
    keywords: 'auto loan affordability, car affordability, how much car can I afford, car budget calculator, auto financing budget',
  }
});

export default function AutoLoanAffordabilityPage() {
  return <AutoLoanAffordabilityClient />;
}
