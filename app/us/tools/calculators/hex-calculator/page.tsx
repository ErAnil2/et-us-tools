import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import HexCalculatorClient from './HexCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'hex-calculator',
  category: 'calculators',
  fallback: {
    title: 'Hex Calculator - Hexadecimal Converter & Bitwise Operations | Free Tool',
    description: 'Free hexadecimal calculator for base conversion and bitwise operations. Convert between hex, decimal, binary, and octal. Perform AND, OR, XOR, NOT, and bit shift operations with step-by-step solutions.',
    keywords: 'hex calculator, hexadecimal converter, hex to decimal, binary converter, bitwise calculator, AND OR XOR, programmer calculator, base converter, hex color codes',
  }
});

export default function HexCalculatorPage() {
  return <HexCalculatorClient />;
}
