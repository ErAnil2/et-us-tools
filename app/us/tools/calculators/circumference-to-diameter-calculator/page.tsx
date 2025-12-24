import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CircumferenceToDiameterCalculatorClient from './CircumferenceToDiameterCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'circumference-to-diameter-calculator',
  category: 'calculators',
  fallback: {
    title: 'Circumference To Diameter Calculator | The Economic Times',
    description: 'Free online circumference to diameter calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function CircumferenceToDiameterCalculatorPage() {
  return <CircumferenceToDiameterCalculatorClient />;
}
