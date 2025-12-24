import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import WordCombinerClient from './WordCombinerClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'word-combiner',
  category: 'apps',
  fallback: {
    title: 'Word Combiner - Merge Words & Create Portmanteaus Free | The Economic Times',
    description: 'Combine words online for free! Merge two words using portmanteau, concatenation, and interleaving methods. Perfect for creating brand names, usernames, and creative wordplay.',
    keywords: 'word combiner, word merger, combine words, portmanteau generator, word fusion, brand name generator, username creator, word blender, merge words',
  }
});

export default function WordCombinerPage() {
  return <WordCombinerClient />;
}
