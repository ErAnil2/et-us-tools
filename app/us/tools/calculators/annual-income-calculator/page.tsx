import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import AnnualIncomeCalculatorClient from './AnnualIncomeCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'annual-income-calculator',
  category: 'calculators',
  fallback: {
    title: 'Annual Income Calculator - Convert Hourly Wage to Yearly Salary | ET',
    description: 'Free annual income calculator to convert hourly wage to yearly salary. Calculate your gross annual income, monthly pay, and weekly earnings based on your hourly rate and work schedule.',
    keywords: 'annual income calculator, hourly to yearly salary calculator, convert hourly to annual salary, yearly income calculator, salary calculator, hourly wage to yearly, income conversion calculator, gross annual income',
  }
});

export default function AnnualIncomeCalculatorPage() {
  return <AnnualIncomeCalculatorClient />;
}
