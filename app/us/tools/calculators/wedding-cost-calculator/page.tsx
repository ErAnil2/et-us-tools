import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import WeddingCostCalculatorClient from './WeddingCostCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'wedding-cost-calculator',
  category: 'calculators',
  fallback: {
    title: 'Wedding Cost Calculator - Complete Wedding Budget Planner & Breakdown',
    description: 'Calculate your wedding costs with detailed category breakdowns. Plan your perfect wedding budget including venue, catering, attire, photography, flowers, and all expenses.',
    keywords: 'wedding cost calculator, wedding budget planner, wedding expenses, venue cost, catering calculator, wedding planning budget',
  }
});

export default function WeddingCostCalculatorPage() {
  return <WeddingCostCalculatorClient />;
}
