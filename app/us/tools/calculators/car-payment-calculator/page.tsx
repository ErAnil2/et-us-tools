import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CarPaymentCalculatorClient from './CarPaymentCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'car-payment-calculator',
  category: 'calculators',
  fallback: {
    title: 'Car Payment Calculator - Monthly Auto Payment Calculator | The Economic Times',
    description: 'Calculate monthly car payments. Estimate auto loan payments with taxes, fees, and trade-in value.',
    keywords: 'car payment calculator, auto payment calculator, monthly car payment, vehicle payment',
  }
});

export default function CarPaymentCalculatorPage() {
  return <CarPaymentCalculatorClient />;
}
