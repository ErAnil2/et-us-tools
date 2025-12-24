import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import HourlyToAnnualSalaryCalculatorClient from './HourlyToAnnualSalaryCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'hourly-to-annual-salary-calculator',
  category: 'calculators',
  fallback: {
    title: 'Hourly to Annual Salary Calculator - Convert Hourly Wage to Yearly Income',
    description: 'Convert hourly wage to annual, monthly, weekly, and daily salary. Calculate overtime pay and estimated take-home pay after taxes.',
    keywords: 'hourly to annual salary calculator, hourly wage converter, salary calculator, hourly rate to yearly salary, wage calculator, overtime calculator',
  }
});

export default function HourlyToAnnualSalaryCalculatorPage() {
  return <HourlyToAnnualSalaryCalculatorClient />;
}
