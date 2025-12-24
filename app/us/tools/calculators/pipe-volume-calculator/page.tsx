import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PipeVolumeCalculatorClient from './PipeVolumeCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'pipe-volume-calculator',
  category: 'calculators',
  fallback: {
    title: 'Square Footage Calculator',
    description: 'Calculate area of spaces',
    keywords: '',
  }
});

export default function PipeVolumeCalculatorPage() {
  return <PipeVolumeCalculatorClient />;
}
