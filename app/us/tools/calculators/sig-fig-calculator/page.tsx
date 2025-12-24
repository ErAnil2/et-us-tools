import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SigFigCalculatorClient from './SigFigCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'sig-fig-calculator',
  category: 'calculators',
  fallback: {
    title: 'Significant Figures Calculator - Sig Fig Counter & Rounder | The Economic Times',
    description: 'Free significant figures calculator to count sig figs, round numbers, and perform arithmetic with proper significant figure rules.',
    keywords: 'significant figures calculator, sig fig calculator, significant digits calculator, sig fig counter, scientific notation calculator',
  }
});

export default function SigFigCalculatorPage() {
  return <SigFigCalculatorClient />;
}
