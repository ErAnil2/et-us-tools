import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MarkupCalculatorClient from './MarkupCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'markup-calculator',
  category: 'calculators',
  fallback: {
    title: 'Markup Calculator - Calculate Product Markup Percentage',
    description: 'Calculate markup percentage, selling price, and profit for your products. Essential tool for pricing strategy.',
    keywords: 'markup calculator, markup percentage, price calculator, profit markup, selling price calculator',
  }
});

export default function MarkupCalculatorPage() {
  return <MarkupCalculatorClient />;
}
