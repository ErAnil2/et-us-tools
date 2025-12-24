import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BasicCalculatorClient from './BasicCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'basic-calculator',
  category: 'apps',
  fallback: {
    title: 'Online Calculator - Free Basic Calculator for Math | The Economic Times',
    description: 'Use our free online calculator for quick math calculations. Perform addition, subtraction, multiplication, and division with this simple, easy-to-use arithmetic calculator.',
    keywords: 'online calculator, basic calculator, free calculator, math calculator, arithmetic calculator, simple calculator, addition subtraction calculator',
  }
});

export default function BasicCalculatorPage() {
  return <BasicCalculatorClient />;
}
