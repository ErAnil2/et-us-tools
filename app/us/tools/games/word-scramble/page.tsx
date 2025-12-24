import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import WordScrambleClient from './WordScrambleClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'word-scramble',
  category: 'games',
  fallback: {
    title: 'Word Scramble Game Online - Free Anagram Puzzle | The Economic Times',
    description: 'Play Word Scramble game online for free! Unscramble jumbled letters to form words. Multiple categories, difficulty levels, hints, and achievements. Fun vocabulary builder for all ages!',
    keywords: 'word scramble, word scramble game, anagram puzzle, unscramble words, word game online, vocabulary game, brain training, jumble words, free word game',
  }
});

export default function WordScramblePage() {
  return <WordScrambleClient />;
}
