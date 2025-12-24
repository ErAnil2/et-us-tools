import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import QRGeneratorClient from './QRGeneratorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'qr-generator',
  category: 'apps',
  fallback: {
    title: 'QR Code Generator - Create Free QR Codes Online | The Economic Times',
    description: 'Generate QR codes online for free! Create QR codes for URLs, text, WiFi, contact info, and more. Customize colors and download in high resolution.',
    keywords: 'QR code generator, create QR code, QR code maker, free QR code, generate QR code, QR code online, custom QR code, QR code for URL',
  }
});

export default function QRGeneratorPage() {
  return <QRGeneratorClient />;
}
