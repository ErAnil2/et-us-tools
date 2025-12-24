import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import RoasCalculatorClient from './RoasCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'roas-calculator',
  category: 'calculators',
  fallback: {
    title: 'ROAS Calculator - Return on Ad Spend & ROI Calculator | Calculators101',
    description: 'Calculate Return on Ad Spend (ROAS) for your marketing campaigns. Track advertising ROI, break-even points, and campaign profitability with detailed analytics.',
    keywords: 'ROAS calculator, return on ad spend, advertising ROI, marketing ROI, ad campaign calculator, digital marketing metrics',
  }
});

export default function RoasCalculatorPage() {
  return <RoasCalculatorClient />;
}
