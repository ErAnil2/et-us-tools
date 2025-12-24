import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import FuelCostCalculatorClient from './FuelCostCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'fuel-cost-calculator',
  category: 'calculators',
  fallback: {
    title: 'Fuel Cost Calculator - Calculate Trip Gas Cost | The Economic Times',
    description: 'Calculate fuel cost for your trip. Find out how much gas money you need based on distance and fuel efficiency.',
    keywords: 'fuel cost calculator, gas cost calculator, trip cost calculator, mpg calculator',
  }
});

export default function FuelCostCalculatorPage() {
  return <FuelCostCalculatorClient />;
}
