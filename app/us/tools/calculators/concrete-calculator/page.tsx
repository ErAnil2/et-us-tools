import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ConcreteClient from './ConcreteClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'concrete-calculator',
  category: 'calculators',
  fallback: {
    title: 'Concrete Calculator - Calculate Concrete Volume, Bags & Cost | The Economic Times',
    description: 'Free concrete calculator to estimate concrete volume in cubic yards/feet, number of bags needed, and total cost for slabs, footings, and projects.',
    keywords: 'concrete calculator, concrete volume calculator, concrete bags calculator, concrete cost calculator, concrete slab calculator, concrete estimate',
  }
});

export default function ConcretePage() {
  return <ConcreteClient />;
}
