import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ScreenTimeCalculatorClient from './ScreenTimeCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'screen-time-calculator',
  category: 'calculators',
  fallback: {
    title: 'Screen Time Calculator - Daily Device Usage & Digital Wellness Tracker | The Economic Times',
    description: 'Calculate your daily screen time across devices and assess digital wellness. Track phone, computer, TV, and tablet usage with health recommendations.',
    keywords: 'screen time calculator, digital wellness, device usage tracker, screen time health, digital detox, phone usage calculator',
  }
});

export default function ScreenTimeCalculatorPage() {
  return <ScreenTimeCalculatorClient />;
}
