import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SpinWheelClient from './SpinWheelClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'spin-wheel',
  category: 'apps',
  fallback: {
    title: 'Spin the Wheel Online - Free Random Picker & Decision Wheel | The Economic Times',
    description: 'Spin the wheel online for free! Random picker and decision maker with custom options. Perfect for games, giveaways, raffles, and making random choices.',
    keywords: 'spin the wheel, spin wheel online, random picker, decision wheel, prize wheel, wheel spinner, random selector, wheel of fortune, picker wheel',
  }
});

export default function SpinWheelPage() {
  return <SpinWheelClient />;
}
