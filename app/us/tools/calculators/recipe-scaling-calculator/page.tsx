import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import RecipeScalingCalculatorClient from './RecipeScalingCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'recipe-scaling-calculator',
  category: 'calculators',
  fallback: {
    title: 'Recipe Scaling Calculator - Scale Recipe Ingredients Up or Down | The Economic Times',
    description: 'Free recipe scaling calculator to adjust ingredient quantities for different serving sizes. Perfect for cooking, baking, and meal planning.',
    keywords: 'recipe scaling calculator, recipe converter, ingredient calculator, cooking calculator, baking calculator, recipe multiplier',
  }
});

export default function RecipeScalingCalculatorPage() {
  return <RecipeScalingCalculatorClient />;
}
