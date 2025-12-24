import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BreakEvenCalculatorClient from './BreakEvenCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'break-even-calculator',
  category: 'calculators',
  fallback: {
    title: 'Break Even Calculator - Calculate Break Even Point | The Economic Times',
    description: 'Calculate break-even point for your business. Find out how many units you need to sell to cover costs.',
    keywords: 'break even calculator, break even point, business calculator, profit calculator',
  }
});

export default function BreakEvenCalculatorPage() {
  return <BreakEvenCalculatorClient />;
}
