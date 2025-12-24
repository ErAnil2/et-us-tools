import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CoinFlipClient from './CoinFlipClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'coin-flip',
  category: 'apps',
  fallback: {
    title: 'Flip a Coin Online - Free Virtual Coin Flipper | The Economic Times',
    description: 'Flip a coin online for free! Virtual coin flipper with fair 50/50 heads or tails results. Perfect for quick decisions, games, and random choices.',
    keywords: 'flip a coin, coin flip, coin toss online, virtual coin flipper, heads or tails, online coin flip, decision maker, flip coin online',
  }
});

export default function CoinFlipPage() {
  return <CoinFlipClient />;
}
