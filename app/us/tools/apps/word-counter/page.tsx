import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import WordCounterClient from './WordCounterClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'word-counter',
  category: 'apps',
  fallback: {
    title: 'Word Counter Online - Free Character & Word Count Tool | The Economic Times',
    description: 'Count words and characters online for free! Instantly count words, characters, paragraphs, sentences, and reading time. Perfect for essays and social media posts.',
    keywords: 'word counter, word count, character counter, count words online, text counter, character count, word count tool, essay word counter, free word counter',
  }
});

export default function WordCounterPage() {
  return <WordCounterClient />;
}
