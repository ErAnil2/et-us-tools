import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MultiplicationTableClient from './MultiplicationTableClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'multiplication-table',
  category: 'games',
  fallback: {
    title: 'Multiplication Tables Game Online - Free Times Tables Practice | The Economic Times',
    description: 'Play Multiplication Tables game online for free! Learn and practice times tables from 1 to 12. Perfect for kids with progress tracking and multiple difficulty levels.',
    keywords: 'multiplication tables, times tables, multiplication game, learn times tables, math practice, multiplication quiz, times tables practice, kids math game',
  }
});

export default function MultiplicationTablePage() {
  return <MultiplicationTableClient />;
}
