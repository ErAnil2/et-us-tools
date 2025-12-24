import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BMRvsTDEEClient from './BMRvsTDEEClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'bmr-vs-tdee-calculator',
  category: 'calculators',
  fallback: {
    title: 'BMR vs TDEE Calculator - Basal Metabolic Rate and Total Daily Energy Expenditure | The Economic Times',
    description: 'Calculate your BMR (Basal Metabolic Rate) and TDEE (Total Daily Energy Expenditure) to understand your metabolism and daily calorie needs for weight management.',
    keywords: 'BMR calculator, TDEE calculator, metabolic rate, daily calorie needs, metabolism calculator, basal metabolic rate',
  }
});

export default function BMRvsTDEEPage() {
  return <BMRvsTDEEClient />;
}
