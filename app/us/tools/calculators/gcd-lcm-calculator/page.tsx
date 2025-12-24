import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import GCDLCMCalculatorClient from './GCDLCMCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'gcd-lcm-calculator',
  category: 'calculators',
  fallback: {
    title: 'GCD & LCM Calculator - Find Greatest Common Divisor & Least Common Multiple | Free Tool',
    description: 'Free GCD and LCM calculator with step-by-step solutions. Calculate Greatest Common Divisor (GCF) and Least Common Multiple for 2-6 numbers using prime factorization.',
    keywords: 'GCD calculator, LCM calculator, greatest common divisor, least common multiple, GCF calculator, prime factorization, math calculator, factor calculator',
  }
});

export default function GCDLCMCalculatorPage() {
  return <GCDLCMCalculatorClient />;
}
