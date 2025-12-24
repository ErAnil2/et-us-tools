import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import InvestmentCalculatorClient from './InvestmentCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'investment-calculator',
  category: 'calculators',
  fallback: {
    title: 'Investment Calculator | The Economic Times',
    description: 'Calculate investment growth and returns. Free online investment calculator for financial planning.',
    keywords: 'investment calculator, compound interest, investment growth, financial calculator',
  }
});

export default function InvestmentCalculatorPage() {
  return <InvestmentCalculatorClient />;
}
