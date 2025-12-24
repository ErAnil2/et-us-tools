import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ScrabbleHelperClient from './ScrabbleHelperClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'scrabble-helper',
  category: 'apps',
  fallback: {
    title: 'Scrabble Word Finder - Free Scrabble Helper & Cheat | The Economic Times',
    description: 'Find high-scoring Scrabble words from your tiles! Free Scrabble helper with word finder, score calculator, and bonus placement suggestions. Win every game!',
    keywords: 'scrabble word finder, scrabble helper, scrabble cheat, scrabble solver, word finder, scrabble score calculator, letter tiles, scrabble words',
  }
});

export default function ScrabbleHelperPage() {
  return <ScrabbleHelperClient />;
}
