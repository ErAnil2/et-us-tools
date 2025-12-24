import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import StudentLoanCalculatorClient from './StudentLoanCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'student-loan-calculator',
  category: 'calculators',
  fallback: {
    title: 'Student Loan Calculator | The Economic Times',
    description: 'Calculate student loan payments, interest, and repayment schedules. Free online student loan calculator for education financing.',
    keywords: 'student loan calculator, education loan, loan repayment, student debt calculator',
  }
});

export default function StudentLoanCalculatorPage() {
  return <StudentLoanCalculatorClient />;
}
