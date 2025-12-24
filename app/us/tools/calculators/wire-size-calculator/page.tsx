import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import WireSizeCalculatorClient from './WireSizeCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'wire-size-calculator',
  category: 'calculators',
  fallback: {
    title: 'Wire Size Calculator - AWG Wire Gauge Calculator | The Economic Times',
    description: 'Free wire size calculator to determine proper AWG wire gauge for electrical circuits. Calculate wire size based on amperage, voltage drop, and distance.',
    keywords: 'wire size calculator, AWG calculator, wire gauge calculator, electrical wire size, ampacity calculator, voltage drop calculator',
  }
});

export default function WireSizeCalculatorPage() {
  return <WireSizeCalculatorClient />;
}
