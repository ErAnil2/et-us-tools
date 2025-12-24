'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
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

type CalculationType = 'speed' | 'distance' | 'time';

const fallbackFaqs = [
  {
    id: '1',
    question: 'What is the formula for calculating speed?',
    answer: 'The formula for speed is: Speed = Distance ÷ Time. If you travel 100 kilometers in 2 hours, your speed is 100 ÷ 2 = 50 km/h. This fundamental formula can be rearranged to find distance (Distance = Speed × Time) or time (Time = Distance ÷ Speed).',
    order: 1
  },
  {
    id: '2',
    question: 'How do I convert between mph and km/h?',
    answer: 'To convert mph to km/h, multiply by 1.609344. To convert km/h to mph, divide by 1.609344 (or multiply by 0.621371). For example, 60 mph equals approximately 96.6 km/h, and 100 km/h equals approximately 62.1 mph.',
    order: 2
  },
  {
    id: '3',
    question: 'What is the difference between speed and velocity?',
    answer: 'Speed is a scalar quantity that only measures how fast something is moving (magnitude only). Velocity is a vector quantity that includes both speed and direction. An object traveling 50 km/h north has a velocity, while 50 km/h without direction is just speed.',
    order: 3
  },
  {
    id: '4',
    question: 'How do I calculate average speed for a trip?',
    answer: 'Average speed is calculated by dividing the total distance traveled by the total time taken. If you drive 150 km in the first 2 hours and 100 km in the next 1.5 hours, your average speed is (150 + 100) ÷ (2 + 1.5) = 71.4 km/h.',
    order: 4
  },
  {
    id: '5',
    question: 'What is a knot and how does it relate to other speed units?',
    answer: 'A knot is a unit of speed equal to one nautical mile per hour, used mainly in aviation and maritime contexts. One knot equals approximately 1.852 km/h or 1.151 mph. The term comes from counting knots on a rope used to measure ship speed.',
    order: 5
  },
  {
    id: '6',
    question: 'How fast is the speed of sound and light?',
    answer: 'The speed of sound in air at sea level is approximately 343 m/s (1,235 km/h or 767 mph). The speed of light in a vacuum is 299,792,458 m/s (approximately 1.08 billion km/h). These are important reference speeds in physics.',
    order: 6
  }
];

export default function SpeedCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('speed-calculator');

  const [calculationType, setCalculationType] = useState<CalculationType>('speed');

  // Speed form inputs
  const [speedDistance, setSpeedDistance] = useState(100);
  const [speedTime, setSpeedTime] = useState(2);
  const [speedDistanceUnit, setSpeedDistanceUnit] = useState('km');
  const [speedTimeUnit, setSpeedTimeUnit] = useState('hours');

  // Distance form inputs
  const [distanceSpeed, setDistanceSpeed] = useState(60);
  const [distanceTime, setDistanceTime] = useState(2);
  const [distanceSpeedUnit, setDistanceSpeedUnit] = useState('km/h');
  const [distanceTimeUnit, setDistanceTimeUnit] = useState('hours');

  // Time form inputs
  const [timeDistance, setTimeDistance] = useState(120);
  const [timeSpeed, setTimeSpeed] = useState(60);
  const [timeDistanceUnit, setTimeDistanceUnit] = useState('km');
  const [timeSpeedUnit, setTimeSpeedUnit] = useState('km/h');

  // Results
  const [mainResult, setMainResult] = useState(50);
  const [resultLabel, setResultLabel] = useState('Speed');
  const [resultUnits, setResultUnits] = useState('km/h');
  const [formulaUsed, setFormulaUsed] = useState('Speed = Distance ÷ Time');
  const [calculationSteps, setCalculationSteps] = useState('100 km ÷ 2 h = 50 km/h');

  // Conversions
  const [speedConversions, setSpeedConversions] = useState({ kmh: 50, mph: 31.07, ms: 13.89, fts: 45.57, knots: 27.00 });
  const [distanceConversions, setDistanceConversions] = useState({ km: 120, miles: 74.56, meters: 120000, feet: 393701 });
  const [timeConversions, setTimeConversions] = useState({ hours: 2, minutes: 120, seconds: 7200 });

  useEffect(() => {
    calculate();
  }, [calculationType, speedDistance, speedTime, speedDistanceUnit, speedTimeUnit,
      distanceSpeed, distanceTime, distanceSpeedUnit, distanceTimeUnit,
      timeDistance, timeSpeed, timeDistanceUnit, timeSpeedUnit]);

  const getSpeedUnit = (distanceUnit: string, timeUnit: string): string => {
    const unitMap: { [key: string]: string } = {
      'km-hours': 'km/h',
      'km-minutes': 'km/min',
      'km-seconds': 'km/s',
      'miles-hours': 'mph',
      'miles-minutes': 'miles/min',
      'miles-seconds': 'miles/s',
      'meters-hours': 'm/h',
      'meters-minutes': 'm/min',
      'meters-seconds': 'm/s',
      'feet-hours': 'ft/h',
      'feet-minutes': 'ft/min',
      'feet-seconds': 'ft/s'
    };
    return unitMap[`${distanceUnit}-${timeUnit}`] || 'units/time';
  };

  const getDistanceUnit = (speedUnit: string): string => {
    if (speedUnit.includes('km')) return 'km';
    if (speedUnit.includes('miles') || speedUnit === 'mph') return 'miles';
    if (speedUnit.includes('m/')) return 'meters';
    if (speedUnit.includes('ft')) return 'feet';
    return 'units';
  };

  const getTimeUnit = (speedUnit: string): string => {
    if (speedUnit.includes('/h')) return 'hours';
    if (speedUnit.includes('/min')) return 'minutes';
    if (speedUnit.includes('/s')) return 'seconds';
    return 'time';
  };

  const updateSpeedConversions = (speed: number, distanceUnit: string, timeUnit: string) => {
    let speedKmh = speed;

    if (distanceUnit === 'miles') speedKmh = speed * 1.609344;
    if (distanceUnit === 'meters') speedKmh = speed * 0.001;
    if (distanceUnit === 'feet') speedKmh = speed * 0.0003048;

    if (timeUnit === 'minutes') speedKmh = speedKmh * 60;
    if (timeUnit === 'seconds') speedKmh = speedKmh * 3600;

    setSpeedConversions({
      kmh: parseFloat(speedKmh.toFixed(2)),
      mph: parseFloat((speedKmh * 0.621371).toFixed(2)),
      ms: parseFloat((speedKmh / 3.6).toFixed(2)),
      fts: parseFloat((speedKmh * 0.911344).toFixed(2)),
      knots: parseFloat((speedKmh * 0.539957).toFixed(2))
    });
  };

  const updateDistanceConversions = (distance: number, unit: string) => {
    let distanceMeters = distance;

    if (unit === 'km') distanceMeters = distance * 1000;
    if (unit === 'miles') distanceMeters = distance * 1609.344;
    if (unit === 'feet') distanceMeters = distance * 0.3048;

    setDistanceConversions({
      km: parseFloat((distanceMeters / 1000).toFixed(2)),
      miles: parseFloat((distanceMeters / 1609.344).toFixed(2)),
      meters: Math.round(distanceMeters),
      feet: Math.round(distanceMeters / 0.3048)
    });
  };

  const updateTimeConversions = (time: number, unit: string) => {
    let timeHours = time;

    if (unit === 'minutes') timeHours = time / 60;
    if (unit === 'seconds') timeHours = time / 3600;

    setTimeConversions({
      hours: parseFloat(timeHours.toFixed(2)),
      minutes: parseFloat((timeHours * 60).toFixed(1)),
      seconds: Math.round(timeHours * 3600)
    });
  };

  const calculate = () => {
    let result = 0;
    let formula = '';
    let calculation = '';
    let label = '';
    let units = '';

    if (calculationType === 'speed') {
      const distance = speedDistance || 0;
      const time = speedTime || 0;
      const distanceUnit = speedDistanceUnit;
      const timeUnit = speedTimeUnit;

      let timeInHours = time;
      if (timeUnit === 'minutes') timeInHours = time / 60;
      if (timeUnit === 'seconds') timeInHours = time / 3600;

      if (timeInHours > 0) {
        result = distance / timeInHours;
      }

      formula = 'Speed = Distance ÷ Time';
      calculation = `${distance} ${distanceUnit} ÷ ${time} ${timeUnit} = ${result.toFixed(2)}`;
      label = 'Speed';
      units = getSpeedUnit(distanceUnit, timeUnit);

      updateSpeedConversions(result, distanceUnit, timeUnit);
    } else if (calculationType === 'distance') {
      const speed = distanceSpeed || 0;
      const time = distanceTime || 0;
      const speedUnit = distanceSpeedUnit;
      const timeUnit = distanceTimeUnit;

      let timeMultiplier = 1;
      if (speedUnit.includes('/h') && timeUnit === 'minutes') timeMultiplier = 1/60;
      if (speedUnit.includes('/h') && timeUnit === 'seconds') timeMultiplier = 1/3600;
      if (speedUnit.includes('/s') && timeUnit === 'minutes') timeMultiplier = 60;
      if (speedUnit.includes('/s') && timeUnit === 'hours') timeMultiplier = 3600;

      result = speed * time * timeMultiplier;

      formula = 'Distance = Speed × Time';
      calculation = `${speed} ${speedUnit} × ${time} ${timeUnit} = ${result.toFixed(2)}`;
      label = 'Distance';
      units = getDistanceUnit(speedUnit);

      updateDistanceConversions(result, getDistanceUnit(speedUnit));
    } else if (calculationType === 'time') {
      const distance = timeDistance || 0;
      const speed = timeSpeed || 0;
      const distanceUnit = timeDistanceUnit;
      const speedUnit = timeSpeedUnit;

      if (speed > 0) {
        result = distance / speed;
      }

      formula = 'Time = Distance ÷ Speed';
      calculation = `${distance} ${distanceUnit} ÷ ${speed} ${speedUnit} = ${result.toFixed(2)}`;
      label = 'Time';
      units = getTimeUnit(speedUnit);

      updateTimeConversions(result, getTimeUnit(speedUnit));
    }

    setMainResult(parseFloat(result.toFixed(2)));
    setResultLabel(label);
    setResultUnits(units);
    setFormulaUsed(formula);
    setCalculationSteps(calculation);
  };

  const applyExample = (type: CalculationType, data: any) => {
    setCalculationType(type);

    if (type === 'speed') {
      setSpeedDistance(data.d);
      setSpeedTime(data.t);
      setSpeedDistanceUnit(data.du);
      setSpeedTimeUnit(data.tu);
    } else if (type === 'distance') {
      setDistanceSpeed(data.s);
      setDistanceTime(data.t);
      setDistanceSpeedUnit(data.su);
      setDistanceTimeUnit(data.tu);
    } else if (type === 'time') {
      setTimeDistance(data.d);
      setTimeSpeed(data.s);
      setTimeDistanceUnit(data.du);
      setTimeSpeedUnit(data.su);
    }
  };

  const getPrimaryResultCardClass = () => {
    if (calculationType === 'speed') {
      return 'bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4 border-2 border-violet-200';
    } else if (calculationType === 'distance') {
      return 'bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4 border-2 border-blue-200';
    } else {
      return 'bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4 border-2 border-green-200';
    }
  };

  const getResultTextColor = () => {
    if (calculationType === 'speed') return 'text-violet-700';
    if (calculationType === 'distance') return 'text-blue-700';
    return 'text-green-700';
  };

  // Schema.org structured data
  const webAppSchema = generateWebAppSchema(
    'Speed Calculator',
    'Calculate speed, distance, or time with multiple unit conversions. Supports km/h, mph, m/s, and more.',
    'https://example.com/us/tools/calculators/speed-calculator',
    'Utility'
  );

  return (
    <article className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Header */}
      <div className="text-center mb-6 md:mb-8 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3">
          {getH1('Speed Calculator')}
        </h1>
        <p className="text-sm md:text-base text-violet-100">
          {getSubHeading('Calculate speed, distance, or time with multiple unit conversions')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Calculator Form */}
        <div className="lg:col-span-2">
          {/* Calculation Mode Selector */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              What do you want to calculate?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="calculationType"
                  value="speed"
                  className="peer sr-only"
                  checked={calculationType === 'speed'}
                  onChange={(e) => setCalculationType(e.target.value as CalculationType)}
                />
                <div className="p-3 md:p-4 border-2 border-gray-300 rounded-xl peer-checked:border-violet-600 peer-checked:bg-violet-50 transition-all hover:border-violet-400">
                  <div className="text-base md:text-lg font-semibold text-gray-900">Calculate Speed</div>
                  <div className="text-xs md:text-sm text-gray-500">Distance ÷ Time</div>
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="calculationType"
                  value="distance"
                  className="peer sr-only"
                  checked={calculationType === 'distance'}
                  onChange={(e) => setCalculationType(e.target.value as CalculationType)}
                />
                <div className="p-3 md:p-4 border-2 border-gray-300 rounded-xl peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all hover:border-blue-400">
                  <div className="text-base md:text-lg font-semibold text-gray-900">Calculate Distance</div>
                  <div className="text-xs md:text-sm text-gray-500">Speed × Time</div>
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="calculationType"
                  value="time"
                  className="peer sr-only"
                  checked={calculationType === 'time'}
                  onChange={(e) => setCalculationType(e.target.value as CalculationType)}
                />
                <div className="p-3 md:p-4 border-2 border-gray-300 rounded-xl peer-checked:border-green-600 peer-checked:bg-green-50 transition-all hover:border-green-400">
                  <div className="text-base md:text-lg font-semibold text-gray-900">Calculate Time</div>
                  <div className="text-xs md:text-sm text-gray-500">Distance ÷ Speed</div>
                </div>
              </label>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Input Forms */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
            {/* Speed Form */}
            {calculationType === 'speed' && (
              <div className="space-y-4">
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Calculate Speed</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label htmlFor="speedDistance" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Distance</label>
                    <div className="relative">
                      <input
                        type="number"
                        id="speedDistance"
                        className="w-full pr-16 md:pr-20 pl-3 md:pl-4 py-2 md:py-2.5 text-sm md:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                        value={speedDistance}
                        onChange={(e) => setSpeedDistance(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                      <select
                        id="speedDistanceUnit"
                        className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-xs md:text-sm focus:ring-0"
                        value={speedDistanceUnit}
                        onChange={(e) => setSpeedDistanceUnit(e.target.value)}
                      >
                        <option value="km">km</option>
                        <option value="miles">miles</option>
                        <option value="meters">meters</option>
                        <option value="feet">feet</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="speedTime" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Time</label>
                    <div className="relative">
                      <input
                        type="number"
                        id="speedTime"
                        className="w-full pr-16 md:pr-20 pl-3 md:pl-4 py-2 md:py-2.5 text-sm md:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                        value={speedTime}
                        onChange={(e) => setSpeedTime(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                      <select
                        id="speedTimeUnit"
                        className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-xs md:text-sm focus:ring-0"
                        value={speedTimeUnit}
                        onChange={(e) => setSpeedTimeUnit(e.target.value)}
                      >
                        <option value="hours">hours</option>
                        <option value="minutes">minutes</option>
                        <option value="seconds">seconds</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="text-xs md:text-sm text-gray-600 bg-violet-50 p-2 md:p-3 rounded-lg">
                  <span className="font-medium">Formula:</span> Speed = Distance ÷ Time
                </div>
              </div>
            )}

            {/* Distance Form */}
            {calculationType === 'distance' && (
              <div className="space-y-4">
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Calculate Distance</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label htmlFor="distanceSpeed" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Speed</label>
                    <div className="relative">
                      <input
                        type="number"
                        id="distanceSpeed"
                        className="w-full pr-16 md:pr-20 pl-3 md:pl-4 py-2 md:py-2.5 text-sm md:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={distanceSpeed}
                        onChange={(e) => setDistanceSpeed(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                      <select
                        id="distanceSpeedUnit"
                        className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-xs md:text-sm focus:ring-0"
                        value={distanceSpeedUnit}
                        onChange={(e) => setDistanceSpeedUnit(e.target.value)}
                      >
                        <option value="km/h">km/h</option>
                        <option value="mph">mph</option>
                        <option value="m/s">m/s</option>
                        <option value="ft/s">ft/s</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="distanceTime" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Time</label>
                    <div className="relative">
                      <input
                        type="number"
                        id="distanceTime"
                        className="w-full pr-16 md:pr-20 pl-3 md:pl-4 py-2 md:py-2.5 text-sm md:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={distanceTime}
                        onChange={(e) => setDistanceTime(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                      <select
                        id="distanceTimeUnit"
                        className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-xs md:text-sm focus:ring-0"
                        value={distanceTimeUnit}
                        onChange={(e) => setDistanceTimeUnit(e.target.value)}
                      >
                        <option value="hours">hours</option>
                        <option value="minutes">minutes</option>
                        <option value="seconds">seconds</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="text-xs md:text-sm text-gray-600 bg-blue-50 p-2 md:p-3 rounded-lg">
                  <span className="font-medium">Formula:</span> Distance = Speed × Time
                </div>
              </div>
            )}

            {/* Time Form */}
            {calculationType === 'time' && (
              <div className="space-y-4">
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Calculate Time</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label htmlFor="timeDistance" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Distance</label>
                    <div className="relative">
                      <input
                        type="number"
                        id="timeDistance"
                        className="w-full pr-16 md:pr-20 pl-3 md:pl-4 py-2 md:py-2.5 text-sm md:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={timeDistance}
                        onChange={(e) => setTimeDistance(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                      <select
                        id="timeDistanceUnit"
                        className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-xs md:text-sm focus:ring-0"
                        value={timeDistanceUnit}
                        onChange={(e) => setTimeDistanceUnit(e.target.value)}
                      >
                        <option value="km">km</option>
                        <option value="miles">miles</option>
                        <option value="meters">meters</option>
                        <option value="feet">feet</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="timeSpeed" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Speed</label>
                    <div className="relative">
                      <input
                        type="number"
                        id="timeSpeed"
                        className="w-full pr-16 md:pr-20 pl-3 md:pl-4 py-2 md:py-2.5 text-sm md:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={timeSpeed}
                        onChange={(e) => setTimeSpeed(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                      <select
                        id="timeSpeedUnit"
                        className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-xs md:text-sm focus:ring-0"
                        value={timeSpeedUnit}
                        onChange={(e) => setTimeSpeedUnit(e.target.value)}
                      >
                        <option value="km/h">km/h</option>
                        <option value="mph">mph</option>
                        <option value="m/s">m/s</option>
                        <option value="ft/s">ft/s</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="text-xs md:text-sm text-gray-600 bg-green-50 p-2 md:p-3 rounded-lg">
                  <span className="font-medium">Formula:</span> Time = Distance ÷ Speed
                </div>
              </div>
            )}
          </div>

          {/* Quick Examples */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              Quick Examples
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
              <button
                className="text-left p-3 bg-gray-50 rounded-lg hover:bg-violet-50 hover:border-violet-300 border-2 border-transparent transition-all"
                onClick={() => applyExample('speed', { d: 100, t: 2, du: 'km', tu: 'hours' })}
              >
                <div className="font-medium text-sm md:text-base">Highway Speed</div>
                <div className="text-xs text-gray-600">100 km in 2 hours</div>
                <div className="text-violet-600 font-semibold text-xs md:text-sm">= 50 km/h</div>
              </button>

              <button
                className="text-left p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-300 border-2 border-transparent transition-all"
                onClick={() => applyExample('distance', { s: 65, t: 3, su: 'mph', tu: 'hours' })}
              >
                <div className="font-medium text-sm md:text-base">Road Trip</div>
                <div className="text-xs text-gray-600">65 mph for 3 hours</div>
                <div className="text-blue-600 font-semibold text-xs md:text-sm">= 195 miles</div>
              </button>

              <button
                className="text-left p-3 bg-gray-50 rounded-lg hover:bg-green-50 hover:border-green-300 border-2 border-transparent transition-all"
                onClick={() => applyExample('time', { d: 300, s: 75, du: 'miles', su: 'mph' })}
              >
                <div className="font-medium text-sm md:text-base">Travel Time</div>
                <div className="text-xs text-gray-600">300 miles at 75 mph</div>
                <div className="text-green-600 font-semibold text-xs md:text-sm">= 4 hours</div>
              </button>

              <button
                className="text-left p-3 bg-gray-50 rounded-lg hover:bg-violet-50 hover:border-violet-300 border-2 border-transparent transition-all"
                onClick={() => applyExample('speed', { d: 100, t: 10, du: 'meters', tu: 'seconds' })}
              >
                <div className="font-medium text-sm md:text-base">Running Speed</div>
                <div className="text-xs text-gray-600">100m in 10 seconds</div>
                <div className="text-violet-600 font-semibold text-xs md:text-sm">= 10 m/s</div>
              </button>
            </div>
          </div>
</div>

        {/* Results Panel - NOT sticky */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              Results
            </h3>

            {/* Primary Result */}
            <div className={getPrimaryResultCardClass()}>
              <div className="text-xs md:text-sm text-gray-600 mb-1">{resultLabel}</div>
              <div className={`text-2xl md:text-3xl font-bold ${getResultTextColor()} mb-1`}>{mainResult}</div>
              <div className="text-xs md:text-sm text-gray-500">{resultUnits}</div>
            </div>

            {/* Calculation Details */}
            <div className="bg-gray-50 rounded-lg p-2 md:p-3 mb-3 md:mb-4 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Formula Used</div>
              <div className="text-xs md:text-sm font-mono text-gray-900">{formulaUsed}</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-2 md:p-3 mb-3 md:mb-4 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Calculation</div>
              <div className="text-xs md:text-sm font-mono text-gray-900">{calculationSteps}</div>
            </div>

            {/* Unit Conversions */}
            <div>
              {/* Speed Conversions */}
              {calculationType === 'speed' && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2 md:mb-3">Speed Conversions</h4>
                  <div className="space-y-2 text-xs md:text-sm">
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>km/h:</span>
                      <span className="font-semibold">{speedConversions.kmh}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>mph:</span>
                      <span className="font-semibold">{speedConversions.mph}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>m/s:</span>
                      <span className="font-semibold">{speedConversions.ms}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>ft/s:</span>
                      <span className="font-semibold">{speedConversions.fts}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>knots:</span>
                      <span className="font-semibold">{speedConversions.knots}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Distance Conversions */}
              {calculationType === 'distance' && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2 md:mb-3">Distance Conversions</h4>
                  <div className="space-y-2 text-xs md:text-sm">
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>km:</span>
                      <span className="font-semibold">{distanceConversions.km}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>miles:</span>
                      <span className="font-semibold">{distanceConversions.miles}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>meters:</span>
                      <span className="font-semibold">{distanceConversions.meters.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>feet:</span>
                      <span className="font-semibold">{distanceConversions.feet.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Time Conversions */}
              {calculationType === 'time' && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2 md:mb-3">Time Conversions</h4>
                  <div className="space-y-2 text-xs md:text-sm">
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Hours:</span>
                      <span className="font-semibold">{timeConversions.hours}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Minutes:</span>
                      <span className="font-semibold">{timeConversions.minutes}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Seconds:</span>
                      <span className="font-semibold">{timeConversions.seconds.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Speed Reference Table */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
        <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6">
          Speed Reference
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="p-3 md:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Walking</div>
            <div className="text-blue-700 font-bold text-base md:text-lg">5 km/h</div>
            <div className="text-xs text-gray-600">3.1 mph</div>
          </div>

          <div className="p-3 md:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Running</div>
            <div className="text-green-700 font-bold text-base md:text-lg">12 km/h</div>
            <div className="text-xs text-gray-600">7.5 mph</div>
          </div>

          <div className="p-3 md:p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Cycling</div>
            <div className="text-orange-700 font-bold text-base md:text-lg">20 km/h</div>
            <div className="text-xs text-gray-600">12.4 mph</div>
          </div>

          <div className="p-3 md:p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="font-semibold text-gray-900 mb-1 text-sm md:text-base">City Driving</div>
            <div className="text-purple-700 font-bold text-base md:text-lg">50 km/h</div>
            <div className="text-xs text-gray-600">31 mph</div>
          </div>

          <div className="p-3 md:p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg border border-red-200">
            <div className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Highway</div>
            <div className="text-red-700 font-bold text-base md:text-lg">100 km/h</div>
            <div className="text-xs text-gray-600">62 mph</div>
          </div>

          <div className="p-3 md:p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
            <div className="font-semibold text-gray-900 mb-1 text-sm md:text-base">High Speed Train</div>
            <div className="text-cyan-700 font-bold text-base md:text-lg">300 km/h</div>
            <div className="text-xs text-gray-600">186 mph</div>
          </div>

          <div className="p-3 md:p-4 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-lg border border-indigo-200">
            <div className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Commercial Jet</div>
            <div className="text-indigo-700 font-bold text-base md:text-lg">900 km/h</div>
            <div className="text-xs text-gray-600">559 mph</div>
          </div>

          <div className="p-3 md:p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg border border-gray-300">
            <div className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Sound</div>
            <div className="text-gray-700 font-bold text-base md:text-lg">1,235 km/h</div>
            <div className="text-xs text-gray-600">767 mph</div>
          </div>
        </div>
      </div>

      

      {/* Mobile MREC2 - Before FAQs */}


      

      <CalculatorMobileMrec2 />



      

      {/* FAQ Section */}
      <FirebaseFAQs pageId="speed-calculator" fallbackFaqs={fallbackFaqs} className="mb-6 md:mb-8" />

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      {relatedCalculators.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mt-6 md:mt-8">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">Related Science Calculators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedCalculators.map((calc, index) => (
              <Link
                key={index}
                href={calc.href}
                className="block p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-1">{calc.title}</h3>
                <p className="text-sm text-gray-600">{calc.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
