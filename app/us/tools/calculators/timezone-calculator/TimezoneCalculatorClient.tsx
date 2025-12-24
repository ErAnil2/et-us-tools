'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface TimeZoneOption {
  zone: string;
  label: string;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "How do I convert time between different time zones?",
    answer: "Enter the date and time in your source time zone, select your current time zone, then add one or more target time zones. The calculator will instantly show you the corresponding time in each selected zone, accounting for any offset differences.",
    order: 1
  },
  {
    id: '2',
    question: "What is UTC and how does it relate to time zones?",
    answer: "UTC (Coordinated Universal Time) is the global reference point for all time zones. It replaced GMT (Greenwich Mean Time) as the world standard. All time zones are expressed as offsets from UTC, such as UTC-5 for Eastern Standard Time or UTC+9 for Japan Standard Time.",
    order: 2
  },
  {
    id: '3',
    question: "Does the calculator account for Daylight Saving Time (DST)?",
    answer: "Yes, our calculator automatically detects and accounts for Daylight Saving Time. It shows whether DST is currently active in each time zone and adjusts the conversion accordingly. DST typically adds one hour to the standard offset.",
    order: 3
  },
  {
    id: '4',
    question: "What's the difference between EST and EDT?",
    answer: "EST (Eastern Standard Time) is UTC-5 and is used during winter months. EDT (Eastern Daylight Time) is UTC-4 and is used during summer months when clocks 'spring forward' one hour. The same pattern applies to other US time zones (PST/PDT, MST/MDT, CST/CDT).",
    order: 4
  },
  {
    id: '5',
    question: "How many time zones are there in the world?",
    answer: "There are 38 distinct time zones worldwide, ranging from UTC-12 to UTC+14. Some countries span multiple zones (like the US with 6), while others use half-hour or quarter-hour offsets (like India at UTC+5:30 or Nepal at UTC+5:45).",
    order: 5
  },
  {
    id: '6',
    question: "Why do some countries have unusual time zone offsets?",
    answer: "Some countries choose non-standard offsets for practical or political reasons. India uses UTC+5:30 to have a single time zone for the entire country. Nepal uses UTC+5:45 to distinguish itself from India. China uses a single time zone (UTC+8) despite spanning five geographical zones.",
    order: 6
  }
];

const popularTimeZones: TimeZoneOption[] = [
  { zone: 'America/New_York', label: 'New York (EST/EDT)' },
  { zone: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { zone: 'Europe/London', label: 'London (GMT/BST)' },
  { zone: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { zone: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { zone: 'Asia/Dubai', label: 'Dubai (GST)' },
  { zone: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { zone: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  { zone: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)' }
];

export default function TimezoneCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('timezone-calculator');

  const [sourceTime, setSourceTime] = useState<string>('');
  const [sourceZone, setSourceZone] = useState<string>('');
  const [targetZones, setTargetZones] = useState<string[]>(['America/New_York']);
  const [convertedTimes, setConvertedTimes] = useState<{zone: string; time: string; offset: string; isDST: boolean}[]>([]);
  const [allTimeZones, setAllTimeZones] = useState<string[]>([]);
  const [sourceInfo, setSourceInfo] = useState({ offset: '', isDST: false });

  // Initialize
  useEffect(() => {
    try {
      const zones = Intl.supportedValuesOf('timeZone');
      setAllTimeZones(zones);

      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setSourceZone(userTimeZone);

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setSourceTime(`${year}-${month}-${day}T${hours}:${minutes}`);
    } catch {
      setAllTimeZones(['America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney']);
    }
  }, []);

  const getTimeZoneInfo = (date: Date, timeZone: string) => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        timeZoneName: 'longOffset'
      });
      const parts = formatter.formatToParts(date);
      const offsetPart = parts.find(p => p.type === 'timeZoneName');
      const offset = offsetPart ? offsetPart.value : '';

      // Check DST by comparing offsets at different times of year
      const jan = new Date(date.getFullYear(), 0, 1);
      const jul = new Date(date.getFullYear(), 6, 1);
      const janOffset = new Date(jan.toLocaleString('en-US', { timeZone })).getTime();
      const julOffset = new Date(jul.toLocaleString('en-US', { timeZone })).getTime();
      const currentOffset = new Date(date.toLocaleString('en-US', { timeZone })).getTime();

      const isDST = Math.max(janOffset, julOffset) !== currentOffset ?
        currentOffset === Math.max(janOffset, julOffset) : false;

      return { offset, isDST };
    } catch {
      return { offset: '', isDST: false };
    }
  };

  const convertTime = () => {
    if (!sourceTime || !sourceZone) return;

    try {
      const sourceDate = new Date(sourceTime);

      // Get source timezone info
      const info = getTimeZoneInfo(sourceDate, sourceZone);
      setSourceInfo(info);

      // Convert to each target timezone
      const converted = targetZones.map(zone => {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: zone,
          weekday: 'short',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });

        const targetInfo = getTimeZoneInfo(sourceDate, zone);
        const formattedTime = formatter.format(sourceDate);

        return {
          zone,
          time: formattedTime,
          offset: targetInfo.offset,
          isDST: targetInfo.isDST
        };
      });

      setConvertedTimes(converted);
    } catch (error) {
      console.error('Error converting time:', error);
    }
  };

  useEffect(() => {
    convertTime();
  }, [sourceTime, sourceZone, targetZones]);

  const addTimeZone = (zone?: string) => {
    const newZone = zone || 'Europe/London';
    if (!targetZones.includes(newZone)) {
      setTargetZones([...targetZones, newZone]);
    }
  };

  const removeTimeZone = () => {
    if (targetZones.length > 1) {
      setTargetZones(targetZones.slice(0, -1));
    }
  };

  const updateTargetZone = (index: number, zone: string) => {
    const newZones = [...targetZones];
    newZones[index] = zone;
    setTargetZones(newZones);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Time Zone Calculator",
            "description": "Convert time between different time zones easily. Get accurate time conversions with daylight saving time support for international meetings and global coordination.",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
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
        }}
      />
      {/* Header */}
      <header className="text-center mb-6 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{getH1('Time Zone Calculator')}</h1>
        <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
          Convert time between different time zones easily. Get accurate time conversions with daylight saving time support for international meetings and global coordination.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Calculator Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="space-y-4 md:space-y-6">
              {/* Source Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">From</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Date & Time</label>
                    <input
                      type="datetime-local"
                      id="sourceTime"
                      className="w-full px-3 md:px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      value={sourceTime}
                      onChange={(e) => setSourceTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Time Zone</label>
                    <select
                      id="sourceZone"
                      className="w-full px-3 md:px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      value={sourceZone}
                      onChange={(e) => setSourceZone(e.target.value)}
                    >
                      {allTimeZones.map(zone => (
                        <option key={zone} value={zone}>{zone.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Source timezone info */}
                <div className="mt-3 p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div className="text-xs text-purple-700">
                    <span>{sourceInfo.offset}</span>
                    <span>{sourceInfo.isDST ? ' • DST Active' : ' • Standard Time'}</span>
                  </div>
                </div>
              </div>

              {/* Target Time Zones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">To</label>
                <div className="space-y-3">
                  {targetZones.map((zone, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div>
                        <label className="block text-xs font-medium text-blue-700 mb-2">Converted Time</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-white text-blue-900 font-medium"
                          readOnly
                          value={convertedTimes[index]?.time || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-blue-700 mb-2">Time Zone</label>
                        <select
                          className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          value={zone}
                          onChange={(e) => updateTargetZone(index, e.target.value)}
                        >
                          {allTimeZones.map(z => (
                            <option key={z} value={z}>{z.replace(/_/g, ' ')}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add/Remove Zone Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => addTimeZone()}
                  className="flex-1 px-2 py-2.5 bg-green-100 text-green-800 font-medium rounded-lg hover:bg-green-200 transition-colors border border-green-200"
                >
                  + Add Time Zone
                </button>
                <button
                  onClick={removeTimeZone}
                  className="flex-1 px-2 py-2.5 bg-red-100 text-red-800 font-medium rounded-lg hover:bg-red-200 transition-colors border border-red-200"
                >
                  - Remove Time Zone
                </button>
              </div>

              {/* Popular Time Zones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Quick Add Popular Time Zones</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {popularTimeZones.map(({ zone, label }) => (
                    <button
                      key={zone}
                      onClick={() => addTimeZone(zone)}
                      className="px-3 py-2 text-sm bg-purple-100 text-purple-800 border border-purple-200 rounded-lg hover:bg-purple-200 transition-colors text-left font-medium"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Information Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-300">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">UTC/GMT Standard</h3>
                  <p className="text-sm text-blue-700 leading-relaxed">UTC (Coordinated Universal Time) is the global reference point for all time zones. All time zones are calculated as offsets from UTC.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center border border-green-300">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Daylight Saving Time</h3>
                  <p className="text-sm text-green-700 leading-relaxed">Many regions observe DST, shifting clocks forward in spring and back in fall. Our calculator automatically accounts for these changes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Reference</h3>

            {/* Current Source Info */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 mb-4 border border-purple-200">
              <h4 className="text-sm font-medium text-purple-800 mb-2">Your Time Zone</h4>
              <p className="text-lg font-bold text-purple-900">{sourceZone.replace(/_/g, ' ')}</p>
              <p className="text-sm text-purple-600 mt-1">{sourceInfo.offset}</p>
              {sourceInfo.isDST && (
                <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                  DST Active
                </span>
              )}
            </div>

            {/* Conversion Results Summary */}
            {convertedTimes.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Converted Times</h4>
                {convertedTimes.map((ct, index) => (
                  <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium">{ct.zone.replace(/_/g, ' ')}</p>
                    <p className="text-lg font-bold text-blue-900">{ct.time}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs text-blue-600">{ct.offset}</span>
                      {ct.isDST && (
                        <span className="text-xs text-yellow-700 bg-yellow-100 px-1 rounded">DST</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Time Zone Facts */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Did You Know?</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                There are 38 time zones worldwide, ranging from UTC-12 to UTC+14. Some countries like India use half-hour offsets (UTC+5:30).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="timezone-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
{/* Related Calculators */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link
              key={index}
              href={calc.href}
              className={`${calc.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity`}
            >
              <h3 className="font-semibold">{calc.title}</h3>
              <p className="text-sm opacity-90">{calc.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
