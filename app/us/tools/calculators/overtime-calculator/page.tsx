import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import OvertimeCalculatorClient from './OvertimeCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'overtime-calculator',
  category: 'calculators',
  fallback: {
    title: 'Overtime Calculator - Calculate Overtime Pay | The Economic Times',
    description: 'Calculate overtime pay and total earnings with our overtime calculator. Get accurate calculations for regular, overtime, and double time hours.',
    keywords: 'overtime calculator, overtime pay, time and a half, double time, payroll calculator, work hours calculator',
  }
});

export default function OvertimeCalculatorPage() {
  return <OvertimeCalculatorClient />;
}
