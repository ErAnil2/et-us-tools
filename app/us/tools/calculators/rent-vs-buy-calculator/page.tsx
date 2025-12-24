import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import RentVsBuyCalculatorClient from './RentVsBuyCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'rent-vs-buy-calculator',
  category: 'calculators',
  fallback: {
    title: 'Rent vs Buy Calculator - Should You Rent or Buy a Home? | Calculators101',
    description: 'Compare the costs of renting vs buying a home. Calculate total costs, break-even point, and long-term financial impact to make the best housing decision.',
    keywords: '',
  }
});

export default function RentVsBuyCalculatorPage() {
  return <RentVsBuyCalculatorClient />;
}
