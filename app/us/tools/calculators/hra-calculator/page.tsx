import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import HraCalculatorClient from './HraCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'hra-calculator',
  category: 'calculators',
  fallback: {
    title: 'Hra Calculator | The Economic Times',
    description: 'Free online hra calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function HraCalculatorPage() {
  return <HraCalculatorClient />;
}
