import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import HomeAffordabilityCalculatorClient from './HomeAffordabilityCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'home-affordability-calculator',
  category: 'calculators',
  fallback: {
    title: 'Home Affordability Calculator - How Much House Can I Afford | The Economic Times',
    description: 'Calculate how much house you can afford. Find your home buying budget based on income, debts, and down payment.',
    keywords: 'home affordability calculator, house affordability, mortgage calculator, home buying budget',
  }
});

export default function HomeAffordabilityCalculatorPage() {
  return <HomeAffordabilityCalculatorClient />;
}
