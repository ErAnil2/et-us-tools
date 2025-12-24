import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import LifePathNumberCalculatorClient from './LifePathNumberCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'life-path-number-calculator',
  category: 'calculators',
  fallback: {
    title: 'Life Path Number Calculator - Find Your Life Path in Numerology',
    description: 'Calculate your Life Path number from your birth date. Discover your life\'s purpose and personality traits through numerology.',
    keywords: 'life path number, life path calculator, numerology life path, birth date numerology, life purpose number, numerology calculator',
  }
});

export default function LifePathNumberCalculatorPage() {
  return <LifePathNumberCalculatorClient />;
}
