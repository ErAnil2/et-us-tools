import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import WavePropertiesCalculatorClient from './WavePropertiesCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'wave-properties-calculator',
  category: 'calculators',
  fallback: {
    title: 'Wave Properties Calculator - Frequency, Wavelength & Wave Speed',
    description: 'Calculate wave properties including frequency, wavelength, wave speed, and period. Free online wave calculator using v = fλ formula.',
    keywords: 'wave calculator, frequency calculator, wavelength calculator, wave speed, period calculator, wave physics',
  }
});

export default function WavePropertiesCalculatorPage() {
  return <WavePropertiesCalculatorClient />;
}
