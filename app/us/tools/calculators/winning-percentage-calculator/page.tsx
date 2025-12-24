import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import WinningPercentageCalculatorClient from './WinningPercentageCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'winning-percentage-calculator',
  category: 'calculators',
  fallback: {
    title: 'Percentage Calculator',
    description: 'Calculate percentages',
    keywords: 'winning percentage, win rate, sports statistics, team performance, success rate, win loss ratio',
  }
});

export default function WinningPercentageCalculatorPage() {
  return <WinningPercentageCalculatorClient />;
}
