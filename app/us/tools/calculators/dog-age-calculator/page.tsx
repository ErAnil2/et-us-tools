import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import DogAgeClient from './DogAgeClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'dog-age-calculator',
  category: 'calculators',
  fallback: {
    title: 'Dog Age Calculator - Dog Years to Human Years Converter | The Economic Times',
    description: 'Free dog age calculator to convert dog years to human years. Calculate your dogs age in human years with breed-specific calculations.',
    keywords: 'dog age calculator, dog years calculator, dog to human years calculator, pet age calculator, dog age converter',
  }
});

export default function DogAgePage() {
  return <DogAgeClient />;
}
