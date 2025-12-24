import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import AnagramSolverClient from './AnagramSolverClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'anagram-solver',
  category: 'apps',
  fallback: {
    title: 'Anagram Solver - Find Anagram Words Free Online | The Economic Times',
    description: 'Solve anagrams with our free Anagram solver! Rearrange letters to find all possible words. Perfect for word games, Scrabble, crosswords, and puzzles.',
    keywords: 'anagram solver, anagram finder, anagram maker, solve anagrams, word anagram, anagram generator, rearrange letters, anagram words, free anagram solver',
  }
});

export default function AnagramSolverPage() {
  return <AnagramSolverClient />;
}
