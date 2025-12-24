import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import GradeCalculatorClient from './GradeCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'grade-calculator',
  category: 'calculators',
  fallback: {
    title: 'Grade Calculator - Calculate Your Final Grade | The Economic Times',
    description: 'Calculate your final grade based on assignments, tests, and exams. Find out what you need to score to achieve your target grade.',
    keywords: 'grade calculator, GPA calculator, final grade calculator, test grade calculator',
  }
});

export default function GradeCalculatorPage() {
  return <GradeCalculatorClient />;
}
