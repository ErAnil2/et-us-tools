import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import RunningPaceCalculatorClient from './RunningPaceCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'running-pace-calculator',
  category: 'calculators',
  fallback: {
    title: 'Running Pace Calculator - Calculate Pace, Time & Distance | Calculators101',
    description: 'Calculate running pace, finish time, and training paces. Perfect for marathon training, 5K, 10K, half marathon with split times and race predictions.',
    keywords: 'running pace calculator, marathon pace, running time calculator, race pace, 5k pace, 10k pace, half marathon, training pace, split times',
  }
});

export default function RunningPaceCalculatorPage() {
  return <RunningPaceCalculatorClient />;
}
