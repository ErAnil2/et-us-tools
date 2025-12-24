import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CurrencyConverterCalculatorClient from './CurrencyConverterCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'currency-converter-calculator',
  category: 'calculators',
  fallback: {
    title: 'Currency Converter Calculator | The Economic Times',
    description: 'Free online currency converter calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function CurrencyConverterCalculatorPage() {
  return <CurrencyConverterCalculatorClient />;
}
