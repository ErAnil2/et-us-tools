import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import DataTransferTimeClient from './DataTransferTimeClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'data-transfer-time-calculator',
  category: 'calculators',
  fallback: {
    title: 'Data Transfer Time Calculator - Download & Upload Speed Calculator | The Economic Times',
    description: 'Free data transfer time calculator to estimate download and upload times for files, backups, and streaming based on internet speed.',
    keywords: 'data transfer calculator, download time calculator, upload time calculator, internet speed calculator, bandwidth calculator, file transfer time',
  }
});

export default function DataTransferTimePage() {
  return <DataTransferTimeClient />;
}
