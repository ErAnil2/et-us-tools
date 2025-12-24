import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MarginCalculatorClient from './MarginCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'margin-calculator',
  category: 'calculators',
  fallback: {
    title: 'Margin Calculator - Calculate Profit Margin Percentage',
    description: 'Calculate profit margin, gross margin, and net margin for your business. Understand your profitability metrics.',
    keywords: 'margin calculator, profit margin calculator, gross margin, net margin, markup calculator',
  }
});

export default function MarginCalculatorPage() {
  return <MarginCalculatorClient />;
}
