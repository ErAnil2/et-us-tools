import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import AppreciationCalculatorClient from './AppreciationCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'appreciation-calculator',
  category: 'calculators',
  fallback: {
    title: 'Appreciation Calculator - Calculate Asset Value Growth & Investment Returns | The Economic Times',
    description: 'Calculate asset appreciation, property value growth, and investment returns over time. Track compound growth and project future values.',
    keywords: 'appreciation calculator, asset growth, property appreciation, investment returns, compound growth, value calculator',
  }
});

export default function AppreciationCalculatorPage() {
  return <AppreciationCalculatorClient />;
}
