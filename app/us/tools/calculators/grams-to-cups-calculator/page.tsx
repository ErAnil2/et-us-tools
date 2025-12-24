import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import GramsToCupsCalculatorClient from './GramsToCupsCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'grams-to-cups-calculator',
  category: 'calculators',
  fallback: {
    title: 'Grams to Cups Calculator - Convert Grams to Cups for Cooking',
    description: 'Free grams to cups converter for cooking ingredients. Accurate conversion for flour, sugar, butter, and more. Calculate measurements for 20+ common ingredients.',
    keywords: '',
  }
});

export default function GramsToCupsCalculatorPage() {
  return <GramsToCupsCalculatorClient />;
}
