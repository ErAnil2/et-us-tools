import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BusinessBreakEvenClient from './BusinessBreakEvenClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'business-break-even-calculator',
  category: 'calculators',
  fallback: {
    title: 'Business Break-Even Calculator - Break-Even Analysis and Profit Planning | The Economic Times',
    description: 'Calculate your business break-even point, analyze fixed and variable costs, and determine profitability thresholds for better financial planning.',
    keywords: 'break even calculator, break even analysis, business calculator, profit planning, cost analysis',
  }
});

export default function BusinessBreakEvenPage() {
  return <BusinessBreakEvenClient />;
}
