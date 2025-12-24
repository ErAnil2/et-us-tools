import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import TimeValueMoneyCalculatorClient from './TimeValueMoneyCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'time-value-money-calculator',
  category: 'calculators',
  fallback: {
    title: 'Time Value of Money Calculator - Future Value & Present Value | The Economic Times',
    description: 'Calculate present value, future value, and time value of money. Understand how money grows over time with compound interest.',
    keywords: 'time value money calculator, present value, future value, TVM calculator, compound interest, financial calculator',
  }
});

export default function TimeValueMoneyCalculatorPage() {
  return <TimeValueMoneyCalculatorClient />;
}
