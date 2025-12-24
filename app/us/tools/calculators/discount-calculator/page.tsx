import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import DiscountCalculatorClient from './DiscountCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'discount-calculator',
  category: 'calculators',
  fallback: {
    title: 'Discount Calculator - Calculate Sale Prices and Savings | The Economic Times',
    description: 'Calculate discounts, sale prices, and savings. Find out how much you save with percentage discounts.',
    keywords: 'discount calculator, sale price calculator, percentage off calculator, savings calculator',
  }
});

export default function DiscountCalculatorPage() {
  return <DiscountCalculatorClient />;
}
