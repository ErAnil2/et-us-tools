import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import HoursCalculatorClient from './HoursCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'hours-calculator',
  category: 'calculators',
  fallback: {
    title: 'Hours Calculator - Calculate Work Hours, Duration & Timesheet | Free Online Tool',
    description: 'Free hours calculator to compute time duration, track weekly work hours, and calculate gross pay with overtime. Perfect for employees, freelancers, and payroll management.',
    keywords: 'hours calculator, time duration, work hours, timesheet calculator, overtime calculator, time tracking, payroll calculator, decimal hours',
  }
});

export default function HoursCalculatorPage() {
  return <HoursCalculatorClient />;
}
