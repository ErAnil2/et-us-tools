import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SolarPanelCalculatorClient from './SolarPanelCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'solar-panel-calculator',
  category: 'calculators',
  fallback: {
    title: 'Solar Panel Calculator - Solar System Size & Savings Calculator | The Economic Times',
    description: 'Free solar panel calculator to estimate solar system size, energy production, cost, and savings. Calculate your solar panel needs and ROI.',
    keywords: 'solar panel calculator, solar system calculator, solar energy calculator, solar cost calculator, solar savings calculator',
  }
});

export default function SolarPanelCalculatorPage() {
  return <SolarPanelCalculatorClient />;
}
