import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SteelPlateWeightCalculatorClient from './SteelPlateWeightCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'steel-plate-weight-calculator',
  category: 'calculators',
  fallback: {
    title: 'Steel Plate Weight Calculator - Calculate Metal Weight & Cost | The Economic Times',
    description: 'Free steel plate weight calculator to determine weight of steel plates, sheets, and bars. Calculate metal weight by dimensions and steel grade.',
    keywords: 'steel plate weight calculator, metal weight calculator, steel weight calculator, plate weight calculator, steel density calculator',
  }
});

export default function SteelPlateWeightCalculatorPage() {
  return <SteelPlateWeightCalculatorClient />;
}
