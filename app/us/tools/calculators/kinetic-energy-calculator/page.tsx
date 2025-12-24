import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import KineticEnergyCalculatorClient from './KineticEnergyCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'kinetic-energy-calculator',
  category: 'calculators',
  fallback: {
    title: 'Kinetic Energy Calculator | The Economic Times',
    description: 'Free online kinetic energy calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function KineticEnergyCalculatorPage() {
  return <KineticEnergyCalculatorClient />;
}
