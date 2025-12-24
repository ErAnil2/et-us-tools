import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BudgetCalculatorClient from './BudgetCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'budget-calculator',
  category: 'calculators',
  fallback: {
    title: 'Budget Calculator - Plan Your Monthly Budget | The Economic Times',
    description: 'Create and manage your monthly budget. Track income, expenses, and savings to achieve your financial goals.',
    keywords: 'budget calculator, monthly budget planner, expense tracker, budget planner',
  }
});

export default function BudgetCalculatorPage() {
  return <BudgetCalculatorClient />;
}
