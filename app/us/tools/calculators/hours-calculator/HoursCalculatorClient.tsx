'use client';

import React, { useState, useEffect } from 'react';
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
type CalculatorType = 'duration' | 'addSubtract' | 'timesheet';

interface TimesheetDay {
  name: string;
  start: string;
  end: string;
  breakMins: number;
  hours: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "How do I calculate hours worked between two times?",
    answer: "To calculate hours worked, subtract the start time from the end time, then subtract any break time. For example, if you start at 9:00 AM and end at 5:00 PM with a 1-hour lunch break: 8 hours total - 1 hour break = 7 hours worked. Our calculator handles this automatically, including overnight shifts that cross midnight.",
    order: 1
  },
  {
    id: '2',
    question: "What is the difference between regular hours and overtime hours?",
    answer: "In the US, regular hours are typically the first 40 hours worked per week. Any hours beyond 40 are considered overtime and are usually paid at 1.5x the regular rate (time and a half). Some states have additional overtime rules for daily hours exceeding 8 or 12 hours.",
    order: 2
  },
  {
    id: '3',
    question: "How do I convert decimal hours to hours and minutes?",
    answer: "To convert decimal hours to minutes, multiply the decimal portion by 60. For example, 7.5 hours = 7 hours and (0.5 × 60) = 30 minutes, so 7.5 hours = 7 hours 30 minutes. Similarly, 2.75 hours = 2 hours and 45 minutes (0.75 × 60 = 45).",
    order: 3
  },
  {
    id: '4',
    question: "How do I calculate hours for an overnight or night shift?",
    answer: "For shifts that cross midnight, enable the 'Time period crosses midnight' option. The calculator will automatically add 24 hours to the end time. For example, a shift from 10 PM to 6 AM would be calculated as: 6:00 + 24 hours - 22:00 = 8 hours.",
    order: 4
  },
  {
    id: '5',
    question: "How is gross pay calculated for weekly timesheets?",
    answer: "Gross pay is calculated by multiplying regular hours (up to 40) by the hourly rate, then adding overtime hours (over 40) at 1.5x the rate. For example, with a $20/hour rate and 45 hours worked: (40 × $20) + (5 × $30) = $800 + $150 = $950 gross pay.",
    order: 5
  },
  {
    id: '6',
    question: "What's the formula for calculating time duration?",
    answer: "Time duration = End Time - Start Time - Break Time. Convert all times to minutes for easier calculation. For example: End (17:00 = 1020 min) - Start (09:00 = 540 min) - Break (60 min) = 420 minutes = 7 hours.",
    order: 6
  }
];

const relatedCalculators = [
  { href: "/us/tools/calculators/time-calculator", title: "Time Calculator", description: "Add & subtract time durations", color: "bg-blue-600" },
  { href: "/us/tools/calculators/overtime-calculator", title: "Overtime Calculator", description: "Calculate overtime pay", color: "bg-green-600" },
  { href: "/us/tools/calculators/salary-calculator", title: "Salary Calculator", description: "Annual to hourly conversion", color: "bg-purple-600" },
  { href: "/us/tools/calculators/time-zone-calculator", title: "Time Zone Calculator", description: "Convert between time zones", color: "bg-orange-500" }
];

export default function HoursCalculatorClient() {
  // Calculator mode
  const { getH1, getSubHeading } = usePageSEO('hours-calculator');

  const [calcType, setCalcType] = useState<CalculatorType>('duration');

  // Duration calculator state
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [breakTime, setBreakTime] = useState<number>(60);
  const [crossesMidnight, setCrossesMidnight] = useState<boolean>(false);

  // Add/Subtract calculator state
  const [baseTime, setBaseTime] = useState<string>('09:00');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [addHours, setAddHours] = useState<number>(8);
  const [addMinutes, setAddMinutes] = useState<number>(30);

  // Timesheet state
  const [timesheetDays, setTimesheetDays] = useState<TimesheetDay[]>([
    { name: 'Monday', start: '09:00', end: '17:00', breakMins: 60, hours: 7 },
    { name: 'Tuesday', start: '09:00', end: '17:00', breakMins: 60, hours: 7 },
    { name: 'Wednesday', start: '09:00', end: '17:00', breakMins: 60, hours: 7 },
    { name: 'Thursday', start: '09:00', end: '17:00', breakMins: 60, hours: 7 },
    { name: 'Friday', start: '09:00', end: '17:00', breakMins: 60, hours: 7 },
    { name: 'Saturday', start: '', end: '', breakMins: 0, hours: 0 },
    { name: 'Sunday', start: '', end: '', breakMins: 0, hours: 0 },
  ]);
  const [hourlyRate, setHourlyRate] = useState<number>(25);

  // Results state
  const [totalDuration, setTotalDuration] = useState<string>('7:00');
  const [durationDecimal, setDurationDecimal] = useState<number>(7.0);
  const [breakdownHours, setBreakdownHours] = useState<number>(7);
  const [breakdownMinutes, setBreakdownMinutes] = useState<number>(0);
  const [totalMinutes, setTotalMinutes] = useState<number>(420);

  // Timesheet results
  const [weeklyHours, setWeeklyHours] = useState<number>(35);
  const [regularHours, setRegularHours] = useState<number>(35);
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [grossPay, setGrossPay] = useState<number>(875);

  // FAQ state

  useEffect(() => {
    if (calcType === 'duration') {
      calculateDuration();
    } else if (calcType === 'addSubtract') {
      calculateAddSubtract();
    } else if (calcType === 'timesheet') {
      calculateTimesheet();
    }
  }, [
    calcType,
    startTime,
    endTime,
    breakTime,
    crossesMidnight,
    baseTime,
    operation,
    addHours,
    addMinutes,
    timesheetDays,
    hourlyRate,
  ]);

  const formatTime = (hours: number, minutes: number): string => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const timeToMinutes = (timeString: string): number => {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return formatTime(hours, mins);
  };

  const calculateDuration = () => {
    if (!startTime || !endTime) return;

    let startMinutes = timeToMinutes(startTime);
    let endMinutes = timeToMinutes(endTime);

    // Handle crossing midnight
    if (crossesMidnight || endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }

    const minutes = Math.max(0, endMinutes - startMinutes - breakTime);
    updateResults(minutes);
  };

  const calculateAddSubtract = () => {
    if (!baseTime) return;

    const baseMinutes = timeToMinutes(baseTime);
    const operationMinutes = addHours * 60 + addMinutes;

    const resultMinutes =
      operation === 'add' ? baseMinutes + operationMinutes : Math.max(0, baseMinutes - operationMinutes);

    updateResults(Math.abs(resultMinutes - baseMinutes));

    // Update main result to show the new time
    const resultTime = minutesToTime(resultMinutes % (24 * 60));
    setTotalDuration(resultTime);
  };

  const calculateTimesheet = () => {
    let totalMins = 0;
    let totalHrs = 0;

    timesheetDays.forEach((day) => {
      if (day.start && day.end) {
        const startMinutes = timeToMinutes(day.start);
        let endMinutes = timeToMinutes(day.end);

        // Handle overnight shifts
        if (endMinutes < startMinutes) {
          endMinutes += 24 * 60;
        }

        const dayMinutes = Math.max(0, endMinutes - startMinutes - day.breakMins);
        const dayHours = dayMinutes / 60;

        totalMins += dayMinutes;
        totalHrs += dayHours;
      }
    });

    // Update timesheet summary
    const regHours = Math.min(totalHrs, 40);
    const ovtHours = Math.max(0, totalHrs - 40);
    const grossPayAmt = regHours * hourlyRate + ovtHours * hourlyRate * 1.5;

    setWeeklyHours(totalHrs);
    setRegularHours(regHours);
    setOvertimeHours(ovtHours);
    setGrossPay(grossPayAmt);

    updateResults(totalMins);
  };

  const updateResults = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const decimalHours = minutes / 60;

    setTotalDuration(minutesToTime(minutes));
    setDurationDecimal(decimalHours);
    setBreakdownHours(hours);
    setBreakdownMinutes(mins);
    setTotalMinutes(minutes);
  };

  const applyTimePreset = (start: string, end: string, breakMins: number = 60) => {
    setStartTime(start);
    setEndTime(end);
    setBreakTime(breakMins);
  };

  const updateTimesheetDay = (index: number, field: 'start' | 'end' | 'breakMins', value: string | number) => {
    const updatedDays = [...timesheetDays];
    if (field === 'breakMins') {
      updatedDays[index].breakMins = value as number;
    } else {
      updatedDays[index][field] = value as string;
    }

    // Calculate hours for this day
    if (updatedDays[index].start && updatedDays[index].end) {
      const startMinutes = timeToMinutes(updatedDays[index].start);
      let endMinutes = timeToMinutes(updatedDays[index].end);

      if (endMinutes < startMinutes) {
        endMinutes += 24 * 60;
      }

      const dayMinutes = Math.max(0, endMinutes - startMinutes - updatedDays[index].breakMins);
      updatedDays[index].hours = dayMinutes / 60;
    } else {
      updatedDays[index].hours = 0;
    }

    setTimesheetDays(updatedDays);
  };

  const copyStandardSchedule = () => {
    const updatedDays = timesheetDays.map((day, index) => {
      if (index < 5) {
        return { ...day, start: '09:00', end: '17:00', breakMins: 60, hours: 7 };
      }
      return { ...day, start: '', end: '', breakMins: 0, hours: 0 };
    });
    setTimesheetDays(updatedDays);
  };

  const clearTimesheet = () => {
    const updatedDays = timesheetDays.map(day => ({
      ...day, start: '', end: '', breakMins: 0, hours: 0
    }));
    setTimesheetDays(updatedDays);
  };

  // Schema.org structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Hours Calculator",
        "description": "Calculate time duration between hours, weekly timesheet totals, and gross pay with overtime. Perfect for work hours tracking and payroll calculations.",
        "url": "https://economictimes.indiatimes.com/us/tools/calculators/hours-calculator",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "permissions": "browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": fallbackFaqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://economictimes.indiatimes.com/us"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Tools",
            "item": "https://economictimes.indiatimes.com/us/tools"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Calculators",
            "item": "https://economictimes.indiatimes.com/us/tools/calculators"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Hours Calculator",
            "item": "https://economictimes.indiatimes.com/us/tools/calculators/hours-calculator"
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-3 sm:mb-4 md:mb-6">
          <Link href="/us/tools" className="text-blue-600 hover:underline">Home</Link>
          <span className="text-gray-400">›</span>
          <Link href="/us/tools/all-calculators" className="text-blue-600 hover:underline">Calculators</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-600">Hours Calculator</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{getH1('Hours Calculator')}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate time duration between hours, track weekly work hours with timesheets, and compute gross pay with automatic overtime calculations. Perfect for employees, freelancers, and payroll management.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8 mb-12">
          {/* Calculator Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
              {/* Calculator Type Selection */}
              <div className="mb-3 sm:mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Calculator Mode</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => setCalcType('duration')}
                    className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all ${
                      calcType === 'duration'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Time Duration</span>
                    <span className="text-xs text-gray-500 mt-1">Calculate hours worked</span>
                  </button>
                  <button
                    onClick={() => setCalcType('addSubtract')}
                    className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all ${
                      calcType === 'addSubtract'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="font-medium">Add/Subtract</span>
                    <span className="text-xs text-gray-500 mt-1">Add or subtract time</span>
                  </button>
                  <button
                    onClick={() => setCalcType('timesheet')}
                    className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all ${
                      calcType === 'timesheet'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="font-medium">Weekly Timesheet</span>
                    <span className="text-xs text-gray-500 mt-1">Track full week</span>
                  </button>
                </div>
              </div>

              {/* Duration Calculator Section */}
              {calcType === 'duration' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculate Duration Between Times</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4">
                    <div>
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      />
                    </div>

                    <div>
                      <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4">
                    <div>
                      <label htmlFor="breakTime" className="block text-sm font-medium text-gray-700 mb-2">
                        Break Time (minutes)
                      </label>
                      <input
                        type="number"
                        id="breakTime"
                        value={breakTime}
                        onChange={(e) => setBreakTime(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        max="480"
                      />
                    </div>

                    <div className="flex items-end">
                      <label className="flex items-center p-3 border border-gray-300 rounded-lg w-full cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={crossesMidnight}
                          onChange={(e) => setCrossesMidnight(e.target.checked)}
                          className="mr-3 w-5 h-5 rounded text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Shift crosses midnight</span>
                      </label>
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Quick Presets</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => applyTimePreset('09:00', '17:00', 60)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        9-5 (1hr break)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyTimePreset('08:00', '17:00', 60)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        8-5 (1hr break)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyTimePreset('08:00', '16:30', 30)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        8-4:30 (30m break)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyTimePreset('22:00', '06:00', 30)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        Night shift
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Add/Subtract Time Section */}
              {calcType === 'addSubtract' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add or Subtract Time</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4">
                    <div>
                      <label htmlFor="baseTime" className="block text-sm font-medium text-gray-700 mb-2">
                        Starting Time
                      </label>
                      <input
                        type="time"
                        id="baseTime"
                        value={baseTime}
                        onChange={(e) => setBaseTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Operation</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setOperation('add')}
                          className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                            operation === 'add'
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          + Add Time
                        </button>
                        <button
                          onClick={() => setOperation('subtract')}
                          className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                            operation === 'subtract'
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          - Subtract
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="addHours" className="block text-sm font-medium text-gray-700 mb-2">
                        Hours
                      </label>
                      <input
                        type="number"
                        id="addHours"
                        value={addHours}
                        onChange={(e) => setAddHours(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        max="100"
                      />
                    </div>

                    <div>
                      <label htmlFor="addMinutes" className="block text-sm font-medium text-gray-700 mb-2">
                        Minutes
                      </label>
                      <input
                        type="number"
                        id="addMinutes"
                        value={addMinutes}
                        onChange={(e) => setAddMinutes(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        max="59"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      {baseTime} {operation === 'add' ? '+' : '-'} {addHours}h {addMinutes}m = <span className="font-semibold text-blue-600">{totalDuration}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Timesheet Section */}
              {calcType === 'timesheet' && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Weekly Timesheet</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={copyStandardSchedule}
                        className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        9-5 Mon-Fri
                      </button>
                      <button
                        onClick={clearTimesheet}
                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left text-sm font-medium text-gray-700 py-3 px-2">Day</th>
                          <th className="text-left text-sm font-medium text-gray-700 py-3 px-2">Start</th>
                          <th className="text-left text-sm font-medium text-gray-700 py-3 px-2">End</th>
                          <th className="text-left text-sm font-medium text-gray-700 py-3 px-2">Break</th>
                          <th className="text-right text-sm font-medium text-gray-700 py-3 px-2">Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timesheetDays.map((day, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="py-2 px-2 font-medium text-gray-700">{day.name}</td>
                            <td className="py-2 px-2">
                              <input
                                type="time"
                                value={day.start}
                                onChange={(e) => updateTimesheetDay(index, 'start', e.target.value)}
                                className="w-full px-2 py-1.5 rounded border border-gray-300 text-sm"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <input
                                type="time"
                                value={day.end}
                                onChange={(e) => updateTimesheetDay(index, 'end', e.target.value)}
                                className="w-full px-2 py-1.5 rounded border border-gray-300 text-sm"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <select
                                value={day.breakMins}
                                onChange={(e) => updateTimesheetDay(index, 'breakMins', parseInt(e.target.value))}
                                className="w-full px-2 py-1.5 rounded border border-gray-300 text-sm"
                              >
                                <option value={0}>None</option>
                                <option value={15}>15 min</option>
                                <option value={30}>30 min</option>
                                <option value={45}>45 min</option>
                                <option value={60}>1 hour</option>
                                <option value={90}>1.5 hours</option>
                              </select>
                            </td>
                            <td className="py-2 px-2 text-right font-medium text-gray-800">
                              {formatNumber(day.hours)}h
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-2">
                        Hourly Rate (optional for pay calculation)
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-lg">
                          $
                        </span>
                        <input
                          type="number"
                          id="hourlyRate"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                          className="flex-1 px-4 py-3 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />


            {/* Time Conversion Reference */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Decimal Hours Conversion Table</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { mins: 15, decimal: 0.25 },
                  { mins: 30, decimal: 0.50 },
                  { mins: 45, decimal: 0.75 },
                  { mins: 6, decimal: 0.10 },
                  { mins: 12, decimal: 0.20 },
                  { mins: 18, decimal: 0.30 },
                  { mins: 24, decimal: 0.40 },
                  { mins: 36, decimal: 0.60 },
                ].map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-500">{item.mins} minutes</div>
                    <div className="font-semibold text-gray-900">{item.decimal} hours</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Results</h3>

              {/* Primary Result */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-200">
                <div className="text-sm text-blue-600 mb-1">
                  {calcType === 'addSubtract' ? 'Result Time' : 'Total Duration'}
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800">{totalDuration}</div>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">{breakdownHours}</div>
                  <div className="text-xs text-gray-500">Hours</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">{breakdownMinutes}</div>
                  <div className="text-xs text-gray-500">Minutes</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">{formatNumber(durationDecimal)}</div>
                  <div className="text-xs text-gray-500">Decimal Hours</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">{totalMinutes}</div>
                  <div className="text-xs text-gray-500">Total Minutes</div>
                </div>
              </div>

              {/* Timesheet Summary */}
              {calcType === 'timesheet' && (
                <div className="border-t pt-4 space-y-3">
                  <h4 className="font-medium text-gray-800">Weekly Summary</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Weekly Hours:</span>
                    <span className="font-semibold">{formatNumber(weeklyHours)}h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Regular Hours:</span>
                    <span className="font-semibold text-blue-600">{formatNumber(regularHours)}h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Overtime Hours:</span>
                    <span className="font-semibold text-orange-600">{formatNumber(overtimeHours)}h</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gross Pay:</span>
                      <span className="text-xl font-bold text-green-600">{formatCurrency(grossPay)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQs Section */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
          <FirebaseFAQs pageId="hours-calculator" fallbackFaqs={fallbackFaqs} />
        </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedCalculators.map((calc, index) => (
              <Link
                key={index}
                href={calc.href}
                className="block p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className={`w-10 h-10 ${calc.color} rounded-lg flex items-center justify-center mb-3`}>
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{calc.title}</h3>
                <p className="text-sm text-gray-500">{calc.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

