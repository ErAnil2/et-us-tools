import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import RandomNumberGeneratorClient from './RandomNumberGeneratorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'random-number-generator',
  category: 'apps',
  fallback: {
    title: 'Random Number Generator - Generate Numbers Online Free | The Economic Times',
    description: 'Generate random numbers online for free! Pick random numbers within any range. Perfect for lottery, games, raffles, statistics, and decision making.',
    keywords: 'random number generator, random number, generate random numbers, number generator, lottery number generator, random picker, RNG, random number online',
  }
});

export default function RandomNumberGeneratorPage() {
  return <RandomNumberGeneratorClient />;
}
