import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import UnitCircleCalculatorClient from './UnitCircleCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'unit-circle-calculator',
  category: 'calculators',
  fallback: {
    title: 'Unit Circle Calculator - Find Trigonometric Values | The Economic Times',
    description: 'Free unit circle calculator to find sine, cosine, and tangent values for any angle. Perfect for trigonometry students and professionals.',
    keywords: 'unit circle calculator, trigonometry, sine cosine tangent, trigonometric values, radians degrees',
  }
});

export default function UnitCircleCalculatorPage() {
  return <UnitCircleCalculatorClient />;
}
