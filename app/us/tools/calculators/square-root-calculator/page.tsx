import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SquareRootCalculatorClient from './SquareRootCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'square-root-calculator',
  category: 'calculators',
  fallback: {
    title: 'Square Root Calculator - Calculate Square, Cube & Nth Roots | Free Tool',
    description: 'Free square root calculator with step-by-step solutions. Calculate square roots, cube roots, nth roots, squares, and cubes. Perfect square detection and radical simplification.',
    keywords: 'square root calculator, sqrt calculator, cube root calculator, nth root, perfect square, radical simplifier, math calculator, root calculator, exponent calculator',
  }
});

export default function SquareRootCalculatorPage() {
  return <SquareRootCalculatorClient />;
}
