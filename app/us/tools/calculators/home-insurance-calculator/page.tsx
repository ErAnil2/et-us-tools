import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import HomeInsuranceCalculatorClient from './HomeInsuranceCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'home-insurance-calculator',
  category: 'calculators',
  fallback: {
    title: 'Home Insurance Calculator | The Economic Times',
    description: 'Free online home insurance calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function HomeInsuranceCalculatorPage() {
  return <HomeInsuranceCalculatorClient />;
}
