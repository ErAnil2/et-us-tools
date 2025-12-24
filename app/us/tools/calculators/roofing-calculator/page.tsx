import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import RoofingCalculatorClient from './RoofingCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'roofing-calculator',
  category: 'calculators',
  fallback: {
    title: 'Roofing Calculator - Shingles, Materials & Cost Calculator | The Economic Times',
    description: 'Free roofing calculator to estimate shingles needed, roofing materials, labor costs, and total project cost. Calculate roof area and material requirements.',
    keywords: 'roofing calculator, shingle calculator, roof area calculator, roofing materials calculator, roof cost calculator, roofing estimate',
  }
});

export default function RoofingCalculatorPage() {
  return <RoofingCalculatorClient />;
}
