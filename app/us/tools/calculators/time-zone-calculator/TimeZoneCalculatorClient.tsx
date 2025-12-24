'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color: string;
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface TimeZoneOption {
  value: string;
  label: string;
  offset: string;
}

const timeZones: TimeZoneOption[] = [
  { value: 'America/New_York', label: 'New York (EST/EDT)', offset: 'UTC-5/4' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', offset: 'UTC-8/7' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)', offset: 'UTC-6/5' },
  { value: 'America/Denver', label: 'Denver (MST/MDT)', offset: 'UTC-7/6' },
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)', offset: 'UTC+0' },
  { value: 'Europe/London', label: 'London (GMT/BST)', offset: 'UTC+0/1' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)', offset: 'UTC+1/2' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)', offset: 'UTC+1/2' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: 'UTC+9' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: 'UTC+8' },
  { value: 'Asia/Kolkata', label: 'Mumbai (IST)', offset: 'UTC+5:30' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)', offset: 'UTC+10/11' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST/AEDT)', offset: 'UTC+10/11' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)', offset: 'UTC+12/13' },
  { value: 'America/Toronto', label: 'Toronto (EST/EDT)', offset: 'UTC-5/4' },
  { value: 'America/Vancouver', label: 'Vancouver (PST/PDT)', offset: 'UTC-8/7' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)', offset: 'UTC+3' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)', offset: 'UTC+4' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)', offset: 'UTC+8' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)', offset: 'UTC-3' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)', offset: 'UTC+8' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)', offset: 'UTC+1/2' },
  { value: 'Asia/Seoul', label: 'Seoul (KST)', offset: 'UTC+9' },
  { value: 'Pacific/Honolulu', label: 'Honolulu (HST)', offset: 'UTC-10' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is UTC and how is it different from GMT?",
    answer: "UTC (Coordinated Universal Time) is the primary time standard by which the world regulates clocks. While GMT (Greenwich Mean Time) was the original global time standard, UTC is more precise as it's based on atomic clocks. For practical purposes, UTC and GMT are often used interchangeably as they both refer to the time at 0° longitude.",
    order: 1
  },
  {
    id: '2',
    question: "What is the difference between EST and EDT?",
    answer: "EST (Eastern Standard Time) is UTC-5 and is used during fall/winter months. EDT (Eastern Daylight Time) is UTC-4 and is used during spring/summer when Daylight Saving Time is in effect. The same pattern applies to other US time zones (CST/CDT, MST/MDT, PST/PDT).",
    order: 2
  },
  {
    id: '3',
    question: "How do I convert time between two zones?",
    answer: "To convert time between zones: 1) Select your source time zone, 2) Enter the time you want to convert, 3) Select the destination time zone(s). The calculator automatically handles the conversion, including date changes if the time crosses midnight.",
    order: 3
  },
  {
    id: '4',
    question: "Why does Daylight Saving Time complicate time zone conversions?",
    answer: "Daylight Saving Time (DST) shifts clocks by one hour in many regions, but not all countries observe it, and the dates vary. For example, the US and Europe change on different dates, so for a few weeks each year, the time difference between New York and London changes. Our calculator accounts for DST automatically.",
    order: 4
  },
  {
    id: '5',
    question: "What is the International Date Line?",
    answer: "The International Date Line (IDL) runs roughly along 180° longitude in the Pacific Ocean. When you cross it westward, you add a day; eastward, you subtract a day. This is why Japan and Australia are 'ahead' of the US in date despite being to the west on most maps.",
    order: 5
  },
  {
    id: '6',
    question: "How can I find the best time for an international meeting?",
    answer: "Use the Meeting Time Planner feature. Add all participant time zones, select business hours, and the calculator finds overlapping work hours. For best results, try to find times that fall within 9 AM - 5 PM for all participants.",
    order: 6
  }
];

const relatedCalculators = [
  { href: '/us/tools/calculators/time-calculator', title: 'Time Calculator', description: 'Add/subtract times' },
  { href: '/us/tools/calculators/time-until-calculator', title: 'Time Until', description: 'Countdown to events' },
  { href: '/us/tools/calculators/date-calculator', title: 'Date Calculator', description: 'Calculate date differences' },
  { href: '/us/tools/calculators/hours-calculator', title: 'Hours Calculator', description: 'Calculate work hours' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate exact age' },
  { href: '/us/tools/calculators/days-between-dates-calculator', title: 'Days Between Dates', description: 'Count days between dates' },
];

export default function TimeZoneCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('time-zone-calculator');

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTimeZone, setCurrentTimeZone] = useState<string>('');
  const [fromTimeZone, setFromTimeZone] = useState<string>('America/New_York');
  const [fromTime, setFromTime] = useState<string>('12:00');
  const [fromDate, setFromDate] = useState<string>('');
  const [conversions, setConversions] = useState<{zone: string; time: string}[]>([{ zone: 'Europe/London', time: '' }]);
  const [meetingHours, setMeetingHours] = useState<string>('9-17');
  const [meetingResults, setMeetingResults] = useState<string[]>([]);
  const [showMeetingResults, setShowMeetingResults] = useState(false);
  const [popularTimes, setPopularTimes] = useState({
    est: '--:--',
    gmt: '--:--',
    jst: '--:--',
    aest: '--:--',
    pst: '--:--',
    ist: '--:--'
  });

  // Update current time
  const updateCurrentTime = () => {
    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };

    setCurrentTime(now.toLocaleTimeString('en-US', timeOptions));
    setCurrentDate(now.toLocaleDateString('en-US', dateOptions));
    setCurrentTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);

    if (!fromDate) {
      setFromDate(now.toISOString().split('T')[0]);
    }
  };

  // Update popular times
  const updatePopularTimes = () => {
    const now = new Date();
    const popularTZ: Record<string, string> = {
      est: 'America/New_York',
      gmt: 'UTC',
      jst: 'Asia/Tokyo',
      aest: 'Australia/Sydney',
      pst: 'America/Los_Angeles',
      ist: 'Asia/Kolkata'
    };

    const times: Record<string, string> = {};
    Object.entries(popularTZ).forEach(([key, timeZone]) => {
      try {
        times[key] = now.toLocaleTimeString('en-US', {
          timeZone,
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch {
        times[key] = '--:--';
      }
    });
    setPopularTimes(times as typeof popularTimes);
  };

  // Convert time
  const convertTime = () => {
    if (!fromTime) return;

    const dateStr = fromDate || new Date().toISOString().split('T')[0];
    const fromDateTime = new Date(`${dateStr}T${fromTime}`);

    const newConversions = conversions.map(conv => {
      if (!conv.zone) return conv;

      try {
        const timeString = fromDateTime.toLocaleTimeString('en-US', {
          timeZone: conv.zone,
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        });
        const dateString = fromDateTime.toLocaleDateString('en-US', {
          timeZone: conv.zone,
          month: 'short',
          day: 'numeric'
        });

        const originalDate = new Date(fromDateTime);
        const convertedDateStr = fromDateTime.toLocaleDateString('en-US', { timeZone: conv.zone });
        const originalDateStr = originalDate.toDateString();

        if (convertedDateStr !== originalDateStr) {
          return { ...conv, time: `${timeString} (${dateString})` };
        }
        return { ...conv, time: timeString };
      } catch {
        return { ...conv, time: 'Error' };
      }
    });

    setConversions(newConversions);
  };

  // Add time zone
  const addTimeZone = () => {
    setConversions([...conversions, { zone: '', time: '' }]);
  };

  // Remove time zone
  const removeTimeZone = (index: number) => {
    if (conversions.length > 1) {
      setConversions(conversions.filter((_, i) => i !== index));
    }
  };

  // Update conversion zone
  const updateConversionZone = (index: number, zone: string) => {
    const newConversions = [...conversions];
    newConversions[index] = { ...newConversions[index], zone };
    setConversions(newConversions);
  };

  // Find meeting times
  const findMeetingTimes = () => {
    const businessHours = meetingHours.split('-');
    const startHour = parseInt(businessHours[0]);
    const endHour = parseInt(businessHours[1]);

    const timeZonesInUse = [fromTimeZone, ...conversions.filter(c => c.zone).map(c => c.zone)];

    if (timeZonesInUse.length < 2) {
      setMeetingResults(['Please select at least two time zones for meeting planning']);
      setShowMeetingResults(true);
      return;
    }

    const goodTimes: string[] = [];

    for (let hour = 0; hour < 24; hour++) {
      const testTime = new Date();
      testTime.setHours(hour, 0, 0, 0);

      let allInBusinessHours = true;
      const timeDetails: string[] = [];

      timeZonesInUse.forEach(tz => {
        try {
          const localHour = parseInt(testTime.toLocaleTimeString('en-US', {
            timeZone: tz,
            hour12: false,
            hour: '2-digit'
          }));

          if (localHour < startHour || localHour >= endHour) {
            allInBusinessHours = false;
          }

          const localTime = testTime.toLocaleTimeString('en-US', {
            timeZone: tz,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
          });

          const tzLabel = timeZones.find(t => t.value === tz)?.label || tz;
          timeDetails.push(`${localTime} ${tzLabel.split(' ')[0]}`);
        } catch {
          allInBusinessHours = false;
        }
      });

      if (allInBusinessHours) {
        goodTimes.push(timeDetails.join(' | '));
      }
    }

    if (goodTimes.length > 0) {
      setMeetingResults(goodTimes.slice(0, 5));
    } else {
      setMeetingResults(['No overlapping business hours found for selected time zones.']);
    }
    setShowMeetingResults(true);
  };

  // Effects
  useEffect(() => {
    updateCurrentTime();
    updatePopularTimes();
    const interval = setInterval(() => {
      updateCurrentTime();
      updatePopularTimes();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    convertTime();
  }, [fromTime, fromDate, fromTimeZone, conversions.map(c => c.zone).join(',')]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Time Zone Calculator",
          "description": "Free online time zone converter. Convert time between different time zones, schedule international meetings, and coordinate across global locations.",
          "url": "https://www.example.com/us/tools/calculators/time-zone-calculator",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Convert time between zones",
            "Meeting time planner",
            "Live world clocks",
            "DST support"
          ]
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.example.com" },
            { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://www.example.com/us/tools" },
            { "@type": "ListItem", "position": 3, "name": "Calculators", "item": "https://www.example.com/us/tools/calculators" },
            { "@type": "ListItem", "position": 4, "name": "Time Zone Calculator", "item": "https://www.example.com/us/tools/calculators/time-zone-calculator" }
          ]
        })
      }} />

      <div className="max-w-[1180px] mx-auto px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Time Zone Calculator')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Convert time between different time zones, schedule international meetings, and coordinate across global locations.</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Current Time Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 text-center">
          <div className="text-sm opacity-80 mb-1">Your Current Time</div>
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono mb-2">{currentTime}</div>
          <div className="text-lg opacity-90">{currentDate}</div>
          <div className="text-sm opacity-75 mt-1">{currentTimeZone}</div>
        </div>

        {/* Main Calculator Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
            {/* Converter Section */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Time Zone Converter</h2>

              {/* From Section */}
              <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                <label className="block text-sm font-medium text-blue-800 mb-3">From</label>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-blue-600 mb-1">Date</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-blue-600 mb-1">Time</label>
                    <input
                      type="time"
                      value={fromTime}
                      onChange={(e) => setFromTime(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-blue-600 mb-1">Time Zone</label>
                    <select
                      value={fromTimeZone}
                      onChange={(e) => setFromTimeZone(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {timeZones.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* To Section */}
              <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-green-800">To</label>
                  <button
                    onClick={addTimeZone}
                    className="text-sm px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    + Add Time Zone
                  </button>
                </div>

                {conversions.map((conv, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <select
                      value={conv.zone}
                      onChange={(e) => updateConversionZone(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Time Zone</option>
                      {timeZones.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                    <div className="w-32 px-3 py-2 bg-white border border-green-200 rounded-lg text-center font-mono font-bold text-green-800">
                      {conv.time || '--:--'}
                    </div>
                    {conversions.length > 1 && (
                      <button
                        onClick={() => removeTimeZone(index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Meeting Planner */}
              <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
                <h3 className="text-sm font-medium text-purple-800 mb-3">Meeting Time Planner</h3>
                <div className="flex gap-4 items-center">
                  <select
                    value={meetingHours}
                    onChange={(e) => setMeetingHours(e.target.value)}
                    className="flex-1 px-3 py-2 border border-purple-200 rounded-lg"
                  >
                    <option value="9-17">Business Hours (9AM - 5PM)</option>
                    <option value="8-18">Extended (8AM - 6PM)</option>
                    <option value="6-22">Flexible (6AM - 10PM)</option>
                  </select>
                  <button
                    onClick={findMeetingTimes}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                  >
                    Find Times
                  </button>
                </div>
                {showMeetingResults && (
                  <div className="mt-4 space-y-2">
                    {meetingResults.map((result, i) => (
                      <div key={i} className="px-4 py-2 bg-white rounded-lg text-sm text-purple-800 border border-purple-200">
                        {result}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* World Clocks Panel */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">World Clocks</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-200">
                  <span className="text-sm text-gray-600">New York (EST)</span>
                  <span className="font-mono font-bold text-gray-800">{popularTimes.est}</span>
                </div>
                <div className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-200">
                  <span className="text-sm text-gray-600">Los Angeles (PST)</span>
                  <span className="font-mono font-bold text-gray-800">{popularTimes.pst}</span>
                </div>
                <div className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-200">
                  <span className="text-sm text-gray-600">London (GMT)</span>
                  <span className="font-mono font-bold text-gray-800">{popularTimes.gmt}</span>
                </div>
                <div className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-200">
                  <span className="text-sm text-gray-600">Tokyo (JST)</span>
                  <span className="font-mono font-bold text-gray-800">{popularTimes.jst}</span>
                </div>
                <div className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-200">
                  <span className="text-sm text-gray-600">Sydney (AEST)</span>
                  <span className="font-mono font-bold text-gray-800">{popularTimes.aest}</span>
                </div>
                <div className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-200">
                  <span className="text-sm text-gray-600">Mumbai (IST)</span>
                  <span className="font-mono font-bold text-gray-800">{popularTimes.ist}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MREC Banners */}
        <CalculatorAfterCalcBanners />

        {/* FAQs Section */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
          <FirebaseFAQs pageId="time-zone-calculator" fallbackFaqs={fallbackFaqs} />
        </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {relatedCalculators.map((calc) => (
              <Link key={calc.href} href={calc.href} className="group">
                <div className="rounded-lg p-4 bg-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600">{calc.title}</h3>
                  <p className="text-xs text-gray-600">{calc.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
