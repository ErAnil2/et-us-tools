import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MegaMillionsPayoutCalculatorClient from './MegaMillionsPayoutCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'mega-millions-payout-calculator',
  category: 'calculators',
  fallback: {
    title: 'Mega Millions Payout Calculator - Lump Sum vs Annuity Tax Analysis | The Economic Times',
    description: 'Calculate Mega Millions payouts, compare lump sum vs annuity options, analyze taxes, and understand Megaplier effects with detailed charts.',
    keywords: 'mega millions calculator, mega millions payout, lump sum vs annuity, megaplier calculator, lottery tax calculator',
  }
});

export default function MegaMillionsPayoutCalculatorPage() {
  return <MegaMillionsPayoutCalculatorClient />;
}
