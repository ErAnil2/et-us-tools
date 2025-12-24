import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import LengthConverterClient from './LengthConverterClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'length-converter',
  category: 'calculators',
  fallback: {
    title: 'Length Converter - Convert Between Length Units | The Economic Times',
    description: 'Convert between different units of length including metric and imperial measurements. Free online length converter with instant results.',
    keywords: '',
  }
});

export default function LengthConverterPage() {
  return <LengthConverterClient />;
}
