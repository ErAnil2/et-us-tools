'use client';

import { useState, useEffect, useCallback } from 'react';
import { MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import Link from 'next/link';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface CityTime {
  id: string;
  city: string;
  country: string;
  timezone: string;
  time: string;
  date: string;
  offset: string;
  isDaylight: boolean;
  flag: string;
}

const availableCities = [
  { city: 'New York', country: 'USA', timezone: 'America/New_York', flag: '🇺🇸' },
  { city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles', flag: '🇺🇸' },
  { city: 'Chicago', country: 'USA', timezone: 'America/Chicago', flag: '🇺🇸' },
  { city: 'London', country: 'UK', timezone: 'Europe/London', flag: '🇬🇧' },
  { city: 'Paris', country: 'France', timezone: 'Europe/Paris', flag: '🇫🇷' },
  { city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', flag: '🇩🇪' },
  { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
  { city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', flag: '🇦🇺' },
  { city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', flag: '🇦🇪' },
  { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬' },
  { city: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong', flag: '🇭🇰' },
  { city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', flag: '🇮🇳' },
  { city: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai', flag: '🇨🇳' },
  { city: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow', flag: '🇷🇺' },
  { city: 'Toronto', country: 'Canada', timezone: 'America/Toronto', flag: '🇨🇦' },
  { city: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver', flag: '🇨🇦' },
  { city: 'Sao Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', flag: '🇧🇷' },
  { city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', flag: '🇰🇷' },
  { city: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam', flag: '🇳🇱' },
  { city: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', flag: '🇳🇿' },
  { city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', flag: '🇹🇭' },
  { city: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta', flag: '🇮🇩' },
  { city: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', flag: '🇪🇬' },
  { city: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg', flag: '🇿🇦' },
];

const defaultCities = [
  { city: 'New York', country: 'USA', timezone: 'America/New_York', flag: '🇺🇸' },
  { city: 'London', country: 'UK', timezone: 'Europe/London', flag: '🇬🇧' },
  { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
  { city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', flag: '🇦🇺' },
];

const faqs = [
  {
    question: "How do I add a city to my world clock?",
    answer: "Click the 'Add City' button and select a city from the dropdown menu. You can add multiple cities to compare times across different locations simultaneously."
  },
  {
    question: "What does the sun/moon icon mean?",
    answer: "The sun icon (☀️) indicates daytime (6 AM - 6 PM) in that location, while the moon icon (🌙) indicates nighttime. This helps you quickly see if it's a good time to call or schedule meetings."
  },
  {
    question: "How accurate is the world clock?",
    answer: "The world clock uses your device's system time and applies the correct timezone offset for each city. It updates every second and automatically adjusts for Daylight Saving Time changes."
  },
  {
    question: "Why do some cities show a different date?",
    answer: "Due to timezone differences, some cities may be ahead or behind your local time by up to 24 hours. For example, when it's Monday evening in New York, it may already be Tuesday morning in Sydney."
  },
  {
    question: "Can I remove cities from my world clock?",
    answer: "Yes! Click the 'X' button on any city card to remove it from your display. You can always add it back later using the 'Add City' button."
  },
  {
    question: "What is the UTC offset shown?",
    answer: "UTC (Coordinated Universal Time) offset shows how many hours ahead (+) or behind (-) a city is from the universal time standard. For example, UTC-5 means the city is 5 hours behind UTC."
  }
];

const relatedTools = [
  { href: '/us/tools/apps/timer', title: 'Timer', description: 'Countdown timer' },
  { href: '/us/tools/apps/stopwatch', title: 'Stopwatch', description: 'Track elapsed time' },
  { href: '/us/tools/apps/pomodoro-timer', title: 'Pomodoro Timer', description: 'Focus productivity' },
  { href: '/us/tools/calculators/time-zone-calculator', title: 'Time Zone Calculator', description: 'Convert time zones' },
  { href: '/us/tools/calculators/time-calculator', title: 'Time Calculator', description: 'Add/subtract times' },
  { href: '/us/tools/calculators/time-until-calculator', title: 'Time Until', description: 'Countdown to events' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a World Clock Calculator?",
    answer: "A World Clock Calculator is a free online tool designed to help you quickly and accurately calculate world clock-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this World Clock Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this World Clock Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this World Clock Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function WorldClockClient() {
  const { getH1, getSubHeading, faqSchema } = usePageSEO('world-clock');

  const [selectedCities, setSelectedCities] = useState<typeof availableCities>([]);
  const [cityTimes, setCityTimes] = useState<CityTime[]>([]);
  const [localTime, setLocalTime] = useState<string>('');
  const [localDate, setLocalDate] = useState<string>('');
  const [localTimezone, setLocalTimezone] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [use24Hour, setUse24Hour] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getTimeForCity = useCallback((timezone: string) => {
    const now = new Date();
    try {
      const timeOptions: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: !use24Hour,
      };

      const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      };

      const time = now.toLocaleTimeString('en-US', timeOptions);
      const date = now.toLocaleDateString('en-US', dateOptions);

      // Get UTC offset
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'shortOffset',
      });
      const parts = formatter.formatToParts(now);
      const offsetPart = parts.find(p => p.type === 'timeZoneName');
      const offset = offsetPart?.value || 'UTC';

      // Determine if it's daytime (6 AM - 6 PM)
      const hour = parseInt(now.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        hour12: false,
      }));
      const isDaylight = hour >= 6 && hour < 18;

      return { time, date, offset, isDaylight };
    } catch {
      return { time: '--:--:--', date: 'Unknown', offset: 'UTC', isDaylight: true };
    }
  }, [use24Hour]);

  const updateAllTimes = useCallback(() => {
    // Update local time
    const now = new Date();
    const localTimeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: !use24Hour,
    };
    setLocalTime(now.toLocaleTimeString('en-US', localTimeOptions));
    setLocalDate(now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
    setLocalTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);

    // Update city times
    const updatedCityTimes: CityTime[] = selectedCities.map(city => {
      const { time, date, offset, isDaylight } = getTimeForCity(city.timezone);
      return {
        id: city.timezone,
        city: city.city,
        country: city.country,
        timezone: city.timezone,
        time,
        date,
        offset,
        isDaylight,
        flag: city.flag,
      };
    });
    setCityTimes(updatedCityTimes);
  }, [selectedCities, use24Hour, getTimeForCity]);

  useEffect(() => {
    // Initialize with default cities
    setSelectedCities(defaultCities);
  }, []);

  useEffect(() => {
    updateAllTimes();
    const interval = setInterval(updateAllTimes, 1000);
    return () => clearInterval(interval);
  }, [updateAllTimes]);

  const addCity = (city: typeof availableCities[0]) => {
    if (!selectedCities.find(c => c.timezone === city.timezone)) {
      setSelectedCities([...selectedCities, city]);
    }
    setShowAddModal(false);
    setSearchTerm('');
  };

  const removeCity = (timezone: string) => {
    setSelectedCities(selectedCities.filter(c => c.timezone !== timezone));
  };

  const filteredCities = availableCities.filter(city =>
    !selectedCities.find(c => c.timezone === city.timezone) &&
    (city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
     city.country.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "World Clock",
          "description": "Free online world clock showing current time in major cities worldwide. Track multiple time zones, compare times across locations, and plan international meetings.",
          "url": "https://economictimes.indiatimes.com/us/tools/apps/world-clock",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Multiple time zones",
            "Real-time updates",
            "Day/night indicator",
            "Customizable city list"
          ]
        })
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })
      }} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{getH1('World Clock')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track current time across multiple cities worldwide. Perfect for scheduling international meetings and coordinating across time zones.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Local Time Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 mb-8 text-center shadow-lg">
          <div className="text-sm opacity-80 mb-2">Your Local Time</div>
          <div className="text-5xl md:text-6xl font-mono font-bold mb-3">
            {localTime}
          </div>
          <div className="text-lg opacity-90 mb-1">{localDate}</div>
          <div className="text-sm opacity-75">{localTimezone}</div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add City
          </button>

          <label className="inline-flex items-center gap-3 cursor-pointer bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <span className="text-gray-700 font-medium">24-hour format</span>
            <input
              type="checkbox"
              checked={use24Hour}
              onChange={(e) => setUse24Hour(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-400"
            />
          </label>
        </div>

        {/* City Clocks Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cityTimes.map((city) => (
            <div
              key={city.id}
              className={`relative rounded-xl p-6 shadow-md border transition-all hover:shadow-lg ${
                city.isDaylight
                  ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
                  : 'bg-gradient-to-br from-indigo-900 to-purple-900 border-indigo-700 text-white'
              }`}
            >
              {/* Remove button */}
              <button
                onClick={() => removeCity(city.timezone)}
                className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  city.isDaylight
                    ? 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    : 'text-gray-400 hover:text-red-400 hover:bg-red-900/30'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Day/Night indicator */}
              <div className="absolute top-2 left-2 text-xl">
                {city.isDaylight ? '☀️' : '🌙'}
              </div>

              {/* City info */}
              <div className="text-center mt-4">
                <div className="text-3xl mb-2">{city.flag}</div>
                <h3 className={`text-lg font-bold mb-1 ${city.isDaylight ? 'text-gray-800' : 'text-white'}`}>
                  {city.city}
                </h3>
                <div className={`text-xs mb-3 ${city.isDaylight ? 'text-gray-500' : 'text-gray-300'}`}>
                  {city.country} • {city.offset}
                </div>

                {/* Time display */}
                <div className={`text-3xl font-mono font-bold mb-1 ${
                  city.isDaylight ? 'text-gray-900' : 'text-white'
                }`}>
                  {city.time}
                </div>
                <div className={`text-sm ${city.isDaylight ? 'text-gray-600' : 'text-gray-300'}`}>
                  {city.date}
                </div>
              </div>
            </div>
          ))}

          {/* Empty state */}
          {cityTimes.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">🌍</div>
              <p className="text-lg mb-2">No cities added yet</p>
              <p className="text-sm">Click &quot;Add City&quot; to start tracking world time</p>
            </div>
          )}
        </div>

        {/* Add City Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Add City</h2>
                  <button
                    onClick={() => { setShowAddModal(false); setSearchTerm(''); }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Search cities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              </div>
              <div className="overflow-y-auto max-h-96">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <button
                      key={city.timezone}
                      onClick={() => addCity(city)}
                      className="w-full px-6 py-4 text-left hover:bg-blue-50 flex items-center gap-4 border-b border-gray-100 last:border-0 transition-colors"
                    >
                      <span className="text-2xl">{city.flag}</span>
                      <div>
                        <div className="font-semibold text-gray-800">{city.city}</div>
                        <div className="text-sm text-gray-500">{city.country}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    {searchTerm ? 'No cities found' : 'All cities already added'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Time Zone Comparison Table */}
        {cityTimes.length >= 2 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Time Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">City</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Current Time</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">UTC Offset</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cityTimes.map((city) => (
                    <tr key={city.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span>{city.flag}</span>
                          <span className="font-medium text-gray-800">{city.city}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-700">{city.time}</td>
                      <td className="px-4 py-3 text-gray-600">{city.date}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{city.offset}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          city.isDaylight
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {city.isDaylight ? '☀️ Day' : '🌙 Night'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Use Cases */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">World Clock Uses</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-2xl mb-2">💼</div>
              <h3 className="font-semibold text-blue-800 mb-1">Business Meetings</h3>
              <p className="text-sm text-blue-700">Schedule international meetings when all parties are available.</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-2xl mb-2">✈️</div>
              <h3 className="font-semibold text-green-800 mb-1">Travel Planning</h3>
              <p className="text-sm text-green-700">Know local times at your destination before and during travel.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="text-2xl mb-2">👨‍👩‍👧‍👦</div>
              <h3 className="font-semibold text-purple-800 mb-1">Family & Friends</h3>
              <p className="text-sm text-purple-700">Know the best time to call loved ones in different countries.</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="font-semibold text-orange-800 mb-1">Stock Markets</h3>
              <p className="text-sm text-orange-700">Track when global stock exchanges open and close.</p>
            </div>
            <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
              <div className="text-2xl mb-2">🎮</div>
              <h3 className="font-semibold text-cyan-800 mb-1">Gaming & Events</h3>
              <p className="text-sm text-cyan-700">Coordinate gaming sessions with international friends.</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="text-2xl mb-2">📺</div>
              <h3 className="font-semibold text-red-800 mb-1">Live Events</h3>
              <p className="text-sm text-red-700">Watch live sports, shows, and events from around the world.</p>
            </div>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <GameAppMobileMrec2 />



        {/* FAQs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <details key={index} className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="font-medium text-gray-800 pr-4">{faq.question}</span>
                  <svg className="w-5 h-5 text-gray-500 flex-shrink-0 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-2 px-4 pb-4 text-gray-600">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
{/* Related Tools */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Time Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {relatedTools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="group">
                <div className="rounded-lg p-4 bg-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600">{tool.title}</h3>
                  <p className="text-xs text-gray-600">{tool.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="world-clock" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
