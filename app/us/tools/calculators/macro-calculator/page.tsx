import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MacroCalculatorClient from './MacroCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'macro-calculator',
  category: 'calculators',
  fallback: {
    title: 'Macro Calculator - Calculate Protein, Carbs & Fat Needs | Free Tool',
    description: 'Free macro calculator to find your daily protein, carbs, and fat requirements. Calculate personalized macronutrients based on your goals - weight loss, muscle gain, or maintenance. Multiple diet types supported.',
    keywords: 'macro calculator, macronutrient calculator, protein calculator, carbs calculator, fat calculator, IIFYM calculator, flexible dieting, macro diet, keto macros, high protein diet calculator',
  }
});

export default function MacroCalculatorPage() {
  return <MacroCalculatorClient />;
}
