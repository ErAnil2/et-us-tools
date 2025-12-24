import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import RampCalculatorClient from './RampCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'ramp-calculator',
  category: 'calculators',
  fallback: {
    title: 'Ramp Calculator - ADA Wheelchair Ramp Length & Slope Calculator | The Economic Times',
    description: 'Free ramp calculator for ADA compliant wheelchair ramps. Calculate ramp length, slope, rise, and run for accessibility compliance.',
    keywords: 'ramp calculator, ADA ramp calculator, wheelchair ramp calculator, ramp slope calculator, accessibility ramp calculator',
  }
});

export default function RampCalculatorPage() {
  return <RampCalculatorClient />;
}
