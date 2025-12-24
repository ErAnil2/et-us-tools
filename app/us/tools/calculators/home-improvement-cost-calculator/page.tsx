import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import HomeImprovementCostCalculatorClient from './HomeImprovementCostCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'home-improvement-cost-calculator',
  category: 'calculators',
  fallback: {
    title: 'Home Improvement Cost Calculator | The Economic Times',
    description: 'Free online home improvement cost calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function HomeImprovementCostCalculatorPage() {
  return <HomeImprovementCostCalculatorClient />;
}
