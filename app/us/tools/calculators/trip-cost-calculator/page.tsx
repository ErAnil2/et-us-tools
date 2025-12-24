import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import TripCostCalculatorClient from './TripCostCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'trip-cost-calculator',
  category: 'calculators',
  fallback: {
    title: 'Trip Cost Calculator - Plan Your Travel Budget | The Economic Times',
    description: 'Calculate total trip costs including flights, hotels, meals, transportation, and activities. Plan your travel budget with detailed cost breakdown and savings tips.',
    keywords: 'trip cost calculator, travel budget calculator, vacation cost, travel expenses, holiday budget planning, trip planner',
  }
});

export default function TripCostCalculatorPage() {
  return <TripCostCalculatorClient />;
}
