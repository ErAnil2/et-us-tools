import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import OuncesToCupsCalculatorClient from './OuncesToCupsCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'ounces-to-cups-calculator',
  category: 'calculators',
  fallback: {
    title: 'Ounces to Cups Calculator - Convert Fluid Ounces to Cups | Calculators101',
    description: 'Convert fluid ounces to cups instantly. Perfect for cooking, baking, and recipe conversions. Includes common measurements and conversion table.',
    keywords: '',
  }
});

export default function OuncesToCupsCalculatorPage() {
  return <OuncesToCupsCalculatorClient />;
}
