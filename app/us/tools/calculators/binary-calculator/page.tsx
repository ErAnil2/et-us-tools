import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BinaryCalculatorClient from './BinaryCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'binary-calculator',
  category: 'calculators',
  fallback: {
    title: 'Binary Calculator - Convert & Calculate Binary, Decimal, Hex, Octal | Free Tool',
    description: 'Free binary calculator for base conversion and bitwise operations. Convert between binary, decimal, hexadecimal, and octal. Perform AND, OR, XOR, NOT operations with step-by-step solutions.',
    keywords: 'binary calculator, binary converter, decimal to binary, hex converter, octal converter, bitwise operations, AND OR XOR, number base converter, programmer calculator',
  }
});

export default function BinaryCalculatorPage() {
  return <BinaryCalculatorClient />;
}
