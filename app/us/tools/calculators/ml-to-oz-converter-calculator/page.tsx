import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MlToOzClient from './MlToOzClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'ml-to-oz-converter-calculator',
  category: 'calculators',
  fallback: {
    title: 'Milliliters to Ounces Converter - mL to oz Calculator | Calculators101',
    description: 'Convert milliliters to fluid ounces instantly. Accurate mL to oz conversion for recipes, medicine, and beverages. Supports both US and UK fluid ounces.',
    keywords: '',
  }
});

export default function MlToOzPage() {
  return <MlToOzClient />;
}
