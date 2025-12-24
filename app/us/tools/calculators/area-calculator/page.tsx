import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import AreaCalculatorClient from './AreaCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'area-calculator',
  category: 'calculators',
  fallback: {
    title: 'Area Calculator - Calculate Area of Different Shapes | The Economic Times',
    description: 'Calculate the area of different geometric shapes with our comprehensive area calculator. Choose from rectangles, circles, triangles, and more.',
    keywords: 'area calculator, geometry calculator, shape area, rectangle area, circle area, triangle area',
  }
});

export default function AreaCalculatorPage() {
  return <AreaCalculatorClient />;
}
