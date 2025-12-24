import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PokerOddsCalculatorClient from './PokerOddsCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'poker-odds-calculator',
  category: 'calculators',
  fallback: {
    title: 'Poker Odds Calculator - Calculate Winning Probabilities | The Economic Times',
    description: 'Calculate poker odds and winning probabilities for Texas Hold\'em. Get hand strength and pot odds calculations.',
    keywords: 'poker odds calculator, texas holdem odds, poker probability, hand strength calculator, pre-flop odds, outs calculator',
  }
});

export default function PokerOddsCalculatorPage() {
  return <PokerOddsCalculatorClient />;
}
