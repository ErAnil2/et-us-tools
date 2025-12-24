import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ZodiacSignCalculatorClient from './ZodiacSignCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'zodiac-sign-calculator',
  category: 'calculators',
  fallback: {
    title: 'Zodiac Sign Calculator - Find Your Astrological Sign',
    description: 'Discover your zodiac sign based on your birth date. Learn about your astrological sign\'s traits and compatibility.',
    keywords: 'zodiac sign calculator, astrology sign, horoscope sign, birth date zodiac, astrological sign calculator',
  }
});

export default function ZodiacSignCalculatorPage() {
  return <ZodiacSignCalculatorClient />;
}
