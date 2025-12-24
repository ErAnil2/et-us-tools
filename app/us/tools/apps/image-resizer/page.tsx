import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ImageResizerClient from './ImageResizerClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'image-resizer',
  category: 'apps',
  fallback: {
    title: 'Image Resizer Online - Resize Photos Free | The Economic Times',
    description: 'Resize images online for free! Change image dimensions by pixels or percentage. Supports JPG, PNG, WebP, and more. Maintain quality while resizing.',
    keywords: 'image resizer, resize image online, photo resizer, image resize, resize picture, reduce image size, image dimensions, free image resizer, resize photo online',
  }
});

export default function ImageResizerPage() {
  return <ImageResizerClient />;
}
