import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ProductivityCalculatorClient from './ProductivityCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'productivity-calculator',
  category: 'calculators',
  fallback: {
    title: 'Productivity Calculator - Optimize Work Efficiency & Track Performance',
    description: 'Calculate your productivity metrics, work efficiency, and optimize your daily schedule with our comprehensive productivity calculator. Track tasks, analyze performance, and improve work output.',
    keywords: 'productivity calculator, work efficiency, time management, task productivity, work performance, efficiency metrics, business productivity',
  }
});

export default function ProductivityCalculatorPage() {
  return <ProductivityCalculatorClient />;
}
