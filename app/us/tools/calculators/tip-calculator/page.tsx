import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import TipCalculatorClient from './TipCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'tip-calculator',
  category: 'calculators',
  fallback: {
    title: 'Tip Calculator - Calculate Tips and Split Bills | The Economic Times',
    description: 'Calculate tips and split bills easily. Find out how much to tip and divide the total among friends.',
    keywords: 'tip calculator, gratuity calculator, bill splitter, tip percentage calculator',
  }
});

export default function TipCalculatorPage() {
  return <TipCalculatorClient />;
}
