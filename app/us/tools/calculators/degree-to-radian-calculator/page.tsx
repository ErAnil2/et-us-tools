import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import DegreeToRadianCalculatorClient from './DegreeToRadianCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'degree-to-radian-calculator',
  category: 'calculators',
  fallback: {
    title: 'Degree to Radian Calculator | The Economic Times',
    description: 'Convert angles from degrees to radians and vice versa. Free online angle conversion calculator.',
    keywords: 'degree to radian, radian to degree, angle converter, trigonometry calculator',
  }
});

export default function DegreeToRadianCalculatorPage() {
  return <DegreeToRadianCalculatorClient />;
}
