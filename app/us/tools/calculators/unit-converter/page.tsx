import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import UnitConverterClient from './UnitConverterClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'unit-converter',
  category: 'calculators',
  fallback: {
    title: 'Universal Unit Converter - Length, Weight, Temperature & More | The Economic Times',
    description: 'Convert between units of measurement including length, weight, temperature, area, volume, speed, and pressure. Comprehensive unit conversion tool.',
    keywords: 'unit converter, measurement converter, metric converter, imperial converter, length converter, weight converter, temperature converter',
  }
});

export default function UnitConverterPage() {
  return <UnitConverterClient />;
}
