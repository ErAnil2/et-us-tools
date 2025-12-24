import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CylinderVolumeClient from './CylinderVolumeClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'cylinder-volume-calculator',
  category: 'calculators',
  fallback: {
    title: 'Cylinder Volume Calculator - Calculate Volume of Cylinder | The Economic Times',
    description: 'Free cylinder volume calculator. Calculate the volume and surface area of cylinders using radius and height. Includes multiple unit conversions.',
    keywords: 'cylinder volume calculator, cylinder volume, volume of cylinder, cylinder calculator, geometry calculator',
  }
});

export default function CylinderVolumePage() {
  return <CylinderVolumeClient />;
}
