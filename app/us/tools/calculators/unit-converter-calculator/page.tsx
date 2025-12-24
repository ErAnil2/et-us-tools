import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import UnitConverterCalculatorClient from './UnitConverterCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'unit-converter-calculator',
  category: 'calculators',
  fallback: {
    title: 'Unit Converter Calculator - Convert Length, Weight, Temperature & More | Calculators101',
    description: 'Universal unit converter for length, weight, temperature, volume, area, and more. Convert between metric, imperial, and other measurement systems instantly.',
    keywords: 'unit converter, measurement converter, length converter, weight converter, temperature converter, metric imperial',
  }
});

export default function UnitConverterCalculatorPage() {
  return <UnitConverterCalculatorClient />;
}
