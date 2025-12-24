import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import NumberGuessingClient from './NumberGuessingClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'number-guessing',
  category: 'games',
  fallback: {
    title: 'Number Guessing Game Online - Play Free Guess the Number | The Economic Times',
    description: 'Play Number Guessing game online for free! Use logic and strategy to guess the secret number. Get hints like ',
    keywords: 'number guessing game, guess the number, number game online, guessing game, logic game, strategy game, educational game, brain training',
  }
});

export default function NumberGuessingPage() {
  return <NumberGuessingClient />;
}
