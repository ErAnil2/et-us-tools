import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MeetingPlannerClient from './MeetingPlannerClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'meeting-planner',
  category: 'calculators',
  fallback: {
    title: 'Meeting Planner - Find Suitable Meeting Times Across Time Zones | The Economic Times',
    description: 'Plan meetings across different time zones easily. Find suitable meeting times for participants in multiple locations.',
    keywords: '',
  }
});

export default function MeetingPlannerPage() {
  return <MeetingPlannerClient />;
}
