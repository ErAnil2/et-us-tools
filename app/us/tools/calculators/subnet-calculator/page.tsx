import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SubnetCalculatorClient from './SubnetCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'subnet-calculator',
  category: 'calculators',
  fallback: {
    title: 'Subnet Calculator - IPv4 CIDR & VLSM Network Calculator | The Economic Times',
    description: 'Free subnet calculator for IPv4 networks. Calculate subnets, CIDR notation, host ranges, and VLSM planning with visual breakdown.',
    keywords: 'subnet calculator, IP calculator, CIDR calculator, VLSM calculator, network calculator, IPv4 calculator',
  }
});

export default function SubnetCalculatorPage() {
  return <SubnetCalculatorClient />;
}
