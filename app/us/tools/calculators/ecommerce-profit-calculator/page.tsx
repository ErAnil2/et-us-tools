import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import EcommerceProfitCalculatorClient from './EcommerceProfitCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'ecommerce-profit-calculator',
  category: 'calculators',
  fallback: {
    title: 'Ecommerce Profit Calculator | The Economic Times',
    description: 'Free online ecommerce profit calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function EcommerceProfitCalculatorPage() {
  return <EcommerceProfitCalculatorClient />;
}
