import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import USFederalTaxClient from './USFederalTaxClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'us-federal-income-tax-calculator',
  category: 'calculators',
  fallback: {
    title: 'US Federal Income Tax Calculator - 2024 & 2025 Tax Brackets | The Economic Times',
    description: 'Calculate your federal tax liability with detailed breakdowns and tax optimization tips. Includes 2024 and 2025 tax brackets, standard deductions, and tax credits.',
    keywords: 'us federal income tax calculator, tax calculator, income tax, tax brackets, federal tax, tax deductions, tax credits, irs tax calculator',
  }
});

export default function USFederalTaxPage() {
  return <USFederalTaxClient />;
}
