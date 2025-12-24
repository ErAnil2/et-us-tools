import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import TimerClient from './TimerClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'timer',
  category: 'apps',
  fallback: {
    title: 'Online Timer - Free Countdown Timer with Alarm | The Economic Times',
    description: 'Set a timer online for free! Countdown timer with customizable alarms and sound alerts. Perfect for cooking, workouts, studying, and time management.',
    keywords: 'online timer, timer, countdown timer, set timer, alarm timer, cooking timer, workout timer, study timer, free timer',
  }
});

export default function TimerPage() {
  return <TimerClient />;
}
