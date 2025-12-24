import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import VolumeCalculatorClient from './VolumeCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'volume-calculator',
  category: 'calculators',
  fallback: {
    title: 'Volume Calculator - Calculate Volume of 3D Shapes | The Economic Times',
    description: 'Free volume calculator for cubes, spheres, cylinders, cones, and more. Calculate the volume of any 3D shape with step-by-step formulas.',
    keywords: 'volume calculator, 3d volume calculator, cube volume, sphere volume, cylinder volume, cone volume, geometry calculator',
  }
});

export default function VolumeCalculatorPage() {
  return <VolumeCalculatorClient />;
}
