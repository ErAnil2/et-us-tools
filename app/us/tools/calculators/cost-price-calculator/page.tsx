import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CostPriceClient from './CostPriceClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'cost-price-calculator',
  category: 'calculators',
  fallback: {
    title: 'Cost Price Calculator - Calculate Product Cost from Selling Price',
    description: 'Calculate cost price from selling price and markup percentage. Free cost price calculator for retailers, wholesalers, and business owners.',
    keywords: 'cost price calculator, cost calculator, reverse markup calculator, product cost, wholesale price',
  }
});

export default function CostPricePage() {
  return <CostPriceClient />;
}
