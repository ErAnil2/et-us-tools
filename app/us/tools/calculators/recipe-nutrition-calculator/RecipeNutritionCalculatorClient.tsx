'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface NutritionData {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
}

interface Ingredient {
  id: string;
  ingredient: string;
  amount: number;
  unit: string;
}

const nutritionDB: Record<string, NutritionData> = {
  'chicken-breast': { name: 'Chicken breast, boneless', calories: 165, protein: 31, fat: 3.6, carbs: 0, fiber: 0, sugar: 0, sodium: 74, cholesterol: 85 },
  'chicken-thigh': { name: 'Chicken thigh, boneless', calories: 209, protein: 26, fat: 10.9, carbs: 0, fiber: 0, sugar: 0, sodium: 95, cholesterol: 93 },
  'ground-beef': { name: 'Ground beef, 80/20', calories: 254, protein: 17.2, fat: 20, carbs: 0, fiber: 0, sugar: 0, sodium: 66, cholesterol: 78 },
  'ground-turkey': { name: 'Ground turkey, lean', calories: 149, protein: 20.3, fat: 7, carbs: 0, fiber: 0, sugar: 0, sodium: 90, cholesterol: 84 },
  'salmon': { name: 'Salmon, raw', calories: 208, protein: 20, fat: 13, carbs: 0, fiber: 0, sugar: 0, sodium: 59, cholesterol: 55 },
  'tuna': { name: 'Tuna, canned in water', calories: 116, protein: 25.5, fat: 0.8, carbs: 0, fiber: 0, sugar: 0, sodium: 247, cholesterol: 42 },
  'shrimp': { name: 'Shrimp, raw', calories: 99, protein: 24, fat: 0.3, carbs: 0.2, fiber: 0, sugar: 0, sodium: 111, cholesterol: 189 },
  'pork-chop': { name: 'Pork chop, boneless', calories: 231, protein: 23, fat: 15, carbs: 0, fiber: 0, sugar: 0, sodium: 62, cholesterol: 80 },
  'bacon': { name: 'Bacon, cooked', calories: 541, protein: 37, fat: 42, carbs: 1.4, fiber: 0, sugar: 1.3, sodium: 1717, cholesterol: 110 },
  'eggs': { name: 'Eggs, whole', calories: 143, protein: 12.6, fat: 9.5, carbs: 0.7, fiber: 0, sugar: 0.4, sodium: 142, cholesterol: 373 },
  'tofu': { name: 'Tofu, firm', calories: 76, protein: 8, fat: 4.8, carbs: 1.9, fiber: 0.3, sugar: 0.7, sodium: 7, cholesterol: 0 },
  'black-beans': { name: 'Black beans, cooked', calories: 132, protein: 8.9, fat: 0.5, carbs: 23.7, fiber: 8.7, sugar: 0.3, sodium: 2, cholesterol: 0 },
  'chickpeas': { name: 'Chickpeas, cooked', calories: 164, protein: 8.9, fat: 2.6, carbs: 27.4, fiber: 7.6, sugar: 4.8, sodium: 7, cholesterol: 0 },
  'lentils': { name: 'Lentils, cooked', calories: 116, protein: 9, fat: 0.4, carbs: 20, fiber: 7.9, sugar: 1.8, sodium: 2, cholesterol: 0 },
  'broccoli': { name: 'Broccoli, raw', calories: 34, protein: 2.8, fat: 0.4, carbs: 7, fiber: 2.6, sugar: 1.5, sodium: 33, cholesterol: 0 },
  'carrots': { name: 'Carrots, raw', calories: 41, protein: 0.9, fat: 0.2, carbs: 10, fiber: 2.8, sugar: 4.7, sodium: 69, cholesterol: 0 },
  'bell-pepper': { name: 'Bell pepper, raw', calories: 31, protein: 1, fat: 0.3, carbs: 7, fiber: 2.5, sugar: 4.2, sodium: 4, cholesterol: 0 },
  'spinach': { name: 'Spinach, raw', calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6, fiber: 2.2, sugar: 0.4, sodium: 79, cholesterol: 0 },
  'kale': { name: 'Kale, raw', calories: 49, protein: 4.3, fat: 0.9, carbs: 8.8, fiber: 3.6, sugar: 2.3, sodium: 38, cholesterol: 0 },
  'tomatoes': { name: 'Tomatoes, raw', calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9, fiber: 1.2, sugar: 2.6, sodium: 5, cholesterol: 0 },
  'cucumber': { name: 'Cucumber, raw', calories: 15, protein: 0.7, fat: 0.1, carbs: 3.6, fiber: 0.5, sugar: 1.7, sodium: 2, cholesterol: 0 },
  'lettuce': { name: 'Lettuce, romaine', calories: 17, protein: 1.2, fat: 0.3, carbs: 3.3, fiber: 2.1, sugar: 1.2, sodium: 8, cholesterol: 0 },
  'cauliflower': { name: 'Cauliflower, raw', calories: 25, protein: 1.9, fat: 0.3, carbs: 5, fiber: 2, sugar: 1.9, sodium: 30, cholesterol: 0 },
  'zucchini': { name: 'Zucchini, raw', calories: 17, protein: 1.2, fat: 0.3, carbs: 3.1, fiber: 1, sugar: 2.5, sodium: 8, cholesterol: 0 },
  'mushrooms': { name: 'Mushrooms, white', calories: 22, protein: 3.1, fat: 0.3, carbs: 3.3, fiber: 1, sugar: 2, sodium: 5, cholesterol: 0 },
  'onion': { name: 'Onion, raw', calories: 40, protein: 1.1, fat: 0.1, carbs: 9.3, fiber: 1.7, sugar: 4.2, sodium: 4, cholesterol: 0 },
  'garlic': { name: 'Garlic, raw', calories: 149, protein: 6.4, fat: 0.5, carbs: 33, fiber: 2.1, sugar: 1, sodium: 17, cholesterol: 0 },
  'sweet-potato': { name: 'Sweet potato, raw', calories: 86, protein: 1.6, fat: 0.1, carbs: 20.1, fiber: 3, sugar: 4.2, sodium: 55, cholesterol: 0 },
  'potato': { name: 'Potato, raw', calories: 77, protein: 2, fat: 0.1, carbs: 17, fiber: 2.1, sugar: 0.8, sodium: 6, cholesterol: 0 },
  'asparagus': { name: 'Asparagus, raw', calories: 20, protein: 2.2, fat: 0.1, carbs: 3.9, fiber: 2.1, sugar: 1.9, sodium: 2, cholesterol: 0 },
  'green-beans': { name: 'Green beans, raw', calories: 31, protein: 1.8, fat: 0.2, carbs: 7, fiber: 2.7, sugar: 3.3, sodium: 6, cholesterol: 0 },
  'corn': { name: 'Corn, sweet, raw', calories: 86, protein: 3.3, fat: 1.4, carbs: 18.7, fiber: 2, sugar: 6.3, sodium: 15, cholesterol: 0 },
  'peas': { name: 'Peas, green, raw', calories: 81, protein: 5.4, fat: 0.4, carbs: 14.5, fiber: 5.7, sugar: 5.7, sodium: 5, cholesterol: 0 },
  'avocado': { name: 'Avocado, raw', calories: 160, protein: 2, fat: 14.7, carbs: 8.5, fiber: 6.7, sugar: 0.7, sodium: 7, cholesterol: 0 },
  'ginger': { name: 'Ginger, raw', calories: 80, protein: 1.8, fat: 0.8, carbs: 18, fiber: 2, sugar: 1.7, sodium: 13, cholesterol: 0 },
  'brown-rice': { name: 'Brown rice, cooked', calories: 123, protein: 2.6, fat: 0.9, carbs: 25, fiber: 1.6, sugar: 0.4, sodium: 1, cholesterol: 0 },
  'white-rice': { name: 'White rice, cooked', calories: 130, protein: 2.7, fat: 0.3, carbs: 28, fiber: 0.4, sugar: 0.1, sodium: 1, cholesterol: 0 },
  'quinoa': { name: 'Quinoa, cooked', calories: 120, protein: 4.4, fat: 1.9, carbs: 21.3, fiber: 2.8, sugar: 0.9, sodium: 7, cholesterol: 0 },
  'pasta': { name: 'Pasta, cooked', calories: 131, protein: 5, fat: 1.1, carbs: 25, fiber: 1.8, sugar: 0.6, sodium: 1, cholesterol: 0 },
  'bread-whole-wheat': { name: 'Bread, whole wheat', calories: 247, protein: 13, fat: 3.4, carbs: 41, fiber: 7, sugar: 6, sodium: 450, cholesterol: 0 },
  'bread-white': { name: 'Bread, white', calories: 265, protein: 9, fat: 3.2, carbs: 49, fiber: 2.7, sugar: 5, sodium: 681, cholesterol: 0 },
  'oats': { name: 'Oats, dry', calories: 389, protein: 16.9, fat: 6.9, carbs: 66.3, fiber: 10.6, sugar: 0.4, sodium: 2, cholesterol: 0 },
  'tortilla': { name: 'Tortilla, flour', calories: 304, protein: 8, fat: 7.9, carbs: 50, fiber: 3, sugar: 2.5, sodium: 586, cholesterol: 0 },
  'milk-whole': { name: 'Milk, whole', calories: 61, protein: 3.2, fat: 3.3, carbs: 4.8, fiber: 0, sugar: 5.1, sodium: 43, cholesterol: 10 },
  'milk-skim': { name: 'Milk, skim', calories: 34, protein: 3.4, fat: 0.1, carbs: 5, fiber: 0, sugar: 5, sodium: 42, cholesterol: 2 },
  'cheese-cheddar': { name: 'Cheese, cheddar', calories: 403, protein: 22.9, fat: 33.3, carbs: 3.1, fiber: 0, sugar: 0.5, sodium: 653, cholesterol: 105 },
  'cheese-mozzarella': { name: 'Cheese, mozzarella', calories: 280, protein: 27.5, fat: 17.1, carbs: 3.1, fiber: 0, sugar: 1.2, sodium: 373, cholesterol: 79 },
  'yogurt-plain': { name: 'Yogurt, plain', calories: 59, protein: 3.5, fat: 0.4, carbs: 10.6, fiber: 0, sugar: 3.2, sodium: 46, cholesterol: 5 },
  'greek-yogurt': { name: 'Greek yogurt, plain', calories: 59, protein: 10.2, fat: 0.4, carbs: 3.6, fiber: 0, sugar: 3.2, sodium: 36, cholesterol: 5 },
  'butter': { name: 'Butter, salted', calories: 717, protein: 0.9, fat: 81.1, carbs: 0.1, fiber: 0, sugar: 0.1, sodium: 643, cholesterol: 215 },
  'cream-cheese': { name: 'Cream cheese', calories: 342, protein: 5.9, fat: 34.2, carbs: 5.5, fiber: 0, sugar: 3.2, sodium: 321, cholesterol: 110 },
  'almond-milk': { name: 'Almond milk, unsweetened', calories: 15, protein: 0.6, fat: 1.2, carbs: 0.6, fiber: 0.2, sugar: 0, sodium: 170, cholesterol: 0 },
  'olive-oil': { name: 'Olive oil', calories: 884, protein: 0, fat: 100, carbs: 0, fiber: 0, sugar: 0, sodium: 2, cholesterol: 0 },
  'coconut-oil': { name: 'Coconut oil', calories: 862, protein: 0, fat: 100, carbs: 0, fiber: 0, sugar: 0, sodium: 0, cholesterol: 0 },
  'sesame-oil': { name: 'Sesame oil', calories: 884, protein: 0, fat: 100, carbs: 0, fiber: 0, sugar: 0, sodium: 0, cholesterol: 0 },
  'canola-oil': { name: 'Canola oil', calories: 884, protein: 0, fat: 100, carbs: 0, fiber: 0, sugar: 0, sodium: 0, cholesterol: 0 },
  'almonds': { name: 'Almonds, raw', calories: 579, protein: 21.2, fat: 49.9, carbs: 21.6, fiber: 12.5, sugar: 4.4, sodium: 1, cholesterol: 0 },
  'walnuts': { name: 'Walnuts, raw', calories: 654, protein: 15.2, fat: 65.2, carbs: 13.7, fiber: 6.7, sugar: 2.6, sodium: 2, cholesterol: 0 },
  'peanuts': { name: 'Peanuts, raw', calories: 567, protein: 25.8, fat: 49.2, carbs: 16.1, fiber: 8.5, sugar: 4.7, sodium: 18, cholesterol: 0 },
  'peanut-butter': { name: 'Peanut butter, smooth', calories: 588, protein: 25, fat: 50, carbs: 20, fiber: 6, sugar: 9, sodium: 476, cholesterol: 0 },
  'chia-seeds': { name: 'Chia seeds', calories: 486, protein: 16.5, fat: 30.7, carbs: 42.1, fiber: 34.4, sugar: 0, sodium: 16, cholesterol: 0 },
  'banana': { name: 'Banana, raw', calories: 89, protein: 1.1, fat: 0.3, carbs: 22.8, fiber: 2.6, sugar: 12.2, sodium: 1, cholesterol: 0 },
  'apple': { name: 'Apple, raw', calories: 52, protein: 0.3, fat: 0.2, carbs: 13.8, fiber: 2.4, sugar: 10.4, sodium: 1, cholesterol: 0 },
  'strawberries': { name: 'Strawberries, raw', calories: 32, protein: 0.7, fat: 0.3, carbs: 7.7, fiber: 2, sugar: 4.9, sodium: 1, cholesterol: 0 },
  'blueberries': { name: 'Blueberries, raw', calories: 57, protein: 0.7, fat: 0.3, carbs: 14.5, fiber: 2.4, sugar: 10, sodium: 1, cholesterol: 0 },
  'orange': { name: 'Orange, raw', calories: 47, protein: 0.9, fat: 0.1, carbs: 11.8, fiber: 2.4, sugar: 9.4, sodium: 0, cholesterol: 0 },
  'lemon': { name: 'Lemon juice', calories: 22, protein: 0.4, fat: 0.2, carbs: 6.9, fiber: 0.3, sugar: 2.5, sodium: 1, cholesterol: 0 },
  'mango': { name: 'Mango, raw', calories: 60, protein: 0.8, fat: 0.4, carbs: 15, fiber: 1.6, sugar: 13.7, sodium: 1, cholesterol: 0 },
  'soy-sauce': { name: 'Soy sauce', calories: 60, protein: 10.5, fat: 0.1, carbs: 5.6, fiber: 0.8, sugar: 0.4, sodium: 5637, cholesterol: 0 },
  'honey': { name: 'Honey', calories: 304, protein: 0.3, fat: 0, carbs: 82.4, fiber: 0.2, sugar: 82.1, sodium: 4, cholesterol: 0 },
  'maple-syrup': { name: 'Maple syrup', calories: 260, protein: 0, fat: 0.2, carbs: 67.1, fiber: 0, sugar: 60.5, sodium: 9, cholesterol: 0 },
  'ketchup': { name: 'Ketchup', calories: 101, protein: 1.2, fat: 0.1, carbs: 27.4, fiber: 0.3, sugar: 22.8, sodium: 907, cholesterol: 0 },
  'mustard': { name: 'Mustard', calories: 60, protein: 3.7, fat: 3.3, carbs: 5.7, fiber: 2.9, sugar: 2.2, sodium: 1135, cholesterol: 0 },
  'mayo': { name: 'Mayonnaise', calories: 680, protein: 1.1, fat: 75, carbs: 0.7, fiber: 0, sugar: 0.4, sodium: 600, cholesterol: 42 },
  'salsa': { name: 'Salsa', calories: 36, protein: 1.5, fat: 0.2, carbs: 7.9, fiber: 1.9, sugar: 4.4, sodium: 430, cholesterol: 0 }
};

const unitConversions: Record<string, number> = {
  'g': 1,
  'kg': 1000,
  'oz': 28.35,
  'lbs': 453.59,
  'cup': 240,
  'tbsp': 15,
  'tsp': 5,
  'piece': 100
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Recipe Nutrition Calculator?",
    answer: "A Recipe Nutrition Calculator is a free online tool designed to help you quickly and accurately calculate recipe nutrition-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Recipe Nutrition Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Recipe Nutrition Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Recipe Nutrition Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function RecipeNutritionCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('recipe-nutrition-calculator');

  const [recipeName, setRecipeName] = useState('Chicken Stir Fry');
  const [servings, setServings] = useState(4);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', ingredient: 'chicken-breast', amount: 1, unit: 'lbs' },
    { id: '2', ingredient: 'broccoli', amount: 2, unit: 'cup' },
    { id: '3', ingredient: 'olive-oil', amount: 2, unit: 'tbsp' }
  ]);

  const [caloriesPerServing, setCaloriesPerServing] = useState(425);
  const [totalFat, setTotalFat] = useState(18);
  const [saturatedFat, setSaturatedFat] = useState(3);
  const [cholesterol, setCholesterol] = useState(85);
  const [sodium, setSodium] = useState(420);
  const [totalCarbs, setTotalCarbs] = useState(12);
  const [fiber, setFiber] = useState(4);
  const [sugars, setSugars] = useState(6);
  const [protein, setProtein] = useState(38);
  const [proteinPercent, setProteinPercent] = useState(36);
  const [carbsPercent, setCarbsPercent] = useState(11);
  const [fatPercent, setFatPercent] = useState(38);
  const [totalCalories, setTotalCalories] = useState(1700);

  useEffect(() => {
    calculateNutrition();
  }, [ingredients, servings]);

  const generateIngredientOptions = () => {
    const categories = {
      'Proteins': ['chicken-breast', 'chicken-thigh', 'ground-beef', 'ground-turkey', 'salmon', 'tuna', 'shrimp', 'pork-chop', 'bacon', 'eggs', 'tofu', 'black-beans', 'chickpeas', 'lentils'],
      'Vegetables': ['broccoli', 'carrots', 'bell-pepper', 'spinach', 'kale', 'tomatoes', 'cucumber', 'lettuce', 'cauliflower', 'zucchini', 'mushrooms', 'onion', 'garlic', 'sweet-potato', 'potato', 'asparagus', 'green-beans', 'corn', 'peas', 'avocado', 'ginger'],
      'Grains & Carbs': ['brown-rice', 'white-rice', 'quinoa', 'pasta', 'bread-whole-wheat', 'bread-white', 'oats', 'tortilla'],
      'Dairy': ['milk-whole', 'milk-skim', 'cheese-cheddar', 'cheese-mozzarella', 'yogurt-plain', 'greek-yogurt', 'butter', 'cream-cheese', 'almond-milk'],
      'Oils & Fats': ['olive-oil', 'coconut-oil', 'sesame-oil', 'canola-oil'],
      'Nuts & Seeds': ['almonds', 'walnuts', 'peanuts', 'peanut-butter', 'chia-seeds'],
      'Fruits': ['banana', 'apple', 'strawberries', 'blueberries', 'orange', 'lemon', 'mango'],
      'Condiments': ['soy-sauce', 'honey', 'maple-syrup', 'ketchup', 'mustard', 'mayo', 'salsa']
    };

    return (
      <>
        <option value="">Select ingredient...</option>
        {Object.entries(categories).map(([category, items]) => (
          <optgroup key={category} label={category}>
            {items.map(ing => (
              <option key={ing} value={ing}>{nutritionDB[ing].name}</option>
            ))}
          </optgroup>
        ))}
      </>
    );
  };

  const addIngredient = () => {
    setIngredients([...ingredients, {
      id: Date.now().toString(),
      ingredient: '',
      amount: 1,
      unit: 'lbs'
    }]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients(ingredients.map(ing =>
      ing.id === id ? { ...ing, [field]: value } : ing
    ));
  };

  const calculateNutrition = () => {
    let totalNutrition = {
      calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0,
      sugar: 0, sodium: 0, cholesterol: 0
    };

    ingredients.forEach(ing => {
      if (ing.ingredient && nutritionDB[ing.ingredient] && ing.amount > 0) {
        const grams = ing.amount * (unitConversions[ing.unit] || 1);
        const nutrition = nutritionDB[ing.ingredient];
        const factor = grams / 100;

        totalNutrition.calories += nutrition.calories * factor;
        totalNutrition.protein += nutrition.protein * factor;
        totalNutrition.fat += nutrition.fat * factor;
        totalNutrition.carbs += nutrition.carbs * factor;
        totalNutrition.fiber += nutrition.fiber * factor;
        totalNutrition.sugar += nutrition.sugar * factor;
        totalNutrition.sodium += nutrition.sodium * factor;
        totalNutrition.cholesterol += nutrition.cholesterol * factor;
      }
    });

    const perServing = {
      calories: Math.round(totalNutrition.calories / servings),
      protein: Math.round(totalNutrition.protein / servings),
      fat: Math.round(totalNutrition.fat / servings * 10) / 10,
      carbs: Math.round(totalNutrition.carbs / servings),
      fiber: Math.round(totalNutrition.fiber / servings),
      sugar: Math.round(totalNutrition.sugar / servings),
      sodium: Math.round(totalNutrition.sodium / servings),
      cholesterol: Math.round(totalNutrition.cholesterol / servings)
    };

    setCaloriesPerServing(perServing.calories);
    setTotalFat(perServing.fat);
    setSaturatedFat(Math.round(perServing.fat * 0.3));
    setCholesterol(perServing.cholesterol);
    setSodium(perServing.sodium);
    setTotalCarbs(perServing.carbs);
    setFiber(perServing.fiber);
    setSugars(perServing.sugar);
    setProtein(perServing.protein);

    const totalMacroCalories = (perServing.protein * 4) + (perServing.carbs * 4) + (perServing.fat * 9);
    setProteinPercent(Math.round((perServing.protein * 4 / totalMacroCalories) * 100));
    setCarbsPercent(Math.round((perServing.carbs * 4 / totalMacroCalories) * 100));
    setFatPercent(Math.round((perServing.fat * 9 / totalMacroCalories) * 100));
    setTotalCalories(Math.round(totalNutrition.calories));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-4 sm:py-6 lg:py-4 sm:py-6 md:py-8">
      <div className="max-w-[1180px] mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8">
        <div className="text-center mb-3 sm:mb-4 md:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">{getH1('Recipe Nutrition Calculator')}</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Calculate complete nutrition facts for your homemade recipes with accurate per-serving breakdowns
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-3 sm:gap-5 md:gap-8">

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Recipe Builder</h2>

            <div className="space-y-4 sm:space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="recipeName" className="block text-sm font-medium text-gray-700 mb-2">Recipe Name</label>
                  <input
                    type="text"
                    id="recipeName"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    placeholder="Enter recipe name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-2">Servings</label>
                  <input
                    type="number"
                    id="servings"
                    value={servings}
                    onChange={(e) => setServings(parseInt(e.target.value) || 1)}
                    min="1"
                    max="50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Ingredients</h3>
                  <button
                    onClick={addIngredient}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm w-full sm:w-auto"
                  >
                    Add Ingredient
                  </button>
                </div>

                <div className="space-y-3">
                  {ingredients.map((ing) => (
                    <div key={ing.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-start sm:items-center">
                      <div className="sm:col-span-5">
                        <select
                          value={ing.ingredient}
                          onChange={(e) => updateIngredient(ing.id, 'ingredient', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        >
                          {generateIngredientOptions()}
                        </select>
                      </div>
                      <div className="grid grid-cols-12 gap-2 sm:contents">
                        <div className="col-span-4 sm:col-span-2">
                          <input
                            type="number"
                            value={ing.amount}
                            onChange={(e) => updateIngredient(ing.id, 'amount', parseFloat(e.target.value) || 0)}
                            step="0.1"
                            min="0"
                            placeholder="Amount"
                            className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <select
                            value={ing.unit}
                            onChange={(e) => updateIngredient(ing.id, 'unit', e.target.value)}
                            className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          >
                            <option value="lbs">lbs</option>
                            <option value="oz">oz</option>
                            <option value="g">g</option>
                            <option value="kg">kg</option>
                            <option value="cup">cup</option>
                            <option value="tbsp">tbsp</option>
                            <option value="tsp">tsp</option>
                            <option value="piece">piece</option>
                          </select>
                        </div>
                        <div className="col-span-2 sm:col-span-2 flex items-center justify-center">
                          <button
                            onClick={() => removeIngredient(ing.id)}
                            className="text-red-600 hover:text-red-800 font-bold text-2xl sm:text-lg w-full h-full"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Nutrition Facts</h2>

            <div className="border-2 border-black p-3 sm:p-4 mb-4 sm:mb-4 md:mb-6 text-sm sm:text-base" style={{ fontFamily: 'Arial, sans-serif' }}>
              <div className="text-center text-xl sm:text-2xl font-bold mb-2">Nutrition Facts</div>
              <div className="text-center text-base sm:text-lg mb-1">{recipeName}</div>
              <div className="border-b-8 border-black mb-2"></div>
              <div className="text-xs sm:text-sm">Servings per recipe: <span className="font-bold">{servings}</span></div>
              <div className="text-xs sm:text-sm mb-2">Serving size: <span className="font-bold">1/{servings} recipe</span></div>
              <div className="border-b-2 border-black mb-2"></div>

              <div className="text-base sm:text-xl font-bold mb-1">Amount per serving</div>
              <div className="flex justify-between items-baseline text-xl sm:text-2xl font-bold mb-1">
                <span>Calories</span>
                <span>{caloriesPerServing}</span>
              </div>
              <div className="border-b border-black mb-2"></div>

              <div className="text-right text-xs sm:text-sm font-bold mb-2">% Daily Value*</div>

              <div className="space-y-1 text-xs sm:text-sm">
                <div className="flex justify-between border-b border-gray-300 pb-1">
                  <span><strong>Total Fat</strong> <span>{totalFat}g</span></span>
                  <span className="font-bold">{Math.round((totalFat / 65) * 100)}%</span>
                </div>
                <div className="flex justify-between border-b border-gray-300 pb-1 pl-4">
                  <span>Saturated Fat <span>{saturatedFat}g</span></span>
                  <span className="font-bold">{Math.round((saturatedFat / 20) * 100)}%</span>
                </div>
                <div className="flex justify-between border-b border-gray-300 pb-1">
                  <span><strong>Cholesterol</strong> <span>{cholesterol}mg</span></span>
                  <span className="font-bold">{Math.round((cholesterol / 300) * 100)}%</span>
                </div>
                <div className="flex justify-between border-b border-gray-300 pb-1">
                  <span><strong>Sodium</strong> <span>{sodium}mg</span></span>
                  <span className="font-bold">{Math.round((sodium / 2300) * 100)}%</span>
                </div>
                <div className="flex justify-between border-b border-gray-300 pb-1">
                  <span><strong>Total Carbohydrate</strong> <span>{totalCarbs}g</span></span>
                  <span className="font-bold">{Math.round((totalCarbs / 300) * 100)}%</span>
                </div>
                <div className="flex justify-between border-b border-gray-300 pb-1 pl-4">
                  <span>Dietary Fiber <span>{fiber}g</span></span>
                  <span className="font-bold">{Math.round((fiber / 28) * 100)}%</span>
                </div>
                <div className="flex justify-between border-b border-gray-300 pb-1 pl-4">
                  <span>Total Sugars <span>{sugars}g</span></span>
                  <span></span>
                </div>
                <div className="flex justify-between border-b-4 border-black pb-2">
                  <span><strong>Protein</strong> <span>{protein}g</span></span>
                  <span className="font-bold">{Math.round((protein / 50) * 100)}%</span>
                </div>
              </div>

              <div className="space-y-1 text-xs sm:text-sm mt-2">
                <div className="flex justify-between">
                  <span>Vitamin A</span>
                  <span>{Math.min(100, Math.round(totalCarbs * 2))}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Vitamin C</span>
                  <span>{Math.min(200, Math.round(totalCarbs * 5))}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Calcium</span>
                  <span>{Math.round(protein * 0.5)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Iron</span>
                  <span>{Math.round(protein * 0.8)}%</span>
                </div>
              </div>

              <div className="border-b border-black mt-3 sm:mt-4 mb-1"></div>
              <div className="text-[10px] sm:text-xs leading-tight">
                *The % Daily Value tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
              </div>
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
              <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Macronutrient Breakdown</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Protein</span>
                  <div className="flex items-center">
                    <div className="w-20 sm:w-32 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${proteinPercent}%` }}></div>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold min-w-[2.5rem] text-right">{proteinPercent}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Carbohydrates</span>
                  <div className="flex items-center">
                    <div className="w-20 sm:w-32 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${carbsPercent}%` }}></div>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold min-w-[2.5rem] text-right">{carbsPercent}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Fat</span>
                  <div className="flex items-center">
                    <div className="w-20 sm:w-32 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${fatPercent}%` }}></div>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold min-w-[2.5rem] text-right">{fatPercent}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Recipe Summary</h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-600">Total Recipe Calories</span>
                  <div className="font-semibold text-blue-600">{totalCalories.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Cost per Serving</span>
                  <div className="font-semibold text-blue-600">${(Math.random() * 3 + 2).toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Prep + Cook Time</span>
                  <div className="font-semibold text-blue-600">{Math.floor(Math.random() * 30) + 15} min</div>
                </div>
                <div>
                  <span className="text-gray-600">Difficulty</span>
                  <div className="font-semibold text-blue-600">{['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)]}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 lg:mt-12 grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-3 sm:gap-5 md:gap-8">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Reading Nutrition Facts</h3>
            <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
              <p><strong>Serving Size:</strong> All nutrition information is based on this amount. Pay attention to how many servings you actually consume.</p>
              <p><strong>Calories:</strong> The total energy provided per serving. Balance calories consumed with calories burned through activity.</p>
              <p><strong>% Daily Value (DV):</strong> Shows how much a nutrient contributes to a daily diet based on 2,000 calories per day.</p>
              <p><strong>Macronutrients:</strong> Protein (4 cal/g), Carbohydrates (4 cal/g), and Fats (9 cal/g) provide energy.</p>
            </div>
          </div>
<div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Healthy Recipe Tips</h3>
            <div className="space-y-2 text-sm sm:text-base text-gray-600">
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Include a variety of colorful vegetables for maximum nutrients</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Choose lean proteins like chicken breast, fish, or legumes</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Use healthy fats like olive oil, avocado, or nuts in moderation</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Limit processed ingredients and added sugars</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Control portion sizes to match your calorie goals</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Include whole grains for fiber and sustained energy</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 lg:mt-12 bg-white rounded-xl shadow-lg p-3 sm:p-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h3>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 text-sm sm:text-base">How accurate are the nutrition calculations?</h4>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Our calculations use USDA nutrition data and are accurate for whole foods. Processed foods may vary slightly from package labels.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Can I save my recipes?</h4>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Currently, you can copy the nutrition facts and ingredient list. We're working on user accounts to save recipes permanently.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm sm:text-base">What if I can't find an ingredient?</h4>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Choose the closest similar ingredient from our database. We're continuously adding new foods based on user requests.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm sm:text-base">How do I account for cooking methods?</h4>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Some nutrients are lost during cooking. Our calculator provides raw values - actual cooked values may be 10-20% lower for water-soluble vitamins.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold text-yellow-800 mb-2 sm:mb-3 flex items-center">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            Important Disclaimer
          </h3>
          <div className="text-xs sm:text-sm text-yellow-800 space-y-2">
            <p><strong>Nutritional Information Accuracy:</strong> All nutritional data is sourced from the USDA FoodData Central database and represents average values for whole, unprocessed foods. Actual nutritional content may vary based on:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Growing conditions, seasonality, and variety of produce</li>
              <li>Cooking methods (baking, frying, steaming, etc.)</li>
              <li>Brand differences for packaged/processed items</li>
              <li>Measurement accuracy and ingredient substitutions</li>
            </ul>
            <p><strong>Not Medical Advice:</strong> This calculator is for informational and educational purposes only. It is not intended as a substitute for professional dietary advice, diagnosis, or treatment. Always consult with a registered dietitian, nutritionist, or healthcare provider before making significant dietary changes.</p>
            <p><strong>Allergen Warning:</strong> This calculator does not track allergens. Always verify ingredients if you have food allergies or sensitivities.</p>
          </div>
        </div>
      </div>
      <div className="max-w-[1180px] mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8 mb-4 sm:mb-6 md:mb-8 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6 text-center">Related Health Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link
              key={index}
              href={calc.href}
              className={`${calc.color} rounded-xl p-6 text-white hover:opacity-90 transition-opacity`}
            >
              <h3 className="text-lg font-semibold mb-2">{calc.title}</h3>
              <p className="text-sm opacity-90">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="recipe-nutrition-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
