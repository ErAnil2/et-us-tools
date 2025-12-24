import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import TypingSpeedClient from './TypingSpeedClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'typing-speed',
  category: 'games',
  fallback: {
    title: 'Typing Speed Test Online - Free WPM Test & Typing Practice | The Economic Times',
    description: 'Take a Typing Speed Test online for free! Measure your WPM (words per minute) and accuracy. Improve your keyboard skills with practice texts and track your progress.',
    keywords: 'typing speed test, typing test, WPM test, words per minute, typing speed, typing practice, keyboard skills, typing accuracy, free typing test',
  }
});

export default function TypingSpeedPage() {
  return <TypingSpeedClient />;
}
