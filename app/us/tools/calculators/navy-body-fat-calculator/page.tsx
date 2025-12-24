import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import NavyBodyFatClient from './NavyBodyFatClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'navy-body-fat-calculator',
  category: 'calculators',
  fallback: {
    title: 'Navy Body Fat Calculator - Military BCA Body Fat Percentage',
    description: 'Calculate body fat percentage using the U.S. Navy method with height, weight, and circumference measurements. Military BCA standards included.',
    keywords: '',
  }
});

export default function NavyBodyFatPage() {
  return <NavyBodyFatClient />;
}
