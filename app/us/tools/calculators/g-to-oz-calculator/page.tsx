import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import GToOzCalculatorClient from './GToOzCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'g-to-oz-calculator',
  category: 'calculators',
  fallback: {
    title: 'G To Oz Calculator | The Economic Times',
    description: 'Free online g to oz calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function GToOzCalculatorPage() {
  return <GToOzCalculatorClient />;
}
