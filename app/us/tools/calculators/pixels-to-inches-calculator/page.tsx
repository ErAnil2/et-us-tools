import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PixelsToInchesCalculatorClient from './PixelsToInchesCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'pixels-to-inches-calculator',
  category: 'calculators',
  fallback: {
    title: 'Pixels to Inches Calculator - Convert px to inches | The Economic Times',
    description: 'Free pixels to inches converter. Calculate physical dimensions from pixels based on DPI/PPI. Essential for print design and display measurements.',
    keywords: 'pixels to inches calculator, px to inches converter, DPI calculator, PPI calculator, print size calculator, pixel dimensions',
  }
});

export default function PixelsToInchesCalculatorPage() {
  return <PixelsToInchesCalculatorClient />;
}
