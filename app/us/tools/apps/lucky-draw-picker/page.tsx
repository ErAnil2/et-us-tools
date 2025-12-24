import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import LuckyDrawPickerClient from './LuckyDrawPickerClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'lucky-draw-picker',
  category: 'apps',
  fallback: {
    title: 'Random Name Picker - Free Lucky Draw Winner Generator | The Economic Times',
    description: 'Pick random names online for free! Lucky draw winner selector with animations. Perfect for raffles, giveaways, classroom activities, and team selection.',
    keywords: 'random name picker, lucky draw, name picker, winner picker, raffle picker, random selector, giveaway picker, random name generator, draw winner',
  }
});

export default function LuckyDrawPickerPage() {
  return <LuckyDrawPickerClient />;
}
