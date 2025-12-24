'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
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

const calculationMethods = [
  { value: 'standard', label: 'Standard', description: '220 - Age formula', emoji: '📊' },
  { value: 'karvonen', label: 'Karvonen', description: 'Heart Rate Reserve method', emoji: '❤️' },
  { value: 'tanaka', label: 'Tanaka', description: '208 - (0.7 × Age) formula', emoji: '🔬' },
];

const zoneInfo = [
  {
    zone: 1,
    name: 'Recovery',
    intensity: 'Very Light',
    percent: '50-60%',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300',
    description: 'Warm-up, cool-down, active recovery',
    benefits: 'Improves overall health, aids recovery',
    duration: '20-60 min'
  },
  {
    zone: 2,
    name: 'Fat Burn',
    intensity: 'Light',
    percent: '60-70%',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
    description: 'Long, easy endurance training',
    benefits: 'Burns fat, builds aerobic base',
    duration: '30-90 min'
  },
  {
    zone: 3,
    name: 'Cardio',
    intensity: 'Moderate',
    percent: '70-80%',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-300',
    description: 'Tempo runs, moderate intensity',
    benefits: 'Improves aerobic fitness, efficiency',
    duration: '20-45 min'
  },
  {
    zone: 4,
    name: 'Threshold',
    intensity: 'Hard',
    percent: '80-90%',
    color: 'orange',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-300',
    description: 'Interval training, race pace',
    benefits: 'Increases speed, lactate threshold',
    duration: '10-30 min'
  },
  {
    zone: 5,
    name: 'VO2 Max',
    intensity: 'Maximum',
    percent: '90-100%',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-300',
    description: 'Sprint intervals, all-out effort',
    benefits: 'Maximum performance, anaerobic power',
    duration: '1-5 min intervals'
  },
];

export default function HeartRateZoneCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('heart-rate-zone-calculator');

  const [age, setAge] = useState(30);
  const [restingHR, setRestingHR] = useState(60);
  const [method, setMethod] = useState('standard');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);

  const [zones, setZones] = useState({
    maxHR: 190,
    zone1: { min: 95, max: 114 },
    zone2: { min: 114, max: 133 },
    zone3: { min: 133, max: 152 },
    zone4: { min: 152, max: 171 },
    zone5: { min: 171, max: 190 }
  });

  useEffect(() => {
    calculateZones();
  }, [age, restingHR, method]);

  const calculateZones = () => {
    let maxHR;

    if (method === 'tanaka') {
      maxHR = Math.round(208 - (0.7 * age));
    } else {
      maxHR = 220 - age;
    }

    if (method === 'karvonen') {
      const hrReserve = maxHR - restingHR;
      setZones({
        maxHR,
        zone1: { min: Math.round(restingHR + hrReserve * 0.5), max: Math.round(restingHR + hrReserve * 0.6) },
        zone2: { min: Math.round(restingHR + hrReserve * 0.6), max: Math.round(restingHR + hrReserve * 0.7) },
        zone3: { min: Math.round(restingHR + hrReserve * 0.7), max: Math.round(restingHR + hrReserve * 0.8) },
        zone4: { min: Math.round(restingHR + hrReserve * 0.8), max: Math.round(restingHR + hrReserve * 0.9) },
        zone5: { min: Math.round(restingHR + hrReserve * 0.9), max: maxHR }
      });
    } else {
      setZones({
        maxHR,
        zone1: { min: Math.round(maxHR * 0.5), max: Math.round(maxHR * 0.6) },
        zone2: { min: Math.round(maxHR * 0.6), max: Math.round(maxHR * 0.7) },
        zone3: { min: Math.round(maxHR * 0.7), max: Math.round(maxHR * 0.8) },
        zone4: { min: Math.round(maxHR * 0.8), max: Math.round(maxHR * 0.9) },
        zone5: { min: Math.round(maxHR * 0.9), max: maxHR }
      });
    }
  };

  const getZoneData = (zoneNum: number) => {
    const zoneKey = `zone${zoneNum}` as keyof typeof zones;
    return zones[zoneKey] as { min: number; max: number };
  };

  const fallbackFaqs = [
    {
    id: '1',
    question: "What are heart rate zones and why do they matter?",
      answer: "Heart rate zones are ranges of heart beats per minute that correspond to different exercise intensities. Training in different zones produces different physiological benefits - Zone 2 builds your aerobic base and burns fat, Zone 3-4 improves cardiovascular fitness, and Zone 5 develops maximum power. Using zones helps you train smarter, not just harder.",
    order: 1
  },
    {
    id: '2',
    question: "How do I find my resting heart rate?",
      answer: "Measure your resting heart rate first thing in the morning before getting out of bed. Place two fingers on your wrist (radial artery) or neck (carotid artery) and count beats for 60 seconds. Do this for several days and take the average. Fitness trackers can also measure this automatically. A typical resting HR is 60-100 bpm; athletes often have 40-60 bpm.",
    order: 2
  },
    {
    id: '3',
    question: "Which calculation method should I use?",
      answer: "The Karvonen method is most accurate as it accounts for your resting heart rate (fitness level). The Standard (220-age) and Tanaka formulas are simpler but less personalized. If you know your resting HR, use Karvonen. The Tanaka formula may be more accurate for older adults than the standard 220-age formula.",
    order: 3
  },
    {
    id: '4',
    question: "How long should I train in each zone?",
      answer: "For general fitness: spend 80% of training time in Zones 1-2 (easy aerobic), and 20% in Zones 4-5 (high intensity). Beginners should focus on Zone 2 to build an aerobic base. For fat loss, Zone 2 is most efficient. For performance, mix Zone 2 base training with Zone 4-5 intervals. Recovery days should stay in Zone 1.",
    order: 4
  },
    {
    id: '5',
    question: "Is the 220-age formula accurate?",
      answer: "The 220-age formula provides a rough estimate but can be off by 10-20 bpm for individuals. It's a population average, not personalized. For more accuracy, get a max HR test at a sports lab, use the Tanaka formula (208 - 0.7 × age), or find your actual max HR during an all-out effort (consult a doctor first if you have health concerns).",
    order: 5
  }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-3 xs:px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">{getH1('Heart Rate Zone Calculator')}</h1>
        <p className="text-sm sm:text-base text-gray-600">Calculate your personalized heart rate training zones for optimal fitness</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-4 md:mb-6">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Input Section */}
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Your Information</h3>

            {/* Age Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age: {age} years</label>
              <input
                type="range"
                min="15"
                max="80"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>15</span>
                <span>80</span>
              </div>
            </div>

            {/* Resting Heart Rate Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resting Heart Rate: {restingHR} bpm</label>
              <input
                type="range"
                min="40"
                max="100"
                value={restingHR}
                onChange={(e) => setRestingHR(parseInt(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-red-200 to-red-400 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>40 (Athletic)</span>
                <span>100 (High)</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Measure first thing in the morning before getting out of bed
              </p>
            </div>

            {/* Calculation Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Calculation Method</label>
              <div className="grid grid-cols-3 gap-2">
                {calculationMethods.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMethod(m.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      method === m.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg">{m.emoji}</div>
                    <div className="text-xs font-medium">{m.label}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {calculationMethods.find(m => m.value === method)?.description}
              </p>
            </div>

            {/* Max HR Result Card */}
            <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-xl p-5 text-white text-center">
              <div className="text-sm opacity-80 mb-1">Maximum Heart Rate</div>
              <div className="text-4xl sm:text-5xl font-bold">{zones.maxHR}</div>
              <div className="text-sm opacity-80 mt-1">beats per minute</div>
              <div className="text-xs opacity-70 mt-2">
                {method === 'tanaka' ? '208 - (0.7 × Age)' : '220 - Age'} formula
              </div>
            </div>

            {/* Heart Rate Reserve (for Karvonen) */}
            {method === 'karvonen' && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="text-sm font-semibold text-purple-800 mb-2">Heart Rate Reserve (HRR)</div>
                <div className="text-2xl font-bold text-purple-600">{zones.maxHR - restingHR} bpm</div>
                <p className="text-xs text-purple-700 mt-2">
                  HRR = Max HR ({zones.maxHR}) - Resting HR ({restingHR})
                </p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Your Training Zones</h3>

            {/* Zone Cards */}
            <div className="space-y-3">
              {zoneInfo.map((info) => {
                const zoneData = getZoneData(info.zone);
                return (
                  <button
                    key={info.zone}
                    onClick={() => setSelectedZone(selectedZone === info.zone ? null : info.zone)}
                    className={`w-full text-left p-4 ${info.bgColor} rounded-xl border-2 ${info.borderColor} transition-all hover:shadow-md`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className={`font-semibold ${info.textColor}`}>
                          Zone {info.zone} - {info.name}
                        </div>
                        <div className="text-xs text-gray-500">{info.intensity} ({info.percent})</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${info.textColor}`}>
                          {zoneData.min}-{zoneData.max}
                        </div>
                        <div className="text-xs text-gray-500">bpm</div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedZone === info.zone && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Activity:</span>
                            <p className={`font-medium ${info.textColor}`}>{info.description}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Duration:</span>
                            <p className={`font-medium ${info.textColor}`}>{info.duration}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-gray-500 text-xs">Benefits:</span>
                          <p className={`text-xs font-medium ${info.textColor}`}>{info.benefits}</p>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Visual Zone Bar */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">Zone Distribution</h4>
              <div className="flex h-8 rounded-lg overflow-hidden">
                <div className="bg-gray-400 flex-1 flex items-center justify-center text-white text-xs font-medium">Z1</div>
                <div className="bg-blue-400 flex-1 flex items-center justify-center text-white text-xs font-medium">Z2</div>
                <div className="bg-green-400 flex-1 flex items-center justify-center text-white text-xs font-medium">Z3</div>
                <div className="bg-orange-400 flex-1 flex items-center justify-center text-white text-xs font-medium">Z4</div>
                <div className="bg-red-400 flex-1 flex items-center justify-center text-white text-xs font-medium">Z5</div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{zones.zone1.min} bpm</span>
                <span>{zones.maxHR} bpm</span>
              </div>
            </div>

            {/* Training Recommendation */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Training Recommendation</h4>
              <div className="text-sm text-blue-700">
                <p className="mb-2"><strong>80/20 Rule:</strong> Spend 80% of training in Zone 1-2 and 20% in Zone 4-5</p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-white rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-green-600">{zones.zone2.min}-{zones.zone2.max}</div>
                    <div className="text-xs text-gray-500">Fat Burning Zone</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-orange-600">{zones.zone4.min}-{zones.zone4.max}</div>
                    <div className="text-xs text-gray-500">Performance Zone</div>
                  </div>
</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* SEO Content Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Understanding Heart Rate Training Zones</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
          Heart rate training zones are the foundation of effective cardiovascular exercise. By training at specific heart rate ranges, you can target different physiological adaptations - from building an aerobic base and burning fat in lower zones, to improving speed and power in higher zones. Understanding and using your personalized heart rate zones helps you train smarter, avoid overtraining, and achieve your fitness goals more efficiently than simply exercising at random intensities.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-red-50 rounded-lg p-3 sm:p-4 border border-red-100">
            <h3 className="font-semibold text-red-800 mb-2 text-sm sm:text-base">Maximum Heart Rate</h3>
            <p className="text-xs text-gray-600">The highest number of beats per minute your heart can achieve during maximal exertion. Used as the reference point for calculating all training zones.</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Heart Rate Reserve</h3>
            <p className="text-xs text-gray-600">The difference between your maximum and resting heart rate. Used in the Karvonen method for more personalized zone calculations based on fitness level.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Training Zones</h3>
            <p className="text-xs text-gray-600">Five distinct heart rate ranges (Zones 1-5) that correspond to different exercise intensities and produce specific physiological adaptations.</p>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">The Five Heart Rate Training Zones</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-3 sm:mb-4 md:mb-6">
          <p className="text-sm text-gray-600 mb-3">Each training zone serves a specific purpose in your fitness development:</p>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-gray-700">Zone 1 - Recovery</span>
                <span className="text-xs text-gray-500">(50-60% max HR)</span>
              </div>
              <p className="text-xs text-gray-600">Very light intensity for active recovery, warm-ups, and cool-downs. Helps flush out metabolic waste and promotes recovery between harder workouts.</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-gray-700">Zone 2 - Aerobic Base</span>
                <span className="text-xs text-gray-500">(60-70% max HR)</span>
              </div>
              <p className="text-xs text-gray-600">Light intensity that builds aerobic endurance, improves fat metabolism, and strengthens the cardiovascular system. This is the foundation zone where most training should occur (60-80% of total training time).</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-gray-700">Zone 3 - Tempo</span>
                <span className="text-xs text-gray-500">(70-80% max HR)</span>
              </div>
              <p className="text-xs text-gray-600">Moderate intensity that improves aerobic capacity and muscular endurance. Sustainable for longer periods but shouldn't dominate your training.</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-gray-700">Zone 4 - Threshold</span>
                <span className="text-xs text-gray-500">(80-90% max HR)</span>
              </div>
              <p className="text-xs text-gray-600">Hard intensity that raises your lactate threshold and improves high-intensity performance. Used for interval training and tempo runs. Uncomfortable but sustainable for limited periods.</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-gray-700">Zone 5 - Maximum</span>
                <span className="text-xs text-gray-500">(90-100% max HR)</span>
              </div>
              <p className="text-xs text-gray-600">Maximum intensity for short bursts that develop speed, power, and anaerobic capacity. Used sparingly in sprint intervals. Only sustainable for very short durations.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Calculation Methods Explained</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <span className="text-orange-500 text-lg">📊</span>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">Standard (220 - Age)</h4>
                  <p className="text-xs text-gray-600">The simplest and most widely known formula. Provides a quick estimate but doesn't account for individual fitness level or genetic variation in max heart rate.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <span className="text-red-500 text-lg">❤️</span>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">Karvonen (Heart Rate Reserve)</h4>
                  <p className="text-xs text-gray-600">Most accurate method that uses both resting and max heart rate. Accounts for fitness level since fitter individuals have lower resting heart rates. Recommended if you know your RHR.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <span className="text-purple-500 text-lg">🔬</span>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">Tanaka (208 - 0.7 × Age)</h4>
                  <p className="text-xs text-gray-600">More accurate than the standard formula, especially for older adults and athletes. Based on larger, more diverse population studies published in 2001.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Training Guidelines by Zone</h3>
            <p className="text-sm text-gray-600 mb-3">Effective training distribution for different goals:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                <span className="font-bold text-green-600 w-24 text-xs">Endurance</span>
                <span className="text-xs text-gray-600 flex-1">80% Zone 2, 10% Zone 3-4, 10% Zone 1 recovery</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                <span className="font-bold text-blue-600 w-24 text-xs">Fat Loss</span>
                <span className="text-xs text-gray-600 flex-1">70% Zone 2, 20% Zone 3, 10% Zone 4 intervals</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-orange-50 rounded">
                <span className="font-bold text-orange-600 w-24 text-xs">Performance</span>
                <span className="text-xs text-gray-600 flex-1">60% Zone 2, 20% Zone 4, 15% Zone 5, 5% Zone 1</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-purple-50 rounded">
                <span className="font-bold text-purple-600 w-24 text-xs">Beginners</span>
                <span className="text-xs text-gray-600 flex-1">90% Zone 1-2 for 4-8 weeks to build base fitness</span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Tips for Effective Heart Rate Training</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Use a Heart Rate Monitor</h4>
            <p className="text-xs text-gray-600">Chest straps provide the most accurate real-time HR data. Wrist-based monitors are convenient but less precise during intense exercise. Monitor your HR continuously to stay in target zones.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">Build Your Base First</h4>
            <p className="text-xs text-gray-600">Spend 6-12 weeks in Zone 2 if you're new to training. This develops your aerobic system, fat-burning capacity, and cardiovascular efficiency before adding higher intensity work.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Follow the 80/20 Rule</h4>
            <p className="text-xs text-gray-600">Elite endurance athletes spend 80% of training time in low-intensity zones (1-2) and only 20% at high intensity (4-5). This prevents overtraining and maximizes adaptation.</p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="heart-rate-zone-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
{/* Related Calculators */}
      <div className="mt-6 sm:mt-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Related Health Calculators</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {relatedCalculators.map((calc: RelatedCalculator) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-3 sm:p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className={`w-10 h-10 ${calc.color || 'bg-blue-500'} rounded-lg flex items-center justify-center mb-2`}>
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600">{calc.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mt-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-2xl">⚠️</div>
          <div>
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Important Note</h3>
            <p className="text-xs sm:text-sm text-amber-700">
              These heart rate zones are estimates based on age formulas. Individual maximum heart rate can vary by 10-20 bpm.
              For precise zones, consider a lab-based VO2 max test. If you have heart conditions, high blood pressure, or other health concerns,
              consult a doctor before starting any exercise program. Stop exercising if you feel chest pain, dizziness, or extreme shortness of breath.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
