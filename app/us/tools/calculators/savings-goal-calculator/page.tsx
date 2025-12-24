import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SavingsGoalClient from './SavingsGoalClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'savings-goal-calculator',
  category: 'calculators',
  fallback: {
    title: 'Savings Goal Calculator - Plan Your Financial Goals | The Economic Times',
    description: 'Achieve your financial dreams with our Savings Goal Calculator. Calculate monthly savings needed, track progress, and optimize your saving strategy.',
    keywords: 'savings goal calculator, financial planning, savings plan, monthly savings, goal tracker, financial goals',
  }
});

export default function SavingsGoalPage() {
  return <SavingsGoalClient />;
}
