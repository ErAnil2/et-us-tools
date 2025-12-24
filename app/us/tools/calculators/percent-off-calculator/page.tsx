import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PercentOffCalculatorClient from './PercentOffCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'percent-off-calculator',
  category: 'calculators',
  fallback: {
    title: 'Percent Off Calculator - Calculate Sale Price & Discount Amount | The Economic Times',
    description: 'Calculate percent off discounts instantly. Find sale price, discount amount, and savings from original price and percentage off. Perfect for shopping and sales.',
    keywords: 'percent off, discount calculator, sale price, percentage discount, shopping calculator, savings calculator',
  }
});

export default function PercentOffCalculatorPage() {
  return <PercentOffCalculatorClient />;
}
