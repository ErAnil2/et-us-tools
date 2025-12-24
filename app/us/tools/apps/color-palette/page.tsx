import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ColorPaletteClient from './ColorPaletteClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'color-palette',
  category: 'apps',
  fallback: {
    title: 'Color Palette Generator - Create Beautiful Color Schemes | The Economic Times',
    description: 'Generate beautiful color palettes for free! Create harmonious color schemes for design projects. Extract colors from images and explore trending palettes.',
    keywords: 'color palette generator, color scheme, color palette, color combinations, design colors, generate palette, color harmony, trending colors',
  }
});

export default function ColorPalettePage() {
  return <ColorPaletteClient />;
}
