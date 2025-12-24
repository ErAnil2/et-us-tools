import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import TorqueCalculatorClient from './TorqueCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'torque-calculator',
  category: 'calculators',
  fallback: {
    title: 'Torque Calculator - Calculate Torque, Force & Distance | The Economic Times',
    description: 'Calculate torque, force, and distance relationships for mechanical systems and rotational applications',
    keywords: 'torque calculator, force calculator, mechanical calculator, rotational force, torque calculation',
  }
});

export default function TorqueCalculatorPage() {
  return <TorqueCalculatorClient />;
}
