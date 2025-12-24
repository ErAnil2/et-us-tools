import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MacronutrientCalculatorClient from './MacronutrientCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'macronutrient-calculator',
  category: 'calculators',
  fallback: {
    title: 'Macronutrient Calculator | The Economic Times',
    description: 'Free online macronutrient calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function MacronutrientCalculatorPage() {
  return <MacronutrientCalculatorClient />;
}
