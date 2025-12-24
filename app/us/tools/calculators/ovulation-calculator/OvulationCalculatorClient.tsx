'use client';

import { useState, useEffect } from 'react';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import Link from 'next/link';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface OvulationCalculatorClientProps {
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
    question: "What is a Ovulation Calculator?",
    answer: "A Ovulation Calculator is a free online tool designed to help you quickly and accurately calculate ovulation-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Ovulation Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Ovulation Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Ovulation Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function OvulationCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: OvulationCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('ovulation-calculator');

  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [lutealLength, setLutealLength] = useState('14');
  const [ovulationDate, setOvulationDate] = useState('Select date above');
  const [fertileWindow, setFertileWindow] = useState('--');
  const [currentCycleDay, setCurrentCycleDay] = useState('--');
  const [daysToOvulation, setDaysToOvulation] = useState('--');
  const [nextPeriod, setNextPeriod] = useState('--');
  const [cycleLengthDisplay, setCycleLengthDisplay] = useState('-- days');
  const [statusText, setStatusText] = useState('Enter information to see status');
  const [statusDisplay, setStatusDisplay] = useState('text-center p-3 rounded-lg bg-gray-100');
  const [statusTextClass, setStatusTextClass] = useState('font-medium text-gray-600');
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDays, setCalendarDays] = useState<JSX.Element[]>([]);

  useEffect(() => {
    // Set default date to 14 days ago (middle of typical cycle)
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() - 14);
    setLastPeriod(defaultDate.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    calculateOvulation();
  }, [lastPeriod, cycleLength, lutealLength]);

  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((date2.getTime() - date1.getTime()) / oneDay);
  }

  function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
    return date >= startDate && date <= endDate;
  }

  function calculateOvulation() {
    const cycleLengthNum = parseInt(cycleLength) || 28;
    const lutealLengthNum = parseInt(lutealLength) || 14;

    if (!lastPeriod) {
      resetResults();
      return;
    }

    const lastPeriodDate = new Date(lastPeriod);
    const today = new Date();

    // Calculate ovulation day (luteal phase days before next period)
    const ovulationDay = cycleLengthNum - lutealLengthNum;
    const ovulationDateCalc = addDays(lastPeriodDate, ovulationDay);

    // Calculate fertile window (5 days before + day of ovulation)
    const fertileStart = addDays(ovulationDateCalc, -5);
    const fertileEnd = ovulationDateCalc;

    // Calculate next period
    const nextPeriodDate = addDays(lastPeriodDate, cycleLengthNum);

    // Calculate current cycle day
    const daysSinceLastPeriod = daysBetween(lastPeriodDate, today) + 1;
    const currentCycleDayNum = daysSinceLastPeriod > cycleLengthNum ?
      daysSinceLastPeriod - cycleLengthNum : daysSinceLastPeriod;

    // Days until ovulation
    const daysToOvulationNum = daysBetween(today, ovulationDateCalc);

    // Update display
    setOvulationDate(formatDate(ovulationDateCalc));
    setFertileWindow(`${formatDate(fertileStart)} - ${formatDate(fertileEnd)}`);
    setCurrentCycleDay(Math.max(1, currentCycleDayNum).toString());
    setDaysToOvulation(daysToOvulationNum > 0 ? daysToOvulationNum.toString() : 'Passed');
    setNextPeriod(formatDate(nextPeriodDate));
    setCycleLengthDisplay(`${cycleLengthNum} days`);

    // Update current status
    updateCurrentStatus(today, fertileStart, fertileEnd, ovulationDateCalc, nextPeriodDate, lastPeriodDate, cycleLengthNum);

    // Generate calendar
    generateCalendar(lastPeriodDate, cycleLengthNum, ovulationDateCalc, fertileStart, fertileEnd);
  }

  function updateCurrentStatus(
    today: Date,
    fertileStart: Date,
    fertileEnd: Date,
    ovulationDate: Date,
    nextPeriodDate: Date,
    lastPeriodDate: Date,
    cycleLengthNum: number
  ) {
    const daysSinceLastPeriod = daysBetween(lastPeriodDate, today) + 1;
    const isInFertileWindow = today >= fertileStart && today <= fertileEnd;
    const isOvulationDay = today.toDateString() === ovulationDate.toDateString();
    const isInPeriod = daysSinceLastPeriod <= 5 || daysSinceLastPeriod > (cycleLengthNum - 2);

    if (isOvulationDay) {
      setStatusText('Peak Fertility - Ovulation Day');
      setStatusDisplay('text-center p-3 rounded-lg bg-pink-100 border-2 border-pink-300');
      setStatusTextClass('font-medium text-pink-700');
    } else if (isInFertileWindow) {
      setStatusText('High Fertility Window');
      setStatusDisplay('text-center p-3 rounded-lg bg-green-100 border-2 border-green-300');
      setStatusTextClass('font-medium text-green-700');
    } else if (isInPeriod) {
      setStatusText('Menstrual Phase');
      setStatusDisplay('text-center p-3 rounded-lg bg-red-100 border-2 border-red-300');
      setStatusTextClass('font-medium text-red-700');
    } else if (daysSinceLastPeriod > (cycleLengthNum - 14)) {
      setStatusText('Luteal Phase');
      setStatusDisplay('text-center p-3 rounded-lg bg-blue-100 border-2 border-blue-300');
      setStatusTextClass('font-medium text-blue-700');
    } else {
      setStatusText('Follicular Phase');
      setStatusDisplay('text-center p-3 rounded-lg bg-purple-100 border-2 border-purple-300');
      setStatusTextClass('font-medium text-purple-700');
    }
  }

  function generateCalendar(
    lastPeriodDate: Date,
    cycleLengthNum: number,
    ovulationDate: Date,
    fertileStart: Date,
    fertileEnd: Date
  ) {
    const days: JSX.Element[] = [];

    // Show current month around ovulation date
    const displayDate = new Date(ovulationDate.getFullYear(), ovulationDate.getMonth(), 1);
    const monthStart = new Date(displayDate);
    const monthEnd = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0);

    // Add empty cells for days before month starts
    const startDayOfWeek = monthStart.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= monthEnd.getDate(); day++) {
      const currentDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);

      // Color code based on cycle phase
      const isInPeriod = isDateInRange(currentDate, lastPeriodDate, addDays(lastPeriodDate, 4));
      const isOvulation = currentDate.toDateString() === ovulationDate.toDateString();
      const isFertile = isDateInRange(currentDate, fertileStart, fertileEnd) && !isOvulation;

      let cellClass = 'h-10 w-10 flex items-center justify-center text-sm font-medium rounded';

      if (isOvulation) {
        cellClass += ' bg-pink-200 text-pink-800 border-2 border-pink-400';
      } else if (isFertile) {
        cellClass += ' bg-green-200 text-green-800';
      } else if (isInPeriod) {
        cellClass += ' bg-red-200 text-red-800';
      } else {
        cellClass += ' bg-gray-100 text-gray-600';
      }

      // Highlight today
      if (currentDate.toDateString() === new Date().toDateString()) {
        cellClass += ' ring-2 ring-blue-500';
      }

      days.push(
        <div key={`day-${day}`} className={cellClass}>
          {day}
        </div>
      );
    }

    setCalendarDays(days);
    setShowCalendar(true);
  }

  function resetResults() {
    setOvulationDate('Select date above');
    setFertileWindow('--');
    setCurrentCycleDay('--');
    setDaysToOvulation('--');
    setNextPeriod('--');
    setCycleLengthDisplay('-- days');
    setStatusText('Enter information to see status');
    setStatusDisplay('text-center p-3 rounded-lg bg-gray-100');
    setStatusTextClass('font-medium text-gray-600');
    setShowCalendar(false);
  }

  return (
    <>
      <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Ovulation Calculator')}</h1>
          <p className="text-lg text-gray-600">Calculate your ovulation date and fertile window for pregnancy planning</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Calculator Card */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Input Section */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enter Cycle Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Menstrual Period (LMP)</label>
                <input
                  type="date"
                  id="lastPeriod"
                  value={lastPeriod}
                  onChange={(e) => setLastPeriod(e.target.value)}
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">First day of your last menstrual period</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Average Cycle Length (days)</label>
                <input
                  type="number"
                  id="cycleLength"
                  min="21"
                  max="45"
                  placeholder="e.g., 28"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(e.target.value)}
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Typical range: 21-35 days (average: 28 days)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Luteal Phase Length (days)</label>
                <input
                  type="number"
                  id="lutealLength"
                  min="10"
                  max="16"
                  placeholder="e.g., 14"
                  value={lutealLength}
                  onChange={(e) => setLutealLength(e.target.value)}
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Usually 12-16 days (default: 14 days if unknown)</p>
              </div>

              {/* Cycle Tracking Tips */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Tracking Tips</h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Track cycles for 3-6 months for accuracy</li>
                  <li>• Note cycle length variations</li>
                  <li>• Monitor ovulation symptoms</li>
                  <li>• Use ovulation tests for confirmation</li>
                  <li>• Consider basal body temperature tracking</li>
                </ul>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Fertility Calendar</h3>

              <div className="space-y-4">
                {/* Ovulation Date */}
                <div className="bg-pink-100 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-pink-600" id="ovulationDate">{ovulationDate}</div>
                  <div className="text-pink-700">Estimated Ovulation Date</div>
                </div>

                {/* Fertile Window */}
                <div className="bg-green-100 rounded-lg p-4 text-center">
                  <div className="text-lg font-semibold text-green-700" id="fertileWindow">{fertileWindow}</div>
                  <div className="text-green-600">Fertile Window (6 days)</div>
                  <div className="text-xs text-green-600 mt-1">Best chance of conception</div>
                </div>

                {/* Cycle Information */}
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">This Cycle</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Cycle Day Today:</span>
                      <span id="currentCycleDay" className="font-medium">{currentCycleDay}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Days Until Ovulation:</span>
                      <span id="daysToOvulation" className="font-medium">{daysToOvulation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Period Expected:</span>
                      <span id="nextPeriod" className="font-medium">{nextPeriod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cycle Length:</span>
                      <span id="cycleLengthDisplay" className="font-medium">{cycleLengthDisplay}</span>
                    </div>
                  </div>
                </div>

                {/* Current Status */}
                <div className="bg-white rounded-lg p-4" id="currentStatus">
                  <h4 className="font-semibold text-gray-700 mb-2">Current Status</h4>
                  <div className={statusDisplay} id="statusDisplay">
                    <span id="statusText" className={statusTextClass}>{statusText}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Monthly Calendar View */}
        {showCalendar && (
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8" id="calendarSection">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Fertility Calendar View</h3>
            <div className="grid grid-cols-7 gap-2 mb-4">
              <div className="text-center font-semibold text-gray-600 p-2">Sun</div>
              <div className="text-center font-semibold text-gray-600 p-2">Mon</div>
              <div className="text-center font-semibold text-gray-600 p-2">Tue</div>
              <div className="text-center font-semibold text-gray-600 p-2">Wed</div>
              <div className="text-center font-semibold text-gray-600 p-2">Thu</div>
              <div className="text-center font-semibold text-gray-600 p-2">Fri</div>
              <div className="text-center font-semibold text-gray-600 p-2">Sat</div>
            </div>
            <div id="calendarGrid" className="grid grid-cols-7 gap-2">
              {calendarDays}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-200 rounded mr-2"></div>
                <span className="text-sm">Period</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-200 rounded mr-2"></div>
                <span className="text-sm">Fertile Window</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-pink-200 rounded mr-2"></div>
                <span className="text-sm">Ovulation</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                <span className="text-sm">Other Days</span>
              </div>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Understanding Your Fertility Cycle</h3>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-blue-700">
            <div>
              <h4 className="font-semibold mb-2">Ovulation Signs & Symptoms:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Changes in cervical mucus (clear, stretchy)</li>
                <li>• Slight increase in basal body temperature</li>
                <li>• Mild pelvic or lower abdominal pain</li>
                <li>• Light spotting or discharge</li>
                <li>• Increased sex drive</li>
                <li>• Breast tenderness</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Maximizing Conception Chances:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Have intercourse during fertile window</li>
                <li>• Every other day approach works well</li>
                <li>• Don't stress about perfect timing</li>
                <li>• Maintain healthy lifestyle</li>
                <li>• Consider fertility-friendly lubricants</li>
                <li>• Track multiple cycles for patterns</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cycle Phase Information */}
        <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6">
          <h3 className="text-xl font-semibold text-green-800 mb-4">Menstrual Cycle Phases</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded p-4">
              <h4 className="font-semibold mb-2 text-green-800">Menstrual Phase</h4>
              <p className="text-sm text-green-700 mb-2">Days 1-5</p>
              <p className="text-xs text-green-600">Period occurs, hormone levels low</p>
            </div>
<div className="bg-white rounded p-4">
              <h4 className="font-semibold mb-2 text-green-800">Follicular Phase</h4>
              <p className="text-sm text-green-700 mb-2">Days 1-13</p>
              <p className="text-xs text-green-600">Egg develops, estrogen rises</p>
            </div>
            <div className="bg-white rounded p-4">
              <h4 className="font-semibold mb-2 text-green-800">Ovulation</h4>
              <p className="text-sm text-green-700 mb-2">Around Day 14</p>
              <p className="text-xs text-green-600">Egg released, peak fertility</p>
            </div>
            <div className="bg-white rounded p-4">
              <h4 className="font-semibold mb-2 text-green-800">Luteal Phase</h4>
              <p className="text-sm text-green-700 mb-2">Days 15-28</p>
              <p className="text-xs text-green-600">Progesterone rises, prepare for period</p>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6 text-center">Related Health Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {relatedCalculators.map((calc, index) => (
            <Link
              key={index}
              href={calc.href}
              className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-3 sm:p-4 md:p-6"
            >
              <div className={`${calc.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <span className="text-white text-2xl">{calc.icon === 'scale' ? '⚖️' : calc.icon === 'heart' ? '❤️' : calc.icon === 'food' ? '🍎' : calc.icon === 'percent' ? '%' : '💧'}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{calc.title}</h3>
              <p className="text-gray-600 text-sm">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="ovulation-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </>
  );
}
