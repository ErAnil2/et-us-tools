import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SyllableCounterClient from './SyllableCounterClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'syllable-counter',
  category: 'apps',
  fallback: {
    title: 'Syllable Counter Online - Count Syllables in Words Free | The Economic Times',
    description: 'Count syllables online for free! Instantly count syllables in words, sentences, and text. Perfect for poetry, haiku, songwriting, and language learning.',
    keywords: 'syllable counter, count syllables, syllable calculator, how many syllables, haiku counter, poetry tool, syllables in word, syllable finder',
  }
});

export default function SyllableCounterPage() {
  return <SyllableCounterClient />;
}
