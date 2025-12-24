import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import FahrenheitToCelsiusCalculatorClient from './FahrenheitToCelsiusCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'fahrenheit-to-celsius-calculator',
  category: 'calculators',
  fallback: {
    title: 'Fahrenheit to Celsius Calculator - Temperature Converter | The Economic Times',
    description: 'Convert Fahrenheit to Celsius and vice versa. Quick and accurate temperature conversion.',
    keywords: 'fahrenheit to celsius, temperature converter, celsius to fahrenheit, temp calculator',
  }
});

export default function FahrenheitToCelsiusCalculatorPage() {
  return <FahrenheitToCelsiusCalculatorClient />;
}
