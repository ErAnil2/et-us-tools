import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BodyWaterPercentageClient from './BodyWaterPercentageClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'body-water-percentage-calculator',
  category: 'calculators',
  fallback: {
    title: 'Body Water Percentage Calculator - Total Body Water & Hydration',
    description: 'Calculate your body water percentage using Watson, Hume-Weyers, and other formulas. Understand hydration levels and body composition.',
    keywords: 'body water percentage, hydration calculator, total body water, fluid balance, dehydration calculator',
  }
});

export default function BodyWaterPercentagePage() {
  return <BodyWaterPercentageClient />;
}
