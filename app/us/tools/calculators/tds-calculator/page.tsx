import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import TDSCalculatorClient from './TDSCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'tds-calculator',
  category: 'calculators',
  fallback: {
    title: 'TDS Calculator - Calculate Tax Deducted at Source | The Economic Times',
    description: 'Calculate TDS (Tax Deducted at Source) with detailed breakup including surcharge and cess. Get accurate TDS calculations instantly.',
    keywords: 'tds calculator, tax deducted at source, tds rate, surcharge, cess, income tax',
  }
});

export default function TDSCalculatorPage() {
  return <TDSCalculatorClient />;
}
