import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import GlassWeightCalculatorClient from './GlassWeightCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'glass-weight-calculator',
  category: 'calculators',
  fallback: {
    title: 'Glass Weight Calculator - Calculate Weight of Glass Panels',
    description: 'Free glass weight calculator for architectural glazing, windows, and structural applications. Calculate weight based on dimensions, thickness, and glass type.',
    keywords: '',
  }
});

export default function GlassWeightCalculatorPage() {
  return <GlassWeightCalculatorClient />;
}
