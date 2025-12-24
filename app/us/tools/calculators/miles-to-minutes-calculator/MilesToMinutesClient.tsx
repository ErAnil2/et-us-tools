'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
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

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Miles To Minutes Calculator?",
    answer: "A Miles To Minutes Calculator is a free online tool designed to help you quickly and accurately calculate miles to minutes-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Miles To Minutes Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Miles To Minutes Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Miles To Minutes Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function MilesToMinutesClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('miles-to-minutes-calculator');

  const [distance, setDistance] = useState<string>('100');
  const [speed, setSpeed] = useState<string>('65');
  const [additionalTime, setAdditionalTime] = useState<string>('0');
  const [totalMinutes, setTotalMinutes] = useState<string>('92');
  const [hoursMinutes, setHoursMinutes] = useState<string>('1h 32m');
  const [drivingTime, setDrivingTime] = useState<string>('92 minutes');
  const [extraTime, setExtraTime] = useState<string>('0 minutes');
  const [avgSpeed, setAvgSpeed] = useState<string>('65 MPH');
  const [totalDistance, setTotalDistance] = useState<string>('100 miles');
  const [arrivalTime, setArrivalTime] = useState<string>('--:--');

  const calculateTravelTime = () => {
    const distanceVal = parseFloat(distance) || 0;
    const speedVal = parseFloat(speed) || 0;
    const additionalTimeVal = parseFloat(additionalTime) || 0;

    if (distanceVal <= 0 || speedVal <= 0) {
      resetResults();
      return;
    }

    // Calculate driving time in minutes
    const drivingMinutes = (distanceVal / speedVal) * 60;
    const totalMins = drivingMinutes + additionalTimeVal;

    // Update results
    setTotalMinutes(Math.round(totalMins).toString());

    const hours = Math.floor(totalMins / 60);
    const minutes = Math.round(totalMins % 60);
    setHoursMinutes(`${hours}h ${minutes}m`);

    setDrivingTime(`${Math.round(drivingMinutes)} minutes`);
    setExtraTime(`${additionalTimeVal} minutes`);
    setAvgSpeed(`${speedVal} MPH`);
    setTotalDistance(`${distanceVal} miles`);

    // Calculate arrival time
    const now = new Date();
    const arrivalTimeDate = new Date(now.getTime() + totalMins * 60000);
    const timeStr = arrivalTimeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setArrivalTime(timeStr);
  };

  const resetResults = () => {
    setTotalMinutes('0');
    setHoursMinutes('0h 0m');
    setDrivingTime('0 minutes');
    setExtraTime('0 minutes');
    setAvgSpeed('0 MPH');
    setTotalDistance('0 miles');
    setArrivalTime('--:--');
  };

  const setSpeedPreset = (speedValue: number) => {
    setSpeed(speedValue.toString());
  };

  const copyResults = () => {
    const resultText = `Miles to Minutes Calculator Results:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Distance: ${distance} miles
Speed: ${speed} MPH
Total Travel Time: ${totalMinutes} minutes (${hoursMinutes})
Estimated Arrival: ${arrivalTime}
━━━━━━━━━━━━━━━━━━━━━━━━━━
Calculated at: ${new Date().toLocaleString()}`;

    navigator.clipboard.writeText(resultText).then(() => {
      alert('Results copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy results');
    });
  };

  useEffect(() => {
    calculateTravelTime();
  }, [distance, speed, additionalTime]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      {/* Header */}
      <header className="text-center mb-6 md:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{getH1('Miles to Minutes Calculator')}</h1>
        <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
          Calculate travel time from distance and speed. Perfect for trip planning and time estimation
        </p>
      </header>

      {/* Main Grid Layout: Calculator (2/3) + Results Sidebar (1/3) */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Left Column: Calculator (2/3) */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Calculator Card */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">Travel Details</h2>

            <div className="space-y-4 md:space-y-5">
              {/* Distance Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Distance (Miles)</label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  step="0.1"
                  min="0"
                  placeholder="e.g., 50"
                  className="w-full px-2 py-3 text-base md:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Speed Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Speed (MPH)</label>
                <input
                  type="number"
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value)}
                  step="1"
                  min="1"
                  placeholder="e.g., 65"
                  className="w-full px-2 py-3 text-base md:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Speed Presets */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3 text-sm md:text-base">Quick Speed Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSpeedPreset(25)}
                    className="px-3 py-2.5 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 text-sm font-medium transition-colors border border-blue-200"
                  >
                    🏙️ City: 25 MPH
                  </button>
                  <button
                    onClick={() => setSpeedPreset(35)}
                    className="px-3 py-2.5 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-sm font-medium transition-colors border border-green-200"
                  >
                    🏘️ Suburban: 35 MPH
                  </button>
                  <button
                    onClick={() => setSpeedPreset(55)}
                    className="px-3 py-2.5 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 text-sm font-medium transition-colors border border-orange-200"
                  >
                    🛣️ Highway: 55 MPH
                  </button>
                  <button
                    onClick={() => setSpeedPreset(70)}
                    className="px-3 py-2.5 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 text-sm font-medium transition-colors border border-purple-200"
                  >
                    🚗 Interstate: 70 MPH
                  </button>
                </div>
              </div>

              {/* Additional Time Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Time (Minutes) - Optional</label>
                <input
                  type="number"
                  value={additionalTime}
                  onChange={(e) => setAdditionalTime(e.target.value)}
                  step="1"
                  min="0"
                  placeholder="e.g., 15 (stops, traffic, etc.)"
                  className="w-full px-2 py-3 text-base md:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <p className="text-xs text-gray-500 mt-2">💡 Add extra time for stops, traffic, or delays</p>
              </div>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Travel Time Examples */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Travel Time Examples</h3>
            <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">City Drive</h4>
                <p className="text-sm text-gray-700 mb-1">10 miles at 30 MPH</p>
                <p className="font-bold text-green-600 text-lg">⏱️ 20 minutes</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Highway Trip</h4>
                <p className="text-sm text-gray-700 mb-1">100 miles at 65 MPH</p>
                <p className="font-bold text-blue-600 text-lg">⏱️ 1h 32m</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Long Distance</h4>
                <p className="text-sm text-gray-700 mb-1">300 miles at 70 MPH</p>
                <p className="font-bold text-purple-600 text-lg">⏱️ 4h 17m</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results Sidebar (1/3) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 lg:sticky lg:top-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Travel Time Results</h3>

            {/* Primary Result */}
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-5 md:p-6 text-center mb-4 shadow-md border border-green-200">
              <div className="text-green-700 text-sm font-medium mb-2">Total Travel Time</div>
              <div className="text-4xl md:text-5xl font-bold text-green-800 mb-1">{totalMinutes}</div>
              <div className="text-green-600 text-sm">Minutes</div>
            </div>

            {/* Hours & Minutes Display */}
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-5 md:p-6 text-center mb-4 shadow-md border border-blue-200">
              <div className="text-blue-700 text-sm font-medium mb-2">Time Duration</div>
              <div className="text-3xl md:text-4xl font-bold text-blue-800">{hoursMinutes}</div>
            </div>

            {/* Detailed Breakdown */}
            <div className="space-y-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Driving Time Only</div>
                <div className="font-semibold text-gray-900">{drivingTime}</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Additional Time</div>
                <div className="font-semibold text-gray-900">{extraTime}</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Average Speed</div>
                <div className="font-semibold text-gray-900">{avgSpeed}</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Distance</div>
                <div className="font-semibold text-gray-900">{totalDistance}</div>
              </div>
            </div>

            {/* Arrival Time */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-4 text-center shadow-md border border-purple-200">
              <div className="text-purple-700 text-xs font-medium mb-1">If leaving now, you&apos;ll arrive at:</div>
              <div className="text-2xl font-bold text-purple-800">{arrivalTime}</div>
            </div>

            {/* Copy Button */}
            <button
              onClick={copyResults}
              className="w-full mt-4 px-2 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
            >
              📋 Copy Results
            </button>
          </div>
</div>
      </div>

      {/* Information Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Card 1: Formula */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Basic Formula</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Travel Time = (Distance ÷ Speed) × 60 minutes. This calculates how long it takes to cover a given distance at a constant speed.</p>
            </div>
          </div>
        </div>

        {/* Card 2: Speed Guidelines */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-green-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Speed Guidelines</h3>
              <p className="text-sm text-gray-600 leading-relaxed">City streets: 25-35 MPH, Suburban roads: 35-45 MPH, Highways: 55-65 MPH, Interstates: 65-80 MPH.</p>
            </div>
          </div>
        </div>

        {/* Card 3: Planning Tips */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-orange-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Planning Tips</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Use realistic speeds for your route type. Add extra time for stops, traffic, and weather conditions. Allow buffer time for long trips.</p>
            </div>
          </div>
        </div>

        {/* Card 4: Real-World Factors */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-purple-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-World Factors</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Consider traffic patterns, road construction, weather conditions, time of day, and rest stops. These factors can significantly affect actual travel time.</p>
            </div>
          </div>
        </div>

        {/* Card 5: Fuel Planning */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-red-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Fuel Planning</h3>
              <p className="text-sm text-gray-600 leading-relaxed">For trips over 200 miles, plan fuel stops every 250-300 miles. Highway speeds typically provide better fuel efficiency than city driving.</p>
            </div>
          </div>
        </div>

        {/* Card 6: Safety Notes */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-yellow-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Safety Notes</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Never exceed posted speed limits. Take breaks every 2 hours on long trips. Adjust speed for weather and road conditions. Drive defensively.</p>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Converter Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="block">
              <div className={`${calc.color} rounded-lg p-6 text-white hover:opacity-90 transition-opacity`}>
                <h3 className="text-lg font-bold mb-2">{calc.title}</h3>
                <p className="text-sm opacity-90">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="miles-to-minutes-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
