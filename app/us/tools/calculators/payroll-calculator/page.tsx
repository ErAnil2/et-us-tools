import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PayrollCalculatorClient from './PayrollCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'payroll-calculator',
  category: 'calculators',
  fallback: {
    title: 'Payroll Calculator - Calculate Net Pay After Taxes | The Economic Times',
    description: 'Calculate employee net pay after federal, state, and local taxes. Includes FICA, Social Security, Medicare, and other payroll deductions.',
    keywords: 'payroll calculator, net pay calculator, salary calculator, tax withholding, paycheck calculator',
  }
});

export default function PayrollCalculatorPage() {
  return <PayrollCalculatorClient />;
}
