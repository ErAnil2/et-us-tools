import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CarLoanCalculatorClient from './CarLoanCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'car-loan-calculator',
  category: 'calculators',
  fallback: {
    title: 'Car Loan Calculator - Auto Loan Payment Calculator | The Economic Times',
    description: 'Calculate car loan payments. Find monthly payment, total interest, and amortization schedule.',
    keywords: 'car loan calculator, auto loan calculator, vehicle loan calculator, car payment calculator',
  }
});

export default function CarLoanCalculatorPage() {
  return <CarLoanCalculatorClient />;
}
