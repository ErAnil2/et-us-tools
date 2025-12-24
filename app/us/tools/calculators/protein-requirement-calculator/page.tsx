import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ProteinRequirementClient from './ProteinRequirementClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'protein-requirement-calculator',
  category: 'calculators',
  fallback: {
    title: 'Protein Requirement Calculator - Daily Protein Intake | Free Tool',
    description: 'Free protein calculator to find your optimal daily protein intake. Calculate protein needs based on weight, activity level, and goals - weight loss, muscle building, or maintenance. Research-backed recommendations.',
    keywords: 'protein calculator, daily protein requirement, protein intake calculator, how much protein do I need, protein per day, muscle building protein, weight loss protein, high protein diet',
  }
});

export default function ProteinRequirementPage() {
  return <ProteinRequirementClient />;
}
