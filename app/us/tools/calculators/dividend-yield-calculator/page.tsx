import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import DividendYieldCalculatorClient from './DividendYieldCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'dividend-yield-calculator',
  category: 'calculators',
  fallback: {
    title: 'Dividend Yield Calculator - Calculate Stock Dividend Yield | The Economic Times',
    description: 'Calculate dividend yield for stocks. Find annual dividend income and yield percentage.',
    keywords: 'dividend yield calculator, dividend calculator, stock dividend, dividend income',
  }
});

export default function DividendYieldCalculatorPage() {
  return <DividendYieldCalculatorClient />;
}
