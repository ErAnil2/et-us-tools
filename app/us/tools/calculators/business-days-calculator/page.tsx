import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BusinessDaysCalculatorClient from './BusinessDaysCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'business-days-calculator',
  category: 'calculators',
  fallback: {
    title: 'Business Days Calculator - Calculate Working Days | The Economic Times',
    description: 'Calculate business days between two dates. Exclude weekends and holidays from your date calculations.',
    keywords: 'business days calculator, working days calculator, weekday calculator, date calculator',
  }
});

export default function BusinessDaysCalculatorPage() {
  return <BusinessDaysCalculatorClient />;
}
