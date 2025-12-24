import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BiorhythmCalculatorClient from './BiorhythmCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'biorhythm-calculator',
  category: 'calculators',
  fallback: {
    title: 'Biorhythm Calculator - Physical, Emotional & Intellectual Cycles',
    description: 'Calculate your biorhythm cycles including physical, emotional, and intellectual patterns. Track daily energy levels.',
    keywords: 'biorhythm calculator, biorhythm cycles, physical cycle, emotional cycle, intellectual cycle',
  }
});

export default function BiorhythmCalculatorPage() {
  return <BiorhythmCalculatorClient />;
}
