import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import DebtToIncomeCalculatorClient from './DebtToIncomeCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'debt-to-income-calculator',
  category: 'calculators',
  fallback: {
    title: 'Debt to Income Calculator - Calculate DTI Ratio | The Economic Times',
    description: 'Calculate your debt-to-income (DTI) ratio. Find out if you qualify for a mortgage or loan.',
    keywords: 'debt to income calculator, DTI calculator, debt ratio calculator, mortgage qualification',
  }
});

export default function DebtToIncomeCalculatorPage() {
  return <DebtToIncomeCalculatorClient />;
}
