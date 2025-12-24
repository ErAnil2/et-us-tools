import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ColorPickerClient from './ColorPickerClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'color-picker',
  category: 'apps',
  fallback: {
    title: 'Color Picker Online - Free HEX, RGB & HSL Color Tool | The Economic Times',
    description: 'Pick colors online for free! Professional color picker with HEX, RGB, and HSL conversion. Generate color palettes and pick colors from images. Perfect for designers.',
    keywords: 'color picker, color picker online, hex color picker, RGB color picker, HSL color, color converter, color palette generator, pick color from image',
  }
});

export default function ColorPickerPage() {
  return <ColorPickerClient />;
}
