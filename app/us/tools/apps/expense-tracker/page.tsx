import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ExpenseTrackerClient from './ExpenseTrackerClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'expense-tracker',
  category: 'apps',
  fallback: {
    title: 'Expense Tracker Online - Free Budget & Spending Tracker | The Economic Times',
    description: 'Track expenses online for free! Simple expense tracker to manage spending, create budgets, and monitor financial goals. Easy personal finance management tool.',
    keywords: 'expense tracker, expense tracker online, budget tracker, spending tracker, track expenses, personal finance, money management, budget planner, free expense tracker',
  }
});

export default function ExpenseTrackerPage() {
  return <ExpenseTrackerClient />;
}
