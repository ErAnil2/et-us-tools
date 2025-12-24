import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import KgToLbsConverterCalculatorClient from './KgToLbsConverterCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'kg-to-lbs-converter-calculator',
  category: 'calculators',
  fallback: {
    title: 'Kg To Lbs Converter Calculator | The Economic Times',
    description: 'Free online kg to lbs converter calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function KgToLbsConverterCalculatorPage() {
  return <KgToLbsConverterCalculatorClient />;
}
