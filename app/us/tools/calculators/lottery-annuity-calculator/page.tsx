import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import LotteryAnnuityCalculatorClient from './LotteryAnnuityCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'lottery-annuity-calculator',
  category: 'calculators',
  fallback: {
    title: 'Lottery Annuity Calculator - Compare Lump Sum vs Annuity Payments | The Economic Times',
    description: 'Calculate and compare lottery annuity payments vs lump sum. Analyze payment schedules, tax implications, and investment opportunities with detailed charts.',
    keywords: 'lottery annuity calculator, lump sum vs annuity, lottery payout calculator, annuity payments, lottery tax calculator',
  }
});

export default function LotteryAnnuityCalculatorPage() {
  return <LotteryAnnuityCalculatorClient />;
}
