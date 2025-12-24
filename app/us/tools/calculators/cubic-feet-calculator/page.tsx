import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CubicFeetClient from './CubicFeetClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'cubic-feet-calculator',
  category: 'calculators',
  fallback: {
    title: 'Cubic Feet Calculator - Calculate Volume in Cubic Feet | The Economic Times',
    description: 'Free cubic feet calculator to calculate volume in cubic feet. Convert between cubic feet, cubic meters, cubic inches, and more. Perfect for construction and shipping.',
    keywords: 'cubic feet calculator, volume calculator, cubic feet to cubic meters, cubic feet to cubic inches, construction calculator, shipping volume',
  }
});

export default function CubicFeetPage() {
  return <CubicFeetClient />;
}
