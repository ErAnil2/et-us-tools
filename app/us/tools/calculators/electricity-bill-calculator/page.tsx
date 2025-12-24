import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ElectricityBillClient from './ElectricityBillClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'electricity-bill-calculator',
  category: 'calculators',
  fallback: {
    title: 'Electricity Bill Calculator - Calculate Power Consumption Costs | The Economic Times',
    description: 'Calculate your electricity bill based on appliance usage, kWh consumption, and utility rates. Estimate monthly and annual power costs.',
    keywords: 'electricity bill calculator, power consumption calculator, kWh calculator, electric bill estimator, energy cost calculator',
  }
});

export default function ElectricityBillPage() {
  return <ElectricityBillClient />;
}
