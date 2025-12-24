import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import TextReadabilityAnalyzerClient from './TextReadabilityAnalyzerClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'text-readability-analyzer',
  category: 'calculators',
  fallback: {
    title: 'Text Readability Analyzer - Flesch Score & Grade Level Calculator | The Economic Times',
    description: 'Analyze text readability with Flesch-Kincaid scores, grade levels, and reading ease. Perfect for writers, educators, and content creators.',
    keywords: 'readability analyzer, flesch kincaid, reading level, grade level, text analysis, readability score, writing tool',
  }
});

export default function TextReadabilityAnalyzerPage() {
  return <TextReadabilityAnalyzerClient />;
}
