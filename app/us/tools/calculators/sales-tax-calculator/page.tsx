import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SalesTaxCalculatorClient from './SalesTaxCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'sales-tax-calculator',
  category: 'calculators',
  fallback: {
    title: 'Sales Tax Calculator - Calculate Tax Amount & Total Price | Calculators101',
    description: 'Calculate sales tax amount and total price with tax. Includes reverse tax calculator and US state tax rates. Free online sales tax calculator.',
    keywords: 'sales tax calculator, tax calculator, state tax rates, reverse tax calculator, total price calculator',
  }
});

export default function SalesTaxCalculatorPage() {
  return <SalesTaxCalculatorClient />;
}
