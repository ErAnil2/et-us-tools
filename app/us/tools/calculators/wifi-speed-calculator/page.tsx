import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import WifiSpeedCalculatorClient from './WifiSpeedCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'wifi-speed-calculator',
  category: 'calculators',
  fallback: {
    title: 'WiFi Speed Calculator - Internet Speed Requirements and Analysis',
    description: 'Calculate WiFi speed requirements for streaming, gaming, work, and multiple devices. Analyze internet bandwidth needs and optimize network performance.',
    keywords: 'wifi speed calculator, internet speed requirements, bandwidth calculator, network speed test, wifi analyzer',
  }
});

export default function WifiSpeedCalculatorPage() {
  return <WifiSpeedCalculatorClient />;
}
