import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PetCostCalculatorClient from './PetCostCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'pet-cost-calculator',
  category: 'calculators',
  fallback: {
    title: 'Pet Cost Calculator - Dog, Cat & Pet Ownership Lifetime Expenses',
    description: 'Calculate the total cost of pet ownership including food, veterinary care, supplies, grooming, insurance, and lifetime expenses. Complete budget planner for dogs, cats, and other pets.',
    keywords: 'pet cost calculator, dog cost calculator, cat cost calculator, pet ownership expenses, veterinary costs, pet budget, lifetime pet costs',
  }
});

export default function PetCostCalculatorPage() {
  return <PetCostCalculatorClient />;
}
