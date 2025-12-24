import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import AreaOfCircleClient from './AreaOfCircleClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'area-of-a-circle-calculator',
  category: 'calculators',
  fallback: {
    title: 'Area of a Circle Calculator - Calculate Circle Area from Radius, Diameter | The Economic Times',
    description: 'Calculate the area of a circle using radius, diameter, or circumference. Includes step-by-step calculations, unit conversions, and practical examples.',
    keywords: 'circle area calculator, area of circle, circle area formula, radius to area, diameter to area, geometry calculator',
  }
});

export default function AreaOfCirclePage() {
  return <AreaOfCircleClient />;
}
