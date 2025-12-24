import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BloodAlcoholClient from './BloodAlcoholClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'blood-alcohol-calculator',
  category: 'calculators',
  fallback: {
    title: 'Blood Alcohol Calculator (BAC) - Calculate Blood Alcohol Content | Calculators101',
    description: 'Calculate blood alcohol content (BAC) based on drinks consumed, weight, gender, and time. Understand legal limits and safety guidelines for responsible drinking.',
    keywords: 'blood alcohol calculator, BAC calculator, blood alcohol content, drunk driving, alcohol levels, legal limit, DUI calculator',
  }
});

export default function BloodAlcoholPage() {
  return <BloodAlcoholClient />;
}
