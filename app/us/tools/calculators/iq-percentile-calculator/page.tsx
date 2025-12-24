import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import IqPercentileCalculatorClient from './IqPercentileCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'iq-percentile-calculator',
  category: 'calculators',
  fallback: {
    title: 'Iq Percentile Calculator | The Economic Times',
    description: 'Free online iq percentile calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function IqPercentileCalculatorPage() {
  return <IqPercentileCalculatorClient />;
}
