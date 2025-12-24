import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import StudyTimeCalculatorClient from './StudyTimeCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'study-time-calculator',
  category: 'calculators',
  fallback: {
    title: 'Study Time Calculator - Plan Study Schedule and Time Management',
    description: 'Calculate optimal study time needed for exams, courses, and learning goals. Create personalized study schedules and improve time management.',
    keywords: 'study time calculator, study planner, exam preparation, study schedule, time management calculator',
  }
});

export default function StudyTimeCalculatorPage() {
  return <StudyTimeCalculatorClient />;
}
