import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ReactionTimeClient from './ReactionTimeClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'reaction-time',
  category: 'games',
  fallback: {
    title: 'Reaction Time Test Online - Free Reflex Speed Game | The Economic Times',
    description: 'Take Reaction Time Test online for free! Measure your reflexes in milliseconds. Improve hand-eye coordination and response speed with this fun brain training game.',
    keywords: 'reaction time test, reaction time, reflex test, speed test, reflexes, hand-eye coordination, reaction speed, reflex game, response time',
  }
});

export default function ReactionTimePage() {
  return <ReactionTimeClient />;
}
