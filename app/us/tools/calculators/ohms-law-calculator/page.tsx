import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import OhmsLawCalculatorClient from './OhmsLawCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'ohms-law-calculator',
  category: 'calculators',
  fallback: {
    title: 'Ohm\'s Law Calculator - Calculate Voltage, Current & Resistance',
    description: 'Calculate voltage, current, and resistance using Ohm\'s Law. Easy-to-use electrical calculator with formulas.',
    keywords: 'ohms law calculator, voltage calculator, current calculator, resistance calculator, electrical calculator, V=IR',
  }
});

export default function OhmsLawCalculatorPage() {
  return <OhmsLawCalculatorClient />;
}
