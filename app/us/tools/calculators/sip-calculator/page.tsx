import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SIPCalculatorClient from './SIPCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'sip-calculator',
  category: 'calculators',
  fallback: {
    title: 'SIP Calculator - Systematic Investment Plan Calculator | The Economic Times',
    description: 'Calculate your SIP investment returns with our comprehensive SIP calculator. Plan systematic investments and track compound growth over time.',
    keywords: 'SIP calculator, systematic investment plan, mutual fund calculator, investment calculator, SIP returns',
  }
});

export default function SIPCalculatorPage() {
  return <SIPCalculatorClient />;
}
