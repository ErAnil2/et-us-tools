import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MathQuizClient from './MathQuizClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'math-quiz',
  category: 'games',
  fallback: {
    title: 'Math Quiz Game Online - Free Arithmetic Practice | The Economic Times',
    description: 'Play Math Quiz game online for free! Practice addition, subtraction, multiplication, and division. Multiple difficulty levels for kids and adults. Improve your math skills!',
    keywords: 'math quiz, math quiz game, arithmetic game, math practice, math game online, addition game, multiplication game, educational math game, free math quiz',
  }
});

export default function MathQuizPage() {
  return <MathQuizClient />;
}
