import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import EducationLoanCalculatorClient from './EducationLoanCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'education-loan-calculator',
  category: 'calculators',
  fallback: {
    title: 'Education Loan Calculator | The Economic Times',
    description: 'Free online education loan calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function EducationLoanCalculatorPage() {
  return <EducationLoanCalculatorClient />;
}
