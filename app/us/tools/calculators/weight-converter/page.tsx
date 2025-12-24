import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import WeightConverterClient from './WeightConverterClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'weight-converter',
  category: 'calculators',
  fallback: {
    title: 'Weight Converter - Convert Kg, Lbs, Oz, Grams & More | Free Weight Unit Converter',
    description: 'Free weight converter for kilograms, pounds, ounces, grams, stones, and more. Accurate metric to imperial conversions with conversion tables, formulas, and practical examples. Instant results!',
    keywords: '',
  }
});

export default function WeightConverterPage() {
  return <WeightConverterClient />;
}
