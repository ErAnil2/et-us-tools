import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import StockValuationCalculatorClient from './StockValuationCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'stock-valuation-calculator',
  category: 'calculators',
  fallback: {
    title: 'Stock Valuation Calculator - DCF, P/E, PEG Analysis | The Economic Times',
    description: 'Analyze stock value using DCF model, P/E ratio, PEG ratio, P/B ratio, and dividend discount model. Comprehensive stock valuation tools.',
    keywords: 'stock valuation calculator, DCF calculator, PE ratio calculator, PEG ratio, stock analysis, intrinsic value calculator',
  }
});

export default function StockValuationCalculatorPage() {
  return <StockValuationCalculatorClient />;
}
