import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import FDCalculatorClient from './FDCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'fd-calculator',
  category: 'calculators',
  fallback: {
    title: 'Fixed Deposit Calculator - Calculate FD Returns & Maturity Amount | The Economic Times',
    description: 'Calculate Fixed Deposit maturity amount and returns with our comprehensive FD calculator. Compare different bank rates and tenure options for optimal returns.',
    keywords: 'fd calculator, fixed deposit calculator, fd maturity calculator, bank fd rates, fixed deposit returns',
  }
});

export default function FDCalculatorPage() {
  return <FDCalculatorClient />;
}
