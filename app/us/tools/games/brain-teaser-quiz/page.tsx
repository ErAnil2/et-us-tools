import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BrainTeaserQuizClient from './BrainTeaserQuizClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'brain-teaser-quiz',
  category: 'games',
  fallback: {
    title: 'Brain Teaser Quiz Online - Free Logic Puzzles & Riddles | The Economic Times',
    description: 'Play Brain Teaser Quiz online for free! Challenge your mind with logic puzzles, riddles, and IQ questions. Test critical thinking and problem-solving skills with fun brain games.',
    keywords: 'brain teasers, brain teaser quiz, logic puzzles, riddles, IQ test, critical thinking, problem solving, mind games, brain games, puzzle quiz',
  }
});

export default function BrainTeaserQuizPage() {
  return <BrainTeaserQuizClient />;
}
