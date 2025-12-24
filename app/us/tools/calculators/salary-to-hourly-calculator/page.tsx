import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SalaryToHourlyCalculatorClient from './SalaryToHourlyCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'salary-to-hourly-calculator',
  category: 'calculators',
  fallback: {
    title: 'Profit Margin Calculator',
    description: 'Calculate profit margins',
    keywords: 'salary to hourly, hourly rate calculator, wage converter, payroll calculator, employment calculator',
  }
});

export default function SalaryToHourlyCalculatorPage() {
  return <SalaryToHourlyCalculatorClient />;
}
