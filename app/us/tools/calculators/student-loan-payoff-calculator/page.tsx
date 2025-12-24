import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import StudentLoanPayoffCalculatorClient from './StudentLoanPayoffCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'student-loan-payoff-calculator',
  category: 'calculators',
  fallback: {
    title: 'Student Loan Payoff Calculator - Calculate Student Loan Payments | The Economic Times',
    description: 'Calculate your student loan payoff time, monthly payments, and total interest. Compare different payment strategies and see how extra payments can save you money.',
    keywords: 'student loan calculator, student loan payoff, loan payment calculator, student debt calculator, loan repayment calculator',
  }
});

export default function StudentLoanPayoffCalculatorPage() {
  return <StudentLoanPayoffCalculatorClient />;
}
