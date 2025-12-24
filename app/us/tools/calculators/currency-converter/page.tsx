import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CurrencyConverterClient from './CurrencyConverterClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'currency-converter',
  category: 'calculators',
  fallback: {
    title: 'Currency Converter - Convert World Currencies | The Economic Times',
    description: 'Convert between world currencies with real-time exchange rates. USD, EUR, GBP, INR and more.',
    keywords: 'currency converter, exchange rate calculator, currency exchange, forex converter',
  }
});

export default function CurrencyConverterPage() {
  return <CurrencyConverterClient />;
}
