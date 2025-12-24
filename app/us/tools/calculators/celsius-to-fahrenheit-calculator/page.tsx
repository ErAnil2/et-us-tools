import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CelsiusToFahrenheitCalculatorClient from './CelsiusToFahrenheitCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'celsius-to-fahrenheit-calculator',
  category: 'calculators',
  fallback: {
    title: 'Celsius to Fahrenheit Calculator - Temperature Converter | The Economic Times',
    description: 'Convert Celsius to Fahrenheit and vice versa. Quick and accurate temperature conversion.',
    keywords: 'celsius to fahrenheit, temperature converter, fahrenheit to celsius, temp calculator',
  }
});

export default function CelsiusToFahrenheitCalculatorPage() {
  return <CelsiusToFahrenheitCalculatorClient />;
}
