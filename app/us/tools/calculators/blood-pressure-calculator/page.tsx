import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BloodPressureCalculatorClient from './BloodPressureCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'blood-pressure-calculator',
  category: 'calculators',
  fallback: {
    title: 'Blood Pressure Calculator - Check BP Levels & Categories',
    description: 'Calculate and interpret your blood pressure readings. Understand systolic and diastolic pressure levels.',
    keywords: 'blood pressure calculator, BP calculator, systolic pressure, diastolic pressure, hypertension',
  }
});

export default function BloodPressureCalculatorPage() {
  return <BloodPressureCalculatorClient />;
}
