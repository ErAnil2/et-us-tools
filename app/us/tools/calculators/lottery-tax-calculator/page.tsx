import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import LotteryTaxCalculatorClient from './LotteryTaxCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'lottery-tax-calculator',
  category: 'calculators',
  fallback: {
    title: 'Lottery Tax Calculator - Calculate Lottery Winnings After Taxes',
    description: 'Calculate lottery taxes on your winnings with federal and state tax rates. Understand your lottery payout after taxes.',
    keywords: 'lottery tax calculator, lottery winnings tax, powerball tax calculator, mega millions tax, lottery payout calculator',
  }
});

export default function LotteryTaxCalculatorPage() {
  return <LotteryTaxCalculatorClient />;
}
