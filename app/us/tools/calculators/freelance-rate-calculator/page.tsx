import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import FreelanceRateCalculatorClient from './FreelanceRateCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'freelance-rate-calculator',
  category: 'calculators',
  fallback: {
    title: 'Freelance Rate Calculator | The Economic Times',
    description: 'Free online freelance rate calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function FreelanceRateCalculatorPage() {
  return <FreelanceRateCalculatorClient />;
}
