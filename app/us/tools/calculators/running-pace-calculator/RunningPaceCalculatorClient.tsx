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
    question: "What is a Running Pace Calculator?",
    answer: "A Running Pace Calculator is a free online tool designed to help you quickly and accurately calculate running pace-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Running Pace Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Running Pace Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Running Pace Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function RunningPaceCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('running-pace-calculator');

  const [paceDistance, setPaceDistance] = useState(5);
  const [paceDistanceUnit, setPaceDistanceUnit] = useState('miles');
  const [paceHours, setPaceHours] = useState(0);
  const [paceMinutes, setPaceMinutes] = useState(25);
  const [paceSeconds, setPaceSeconds] = useState(30);

  const [paceResult, setPaceResult] = useState('0:00');
  const [pacePerKm, setPacePerKm] = useState('0:00');
  const [speedMph, setSpeedMph] = useState('0.0');
  const [speedKmh, setSpeedKmh] = useState('0.0');
  const [performanceCategory, setPerformanceCategory] = useState({
    category: 'Enter values to see performance level',
    description: '',
    bgColor: '',
    textColor: ''
  });

  useEffect(() => {
    calculatePace();
  }, [paceDistance, paceDistanceUnit, paceHours, paceMinutes, paceSeconds]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
      return `${minutes}:${String(seconds).padStart(2, '0')}`;
    }
  };

  const formatPace = (paceInSeconds: number): string => {
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = Math.floor(paceInSeconds % 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  const calculatePace = () => {
    const distance = parseFloat(String(paceDistance)) || 0;
    const hours = parseInt(String(paceHours)) || 0;
    const minutes = parseInt(String(paceMinutes)) || 0;
    const seconds = parseInt(String(paceSeconds)) || 0;

    if (distance <= 0 || (hours === 0 && minutes === 0 && seconds === 0)) {
      resetPaceResults();
      return;
    }

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    // Convert distance to miles for pace calculation
    let distanceInMiles = distance;
    if (paceDistanceUnit === 'km') distanceInMiles = distance * 0.621371;
    else if (paceDistanceUnit === 'meters') distanceInMiles = distance * 0.000621371;

    const pacePerMile = totalSeconds / distanceInMiles;
    const pacePerKilometer = totalSeconds / (distanceInMiles / 0.621371);
    const speedMilesPerHour = 3600 / pacePerMile;
    const speedKilometersPerHour = speedMilesPerHour * 1.60934;

    // Update results
    setPaceResult(formatPace(pacePerMile));
    setPacePerKm(formatPace(pacePerKilometer));
    setSpeedMph(speedMilesPerHour.toFixed(1));
    setSpeedKmh(speedKilometersPerHour.toFixed(1));

    // Performance category
    updatePerformanceCategory(pacePerMile);
  };

  const updatePerformanceCategory = (pacePerMile: number) => {
    let category = '';
    let textColor = '';
    let bgColor = '';
    let description = '';

    if (pacePerMile < 360) { // Sub-6:00
      category = 'Elite';
      textColor = 'text-purple-700';
      bgColor = 'bg-purple-100';
      description = 'Elite/Professional level performance';
    } else if (pacePerMile < 450) { // Sub-7:30
      category = 'Highly Competitive';
      textColor = 'text-blue-700';
      bgColor = 'bg-blue-100';
      description = 'Highly competitive club/collegiate level';
    } else if (pacePerMile < 540) { // Sub-9:00
      category = 'Competitive';
      textColor = 'text-green-700';
      bgColor = 'bg-green-100';
      description = 'Competitive recreational runner';
    } else if (pacePerMile < 660) { // Sub-11:00
      category = 'Recreational';
      textColor = 'text-yellow-700';
      bgColor = 'bg-yellow-100';
      description = 'Good recreational fitness level';
    } else {
      category = 'Beginner/Fitness';
      textColor = 'text-orange-700';
      bgColor = 'bg-orange-100';
      description = 'Beginning runner or fitness-focused';
    }

    setPerformanceCategory({
      category,
      description,
      bgColor,
      textColor
    });
  };

  const setDistance = (dist: number, unit: string) => {
    setPaceDistance(dist);
    setPaceDistanceUnit(unit);
  };

  const resetPaceResults = () => {
    setPaceResult('0:00');
    setPacePerKm('0:00');
    setSpeedMph('0.0');
    setSpeedKmh('0.0');
    setPerformanceCategory({
      category: 'Enter values to see performance level',
      description: '',
      bgColor: '',
      textColor: ''
    });
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Running Pace Calculator')}</h1>
        <p className="text-lg text-gray-600">Calculate pace, time, and distance for your running and race planning</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Running Pace Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Calculate Your Running Pace</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  id="paceDistance"
                  step="0.01"
                  min="0"
                  placeholder="5"
                  value={paceDistance}
                  onChange={(e) => setPaceDistance(parseFloat(e.target.value) || 0)}
                  className="flex-1 px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  id="paceDistanceUnit"
                  value={paceDistanceUnit}
                  onChange={(e) => setPaceDistanceUnit(e.target.value)}
                  className="px-2 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="miles">Miles</option>
                  <option value="km">Kilometers</option>
                  <option value="meters">Meters</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Time</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Hours</label>
                  <input
                    type="number"
                    id="paceHours"
                    min="0"
                    max="23"
                    placeholder="0"
                    value={paceHours}
                    onChange={(e) => setPaceHours(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Minutes</label>
                  <input
                    type="number"
                    id="paceMinutes"
                    min="0"
                    max="59"
                    placeholder="25"
                    value={paceMinutes}
                    onChange={(e) => setPaceMinutes(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Seconds</label>
                  <input
                    type="number"
                    id="paceSeconds"
                    min="0"
                    max="59"
                    placeholder="30"
                    value={paceSeconds}
                    onChange={(e) => setPaceSeconds(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Quick Distance Presets */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Common Race Distances</h4>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setDistance(3.1, 'miles')} className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded transition-colors">5K (3.1 mi)</button>
                <button onClick={() => setDistance(6.2, 'miles')} className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded transition-colors">10K (6.2 mi)</button>
                <button onClick={() => setDistance(13.1, 'miles')} className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded transition-colors">Half Marathon</button>
                <button onClick={() => setDistance(26.2, 'miles')} className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded transition-colors">Marathon</button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Pace</h3>

            <div className="space-y-4">
              {/* Main Pace Display */}
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600" id="paceResult">{paceResult}</div>
                <div className="text-green-700">per mile</div>
              </div>

              {/* Alternative Units */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Pace per kilometer:</span>
                  <span id="pacePerKm" className="font-semibold">{pacePerKm}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Speed (mph):</span>
                  <span id="speedMph" className="font-semibold">{speedMph}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Speed (km/h):</span>
                  <span id="speedKmh" className="font-semibold">{speedKmh}</span>
                </div>
              </div>

              {/* Performance Category */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-700 mb-3">Performance Level</h4>
                <div className={`bg-white rounded-lg p-4 ${performanceCategory.bgColor}`} id="performanceCategory">
                  {performanceCategory.description ? (
                    <>
                      <div className={`font-medium ${performanceCategory.textColor} mb-1`}>{performanceCategory.category}</div>
                      <div className={`text-sm ${performanceCategory.textColor}`}>{performanceCategory.description}</div>
                    </>
                  ) : (
                    <span className="font-medium">{performanceCategory.category}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Performance Standards */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">General Performance Standards</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8 text-blue-700">
          <div>
            <h4 className="font-semibold mb-2">5K Pace Guidelines:</h4>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Beginner:</strong> 10:00-12:00 per mile</li>
              <li>• <strong>Recreational:</strong> 8:00-10:00 per mile</li>
              <li>• <strong>Competitive:</strong> 6:30-8:00 per mile</li>
              <li>• <strong>Elite:</strong> Sub-6:00 per mile</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Marathon Pace Guidelines:</h4>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Beginner:</strong> 10:00-12:00 per mile</li>
              <li>• <strong>Recreational:</strong> 8:30-10:00 per mile</li>
              <li>• <strong>Competitive:</strong> 7:00-8:30 per mile</li>
              <li>• <strong>Elite:</strong> Sub-6:00 per mile</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Training Tips */}
      <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-green-800 mb-4">Training Zone Guidelines</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 text-green-700">
          <div>
            <h4 className="font-semibold mb-2">Easy/Recovery</h4>
            <p className="text-sm mb-2">60-70% of weekly miles</p>
            <p className="text-xs">Builds aerobic base, promotes recovery</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Tempo/Threshold</h4>
            <p className="text-sm mb-2">15-20% of weekly miles</p>
            <p className="text-xs">Improves lactate threshold, race pace</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Interval/VO2 Max</h4>
            <p className="text-sm mb-2">5-10% of weekly miles</p>
            <p className="text-xs">Increases maximum oxygen uptake</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Long Run</h4>
            <p className="text-sm mb-2">20-25% of weekly miles</p>
            <p className="text-xs">Builds endurance, mental toughness</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Race Pace</h4>
            <p className="text-sm mb-2">Target race effort</p>
            <p className="text-xs">Practices goal pace, race strategy</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Repetition</h4>
            <p className="text-sm mb-2">Short, fast intervals</p>
            <p className="text-xs">Improves speed, running economy</p>
          </div>
        </div>
      </div>

      {/* Running Science Information */}
      <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Understanding Running Physiology</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-700">VO2 Max</h4>
              <p className="text-sm text-gray-600">Maximum oxygen uptake capacity - determines aerobic power</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-700">Lactate Threshold</h4>
              <p className="text-sm text-gray-600">Point where lactate accumulates faster than removal</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-gray-700">Running Economy</h4>
              <p className="text-sm text-gray-600">Efficiency of oxygen consumption at a given pace</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-gray-700">Aerobic Base</h4>
              <p className="text-sm text-gray-600">Foundation of endurance built through easy, steady running</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Race Distance Characteristics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">5K (3.1 miles)</span>
              <span className="font-semibold text-purple-600">VO2 Max Power</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">10K (6.2 miles)</span>
              <span className="font-semibold text-purple-600">Threshold + VO2</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Half Marathon (13.1 mi)</span>
              <span className="font-semibold text-purple-600">Threshold Pace</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Marathon (26.2 mi)</span>
              <span className="font-semibold text-purple-600">Aerobic Endurance</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Ultra Marathon (50K+)</span>
              <span className="font-semibold text-purple-600">Fat Metabolism</span>
            </div>
          </div>
        </div>
</div>

      {/* Training Plans by Goal */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Training Focus by Race Distance</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-3">5K Training</h4>
            <ul className="space-y-2 text-sm text-red-700">
              <li>• 2-3 speed workouts per week</li>
              <li>• Short intervals (400m-1200m)</li>
              <li>• Emphasis on VO2 max development</li>
              <li>• Total weekly volume: 20-40 miles</li>
              <li>• Race pace practice crucial</li>
            </ul>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <h4 className="font-semibold text-orange-800 mb-3">10K Training</h4>
            <ul className="space-y-2 text-sm text-orange-700">
              <li>• Balance of speed and threshold</li>
              <li>• Tempo runs 2-3 miles</li>
              <li>• Longer intervals (1200m-2 miles)</li>
              <li>• Total weekly volume: 30-50 miles</li>
              <li>• Progressive long runs</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">Half Marathon</h4>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Threshold runs 4-6 miles</li>
              <li>• Long runs up to 15 miles</li>
              <li>• 80% easy pace training</li>
              <li>• Total weekly volume: 40-60 miles</li>
              <li>• Practice race nutrition</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">Marathon</h4>
            <ul className="space-y-2 text-sm text-green-700">
              <li>• Long runs 18-22 miles</li>
              <li>• 85% easy aerobic pace</li>
              <li>• Back-to-back long runs</li>
              <li>• Total weekly volume: 50-80+ miles</li>
              <li>• Fuel and hydration strategy</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Running Injury Prevention */}
      <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">Injury Prevention & Recovery</h3>
        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2 text-yellow-800">Common Running Injuries</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Runner&apos;s knee (patellofemoral pain)</li>
              <li>• IT band syndrome</li>
              <li>• Plantar fasciitis</li>
              <li>• Shin splints</li>
              <li>• Achilles tendinitis</li>
              <li>• Stress fractures</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2 text-yellow-800">Prevention Strategies</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Increase mileage gradually (10% rule)</li>
              <li>• Include strength training 2-3x/week</li>
              <li>• Proper running form and cadence</li>
              <li>• Quality running shoes (replace every 300-500 miles)</li>
              <li>• Cross-training activities</li>
              <li>• Adequate rest and recovery</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2 text-yellow-800">Recovery Methods</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Easy runs on recovery days</li>
              <li>• Foam rolling and stretching</li>
              <li>• Ice baths or compression</li>
              <li>• Proper nutrition and hydration</li>
              <li>• 7-9 hours of quality sleep</li>
              <li>• Regular massage or self-massage</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Nutrition and Hydration */}
      <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Running Nutrition Guidelines</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-700">Pre-Run (1-3 hours before)</h4>
              <p className="text-sm text-gray-600">Carbs + small amount protein, avoid high fiber/fat</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-700">During Run (&gt;60-90 minutes)</h4>
              <p className="text-sm text-gray-600">30-60g carbs/hour, 150-250ml fluid every 15-20 min</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-gray-700">Post-Run (within 30 minutes)</h4>
              <p className="text-sm text-gray-600">3:1 or 4:1 carb to protein ratio for recovery</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Running Form Tips</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Cadence (steps/minute)</span>
              <span className="font-semibold text-purple-600">170-180</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Foot strike</span>
              <span className="font-semibold text-purple-600">Midfoot</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Posture</span>
              <span className="font-semibold text-purple-600">Slight forward lean</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Arm swing</span>
              <span className="font-semibold text-purple-600">90° angle, relaxed</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Breathing</span>
              <span className="font-semibold text-purple-600">Rhythmic, belly breathing</span>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Health Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">❤️</div>
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
        <FirebaseFAQs pageId="running-pace-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
