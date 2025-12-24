import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import BodySurfaceAreaClient from './BodySurfaceAreaClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'body-surface-area-calculator',
  category: 'calculators',
  fallback: {
    title: 'Body Surface Area Calculator - BSA Medical Calculator | The Economic Times',
    description: 'Calculate body surface area (BSA) using height and weight. Medical calculator using Du Bois, Mosteller, Haycock, and Gehan-George formulas.',
    keywords: 'body surface area calculator, BSA calculator, medical calculator, drug dosage calculator, chemotherapy dosing',
  }
});

export default function BodySurfaceAreaPage() {
  return <BodySurfaceAreaClient />;
}
