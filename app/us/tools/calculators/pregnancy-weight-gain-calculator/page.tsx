import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PregnancyWeightGainCalculatorClient from './PregnancyWeightGainCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'pregnancy-weight-gain-calculator',
  category: 'calculators',
  fallback: {
    title: 'Pregnancy Weight Gain Calculator - Healthy Weight Gain During Pregnancy',
    description: 'Calculate recommended weight gain during pregnancy based on pre-pregnancy BMI and current week. Track healthy pregnancy weight gain.',
    keywords: '',
  }
});

export default function PregnancyWeightGainCalculatorPage() {
  return <PregnancyWeightGainCalculatorClient />;
}
