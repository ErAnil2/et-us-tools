import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import TemperatureConverterClient from './TemperatureConverterClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'temperature-converter',
  category: 'calculators',
  fallback: {
    title: 'Temperature Converter - Convert °C, °F, K | Free Temperature Unit Converter',
    description: 'Free temperature converter for Celsius, Fahrenheit, and Kelvin. Accurate conversions with formulas, reference tables, and practical examples. Instant results!',
    keywords: 'temperature converter, celsius to fahrenheit, fahrenheit to celsius, kelvin converter, temperature conversion calculator, °C to °F, °F to °C, temperature units',
  }
});

export default function TemperatureConverterPage() {
  return <TemperatureConverterClient />;
}
