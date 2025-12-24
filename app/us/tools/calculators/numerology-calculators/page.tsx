import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import NumerologyCalculatorsClient from './NumerologyCalculatorsClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'numerology-calculators',
  category: 'calculators',
  fallback: {
    title: 'Numerology & Zodiac Calculators - Life Path, Destiny & Astrology Signs',
    description: 'Free numerology and zodiac calculators to discover your Life Path, Destiny, Soul Urge numbers, Western zodiac sign, and Chinese zodiac animal. Complete readings and analysis.',
    keywords: 'numerology calculators, life path calculator, destiny number, numerology compatibility, zodiac sign calculator, chinese zodiac, free numerology, birth date numerology, astrology calculator',
  }
});

export default function NumerologyCalculatorsPage() {
  return <NumerologyCalculatorsClient />;
}
