import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import TestGradeCalculatorClient from './TestGradeCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'test-grade-calculator',
  category: 'calculators',
  fallback: {
    title: 'Test Grade Calculator - Calculate Test Scores and Letter Grades | The Economic Times',
    description: 'Free test grade calculator to determine your test score percentage and letter grade. Calculate grades from correct answers, points, or weighted scores.',
    keywords: 'test grade calculator, grade calculator, test score calculator, percentage calculator, letter grade calculator',
  }
});

export default function TestGradeCalculatorPage() {
  return <TestGradeCalculatorClient />;
}
