import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ROICalculatorClient from './ROICalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'roi-calculator',
  category: 'calculators',
  fallback: {
    title: 'ROI Calculator - Calculate Return on Investment | The Economic Times',
    description: 'Calculate ROI (Return on Investment) for your investments. Measure profitability and investment performance.',
    keywords: 'ROI calculator, return on investment calculator, investment return calculator, ROI formula',
  }
});

export default function ROICalculatorPage() {
  return <ROICalculatorClient />;
}
