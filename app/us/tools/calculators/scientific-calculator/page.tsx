import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ScientificCalculatorClient from './ScientificCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'scientific-calculator',
  category: 'calculators',
  fallback: {
    title: 'Scientific Calculator - Advanced Math Functions Online | Free Tool',
    description: 'Free online scientific calculator with trigonometric functions, logarithms, exponentials, and advanced mathematical operations. Supports degrees/radians, memory functions, and keyboard shortcuts.',
    keywords: 'scientific calculator, trigonometry calculator, logarithm calculator, exponential calculator, advanced math calculator, sin cos tan, factorial calculator',
  }
});

export default function ScientificCalculatorPage() {
  return <ScientificCalculatorClient />;
}
