import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import HangmanClient from './HangmanClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'hangman',
  category: 'games',
  fallback: {
    title: 'Hangman Game Online - Play Free Word Guessing Game | The Economic Times',
    description: 'Play Hangman game online for free! Guess letters to reveal hidden words before running out of tries. Multiple categories, difficulty levels, and hints. Classic vocabulary building fun!',
    keywords: 'hangman, hangman game, hangman online, word guessing game, guess the word, vocabulary game, word puzzle, free hangman, letter game',
  }
});

export default function HangmanPage() {
  return <HangmanClient />;
}
