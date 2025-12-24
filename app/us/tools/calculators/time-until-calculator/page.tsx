import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import TimeUntilCalculatorClient from './TimeUntilCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'time-until-calculator',
  category: 'calculators',
  fallback: {
    title: 'Time Until Calculator - Countdown to Any Date | Free Online Tool',
    description: 'Calculate exact time remaining until any future date. Countdown in years, months, days, hours, minutes, and seconds. Perfect for holidays, birthdays, and events.',
    keywords: 'time until calculator, countdown calculator, days until, event countdown, date countdown, holiday countdown, birthday countdown',
  }
});

export default function TimeUntilCalculatorPage() {
  return <TimeUntilCalculatorClient />;
}
