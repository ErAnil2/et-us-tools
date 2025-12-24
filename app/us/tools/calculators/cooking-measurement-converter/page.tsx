import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CookingMeasurementConverterClient from './CookingMeasurementConverterClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'cooking-measurement-converter',
  category: 'calculators',
  fallback: {
    title: 'Cooking Measurement Converter | The Economic Times',
    description: 'Free online cooking measurement converter. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function CookingMeasurementConverterPage() {
  return <CookingMeasurementConverterClient />;
}
