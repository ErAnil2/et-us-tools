import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import RockPaperScissorsClient from './RockPaperScissorsClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'rock-paper-scissors',
  category: 'games',
  fallback: {
    title: 'Rock Paper Scissors Online - Play Free RPS Game | The Economic Times',
    description: 'Play Rock Paper Scissors online for free! Classic hand game against computer AI. Choose rock, paper, or scissors and test your luck and strategy. Fun quick game for all ages!',
    keywords: 'rock paper scissors, RPS game, rock paper scissors online, play RPS, hand game, quick game, free rock paper scissors, classic game',
  }
});

export default function RockPaperScissorsPage() {
  return <RockPaperScissorsClient />;
}
