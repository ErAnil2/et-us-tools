import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import FuelEconomyCalculatorClient from './FuelEconomyCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'fuel-economy-calculator',
  category: 'calculators',
  fallback: {
    title: 'Fuel Economy Calculator | The Economic Times',
    description: 'Free online fuel economy calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function FuelEconomyCalculatorPage() {
  return <FuelEconomyCalculatorClient />;
}
