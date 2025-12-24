import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PresentValueCalculatorClient from './PresentValueCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'present-value-calculator',
  category: 'calculators',
  fallback: {
    title: 'Present Value Calculator - NPV & Discounted Cash Flow Calculator | The Economic Times',
    description: 'Free present value calculator for NPV analysis, discounted cash flows, and investment valuation. Calculate present value with multiple cash flows.',
    keywords: 'present value calculator, NPV calculator, discounted cash flow calculator, net present value calculator, investment calculator',
  }
});

export default function PresentValueCalculatorPage() {
  return <PresentValueCalculatorClient />;
}
