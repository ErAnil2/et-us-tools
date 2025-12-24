import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CircumferenceClient from './CircumferenceClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'circumference-calculator',
  category: 'calculators',
  fallback: {
    title: 'Circumference Calculator - Calculate Circle Circumference | The Economic Times',
    description: 'Free circumference calculator. Calculate circle circumference from radius, diameter, or area. Includes step-by-step calculations and multiple unit conversions.',
    keywords: 'circumference calculator, circle circumference, radius to circumference, diameter to circumference, circle calculator',
  }
});

export default function CircumferencePage() {
  return <CircumferenceClient />;
}
