import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import FlappyBirdClient from './FlappyBirdClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'flappy-bird',
  category: 'games',
  fallback: {
    title: 'Flappy Bird Game Online - Play Free Flying Challenge | The Economic Times',
    description: 'Play Flappy Bird game online for free! Navigate through pipes by tapping to fly. Addictive arcade gameplay with simple controls. Beat your high score in this viral classic!',
    keywords: 'flappy bird, flappy bird game, flappy bird online, flying game, tap to fly, endless runner, arcade game, free flappy bird, bird game',
  }
});

export default function FlappyBirdPage() {
  return <FlappyBirdClient />;
}
