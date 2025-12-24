import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import WordMathClient from './WordMathClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'word-math',
  category: 'games',
  fallback: {
    title: 'Word Math Game Online - Solve Math Word Problems Free | The Economic Times',
    description: 'Play Word Math game online for free! Practice solving math word problems. Improve reading comprehension and mathematical problem-solving skills with interactive challenges.',
    keywords: 'word math, math word problems, word problems, problem solving, educational math game, math practice, reading comprehension, story problems',
  }
});

export default function WordMathPage() {
  return <WordMathClient />;
}
