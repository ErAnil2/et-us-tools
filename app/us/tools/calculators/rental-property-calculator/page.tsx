import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import RentalPropertyCalculatorClient from './RentalPropertyCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'rental-property-calculator',
  category: 'calculators',
  fallback: {
    title: 'Rental Property Calculator - Calculate Cash Flow, ROI & Investment Returns | The Economic Times',
    description: 'Calculate rental property cash flow, ROI, cap rate, and investment returns. Analyze different property scenarios with our comprehensive rental property investment calculator.',
    keywords: 'rental property calculator, real estate calculator, property investment calculator, cash flow calculator, ROI calculator, cap rate calculator',
  }
});

export default function RentalPropertyCalculatorPage() {
  return <RentalPropertyCalculatorClient />;
}
