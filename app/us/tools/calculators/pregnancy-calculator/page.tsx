import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PregnancyCalculatorClient from './PregnancyCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'pregnancy-calculator',
  category: 'calculators',
  fallback: {
    title: 'Pregnancy Calculator - Due Date & Milestone Tracker | Free Tool',
    description: 'Free pregnancy calculator to find your due date and track pregnancy milestones. Calculate based on last period, conception date, or IVF transfer. Get week-by-week information.',
    keywords: 'pregnancy calculator, due date calculator, pregnancy due date, when is my baby due, pregnancy week calculator, conception calculator, IVF due date, pregnancy timeline',
  }
});

export default function PregnancyCalculatorPage() {
  return <PregnancyCalculatorClient />;
}
