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
    question: "How many miles is 10,000 steps?",
    answer: "For most people, 10,000 steps equals approximately 4.5 to 5 miles, depending on stride length. Men (average stride 2.5 feet) typically cover about 4.7 miles, while women (average stride 2.2 feet) cover approximately 4.2 miles. However, individual stride length varies based on height, leg length, walking speed, and terrain. For precise measurements, calculate your personal stride length by measuring the distance of 10 steps and dividing by 10, then multiply your steps by your stride length.",
    order: 1
  },
  {
    id: '2',
    question: "What factors affect stride length?",
    answer: "Stride length is influenced by multiple factors: 1) Height and leg length - taller people typically have longer strides (approximately 41-45% of height). 2) Gender - men average 2.5 feet vs. women's 2.2 feet. 3) Walking speed - faster walking increases stride length by up to 30%. 4) Age - stride length tends to decrease with age. 5) Terrain - uphill walking shortens stride, downhill lengthens it. 6) Fatigue and fitness level - tired individuals take shorter steps. 7) Purpose - purposeful walking (exercise) typically has longer strides than casual strolling.",
    order: 2
  },
  {
    id: '3',
    question: "How accurate are fitness tracker step counts?",
    answer: "Most modern fitness trackers are 90-95% accurate for step counting during normal walking, but accuracy varies by activity. They're most accurate during consistent walking on flat surfaces, but can miscount during activities involving arm movements (cooking, typing), may undercount during slow walking or shuffling, and sometimes overcount during driving on bumpy roads or certain arm exercises. For distance calculations, trackers use estimated stride lengths unless you manually calibrate them. To improve accuracy: 1) Wear the tracker snugly on your non-dominant wrist. 2) Calibrate by measuring your actual stride length. 3) Update your height and weight in the app. 4) Walk naturally with normal arm swing.",
    order: 3
  },
  {
    id: '4',
    question: "What is a good daily step goal?",
    answer: "Daily step goals should be personalized to your fitness level and lifestyle. General guidelines: 5,000 steps = sedentary baseline (≈2.5 miles); 7,500 steps = moderately active (≈3.75 miles); 10,000 steps = active lifestyle (≈5 miles) - the popular goal promoting general health; 12,500+ steps = highly active (≈6+ miles) - for fitness enthusiasts. Research shows health benefits start at 4,000-5,000 steps daily for older adults, while 7,000-8,000 steps reduce mortality risk significantly. For weight loss, aim for 10,000-12,000 steps. Start with your current average and increase by 500-1,000 steps weekly to avoid injury.",
    order: 4
  },
  {
    id: '5',
    question: "How can I measure my stride length accurately?",
    answer: "To measure your stride length accurately: Method 1 (Most Accurate): Mark a starting point, walk 10 natural steps at your normal pace, mark the ending point, measure the total distance in feet/meters, and divide by 10. Method 2 (Height-Based Estimate): For walking - multiply height in inches by 0.413 (women) or 0.415 (men). For running - multiply by 0.413 for women or 0.415 for men. Method 3 (Track Test): Walk a known distance (like a 400m track = 1,312 feet), count your steps, divide distance by step count. Tips for accurate measurement: Walk at your typical everyday pace, measure on flat, level ground, take multiple measurements and average them, and remeasure every few months as fitness improves.",
    order: 5
  },
  {
    id: '6',
    question: "Do steps count differently for walking vs. running?",
    answer: "Yes, walking and running have significantly different stride mechanics. Running stride length is typically 1.2-1.5× longer than walking stride due to the flight phase where both feet leave the ground. For the same distance, you'll take 25-35% fewer steps running than walking. Example: 1 mile walking (2.2 ft stride) = ~2,400 steps; 1 mile running (3.3 ft stride) = ~1,600 steps. However, running burns approximately 2× more calories per mile than walking due to higher intensity. Most fitness trackers detect the difference automatically and adjust calculations. For mixed workouts, consider using separate stride length measurements for walking vs. running for most accurate distance tracking.",
    order: 6
  }
];

export default function StepsToMilesCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('steps-to-miles-calculator');

  const [steps, setSteps] = useState<string>('10000');
  const [strideLength, setStrideLength] = useState<string>('2.5');
  const [strideUnit, setStrideUnit] = useState<string>('feet');
  const [results, setResults] = useState({
    miles: '0',
    kilometers: '0',
    feet: '0 ft',
    yards: '0 yd',
    meters: '0 m',
    stepsDisplay: '0',
    calories: '0'
  });
  const [goalDistances, setGoalDistances] = useState({
    goal5000: '≈ 0 miles',
    goal7500: '≈ 0 miles',
    goal10000: '≈ 0 miles',
    goal12500: '≈ 0 miles'
  });

  const formatNumber = (num: number, decimals: number = 2): string => {
    if (num === 0) return '0';
    return parseFloat(num.toFixed(decimals)).toString();
  };

  const updateGoalDistances = (strideFeet: number) => {
    const goals = [5000, 7500, 10000, 12500];
    const newGoals: any = {};
    goals.forEach(goal => {
      const distance = (goal * strideFeet) / 5280;
      newGoals[`goal${goal}`] = `≈ ${formatNumber(distance, 1)} miles`;
    });
    setGoalDistances(newGoals);
  };

  const calculateDistance = () => {
    const stepsNum = parseFloat(steps) || 0;
    const strideLengthNum = parseFloat(strideLength) || 0;

    if (stepsNum <= 0 || strideLengthNum <= 0) {
      setResults({
        miles: '0',
        kilometers: '0',
        feet: '0 ft',
        yards: '0 yd',
        meters: '0 m',
        stepsDisplay: '0',
        calories: '0'
      });
      setGoalDistances({
        goal5000: '≈ 0 miles',
        goal7500: '≈ 0 miles',
        goal10000: '≈ 0 miles',
        goal12500: '≈ 0 miles'
      });
      return;
    }

    // Convert stride length to feet
    let strideFeet: number;
    switch(strideUnit) {
      case 'feet':
        strideFeet = strideLengthNum;
        break;
      case 'inches':
        strideFeet = strideLengthNum / 12;
        break;
      case 'meters':
        strideFeet = strideLengthNum * 3.28084;
        break;
      case 'cm':
        strideFeet = strideLengthNum / 30.48;
        break;
      default:
        strideFeet = strideLengthNum;
    }

    // Calculate total distance in feet
    const totalFeet = stepsNum * strideFeet;

    // Convert to various units
    const miles = totalFeet / 5280;
    const kilometers = miles * 1.609344;
    const yards = totalFeet / 3;
    const meters = totalFeet * 0.3048;

    // Estimate calories burned (rough approximation: 0.04 calories per step for 150 lb person)
    const calories = Math.round(stepsNum * 0.04);

    // Update results
    setResults({
      miles: formatNumber(miles, 3),
      kilometers: formatNumber(kilometers, 3),
      feet: `${formatNumber(totalFeet, 0)} ft`,
      yards: `${formatNumber(yards, 0)} yd`,
      meters: `${formatNumber(meters, 0)} m`,
      stepsDisplay: stepsNum.toLocaleString(),
      calories: calories.toString()
    });

    // Update goal distances using current stride
    updateGoalDistances(strideFeet);
  };

  const setStride = (length: number, unit: string) => {
    setStrideLength(length.toString());
    setStrideUnit(unit);
  };

  useEffect(() => {
    calculateDistance();
  }, [steps, strideLength, strideUnit]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Steps to Miles Calculator')}</h1>
        <p className="text-lg text-gray-600">Convert your daily steps to miles and kilometers with personalized stride length</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step Information</h2>

            <div>
              <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-2">Number of Steps</label>
              <input
                type="number"
                id="steps"
                min="0"
                placeholder="e.g., 10000"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="strideLength" className="block text-sm font-medium text-gray-700 mb-2">Stride Length</label>
              <div className="flex">
                <input
                  type="number"
                  id="strideLength"
                  step="0.1"
                  min="0"
                  placeholder="2.2"
                  value={strideLength}
                  onChange={(e) => setStrideLength(e.target.value)}
                  className="flex-1 px-2 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  id="strideUnit"
                  value={strideUnit}
                  onChange={(e) => setStrideUnit(e.target.value)}
                  className="px-2 py-3 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="feet">feet</option>
                  <option value="inches">inches</option>
                  <option value="meters">meters</option>
                  <option value="cm">centimeters</option>
                </select>
              </div>
            </div>

            {/* Quick Stride Presets */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Average Stride Lengths</h4>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setStride(2.2, 'feet')} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm">Women: 2.2 ft</button>
                <button onClick={() => setStride(2.5, 'feet')} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm">Men: 2.5 ft</button>
                <button onClick={() => setStride(26, 'inches')} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm">Short: 26 in</button>
                <button onClick={() => setStride(30, 'inches')} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm">Tall: 30 in</button>
              </div>
              <p className="text-xs text-blue-600 mt-2">Click to use average values, or measure your own stride for accuracy</p>
            </div>

            {/* How to Measure Stride */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">How to Measure Your Stride</h4>
              <ol className="text-sm text-yellow-700 space-y-1">
                <li>1. Walk 10 normal steps</li>
                <li>2. Measure the total distance</li>
                <li>3. Divide by 10 for your average stride</li>
              </ol>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Distance Results</h3>

            <div className="space-y-4">
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">{results.miles}</div>
                <div className="text-green-700">Miles</div>
              </div>

              <div className="bg-blue-100 rounded-lg p-4 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">{results.kilometers}</div>
                <div className="text-blue-700">Kilometers</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Feet:</span>
                  <span className="font-semibold">{results.feet}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Yards:</span>
                  <span className="font-semibold">{results.yards}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Meters:</span>
                  <span className="font-semibold">{results.meters}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Total Steps:</span>
                  <span className="font-semibold">{results.stepsDisplay}</span>
                </div>
              </div>

              {/* Fitness Stats */}
              <div className="bg-purple-100 rounded-lg p-4 text-center mt-4">
                <div className="text-lg font-bold text-purple-600">{results.calories}</div>
                <div className="text-purple-700 text-sm">Estimated Calories Burned</div>
                <div className="text-xs text-purple-600 mt-1">(Based on 150 lb person)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Related Calculators */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Health Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {relatedCalculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className={`${calc.color} text-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-300`}
            >
              <h3 className="text-xl font-semibold mb-2">{calc.title}</h3>
              <p className="text-white/90">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding Steps to Miles Conversion</h2>

        <p className="text-gray-700 mb-3 sm:mb-4 md:mb-6">
          Converting steps to miles is essential for tracking your daily physical activity, setting fitness goals, and monitoring progress toward health targets. While the popular "10,000 steps per day" guideline is widely recognized, the actual distance covered varies significantly based on your individual stride length, which depends on height, gender, walking speed, and biomechanics. This calculator provides personalized distance calculations by accounting for your specific stride length, offering more accurate results than generic fitness tracker estimates that use population averages.
        </p>

        {/* Key Concepts */}
        <div className="grid md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">Stride Length</h3>
            <p className="text-sm text-gray-700">
              The distance covered in one step from heel strike to the next heel strike of the same foot. Average values: women 2.2 feet (26 inches), men 2.5 feet (30 inches). Varies by height, leg length, and walking speed. Accurate measurement significantly improves distance calculations.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">Step Counting Accuracy</h3>
            <p className="text-sm text-gray-700">
              Modern accelerometer-based fitness trackers are 90-95% accurate for counting steps during normal walking. Accuracy decreases during slow walking, shuffling, or activities with repetitive arm movements. Calibration with personal stride length improves distance precision.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2">Daily Step Goals</h3>
            <p className="text-sm text-gray-700">
              While 10,000 steps (≈5 miles) is the popular target, research shows health benefits begin at 4,000-5,000 steps. Optimal goals: 7,000-8,000 steps for longevity, 10,000-12,000 for weight loss. Personalize based on fitness level and gradually increase.
            </p>
          </div>
        </div>

        {/* Calculation Formula & Methods */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">Step to Distance Calculation Formula</h3>
        <div className="space-y-3 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2">Basic Distance Formula</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Formula:</strong> Distance = Number of Steps × Stride Length<br />
              <strong>Example:</strong> 10,000 steps × 2.5 feet = 25,000 feet ÷ 5,280 = 4.73 miles
            </p>
            <p className="text-xs text-gray-600">
              This linear calculation assumes consistent stride length throughout your walk. In reality, stride varies slightly with speed, terrain, and fatigue, but averages provide reliable estimates for daily tracking. For mixed walking/running, calculate each activity separately.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-green-800 mb-2">Height-Based Stride Estimation</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Walking Stride:</strong> Height (inches) × 0.413 (women) or × 0.415 (men)<br />
              <strong>Running Stride:</strong> Height (inches) × 0.413 (women) or × 0.415 (men)<br />
              <strong>Example:</strong> 5'8" woman (68 inches): 68 × 0.413 = 28.1 inches (2.34 feet)
            </p>
            <p className="text-xs text-gray-600">
              Height-based formulas provide reasonable estimates when direct measurement isn't possible. However, leg-to-torso ratio affects accuracy—people with longer legs relative to height have proportionally longer strides. Direct measurement remains the gold standard.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2">Measured Stride Length (Most Accurate)</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Method 1:</strong> Walk 10 normal steps, measure total distance, divide by 10<br />
              <strong>Method 2:</strong> Walk a known distance (e.g., 400m track), count steps, calculate: Distance ÷ Steps<br />
              <strong>Tips:</strong> Walk at normal everyday pace, measure on flat ground, average 3 trials
            </p>
            <p className="text-xs text-gray-600">
              Direct measurement accounts for your unique biomechanics, gait pattern, and typical walking speed. Remeasure every 3-6 months as fitness improves—stride length often increases with better conditioning and walking efficiency.
            </p>
          </div>
        </div>

        {/* Factors Affecting Stride Length */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">Factors Affecting Stride Length & Distance</h3>
        <div className="space-y-3 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-100">
            <h4 className="font-semibold text-yellow-800 mb-2">Height & Leg Length (Primary Factor)</h4>
            <p className="text-sm text-gray-700 mb-2">
              Taller individuals naturally have longer strides—stride length correlates strongly with height at approximately 41-45% of total height. Someone 6'0" tall typically has a stride 20-25% longer than someone 5'4".
            </p>
            <p className="text-xs text-gray-600">
              <strong>Impact:</strong> A 6-foot person covers 10,000 steps in ≈5.2 miles vs. ≈4.2 miles for a 5'4" person—1 full mile difference with same step count. Leg-to-torso ratio also matters: longer legs relative to height = longer stride.
            </p>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-100">
            <h4 className="font-semibold text-pink-800 mb-2">Gender Differences</h4>
            <p className="text-sm text-gray-700 mb-2">
              Men average 2.5-foot stride (30 inches), women average 2.2-foot stride (26 inches)—approximately 14% difference at similar heights. This is partly due to average height differences and partly due to biomechanical factors (pelvic width, Q-angle).
            </p>
            <p className="text-xs text-gray-600">
              <strong>Practical Impact:</strong> For 10,000 steps, men average 4.7 miles while women average 4.2 miles. However, individual variation is large—an active 5'10" woman likely has a longer stride than a sedentary 5'6" man. Always measure personally when possible.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2">Walking Speed & Intensity</h4>
            <p className="text-sm text-gray-700 mb-2">
              Walking speed dramatically affects stride length. Casual strolling (2 mph): short stride, ~2.0 feet. Normal walking (3-3.5 mph): average stride, ~2.2-2.5 feet. Brisk walking (4 mph): extended stride, ~2.8-3.0 feet. Power walking (4.5+ mph): long stride, ~3.2+ feet.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Variance:</strong> The same person's stride can vary 30-40% between slow and fast walking. For exercise walking, measure stride at your typical workout pace. For general activity tracking, use your average everyday pace for most accurate cumulative distance.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-green-800 mb-2">Terrain & Environment</h4>
            <p className="text-sm text-gray-700 mb-2">
              Terrain significantly impacts stride: Flat ground = normal stride baseline. Uphill = 10-20% shorter stride due to increased effort and body angle. Downhill = 5-10% longer stride from gravity assistance. Sand/soft ground = 15-25% shorter from instability. Stairs = much shorter effective "stride."
            </p>
            <p className="text-xs text-gray-600">
              <strong>Tracking Consideration:</strong> Fitness trackers count stairs as steps but distance calculations become inaccurate. Hiking 10,000 steps on hills covers less distance than flat walking with the same step count, despite burning more calories due to elevation gain.
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
            <h4 className="font-semibold text-orange-800 mb-2">Age & Fitness Level</h4>
            <p className="text-sm text-gray-700 mb-2">
              Stride length tends to decrease with age: peak in 20s-30s, gradual 10-15% reduction by 60s-70s due to reduced muscle strength, flexibility, and balance. However, active older adults maintain longer strides than sedentary younger individuals.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Fitness Impact:</strong> Regular walking and strength training can increase stride length by 5-10% within months through improved leg strength, hip flexibility, and walking efficiency. Longer stride = fewer steps for same distance, often with lower injury risk from reduced repetitive impact.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2">Walking vs. Running Stride</h4>
            <p className="text-sm text-gray-700 mb-2">
              Running stride is 1.2-1.5× longer than walking stride for the same person due to the flight phase where both feet leave the ground. Example: 2.5-foot walking stride becomes 3.3-3.8 feet when running, resulting in 25-35% fewer steps per mile.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Mixed Activity:</strong> For walks that include running intervals, sophisticated trackers detect cadence changes and adjust stride calculations automatically. Manual tracking requires separate measurements: measure running stride during a jog, walking stride during normal walking, then calculate each activity portion separately.
            </p>
          </div>
        </div>

        {/* Daily Step Goals & Health Benefits */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">Daily Step Goals & Health Benefits</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-green-800 mb-3">Step Goal Guidelines by Activity Level</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">5,000</span>
                <span><strong>Sedentary Baseline:</strong> ≈2.5 miles. Minimum for basic health maintenance. Good starting point for previously inactive individuals. Achievable with normal daily activities.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">7,500</span>
                <span><strong>Moderately Active:</strong> ≈3.75 miles. Research shows significant health benefits, including 50-70% reduction in mortality risk compared to 4,000 steps. Sweet spot for busy schedules.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">10,000</span>
                <span><strong>Active Lifestyle:</strong> ≈5 miles. Classic goal promoting general health, weight management, cardiovascular fitness. Meets WHO physical activity recommendations. Achievable for most people with intentional walking.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">12,500+</span>
                <span><strong>Highly Active:</strong> ≈6+ miles. For fitness enthusiasts, weight loss goals, or physically demanding jobs. May require dedicated walking time beyond daily activities.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-3">Research-Backed Health Benefits</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Cardiovascular Health:</strong> 7,000-8,000 steps daily reduces cardiovascular disease risk by 50-70% compared to {'<'}4,000 steps. Improves blood pressure, cholesterol, and heart function.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Weight Management:</strong> 10,000 steps burns 300-500 calories depending on weight and pace. Combined with caloric awareness, supports 1-2 lbs/week weight loss.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Longevity:</strong> Meta-analyses show peak mortality benefits at 7,000-8,000 steps for older adults (60+), 8,000-10,000 for younger adults. Diminishing returns above 12,000 steps.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Mental Health:</strong> Daily walking reduces anxiety and depression symptoms, improves mood, cognitive function. Benefits start at moderate intensity (3,000-5,000 steps).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Fitness Tracker Accuracy & Calibration */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">Fitness Tracker Accuracy & Calibration</h3>
        <div className="space-y-3 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
            <h4 className="font-semibold text-indigo-800 mb-2">How Fitness Trackers Count Steps</h4>
            <p className="text-sm text-gray-700 mb-2">
              Modern trackers use 3-axis accelerometers that detect characteristic walking motion patterns: rhythmic vertical oscillation, forward acceleration, side-to-side sway. Algorithms filter out non-walking movements and distinguish steps from other activities.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Accuracy Rates:</strong> Normal walking on flat ground: 90-95% accurate. Slow walking ({'<'}2 mph): 75-85% (undercounts due to subtle motion). Running: 93-97% (more pronounced motion). Mixed activities: varies widely. Wrist-worn devices slightly less accurate than hip-worn, but convenience typically outweighs small accuracy difference.
            </p>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-100">
            <h4 className="font-semibold text-pink-800 mb-2">Common Accuracy Issues & Solutions</h4>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Problem: Overcounting</strong> - Activities with repetitive arm movements (cooking, typing, folding laundry) can register as steps.</p>
              <p className="text-xs text-gray-600">Solution: Wear on non-dominant wrist, ensure snug fit, accept 5-10% variance as normal.</p>

              <p className="mt-2"><strong>Problem: Undercounting</strong> - Slow walking, shuffling, or holding objects (grocery bags, baby) reduces arm swing detection.</p>
              <p className="text-xs text-gray-600">Solution: Hip-worn trackers more accurate for these activities, or accept slight undercount.</p>

              <p className="mt-2"><strong>Problem: Distance Inaccuracy</strong> - Trackers use population averages for stride length unless calibrated.</p>
              <p className="text-xs text-gray-600">Solution: Manually measure and input your stride length in tracker settings for 10-20% improvement in distance accuracy.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2">Calibration for Maximum Accuracy</h4>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Step 1: Update Personal Data</strong> - Ensure height, weight, age, gender are current in app settings. Algorithms use these for stride estimation.</p>

              <p><strong>Step 2: Measure Stride Length</strong> - Walk 400m track (or measure 100 feet), count steps, calculate: Distance ÷ Steps. Enter in app as custom stride length.</p>

              <p><strong>Step 3: Calibrate on Known Routes</strong> - Some trackers allow GPS calibration: walk measured routes to improve algorithm learning.</p>

              <p><strong>Step 4: Separate Walking/Running</strong> - Advanced trackers let you set different stride lengths for walking vs. running for automatic switching.</p>

              <p className="text-xs text-gray-600 mt-2"><strong>Result:</strong> Proper calibration can improve distance accuracy from ±20% (uncalibrated) to ±5% (calibrated), especially important for training programs or competitive walking.</p>
            </div>
          </div>
        </div>

        {/* Strategies to Increase Daily Steps */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">Practical Strategies to Increase Daily Steps</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-green-800 mb-3">Lifestyle Integration (Easiest)</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Park Farther:</strong> Adds 200-500 steps per trip (400-1,000 daily round trips)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Take Stairs:</strong> Each floor = ~20 steps up, 15 down. 5 floors = 175 steps</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Walking Meetings:</strong> 30-minute walk = 3,000-4,000 steps vs. 0 sitting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Pace While Talking:</strong> Phone calls, thinking time. 10 min = 800-1,200 steps</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Walk to Colleagues:</strong> Instead of email/Slack. 10 trips = 500-1,000 steps</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-3">Dedicated Walking Time</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Morning Walk:</strong> 15-min = 1,500-2,000 steps. Sets positive tone, boosts energy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Lunch Break Walk:</strong> 20-30 min = 2,000-3,500 steps. Breaks up sitting time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Evening Stroll:</strong> 30-min = 3,000-4,000 steps. Aids digestion, improves sleep</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Weekend Hikes:</strong> 60-90 min = 6,000-10,000 steps. Explores nature, family time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Walking Commute:</strong> Get off transit 1 stop early. 10-min = 1,000-1,500 steps</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-3">Progressive Goal Setting</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">Week 1-2:</span>
                <span>Track baseline. Don't change habits, just observe. Identify current average.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">Week 3-4:</span>
                <span>Increase by 500-1,000 steps/day. Add one 10-minute walk or small lifestyle changes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">Week 5-8:</span>
                <span>Add another 1,000 steps/day. Implement 2-3 strategies. Should feel manageable.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">Month 3+:</span>
                <span>Continue gradual increases until reaching goal. Maintain through habit formation.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
            <h4 className="font-semibold text-orange-800 mb-3">Accountability & Motivation</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Walking Partner:</strong> Social commitment increases adherence by 65-95%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Step Challenges:</strong> Friendly competition with friends/family boosts motivation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Track Streaks:</strong> Consecutive days hitting goal builds powerful habit reinforcement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Podcast/Audiobooks:</strong> Entertainment makes walking time enjoyable, not a chore</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Visual Progress:</strong> Graph weekly averages to see long-term trends and improvements</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <FirebaseFAQs pageId="steps-to-miles-calculator" fallbackFaqs={fallbackFaqs} />
    </div>
  );
}
