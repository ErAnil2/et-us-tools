import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import OzMlConverterCalculatorClient from './OzMlConverterCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'oz-ml-converter-calculator',
  category: 'calculators',
  fallback: {
    title: 'Ounces to Milliliters Converter - oz to mL Calculator | Calculators101',
    description: 'Convert fluid ounces to milliliters instantly. Accurate oz to mL conversion for cooking, medicine, and science. Includes both US and UK fluid ounce conversions.',
    keywords: '',
  }
});

export default function OzMlConverterCalculatorPage() {
  return <OzMlConverterCalculatorClient />;
}
