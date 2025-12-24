import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BatteryLifeCalculatorClient from './BatteryLifeCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'battery-life-calculator',
  category: 'calculators',
  fallback: {
    title: 'Battery Life Calculator - Device Runtime & Capacity Calculator | The Economic Times',
    description: 'Calculate battery life for phones, laptops, and devices. Estimate runtime based on capacity, power consumption, and usage patterns.',
    keywords: 'battery life calculator, battery runtime calculator, device battery calculator, power consumption calculator, battery capacity',
  }
});

export default function BatteryLifeCalculatorPage() {
  return <BatteryLifeCalculatorClient />;
}
