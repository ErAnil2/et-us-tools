import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PregnancyDueDateCalculatorClient from './PregnancyDueDateCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'pregnancy-due-date-calculator',
  category: 'calculators',
  fallback: {
    title: 'Pregnancy Due Date Calculator - Calculate Your Baby\'s Due Date',
    description: 'Calculate your baby\'s expected due date based on your last menstrual period or conception date.',
    keywords: 'pregnancy due date calculator, pregnancy calculator, due date calculator, pregnancy timeline, baby due date, pregnancy weeks calculator',
  }
});

export default function PregnancyDueDateCalculatorPage() {
  return <PregnancyDueDateCalculatorClient />;
}
