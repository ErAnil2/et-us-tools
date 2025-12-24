import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MilesToKilometersClient from './MilesToKilometersClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'miles-to-kilometers-calculator',
  category: 'calculators',
  fallback: {
    title: 'Miles to Kilometers Calculator - Distance Converter',
    description: 'Convert miles to kilometers and km to miles. Perfect for travel planning, running, and international distance conversions.',
    keywords: '',
  }
});

export default function MilesToKilometersPage() {
  return <MilesToKilometersClient />;
}
