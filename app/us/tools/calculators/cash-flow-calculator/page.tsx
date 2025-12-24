import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CashFlowCalculatorClient from './CashFlowCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'cash-flow-calculator',
  category: 'calculators',
  fallback: {
    title: 'Cash Flow Calculator - Calculate Business Cash Flow | The Economic Times',
    description: 'Calculate cash flow for your business. Track income, expenses, and net cash flow.',
    keywords: 'cash flow calculator, business cash flow, cash flow statement, operating cash flow',
  }
});

export default function CashFlowCalculatorPage() {
  return <CashFlowCalculatorClient />;
}
