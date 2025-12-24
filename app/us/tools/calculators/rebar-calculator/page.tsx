import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import RebarCalculatorClient from './RebarCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'rebar-calculator',
  category: 'calculators',
  fallback: {
    title: 'Rebar Calculator - Calculate Rebar Weight, Length & Cost | The Economic Times',
    description: 'Free rebar calculator to determine rebar weight, total length needed, and project cost. Calculate rebar requirements for concrete reinforcement projects.',
    keywords: 'rebar calculator, rebar weight calculator, rebar cost calculator, reinforcement bar calculator, concrete rebar, rebar spacing calculator',
  }
});

export default function RebarCalculatorPage() {
  return <RebarCalculatorClient />;
}
