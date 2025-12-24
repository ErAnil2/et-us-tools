import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import EMICalculatorClient from './EMICalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'emi-calculator',
  category: 'calculators',
  fallback: {
    title: 'EMI Calculator - Calculate Equated Monthly Installment | The Economic Times',
    description: 'Calculate your EMI (Equated Monthly Installment) for loans. Get detailed amortization schedule and payment breakdown.',
    keywords: 'EMI calculator, equated monthly installment, loan EMI, monthly installment calculator',
  }
});

export default function EMICalculatorPage() {
  return <EMICalculatorClient />;
}
