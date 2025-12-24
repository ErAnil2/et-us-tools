import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import FractionCalculatorClient from './FractionCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'fraction-calculator',
  category: 'calculators',
  fallback: {
    title: 'Fraction Calculator - Add, Subtract, Multiply, Divide Fractions | Free Tool',
    description: 'Free fraction calculator with step-by-step solutions. Add, subtract, multiply, divide, simplify, and convert fractions. Includes LCD calculations, mixed numbers, and decimal conversions.',
    keywords: 'fraction calculator, add fractions, subtract fractions, multiply fractions, divide fractions, simplify fractions, mixed numbers, LCD, fraction to decimal, fraction operations',
  }
});

export default function FractionCalculatorPage() {
  return <FractionCalculatorClient />;
}
