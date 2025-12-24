import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MetabolicAgeClient from './MetabolicAgeClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'metabolic-age-calculator',
  category: 'calculators',
  fallback: {
    title: 'Metabolic Age Calculator - Real Age vs Metabolic Age',
    description: 'Calculate your metabolic age based on BMR, body composition, and fitness level. Compare your metabolic age to your chronological age.',
    keywords: '',
  }
});

export default function MetabolicAgePage() {
  return <MetabolicAgeClient />;
}
