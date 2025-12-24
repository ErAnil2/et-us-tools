import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import AgeCalculatorClient from './AgeCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'age-calculator',
  category: 'calculators',
  fallback: {
    title: 'Age Calculator - Calculate Your Exact Age in Years, Months & Days | Free Online Tool',
    description: 'Calculate your exact age in years, months, days, hours, and minutes. Find your zodiac sign, Chinese zodiac, generation, next birthday countdown, and life statistics.',
    keywords: 'age calculator, calculate age, exact age, age in days, age in months, birthday calculator, zodiac sign, chinese zodiac, generation calculator',
  }
});

export default function AgeCalculatorPage() {
  return <AgeCalculatorClient />;
}
