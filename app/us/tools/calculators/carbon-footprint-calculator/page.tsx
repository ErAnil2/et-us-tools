import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CarbonFootprintClient from './CarbonFootprintClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'carbon-footprint-calculator',
  category: 'calculators',
  fallback: {
    title: 'Carbon Footprint Calculator - Calculate Your Environmental Impact | The Economic Times',
    description: 'Calculate your carbon footprint based on transportation, energy use, diet, and lifestyle. Track CO2 emissions and get tips to reduce your environmental impact.',
    keywords: 'carbon footprint calculator, CO2 calculator, environmental impact, carbon emissions, sustainability calculator',
  }
});

export default function CarbonFootprintPage() {
  return <CarbonFootprintClient />;
}
