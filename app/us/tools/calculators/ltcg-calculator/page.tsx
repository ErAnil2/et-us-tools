import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import LTCGCalculatorClient from './LTCGCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'ltcg-calculator',
  category: 'calculators',
  fallback: {
    title: 'LTCG Calculator - Calculate Long Term Capital Gains Tax | The Economic Times',
    description: 'Calculate Long Term Capital Gains (LTCG) tax on stocks, bonds, real estate, and other investments. Get accurate LTCG tax calculations for US tax planning.',
    keywords: 'ltcg calculator, long term capital gains, capital gains tax, stock ltcg, investment tax, usa capital gains',
  }
});

export default function LtcgCalculatorPage() {
  return <LTCGCalculatorClient />;
}
