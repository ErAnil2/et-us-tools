import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import EmergencyFundClient from './EmergencyFundClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'emergency-fund-calculator',
  category: 'calculators',
  fallback: {
    title: 'Emergency Fund Calculator - How Much Emergency Money Do You Need? | The Economic Times',
    description: 'Calculate your ideal emergency fund amount based on monthly expenses and financial situation. Plan for financial security with personalized savings goals.',
    keywords: 'emergency fund calculator, emergency savings, financial planning, emergency money, savings goal calculator',
  }
});

export default function EmergencyFundPage() {
  return <EmergencyFundClient />;
}
