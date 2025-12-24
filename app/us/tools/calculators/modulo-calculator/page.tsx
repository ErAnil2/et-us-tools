import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ModuloClient from './ModuloClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'modulo-calculator',
  category: 'calculators',
  fallback: {
    title: 'Modulo Calculator - Modular Arithmetic & Remainder Calculator | The Economic Times',
    description: 'Free modulo calculator for modular arithmetic operations. Calculate mod, remainder, and perform modular arithmetic with step-by-step solutions.',
    keywords: '',
  }
});

export default function ModuloPage() {
  return <ModuloClient />;
}
