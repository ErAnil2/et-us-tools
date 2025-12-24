import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import RecipeNutritionCalculatorClient from './RecipeNutritionCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'recipe-nutrition-calculator',
  category: 'calculators',
  fallback: {
    title: 'Recipe Nutrition Calculator - Analyze Recipe Calories & Macros | The Economic Times',
    description: 'Calculate nutrition facts for your recipes. Get accurate calorie counts, macronutrients, and nutritional information per serving for homemade meals.',
    keywords: 'recipe nutrition calculator, recipe calories, macro calculator, nutrition facts, cooking calculator, meal planning, dietary analysis',
  }
});

export default function RecipeNutritionCalculatorPage() {
  return <RecipeNutritionCalculatorClient />;
}
