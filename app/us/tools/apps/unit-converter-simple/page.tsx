import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import UnitConverterSimpleClient from './UnitConverterSimpleClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'unit-converter-simple',
  category: 'apps',
  fallback: {
    title: 'Unit Converter Online - Free Length, Weight & Temperature Tool | The Economic Times',
    description: 'Convert units online for free! Simple unit converter for length, weight, temperature, volume, and more. Instant metric and imperial unit conversions.',
    keywords: 'unit converter, unit converter online, convert units, length converter, weight converter, temperature converter, metric conversion, unit conversion tool',
  }
});

export default function UnitConverterSimplePage() {
  return <UnitConverterSimpleClient />;
}
