import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PayRaiseCalculatorClient from './PayRaiseCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'pay-raise-calculator',
  category: 'calculators',
  fallback: {
    title: 'Pay Raise Calculator - Calculate Salary Increase Impact | The Economic Times',
    description: 'Free pay raise calculator to analyze salary increases. Calculate the financial impact of raises on annual, monthly, and hourly income.',
    keywords: 'pay raise calculator, salary increase calculator, raise calculator, promotion calculator, wage increase calculator',
  }
});

export default function PayRaiseCalculatorPage() {
  return <PayRaiseCalculatorClient />;
}
