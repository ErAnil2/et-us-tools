import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SalaryCalculatorClient from './SalaryCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'salary-calculator',
  category: 'calculators',
  fallback: {
    title: 'Salary Calculator - Calculate Take Home Pay | The Economic Times',
    description: 'Calculate your take-home salary after taxes and deductions. Convert between hourly, monthly, and annual salary.',
    keywords: 'salary calculator, take home pay calculator, net salary calculator, paycheck calculator',
  }
});

export default function SalaryCalculatorPage() {
  return <SalaryCalculatorClient />;
}
