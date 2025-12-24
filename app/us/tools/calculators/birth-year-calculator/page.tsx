import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BirthYearCalculatorClient from './BirthYearCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'birth-year-calculator',
  category: 'calculators',
  fallback: {
    title: 'Birth Year Calculator - Find Birth Year from Age',
    description: 'Calculate birth year from current age or find age from birth year. Includes generation info and Chinese zodiac.',
    keywords: 'birth year calculator, age calculator, birth year from age, generation calculator',
  }
});

export default function BirthYearCalculatorPage() {
  return <BirthYearCalculatorClient />;
}
