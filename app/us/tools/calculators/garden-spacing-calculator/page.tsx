import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import GardenSpacingCalculatorClient from './GardenSpacingCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'garden-spacing-calculator',
  category: 'calculators',
  fallback: {
    title: 'Garden Spacing Calculator | The Economic Times',
    description: 'Free online garden spacing calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function GardenSpacingCalculatorPage() {
  return <GardenSpacingCalculatorClient />;
}
