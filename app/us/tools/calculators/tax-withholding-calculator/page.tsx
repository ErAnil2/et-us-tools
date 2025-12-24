import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import TaxWithholdingCalculatorClient from './TaxWithholdingCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'tax-withholding-calculator',
  category: 'calculators',
  fallback: {
    title: 'Tax Withholding Calculator - Federal Tax Withholding | The Economic Times',
    description: 'Calculate optimal tax withholding to avoid owing taxes or getting large refunds. Adjust your W-4 with accurate withholding calculations.',
    keywords: '',
  }
});

export default function TaxWithholdingCalculatorPage() {
  return <TaxWithholdingCalculatorClient />;
}
