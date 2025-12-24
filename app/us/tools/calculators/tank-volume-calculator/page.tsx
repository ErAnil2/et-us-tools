import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import TankVolumeCalculatorClient from './TankVolumeCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'tank-volume-calculator',
  category: 'calculators',
  fallback: {
    title: 'Tank Volume Calculator | The Economic Times',
    description: 'Calculate tank volume for various shapes including cylindrical, rectangular, and spherical tanks. Free online tank volume calculator.',
    keywords: 'tank volume calculator, cylinder volume, tank capacity, liquid volume calculator',
  }
});

export default function TankVolumeCalculatorPage() {
  return <TankVolumeCalculatorClient />;
}
