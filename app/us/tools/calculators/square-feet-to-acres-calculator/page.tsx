import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SquareFeetToAcresCalculatorClient from './SquareFeetToAcresCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'square-feet-to-acres-calculator',
  category: 'calculators',
  fallback: {
    title: 'Square Feet to Acres Calculator - Land Area Converter',
    description: 'Convert square feet to acres and acres to square feet. Perfect for real estate, land measurement, and property calculations.',
    keywords: '',
  }
});

export default function SquareFeetToAcresCalculatorPage() {
  return <SquareFeetToAcresCalculatorClient />;
}
