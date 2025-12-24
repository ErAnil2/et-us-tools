'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface CountdownClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "How do I create a countdown to my event?",
    answer: "Simply enter your event name, select the target date and time, and the countdown will automatically start. You can also set recurring options if your event repeats daily, weekly, monthly, or yearly.",
    order: 1
  },
  {
    id: '2',
    question: "Can I set a countdown for a specific time?",
    answer: "Yes! You can set both the date and time for your countdown. Use the Target Time field to specify the exact time your event starts. The countdown will include hours, minutes, and seconds.",
    order: 2
  },
  {
    id: '3',
    question: "What happens when the countdown reaches zero?",
    answer: "When your countdown reaches zero, all displays will show 0 and you'll see a message indicating the event has passed. If you set up a recurring event, the countdown will automatically reset to count down to the next occurrence.",
    order: 3
  },
  {
    id: '4',
    question: "How do recurring countdowns work?",
    answer: "Recurring countdowns automatically reset after each occurrence. For example, a weekly recurring countdown will always show the time until the next weekly occurrence. Options include daily, weekly, monthly, and yearly recurrence.",
    order: 4
  },
  {
    id: '5',
    question: "Is the countdown accurate?",
    answer: "Yes, the countdown updates every second and uses your device's local time for calculations. It accounts for the exact difference between now and your target date/time, including all days, hours, minutes, and seconds.",
    order: 5
  },
  {
    id: '6',
    question: "Can I bookmark or share my countdown?",
    answer: "The countdown settings are stored locally in your browser while the page is open. For long-term tracking, keep the browser tab open or make note of your event date. The countdown will restart when you revisit the page.",
    order: 6
  }
];

export default function CountdownClient({ relatedCalculators = defaultRelatedCalculators }: CountdownClientProps) {
  const { getH1, getSubHeading } = usePageSEO('countdown-calculator');

  const [eventName, setEventName] = useState('My Event');
  const [targetDate, setTargetDate] = useState('');
  const [targetTime, setTargetTime] = useState('12:00');
  const [recurring, setRecurring] = useState('none');

  // Countdown state
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [recommendation, setRecommendation] = useState('Set your countdown and we\'ll help you track the time remaining.');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set default date to 30 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    setTargetDate(defaultDate.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (targetDate) {
      startCountdown();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [targetDate, targetTime, recurring]);

  const startCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      let target = new Date(`${targetDate}T${targetTime}`).getTime();

      // Handle recurring events
      if (recurring !== 'none') {
        const targetDateTime = new Date(`${targetDate}T${targetTime}`);
        while (targetDateTime.getTime() < now) {
          switch (recurring) {
            case 'daily':
              targetDateTime.setDate(targetDateTime.getDate() + 1);
              break;
            case 'weekly':
              targetDateTime.setDate(targetDateTime.getDate() + 7);
              break;
            case 'monthly':
              targetDateTime.setMonth(targetDateTime.getMonth() + 1);
              break;
            case 'yearly':
              targetDateTime.setFullYear(targetDateTime.getFullYear() + 1);
              break;
          }
        }
        target = targetDateTime.getTime();
      }

      const difference = target - now;

      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        setDays(d);
        setHours(h);
        setMinutes(m);
        setSeconds(s);

        // Update recommendation
        if (d === 0) {
          setRecommendation('The event is today!');
        } else if (d <= 7) {
          setRecommendation('The event is coming up soon. Make final preparations.');
        } else if (d <= 30) {
          setRecommendation('Start planning and making arrangements.');
        } else {
          setRecommendation('You have plenty of time to plan and prepare.');
        }
      } else {
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        setRecommendation('This event has already passed.');
      }
    };

    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 1000);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-4 py-6 md:py-8">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Countdown Calculator",
          "description": "Create countdowns to important events. Track days, hours, minutes, and seconds until weddings, birthdays, holidays, and more.",
          "url": "https://economictimes.indiatimes.com/us/tools/calculators/countdown-calculator",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        })
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": fallbackFaqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })
      }} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Link href="/us/tools" className="text-blue-600 hover:text-blue-800 text-sm md:text-base">
          Home
        </Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600 text-sm md:text-base">Countdown Calculator</span>
      </div>

      {/* Header */}
      <header className="text-center mb-6 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{getH1('Countdown Calculator')}</h1>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
          Create countdowns to important events. Track days, hours, minutes, and seconds until your special occasions, deadlines, or milestones.
        </p>
      </header>

      {/* Countdown Display */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 md:p-8 mb-6 md:mb-8">
        <div className="text-center mb-3 sm:mb-4 md:mb-6">
          <div className="text-indigo-100 text-sm md:text-base font-medium mb-2">Counting down to</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">{eventName}</h2>
          <div className="text-indigo-200 text-xs md:text-sm">{targetDate} {targetTime}</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-white/20 backdrop-blur-sm p-4 md:p-6 rounded-xl border-2 border-white/30 text-center hover:bg-white/30 transition-all">
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2">{days}</div>
            <div className="text-sm md:text-base font-semibold text-indigo-100">Days</div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          <div className="bg-white/20 backdrop-blur-sm p-4 md:p-6 rounded-xl border-2 border-white/30 text-center hover:bg-white/30 transition-all">
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2">{hours}</div>
            <div className="text-sm md:text-base font-semibold text-indigo-100">Hours</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 md:p-6 rounded-xl border-2 border-white/30 text-center hover:bg-white/30 transition-all">
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2">{minutes}</div>
            <div className="text-sm md:text-base font-semibold text-indigo-100">Minutes</div>
          </div>
<div className="bg-white/20 backdrop-blur-sm p-4 md:p-6 rounded-xl border-2 border-white/30 text-center hover:bg-white/30 transition-all">
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2">{seconds}</div>
            <div className="text-sm md:text-base font-semibold text-indigo-100">Seconds</div>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center text-white text-sm md:text-base border border-white/30">
          {recommendation}
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Countdown Settings</h3>
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Event Name */}
          <div className="md:col-span-2">
            <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
            <input
              type="text"
              id="eventName"
              className="w-full px-3 md:px-2 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
              placeholder="Enter event name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>

          {/* Target Date */}
          <div>
            <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
            <input
              type="date"
              id="targetDate"
              className="w-full px-3 md:px-2 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          {/* Target Time */}
          <div>
            <label htmlFor="targetTime" className="block text-sm font-medium text-gray-700 mb-2">Target Time</label>
            <input
              type="time"
              id="targetTime"
              className="w-full px-3 md:px-2 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={targetTime}
              onChange={(e) => setTargetTime(e.target.value)}
            />
          </div>

          {/* Recurring Options */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-3">Recurring Event</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { value: 'none', label: 'None', color: 'blue' },
                { value: 'daily', label: 'Daily', color: 'green' },
                { value: 'weekly', label: 'Weekly', color: 'purple' },
                { value: 'monthly', label: 'Monthly', color: 'orange' },
                { value: 'yearly', label: 'Yearly', color: 'pink' },
              ].map((option) => (
                <label key={option.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="recurring"
                    value={option.value}
                    checked={recurring === option.value}
                    onChange={(e) => setRecurring(e.target.value)}
                    className="sr-only peer"
                  />
                  <div className={`px-3 py-2.5 bg-${option.color}-100 text-${option.color}-800 rounded-lg hover:bg-${option.color}-200 transition-colors text-center text-sm font-medium border border-${option.color}-200 peer-checked:ring-2 peer-checked:ring-purple-500 peer-checked:bg-purple-100 peer-checked:text-purple-800 peer-checked:border-purple-300`}>
                    {option.label}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {[
          {
            title: 'Event Tracking',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            ),
            bg: 'blue',
            description: 'Track important dates like birthdays, anniversaries, weddings, vacations, and special celebrations with precision.'
          },
          {
            title: 'Recurring Events',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ),
            bg: 'green',
            description: 'Set up daily, weekly, monthly, or yearly recurring countdowns that automatically reset after each occurrence.'
          },
          {
            title: 'Real-Time Updates',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            bg: 'purple',
            description: 'Live countdown that updates every second, showing exact days, hours, minutes, and seconds remaining.'
          },
        ].map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-5 md:p-6">
            <div className="flex items-start gap-3 mb-3">
              <div className={`bg-${card.bg}-100 rounded-lg p-2 text-${card.bg}-600`}>
                {card.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
                <div className="text-sm text-gray-600 leading-relaxed">{card.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs */}

      {/* FAQs Section - Firebase Powered */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="countdown-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="group">
              <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
