import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import HashGeneratorClient from './HashGeneratorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'hash-generator',
  category: 'apps',
  fallback: {
    title: 'Hash Generator Online - Free MD5, SHA1, SHA256 Tool | The Economic Times',
    description: 'Generate hash values online for free! Create MD5, SHA1, SHA256, and other hashes instantly. Hash text and files with multiple algorithms.',
    keywords: 'hash generator, MD5 generator, SHA1 generator, SHA256 generator, hash online, create hash, checksum generator, hash calculator, crypto hash',
  }
});

export default function HashGeneratorPage() {
  return <HashGeneratorClient />;
}
