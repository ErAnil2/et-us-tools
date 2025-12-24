import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MaintenanceCalorieCalculatorClient from './MaintenanceCalorieCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'maintenance-calorie-calculator',
  category: 'calculators',
  fallback: {
    title: 'Maintenance Calorie Calculator | The Economic Times',
    description: 'Free online maintenance calorie calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function MaintenanceCalorieCalculatorPage() {
  return <MaintenanceCalorieCalculatorClient />;
}
