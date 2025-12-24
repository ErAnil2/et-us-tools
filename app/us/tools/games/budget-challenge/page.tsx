import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BudgetChallengeClient from './BudgetChallengeClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'budget-challenge',
  category: 'games',
  fallback: {
    title: 'Budget Challenge Game Online - Free Personal Finance Simulator | The Economic Times',
    description: 'Play Budget Challenge game online for free! Learn budgeting skills by managing virtual monthly income and expenses. Make smart financial decisions in this educational money management game.',
    keywords: 'budget challenge, budget game, personal finance game, budgeting simulator, financial literacy, money management, financial planning, budget planner game',
  }
});

export default function BudgetChallengePage() {
  return <BudgetChallengeClient />;
}
