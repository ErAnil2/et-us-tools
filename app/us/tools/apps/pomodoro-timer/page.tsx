import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PomodoroTimerClient from './PomodoroTimerClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'pomodoro-timer',
  category: 'apps',
  fallback: {
    title: 'Pomodoro Timer Online - Free Focus & Productivity Timer | The Economic Times',
    description: 'Use our free Pomodoro Timer online! Boost productivity with 25-minute focus sessions and 5-minute breaks. The Pomodoro Technique helps you work smarter and achieve more.',
    keywords: 'pomodoro timer, pomodoro timer online, productivity timer, focus timer, pomodoro technique, time management, work timer, study timer, 25 minute timer',
  }
});

export default function PomodoroTimerPage() {
  return <PomodoroTimerClient />;
}
