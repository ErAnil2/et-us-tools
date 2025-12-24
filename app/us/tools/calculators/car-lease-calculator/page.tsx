import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CarLeaseCalculatorClient from './CarLeaseCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'car-lease-calculator',
  category: 'calculators',
  fallback: {
    title: 'Car Lease Calculator - Calculate Monthly Lease Payments | The Economic Times',
    description: 'Calculate car lease payments. Compare lease vs buy options and find the best deal.',
    keywords: 'car lease calculator, auto lease calculator, lease payment calculator, vehicle lease',
  }
});

export default function CarLeaseCalculatorPage() {
  return <CarLeaseCalculatorClient />;
}
