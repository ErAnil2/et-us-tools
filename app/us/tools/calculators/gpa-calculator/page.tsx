import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import GPACalculatorClient from './GPACalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'gpa-calculator',
  category: 'calculators',
  fallback: {
    title: 'GPA Calculator - Calculate Your Grade Point Average | The Economic Times',
    description: 'Calculate your GPA (Grade Point Average) for high school or college. Track your academic performance.',
    keywords: 'GPA calculator, grade point average calculator, college GPA calculator, cumulative GPA',
  }
});

export default function GPACalculatorPage() {
  return <GPACalculatorClient />;
}
