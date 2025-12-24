import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import FractionMatchClient from './FractionMatchClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'fraction-match',
  category: 'games',
  fallback: {
    title: 'Fraction Match Game Online - Learn Fractions & Decimals Free | The Economic Times',
    description: 'Play Fraction Match game online for free! Match fractions with decimal equivalents. Learn fraction-decimal conversion with this educational math game for students.',
    keywords: 'fraction match, fraction game, decimal conversion, learn fractions, fractions and decimals, math education, fraction matching game, educational math game',
  }
});

export default function FractionMatchPage() {
  return <FractionMatchClient />;
}
