import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ChineseZodiacClient from './ChineseZodiacClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'chinese-zodiac-calculator',
  category: 'calculators',
  fallback: {
    title: 'Chinese Zodiac Calculator - Find Your Chinese Zodiac Animal',
    description: 'Discover your Chinese zodiac animal sign based on your birth year. Learn about your personality traits, compatibility, and fortune.',
    keywords: 'chinese zodiac calculator, chinese astrology, zodiac animals, chinese horoscope, birth year zodiac',
  }
});

export default function ChineseZodiacPage() {
  return <ChineseZodiacClient />;
}
