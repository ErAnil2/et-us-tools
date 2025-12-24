import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ColorPaletteCalculatorClient from './ColorPaletteCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'color-palette-calculator',
  category: 'calculators',
  fallback: {
    title: 'Color Palette Calculator | The Economic Times',
    description: 'Free online color palette calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function ColorPaletteCalculatorPage() {
  return <ColorPaletteCalculatorClient />;
}
