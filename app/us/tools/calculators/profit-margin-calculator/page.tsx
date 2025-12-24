import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ProfitMarginCalculatorClient from './ProfitMarginCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'profit-margin-calculator',
  category: 'calculators',
  fallback: {
    title: 'Profit Margin Calculator - Calculate Gross & Net Profit Margins | The Economic Times',
    description: 'Calculate gross profit margin, net profit margin, and markup for your business. Free profit margin calculator with detailed analysis and industry benchmarks.',
    keywords: 'profit margin calculator, gross margin, net margin, business calculator, markup calculator, profit analysis',
  }
});

export default function ProfitMarginCalculatorPage() {
  return <ProfitMarginCalculatorClient />;
}
