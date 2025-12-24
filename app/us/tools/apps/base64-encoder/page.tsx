import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import Base64EncoderClient from './Base64EncoderClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'base64-encoder',
  category: 'apps',
  fallback: {
    title: 'Base64 Encoder Decoder Online - Free Encode & Decode Tool | The Economic Times',
    description: 'Encode and decode Base64 online for free! Convert text to Base64 and decode Base64 strings instantly. Developer-friendly tool with copy functionality.',
    keywords: 'base64 encoder, base64 decoder, encode base64, decode base64, base64 online, text to base64, base64 converter, base64 tool, developer tools',
  }
});

export default function Base64EncoderPage() {
  return <Base64EncoderClient />;
}
