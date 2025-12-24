import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import AutoLoanComparisonCalculatorClient from './AutoLoanComparisonCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'auto-loan-comparison-calculator',
  category: 'calculators',
  fallback: {
    title: 'Auto Loan Comparison Calculator - Compare Car Financing Options | The Economic Times',
    description: 'Compare multiple auto loan options side-by-side. Calculate monthly payments, total interest, and find the best car financing deal. Free auto loan comparison tool with detailed payment schedules.',
    keywords: '',
  }
});

export default function AutoLoanComparisonCalculatorPage() {
  return <AutoLoanComparisonCalculatorClient />;
}
