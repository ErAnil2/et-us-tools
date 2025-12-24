import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import NumerologyCompatibilityCalculatorClient from './NumerologyCompatibilityCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'numerology-compatibility-calculator',
  category: 'calculators',
  fallback: {
    title: 'Numerology Compatibility Calculator - Life Path Number Compatibility',
    description: 'Check numerology compatibility between two people based on Life Path numbers. Discover relationship potential and compatibility percentage.',
    keywords: 'numerology compatibility, life path compatibility, numerology love compatibility, relationship numerology, numerology compatibility calculator',
  }
});

export default function NumerologyCompatibilityCalculatorPage() {
  return <NumerologyCompatibilityCalculatorClient />;
}
