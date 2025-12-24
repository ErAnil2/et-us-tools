import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MinecraftCircleCalculatorClient from './MinecraftCircleCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'minecraft-circle-calculator',
  category: 'calculators',
  fallback: {
    title: 'Minecraft Circle Generator - Perfect Pixel Circles & Spheres | Calculators101',
    description: 'Generate perfect circles and spheres for Minecraft builds. Get block-by-block placement guides for any diameter. Essential tool for Minecraft builders.',
    keywords: '',
  }
});

export default function MinecraftCircleCalculatorPage() {
  return <MinecraftCircleCalculatorClient />;
}
