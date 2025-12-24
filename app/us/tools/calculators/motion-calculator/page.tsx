import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MotionClient from './MotionClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'motion-calculator',
  category: 'calculators',
  fallback: {
    title: 'Motion Calculator - Velocity, Acceleration & Displacement Calculator',
    description: 'Calculate motion equations for velocity, acceleration, displacement, and time. Solve kinematic problems with our easy-to-use motion calculator.',
    keywords: '',
  }
});

export default function MotionPage() {
  return <MotionClient />;
}
