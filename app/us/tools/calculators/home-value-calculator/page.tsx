import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import HomeValueCalculatorClient from './HomeValueCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'home-value-calculator',
  category: 'calculators',
  fallback: {
    title: 'Home Value Calculator | The Economic Times',
    description: 'Free online home value calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function HomeValueCalculatorPage() {
  return <HomeValueCalculatorClient />;
}
