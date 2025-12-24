import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SquareFootageCalculatorClient from './SquareFootageCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'square-footage-calculator',
  category: 'calculators',
  fallback: {
    title: 'Square Footage Calculator - Calculate Room and Area Square Feet | The Economic Times',
    description: 'Free square footage calculator for rooms, houses, and irregular areas. Calculate square feet from length and width with multiple shape options.',
    keywords: 'square footage calculator, square feet calculator, room area calculator, floor area calculator, square foot calculator',
  }
});

export default function SquareFootageCalculatorPage() {
  return <SquareFootageCalculatorClient />;
}
