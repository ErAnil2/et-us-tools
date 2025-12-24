import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BreakoutClient from './BreakoutClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'breakout',
  category: 'games',
  fallback: {
    title: 'Breakout Game Online - Free Brick Breaker Arcade Game | The Economic Times',
    description: 'Play Breakout game online for free! Classic brick breaker arcade game with paddle controls. Destroy bricks, collect power-ups, and beat high scores in this retro gaming experience.',
    keywords: 'breakout game, brick breaker, breakout online, arcade game, paddle game, atari breakout, free breakout, classic games, retro arcade',
  }
});

export default function BreakoutPage() {
  return <BreakoutClient />;
}
