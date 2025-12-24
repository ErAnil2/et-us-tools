import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BusinessValuationClient from './BusinessValuationClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'business-valuation-calculator',
  category: 'calculators',
  fallback: {
    title: 'Business Valuation Calculator - Value Your Business | The Economic Times',
    description: 'Calculate your business value using multiple valuation methods including DCF, earnings multiples, and asset-based approaches. Get professional business valuations.',
    keywords: 'business valuation calculator, company valuation, business worth, DCF calculator, earnings multiple, business appraisal',
  }
});

export default function BusinessValuationPage() {
  return <BusinessValuationClient />;
}
