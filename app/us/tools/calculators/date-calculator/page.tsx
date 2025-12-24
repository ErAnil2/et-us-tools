import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import DateCalculatorClient from './DateCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'date-calculator',
  category: 'calculators',
  fallback: {
    title: 'Date Calculator - Days Between Dates & Add/Subtract Days | Free Online Tool',
    description: 'Calculate days, weeks, months, and years between two dates. Add or subtract days from any date. Find business days excluding weekends. Free online date calculator.',
    keywords: 'date calculator, days between dates, date difference calculator, add days to date, subtract days, business days calculator, date duration',
  }
});

export default function DateCalculatorPage() {
  return <DateCalculatorClient />;
}
