import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ReadingTimeCalculatorClient from './ReadingTimeCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'reading-time-calculator',
  category: 'calculators',
  fallback: {
    title: 'Reading Time Calculator - Estimate Reading Time for Text & Articles | The Economic Times',
    description: 'Free reading time calculator to estimate how long it takes to read text, articles, books, and documents. Calculate reading time based on word count and reading speed.',
    keywords: 'reading time calculator, reading speed calculator, text reading time, article reading time, words per minute calculator',
  }
});

export default function ReadingTimeCalculatorPage() {
  return <ReadingTimeCalculatorClient />;
}
