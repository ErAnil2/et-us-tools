import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SocialSecurityCalculatorClient from './SocialSecurityCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'social-security-calculator',
  category: 'calculators',
  fallback: {
    title: 'Social Security Calculator - Estimate Benefits & Claiming Strategy | The Economic Times',
    description: 'Calculate your Social Security benefits, optimal claiming strategy, and break-even analysis. Plan your retirement with accurate benefit estimates.',
    keywords: 'social security calculator, social security benefits, retirement calculator, claiming strategy, social security estimator',
  }
});

export default function SocialSecurityCalculatorPage() {
  return <SocialSecurityCalculatorClient />;
}
