import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import DownloadTimeClient from './DownloadTimeClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'download-time-calculator',
  category: 'calculators',
  fallback: {
    title: 'Download Time Calculator - Calculate File Download Time | The Economic Times',
    description: 'Free download time calculator to estimate how long it takes to download files. Calculate download time based on file size and internet speed.',
    keywords: 'download time calculator, file download calculator, internet speed calculator, bandwidth calculator, download speed calculator',
  }
});

export default function DownloadTimePage() {
  return <DownloadTimeClient />;
}
