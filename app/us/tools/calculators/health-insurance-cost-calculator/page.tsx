import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import HealthInsuranceCostCalculatorClient from './HealthInsuranceCostCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'health-insurance-cost-calculator',
  category: 'calculators',
  fallback: {
    title: 'Health Insurance Cost Calculator | The Economic Times',
    description: 'Free online health insurance cost calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function HealthInsuranceCostCalculatorPage() {
  return <HealthInsuranceCostCalculatorClient />;
}
