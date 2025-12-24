import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import DigitalWellnessCalculatorClient from './DigitalWellnessCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'digital-wellness-calculator',
  category: 'calculators',
  fallback: {
    title: 'Digital Wellness Calculator - Analyze Screen Time & Improve Digital Health | Free Tool',
    description: 'Analyze your screen time and improve your digital wellbeing with personalized insights. Track daily usage, assess digital habits, and get recommendations for healthier technology use.',
    keywords: 'digital wellness calculator, screen time calculator, digital health, screen time tracker, digital wellbeing, phone usage tracker, digital detox, screen time analysis, technology addiction, digital habits',
  }
});

export default function DigitalWellnessCalculatorPage() {
  return <DigitalWellnessCalculatorClient />;
}
