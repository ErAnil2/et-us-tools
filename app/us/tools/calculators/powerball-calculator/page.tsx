import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PowerballCalculatorClient from './PowerballCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'powerball-calculator',
  category: 'calculators',
  fallback: {
    title: 'Powerball Calculator - Calculate Odds, Payouts & Tax Impact | The Economic Times',
    description: 'Calculate your Powerball odds, potential winnings, and tax impact. Compare lump sum vs annuity payouts with comprehensive analysis and visual charts.',
    keywords: 'powerball calculator, lottery calculator, powerball odds, lottery tax calculator, powerball payout, lottery winnings calculator',
  }
});

export default function PowerballCalculatorPage() {
  return <PowerballCalculatorClient />;
}
