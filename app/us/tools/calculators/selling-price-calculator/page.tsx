import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SellingPriceCalculatorClient from './SellingPriceCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'selling-price-calculator',
  category: 'calculators',
  fallback: {
    title: 'Selling Price Calculator - Calculate Optimal Product Pricing',
    description: 'Calculate optimal selling price based on cost price and desired markup percentage. Free selling price calculator for retailers and business owners.',
    keywords: 'selling price calculator, pricing calculator, markup calculator, retail price, product pricing',
  }
});

export default function SellingPriceCalculatorPage() {
  return <SellingPriceCalculatorClient />;
}
