import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MgToMlClient from './MgToMlClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'mg-to-ml-calculator',
  category: 'calculators',
  fallback: {
    title: 'mg to mL Calculator',
    description: 'Convert milligrams (mg) to milliliters (mL) for medications, solutions, and liquid measurements. Includes dosage calculations and concentration conversions.',
    keywords: '',
  }
});

export default function MgToMlPage() {
  return <MgToMlClient />;
}
