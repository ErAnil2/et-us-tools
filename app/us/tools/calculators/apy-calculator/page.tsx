import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import APYCalculatorClient from './APYCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'apy-calculator',
  category: 'calculators',
  fallback: {
    title: 'APY Calculator - Annual Percentage Yield & Compound Interest | ET',
    description: 'Free APY calculator to compare savings account rates and calculate compound interest earnings. See how APY vs APR affects your savings growth over time with daily, monthly, or annual compounding.',
    keywords: 'apy calculator, annual percentage yield calculator, compound interest calculator, savings interest calculator, apy vs apr, high yield savings calculator, cd calculator, money market calculator, compound interest rate',
  }
});

export default function APYCalculatorPage() {
  return <APYCalculatorClient />;
}
