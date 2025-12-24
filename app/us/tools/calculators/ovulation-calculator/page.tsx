import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import OvulationCalculatorClient from './OvulationCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'ovulation-calculator',
  category: 'calculators',
  fallback: {
    title: 'Ovulation Calculator - Predict Fertile Days & Best Time to Conceive | Calculators101',
    description: 'Calculate ovulation date and fertile window. Track menstrual cycle, predict best conception days, and optimize pregnancy planning with our fertility calculator.',
    keywords: '',
  }
});

export default function OvulationCalculatorPage() {
  return <OvulationCalculatorClient />;
}
