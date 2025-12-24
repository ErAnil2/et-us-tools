import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BodyShapeClient from './BodyShapeClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'body-shape-calculator',
  category: 'calculators',
  fallback: {
    title: 'Body Shape Calculator - Determine Your Body Type | The Economic Times',
    description: 'Free body shape calculator to determine your body type based on measurements. Find out if you have an apple, pear, hourglass, or rectangle body shape.',
    keywords: 'body shape calculator, body type calculator, hourglass calculator, apple pear body shape, rectangle body type',
  }
});

export default function BodyShapePage() {
  return <BodyShapeClient />;
}
