import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import RetirementClient from './RetirementClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'retirement-calculator',
  category: 'calculators',
  fallback: {
    title: 'Retirement Calculator - Plan Your Financial Future | The Economic Times',
    description: 'Calculate how much you need to save for retirement. Plan your future with our comprehensive retirement savings calculator.',
    keywords: 'retirement calculator, retirement planning, savings calculator, financial planning, retirement fund, 401k calculator',
  }
});

export default function RetirementPage() {
  return <RetirementClient />;
}
