'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
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
    question: "What is a Shift Calculator?",
    answer: "A Shift Calculator is a free online tool designed to help you quickly and accurately calculate shift-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Shift Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Shift Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Shift Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function ShiftCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('shift-calculator');

  const [shiftType, setShiftType] = useState('day');
  const [shiftLength, setShiftLength] = useState(8);
  const [breakTime, setBreakTime] = useState(30);
  const [startTime, setStartTime] = useState('09:00');
  const [rotation, setRotation] = useState('fixed');
  const [daysPerWeek, setDaysPerWeek] = useState(5);

  // Results
  const [workingHours, setWorkingHours] = useState('--');
  const [shiftTiming, setShiftTiming] = useState('--');
  const [breakSchedule, setBreakSchedule] = useState('--');
  const [weeklyHours, setWeeklyHours] = useState('--');
  const [monthlyHours, setMonthlyHours] = useState('--');
  const [recommendation, setRecommendation] = useState('Plan your shifts to maintain work-life balance.');

  // Shift Differential
  const [baseHourlyRate, setBaseHourlyRate] = useState(20);
  const [shiftDifferentialType, setShiftDifferentialType] = useState('evening');
  const [hoursWorked, setHoursWorked] = useState(8);
  const [customDifferential, setCustomDifferential] = useState(10);
  const [totalShiftPay, setTotalShiftPay] = useState('$176.00');
  const [basePay, setBasePay] = useState('$160.00');
  const [differentialAmount, setDifferentialAmount] = useState('$16.00');
  const [effectiveRate, setEffectiveRate] = useState('$22.00');
  const [weeklyProjection, setWeeklyProjection] = useState('$880.00');

  const formatTime = (timeString: string): string => {
    const [h, m] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(h), parseInt(m));
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const addHours = (timeString: string, hours: number): string => {
    const [h, m] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(h), parseInt(m));
    date.setHours(date.getHours() + hours);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const calculateShift = () => {
    const endTime = addHours(startTime, shiftLength);
    const totalWorkingHours = shiftLength - (breakTime / 60);
    const weekly = totalWorkingHours * daysPerWeek;
    const monthly = weekly * 4.33;

    const breakCount = Math.floor(shiftLength / 4);
    const breaks: string[] = [];
    let currentTime = startTime;
    for (let i = 0; i < breakCount; i++) {
      currentTime = addHours(currentTime, 4);
      breaks.push(currentTime);
    }

    setWorkingHours(`${totalWorkingHours.toFixed(1)} hours per shift`);
    setShiftTiming(`${formatTime(startTime)} - ${endTime}`);
    setBreakSchedule(breaks.length > 0 ? `Breaks at: ${breaks.join(', ')}` : 'No scheduled breaks');
    setWeeklyHours(`${weekly.toFixed(1)} hours`);
    setMonthlyHours(`${monthly.toFixed(1)} hours`);

    if (shiftType === 'night') {
      setRecommendation('Maintain a consistent sleep schedule and use blackout curtains for day sleep.');
    } else if (totalWorkingHours > 10) {
      setRecommendation('Consider additional breaks for long shifts to maintain productivity.');
    } else if (rotation !== 'fixed') {
      setRecommendation('Allow adequate rest between rotation changes to adjust your body clock.');
    } else {
      setRecommendation('Plan your shifts to maintain a healthy work-life balance.');
    }
  };

  const calculateShiftDifferential = () => {
    let differentialPercent = 0;
    switch (shiftDifferentialType) {
      case 'evening': differentialPercent = 10; break;
      case 'night': differentialPercent = 15; break;
      case 'weekend': differentialPercent = 20; break;
      case 'holiday': differentialPercent = 50; break;
      case 'custom': differentialPercent = customDifferential; break;
    }

    const basePayValue = baseHourlyRate * hoursWorked;
    const diffAmount = basePayValue * (differentialPercent / 100);
    const totalPay = basePayValue + diffAmount;
    const effRate = totalPay / hoursWorked;
    const weeklyProj = totalPay * 5;

    setBasePay(`$${basePayValue.toFixed(2)}`);
    setDifferentialAmount(`$${diffAmount.toFixed(2)}`);
    setTotalShiftPay(`$${totalPay.toFixed(2)}`);
    setEffectiveRate(`$${effRate.toFixed(2)}`);
    setWeeklyProjection(`$${weeklyProj.toFixed(2)}`);
  };

  useEffect(() => {
    calculateShift();
  }, [shiftType, shiftLength, breakTime, startTime, rotation, daysPerWeek]);

  useEffect(() => {
    calculateShiftDifferential();
  }, [baseHourlyRate, shiftDifferentialType, hoursWorked, customDifferential]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-6">
        <Link href="/us/tools" className="text-blue-600 hover:text-blue-800">Home</Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600">Shift Calculator</span>
      </div>

      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{getH1('Shift Calculator')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate work shift schedules, break times, and rotation patterns.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8 mb-12">
        {/* Calculator Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shift Type</label>
                <select
                  value={shiftType}
                  onChange={(e) => setShiftType(e.target.value)}
                  className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="day">Day Shift</option>
                  <option value="evening">Evening Shift</option>
                  <option value="night">Night Shift</option>
                  <option value="split">Split Shift</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shift Length (hours)</label>
                <input
                  type="number"
                  value={shiftLength}
                  onChange={(e) => setShiftLength(parseFloat(e.target.value) || 8)}
                  min="4"
                  max="12"
                  step="0.5"
                  className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Break Time (minutes)</label>
                <input
                  type="number"
                  value={breakTime}
                  onChange={(e) => setBreakTime(parseFloat(e.target.value) || 30)}
                  min="0"
                  max="120"
                  step="15"
                  className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rotation Pattern</label>
                <select
                  value={rotation}
                  onChange={(e) => setRotation(e.target.value)}
                  className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fixed">Fixed Schedule</option>
                  <option value="weekly">Weekly Rotation</option>
                  <option value="biweekly">Bi-weekly Rotation</option>
                  <option value="monthly">Monthly Rotation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Working Days Per Week</label>
                <input
                  type="number"
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(parseInt(e.target.value) || 5)}
                  min="1"
                  max="7"
                  className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        </div>

        {/* Results */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shift Details</h2>

            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600">Working Hours</div>
                <div className="text-xl font-semibold text-blue-600">{workingHours}</div>
                <div className="text-sm text-gray-500">{shiftTiming}</div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600">Break Schedule</div>
                <div className="text-lg font-semibold text-green-600">{breakSchedule}</div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600">Weekly Hours</div>
                <div className="text-lg font-semibold text-purple-600">{weeklyHours}</div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600">Monthly Hours</div>
                <div className="text-lg font-semibold text-orange-600">{monthlyHours}</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
                {recommendation}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shift Differential Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Shift Differential Pay Calculator</h2>

        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pay Calculation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Hourly Rate</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={baseHourlyRate}
                    onChange={(e) => setBaseHourlyRate(parseFloat(e.target.value) || 20)}
                    step="0.50"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shift Type</label>
                <select
                  value={shiftDifferentialType}
                  onChange={(e) => setShiftDifferentialType(e.target.value)}
                  className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="evening">Evening Shift (10% premium)</option>
                  <option value="night">Night Shift (15% premium)</option>
                  <option value="weekend">Weekend Shift (20% premium)</option>
                  <option value="holiday">Holiday Shift (50% premium)</option>
                  <option value="custom">Custom Differential</option>
                </select>
              </div>

              {shiftDifferentialType === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Differential (%)</label>
                  <input
                    type="number"
                    value={customDifferential}
                    onChange={(e) => setCustomDifferential(parseFloat(e.target.value) || 10)}
                    min="0"
                    max="100"
                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hours Worked</label>
                <input
                  type="number"
                  value={hoursWorked}
                  onChange={(e) => setHoursWorked(parseFloat(e.target.value) || 8)}
                  step="0.5"
                  min="0"
                  max="24"
                  className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pay Breakdown</h3>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Total Shift Pay</h4>
                <div className="text-2xl font-bold text-green-600">{totalShiftPay}</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Base Pay:</span>
                  <span className="font-medium">{basePay}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Shift Differential:</span>
                  <span className="font-medium text-blue-600">{differentialAmount}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Effective Hourly Rate:</span>
                  <span className="font-medium text-purple-600">{effectiveRate}</span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Weekly Projection:</h4>
                <div className="text-lg font-semibold text-blue-700">{weeklyProjection}</div>
                <div className="text-sm text-blue-800">Based on 5 shifts per week</div>
              </div>
            </div>
          </div>
        </div>
      </div>
{/* Rotation Schedule Info */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Rotation Schedule Patterns</h2>
        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">2-Shift Rotation</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-blue-50 p-2 rounded"><strong>Day Shift:</strong> 6 AM - 6 PM</div>
              <div className="bg-purple-50 p-2 rounded"><strong>Night Shift:</strong> 6 PM - 6 AM</div>
              <div className="text-xs text-gray-600 mt-2">Common in manufacturing</div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">3-Shift Rotation</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-yellow-50 p-2 rounded"><strong>Day:</strong> 7 AM - 3 PM</div>
              <div className="bg-orange-50 p-2 rounded"><strong>Evening:</strong> 3 PM - 11 PM</div>
              <div className="bg-blue-50 p-2 rounded"><strong>Night:</strong> 11 PM - 7 AM</div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">4-Shift Rotation</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-green-50 p-2 rounded"><strong>A Shift:</strong> 6 AM - 6 PM</div>
              <div className="bg-blue-50 p-2 rounded"><strong>B Shift:</strong> 6 PM - 6 AM</div>
              <div className="text-xs text-gray-600 mt-2">Plus 2 off-duty crews rotating</div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Time Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">⏰</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="shift-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
