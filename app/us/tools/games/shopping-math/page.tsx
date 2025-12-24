import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ShoppingMathClient from './ShoppingMathClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'shopping-math',
  category: 'games',
  fallback: {
    title: 'Shopping Math Game Online - Calculate Discounts & Taxes Free | The Economic Times',
    description: 'Play Shopping Math game online for free! Practice real-world math by calculating discounts, taxes, and tips. Learn practical money skills in realistic shopping scenarios.',
    keywords: 'shopping math, shopping math game, calculate discounts, tax calculator game, practical math, real world math, percentage calculation, money math',
  }
});

export default function ShoppingMathPage() {
  return <ShoppingMathClient />;
}
