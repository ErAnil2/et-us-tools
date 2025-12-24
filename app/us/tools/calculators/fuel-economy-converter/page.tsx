import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import FuelEconomyConverterClient from './FuelEconomyConverterClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'fuel-economy-converter',
  category: 'calculators',
  fallback: {
    title: 'Fuel Economy Converter | The Economic Times',
    description: 'Free online fuel economy converter. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function FuelEconomyConverterPage() {
  return <FuelEconomyConverterClient />;
}
