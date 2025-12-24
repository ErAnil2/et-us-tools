'use client';

import { useState, useEffect } from 'react';
import RelatedCalculatorCards from '@/components/RelatedCalculatorCards';
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

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "How do marathon time calculators predict finishing times?",
    answer: "Marathon time calculators use scientifically-validated prediction formulas based on your performance at shorter distances to estimate your marathon finish time. The most common methods include: Riegel Formula—the most widely used prediction equation developed by marathoner Pete Riegel: T2 = T1 × (D2/D1)^1.06, where T1 is your known time, D1 is the known distance, T2 is predicted time, and D2 is target distance (26.2 miles for marathon). The exponent 1.06 represents the fatigue factor—performance degrades slightly with increasing distance. For example, if you run a half marathon (13.1 miles) in 1:45:00 (105 minutes), your predicted marathon time would be: 105 × (26.2/13.1)^1.06 = 220.8 minutes = 3:40:48. Jack Daniels VDOT Method—assigns a 'VDOT' score (representing running fitness/VO2 max equivalent) based on a race result, then predicts times for all distances using that score. More sophisticated than Riegel as it accounts for different training levels. Cameron Formula—uses the equation T2 = T1 × (D2/D1) × 1.05, adding 5% to account for the additional physiological demands of longer distances. McMillan Running Calculator—incorporates training pace zones and recent race performances to generate predictions across all distances. These calculators work because aerobic fitness (VO2 max, lactate threshold, running economy) determines performance across all endurance distances—a strong half marathon indicates the cardiovascular capacity to sustain effort for a marathon, though marathon-specific training (long runs, race-pace work) significantly affects how well you realize that potential.",
    order: 1
  },
  {
    id: '2',
    question: "What factors can make marathon time predictions inaccurate?",
    answer: "While prediction formulas are scientifically-based and reasonably accurate for well-trained runners, several factors create substantial variation between predicted and actual marathon times. Marathon-specific training preparation: The calculator assumes you've completed marathon-specific training—18-20 week programs building to 40-60 weekly miles with long runs of 18-22 miles. Runners who haven't done marathon-specific preparation will underperform predictions by 5-20 minutes because they lack muscular endurance, glycogen management experience, and mental resilience for 26.2 miles. Input race effort level: Predictions assume your input race (e.g., half marathon) was run at maximum effort. If you ran a training half marathon at 80% effort, your predicted marathon will be artificially slow. Conversely, using a 5K PR from years ago when you were fitter produces overly optimistic predictions. Race day conditions: Environmental factors dramatically affect performance—heat (70°F+) slows times by 2-5%, humidity above 60% adds 5-10%, wind resistance and hilly courses add 1-10%. Flat, cool, low-humidity courses favor faster times. Training base differences: Marathons disproportionately punish runners without adequate mileage base. A runner peaking at 25 weekly miles will hit 'the wall' (glycogen depletion) around mile 18-20 regardless of cardiovascular fitness, while 50+ mile-per-week runners trained their bodies to burn fat efficiently and spare glycogen. Pacing strategy: Starting too fast depletes glycogen prematurely and accumulates lactate, causing catastrophic slowdown ('bonking'). Even 10-15 seconds per mile too fast in the first half can cost 5-10 minutes in the second half. Proper pacing (even splits or slight negative split) is crucial for achieving predicted times. Experience level: First-time marathoners typically run 10-15 minutes slower than predictions due to pacing errors, fueling mistakes, and underestimating the challenge. Veterans with 3+ marathons typically match or beat predictions. Age-related decline: Performance peaks at 25-35 years old, then declines ~1% per year after 40 and ~2% per year after 60. Calculators don't account for age unless specifically designed to do so.",
    order: 2
  },
  {
    id: '3',
    question: "What is a good marathon time for different experience levels?",
    answer: "Marathon finish times vary enormously based on age, gender, training background, and goals. Understanding time benchmarks helps set realistic expectations: General population averages (US): Overall average finish time for all marathoners: 4:21:00 (Marathon Guide data from major US marathons). Male average: 4:13:00, Female average: 4:42:00. These include first-timers, charity runners, and recreational joggers. Median finish time: ~4:30:00 (half finish faster, half slower). Age group performance (competitive runners): Men 18-34: Elite 2:05-2:15, Competitive 2:45-3:15, Recreational 3:30-4:30. Men 35-49: Elite 2:15-2:30, Competitive 2:55-3:30, Recreational 3:45-4:45. Men 50+: Elite 2:35-3:00, Competitive 3:15-3:50, Recreational 4:15-5:15. Women 18-34: Elite 2:20-2:35, Competitive 3:05-3:35, Recreational 3:50-4:50. Women 35-49: Elite 2:35-2:50, Competitive 3:20-3:55, Recreational 4:15-5:15. Women 50+: Elite 2:55-3:20, Competitive 3:45-4:20, Recreational 4:45-5:45. Qualification and milestone times: Boston Marathon qualification (BQ): Men 18-34: 3:00:00, Men 35-39: 3:05:00, Women 18-34: 3:30:00, Women 35-39: 3:35:00 (gets progressively slower with age groups). Sub-3 hour marathon: An elite amateur achievement requiring extensive training, strong genetic endurance base, and years of progressive development. Represents roughly top 3-5% of marathon finishers. Sub-4 hour marathon: A common goal for serious recreational runners. Requires consistent training (35-50 miles/week), long runs of 18-20 miles, and race pace work. Represents approximately top 35-40% of marathon finishers. Sub-5 hour marathon: An achievable first marathon goal for moderately fit individuals with 16-20 weeks of structured training. Represents approximately top 65-70% of finishers. First-timer realistic goals: Never run before starting training: 5:00-6:00+ finish time. Realistic first goal is simply to finish, building base fitness over 20-24 weeks. Recreational runner (15-25 miles/week): 4:00-4:45 finish time with 18-week marathon-specific training. Experienced runner (30-40 miles/week): 3:30-4:00 finish time with quality workouts (tempo runs, long runs, race pace work). Competitive runner (50+ miles/week): 3:00-3:30 finish time with structured training, speed work, and years of base building.",
    order: 3
  },
  {
    id: '4',
    question: "How should I pace my marathon to achieve my goal time?",
    answer: "Proper pacing is the single most critical factor determining marathon success—more important than training volume or speed. Physiological principles of marathon pacing: The marathon distance exists at the intersection of aerobic and glycogen-depletion physiology. Most runners store 1,800-2,200 calories of muscle glycogen—enough fuel for 18-22 miles at marathon pace. Running faster than lactate threshold pace accelerates glycogen depletion and lactate accumulation, causing 'the wall' (sudden fatigue, dramatic pace slowdown) at mile 18-22. Successful pacing keeps you just below lactate threshold, maximizing fat oxidation and preserving glycogen for the final miles. Recommended pacing strategies: Even pacing (most physiologically efficient): Run consistent mile splits throughout the race (e.g., 8:00/mile for a 3:30 finish = 26.2 miles × 8:00). Research shows this minimizes glycogen depletion and accumulates least lactate. Elite marathoners typically use even pacing (their halfway split differs from second half by <30 seconds). Slight negative split: Run the first half 1-2% slower than goal pace, second half at or slightly faster than goal pace. Example for 3:30 goal: first half in 1:47 (8:10/mile), second half in 1:43 (7:52/mile). This strategy preserves glycogen early, allowing you to maintain or increase pace when others fade. Positive split (common mistake): Running first half faster than second half. This ALWAYS indicates pacing error and results in slower overall time than even pacing. Example: 1:43 first half, 1:52 second half = 3:35 finish when 3:30 was achievable with even pacing. Calculating your marathon pace: Use calculator prediction based on recent race (half marathon ideal, 10K acceptable). Subtract 5-10 seconds per mile for first 6-8 miles to account for race-day adrenaline and crowd surge. Settle into goal pace from miles 8-20. Final 6.2 miles: If feeling strong, increase pace by 5-10 seconds per mile. If struggling, maintain pace or slow minimally. Using perceived effort: Marathons should feel 'comfortably hard' for first 16-18 miles—conversational effort impossible but not gasping. Miles 18-22 increase to 'hard' effort—breathing heavy, conversation limited to few words. Final 4.2 miles become 'very hard'—maximum sustainable effort, full focus required to maintain pace. Common pacing mistakes to avoid: Starting too fast (most common error): First mile 20-30+ seconds faster than goal pace due to excitement, crowd energy. This creates 'oxygen debt' and accelerates glycogen depletion, guaranteeing second-half slowdown. Walking through aid stations: While it seems to conserve energy, stopping or slowing to walk for fluids breaks rhythm and costs 5-10 seconds per stop. Practice grabbing cups while running (pinch cup top to prevent spilling). Surging in pace: Varying pace by 15-30+ seconds per mile wastes energy compared to steady effort. Each surge requires glycogen, while slowdowns don't fully recover that energy cost.",
    order: 4
  },
  {
    id: '5',
    question: "What training plan should I follow to achieve my marathon goal time?",
    answer: "Marathon training plans vary by experience level, current fitness, weekly mileage capacity, and goal time, but all successful plans share core components: Training plan duration and structure: Beginners (first marathon): 18-20 week plans building from 15-20 miles/week base to 35-40 miles/week peak. Focus on gradually increasing long run distance (8 to 20 miles) and building aerobic base. Intermediate runners (2-5 marathons): 16-18 week plans starting from 25-35 miles/week base, peaking at 45-55 miles/week. Incorporates tempo runs, marathon pace work, and strategic recovery. Advanced runners (5+ marathons, sub-3:30 goal): 12-16 week plans building from 40-50 miles/week base to 60-80+ miles/week peak. Includes VO2 max intervals, lactate threshold tempo runs, and race-specific preparation. Essential training components: Long runs (most important workout): Progressive distance building—start at 8-10 miles, add 1-2 miles weekly until reaching 18-22 miles (3-4 weeks before race). Run at easy pace (1:00-1:30 per mile slower than marathon goal pace) to build aerobic endurance, glycogen storage capacity, and muscular resilience without excessive fatigue. Schedule long runs on weekends when you have 3-4 hours available. Easy runs (foundation of training): 60-70% of weekly mileage should be easy pace (conversational effort, ~2:00 per mile slower than marathon pace). These build aerobic base, capillary density, mitochondrial development without accumulating fatigue. Marathon pace runs: Once every 2-3 weeks, run 6-10 miles at goal marathon pace to teach your body the target effort level, dial in fueling strategy, and build race-specific confidence. Example: 3-mile warm-up, 8 miles at marathon pace, 2-mile cool-down. Tempo runs (lactate threshold training): Weekly or bi-weekly runs of 4-8 miles at tempo pace (~20-30 seconds per mile faster than marathon pace, or half marathon race pace). These improve lactate clearance, raise the effort level you can sustain, and increase running economy. Crucial for breaking through time barriers (sub-4, sub-3:30). Rest and recovery: Include 1-2 complete rest days per week (no running). Schedule easy weeks every 3-4 weeks (reduce mileage 20-30%) to allow adaptation and prevent overtraining. Taper period (critical final 3 weeks): 3 weeks before race: Reduce weekly mileage to 75% of peak (if peak was 50 miles, run 38 miles). Maintain intensity (one tempo run, one marathon pace session). 2 weeks before: Reduce to 60% of peak mileage (30 miles). Keep legs fresh while preserving fitness. 1 week before (race week): Reduce to 30-40% of peak mileage (15-20 miles). Include 3-4 easy runs and one short 20-minute run with 3-4 minutes at marathon pace 2-3 days before race. Sample weekly schedules: Beginner (40 miles/week peak): Monday rest, Tuesday 5 miles easy, Wednesday 6 miles with 3 at marathon pace, Thursday 5 miles easy, Friday rest, Saturday 18-mile long run, Sunday 6 miles easy recovery. Intermediate (50 miles/week peak): Monday 5 miles easy, Tuesday 8 miles with 5-mile tempo run, Wednesday 6 miles easy, Thursday 8 miles with 4 at marathon pace, Friday rest, Saturday 20-mile long run, Sunday 8 miles easy. Advanced (70 miles/week peak): Monday 8 miles easy, Tuesday 12 miles with 8-mile tempo run, Wednesday 8 miles easy, Thursday 10 miles with 6 at marathon pace, Friday 6 miles easy, Saturday 22-mile long run, Sunday 10 miles easy.",
    order: 5
  },
  {
    id: '6',
    question: "How important is nutrition and fueling for marathon performance?",
    answer: "Nutrition during training and especially on race day is critical for marathon success—inadequate fueling causes 'bonking' (sudden energy depletion) and can prevent achieving predicted finish times regardless of fitness. Pre-race nutrition (3 days to race morning): Carbohydrate loading (3 days before race): Increase carbohydrate intake to 70-80% of calories (8-10g carbs per kg bodyweight daily) while reducing training volume. This maximizes muscle glycogen storage from typical 1,800 calories to 2,200-2,500 calories—providing ~30-45 extra minutes of running fuel. Effective carb sources: pasta, rice, bread, oatmeal, potatoes, bananas. Avoid high-fiber foods that cause GI distress. Race morning meal (3-4 hours before start): Consume 100-150g easily digestible carbohydrates: bagel with peanut butter and banana, oatmeal with honey, or energy bars. Include small amount of protein and minimal fat/fiber. Stay hydrated but don't overdrink (clear or pale yellow urine indicates proper hydration). Race day fueling strategy (crucial for sub-4 hour marathons): Why you need mid-race fuel: Runners store ~1,800-2,200 calories as muscle glycogen—enough for 18-22 miles at marathon pace depending on efficiency. Running beyond this without supplemental carbohydrates causes glycogen depletion ('hitting the wall')—dramatic fatigue, mental fog, inability to maintain pace, sometimes requiring walking. Consuming carbohydrates during the race spares glycogen and maintains blood glucose. Recommended fueling protocol: Start fueling early (miles 6-8, NOT waiting until you feel tired—glycogen depletion takes 30-45 minutes to reverse once it starts). Consume 30-60g carbohydrates per hour (120-240 calories/hour). Example schedules: Option 1—Energy gels (25g carbs per gel): Take one gel every 45 minutes starting at mile 6 (miles 6, 10, 14, 18, 22). Chase each gel with 4-6 oz water to aid absorption and prevent GI distress. Option 2—Sports drinks (14-17g carbs per 8oz): Drink 8oz at every aid station (every 2 miles = 6-8 servings over 26.2 miles). Option 3—Combination: Alternate between gels and sports drinks. Example: gel at miles 6, 14, 22; sports drink at all other aid stations. Fuel types and considerations: Energy gels (GU, Clif Shot, Honey Stinger): Convenient, portable, easy to carry. Maltodextrin and fructose combinations absorb quickly. Practice in training—some cause GI issues. Sports drinks (Gatorade, Powerade): Available at aid stations, provides both carbs and electrolytes. Lower carb concentration requires drinking larger volumes. Chews/blocks (Shot Bloks, Clif Bloks): Easier on stomach for some runners, requires chewing while running hard. Energy bars: Too slow to digest during race—save for ultra-marathons. Electrolyte replacement (sodium, potassium): Marathons lasting 3+ hours in warm weather increase sweat losses, risking hyponatremia (low blood sodium) if drinking excessive plain water. Solutions: consume sports drinks (contain sodium), take salt tablets (1-2 per hour in heat), or use electrolyte mixes. Post-race recovery nutrition: Within 30 minutes: Consume 3:1 or 4:1 ratio of carbs to protein (example: chocolate milk, recovery shake, banana with peanut butter). This window optimizes glycogen replenishment and muscle repair. Within 2 hours: Eat full meal with carbohydrates, protein, healthy fats. First 24 hours: Stay well-hydrated (monitor urine color), continue eating carb-rich foods to fully restore glycogen stores depleted during the race. Training your fueling strategy: Critical mistake: Trying new fuels on race day. GI distress from unfamiliar gels/drinks can ruin your race. Solution: Practice your exact race day fueling plan during long runs. Use the same gel brand, timing, and hydration strategy you'll use on race day. This trains your gut to absorb and tolerate mid-run fueling, identifies what works for your system, and builds confidence in your race plan.",
    order: 6
  }
];

interface MarathonTimeCalculatorClientProps {
  relatedCalculators?: Array<{
    href: string;
    title: string;
    description: string;
    color?: string;
  }>;
}

export default function MarathonTimeCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: MarathonTimeCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('marathon-time-calculator');

  const [value, setValue] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    // Basic placeholder calculation
    if (value) {
      setResult(`Result for ${value}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Marathon Time Calculator')}</h1>
          <p className="text-lg text-gray-600">Free online marathon time calculator</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="max-w-md mx-auto">
            <div className="mb-3 sm:mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Value
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter value..."
              />
            </div>

            <button
              onClick={calculate}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Calculate
            </button>

            {result && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 font-semibold">{result}</p>
              </div>
            )}
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* SEO Content Section */}
        <div className="mt-12 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Marathon Training and Performance: Science-Based Strategies for Success</h2>

          <div className="space-y-3 sm:space-y-4 md:space-y-6 text-gray-700">
            <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-l-4 border-blue-500">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Understanding Marathon Time Prediction Formulas</h3>
              <p className="mb-3">
                Marathon time calculators employ mathematically-derived formulas based on decades of race data analysis to predict your 26.2-mile performance from shorter race results. The most widely-used prediction method is the Riegel Formula, which accurately estimates race times across distances:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-3 font-mono text-sm">
                <div className="mb-2"><strong>T2 = T1 × (D2 / D1)^1.06</strong></div>
                <div className="text-xs space-y-1">
                  <div>T1 = Your known race time (e.g., half marathon: 1:45:00 = 105 minutes)</div>
                  <div>D1 = Distance of known race (half marathon: 13.1 miles)</div>
                  <div>T2 = Predicted race time (what we're calculating)</div>
                  <div>D2 = Target race distance (marathon: 26.2 miles)</div>
                  <div>1.06 = Fatigue factor exponent (performance degradation with distance)</div>
                </div>
              </div>
              <p className="mb-3">
                <strong>Example calculation:</strong> If you recently ran a half marathon in 1:45:00 (105 minutes), your predicted marathon time would be: 105 × (26.2 / 13.1)^1.06 = 105 × 2.103 = 220.8 minutes = 3:40:48. The formula accounts for the physiological reality that maintaining race pace becomes progressively harder as distance increases—you can't simply double your half marathon time because fatigue accumulates exponentially, not linearly.
              </p>
              <p>
                The 1.06 exponent reflects empirical data showing that aerobic endurance performance declines by approximately 6% for each doubling of race distance. This degradation occurs because longer distances progressively deplete muscle glycogen stores (typically lasting 90-120 minutes at race pace), increase lactate accumulation despite running below threshold, cause greater thermoregulatory stress, and accumulate muscular fatigue from thousands of ground contact repetitions. Elite marathoners demonstrate exponents closer to 1.04-1.05 due to superior glycogen management and running economy, while recreational runners may show 1.07-1.08 exponents reflecting less efficient pacing and fueling strategies.
              </p>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-l-4 border-green-500">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">The Physiology of Marathon Performance</h3>
              <p className="mb-3">
                Marathon success depends on the integration of three primary physiological systems that determine sustainable pace over 26.2 miles:
              </p>
              <p className="mb-3">
                <strong>VO2 Max (Aerobic Capacity):</strong> Your maximum oxygen consumption rate determines the ceiling of your aerobic system—the fastest pace you can theoretically sustain through oxidative metabolism. Elite marathoners possess VO2 max values of 70-85 ml/kg/min (men) and 65-75 ml/kg/min (women), while competitive recreational runners range from 50-65 ml/kg/min. However, VO2 max alone doesn't determine marathon performance—research shows elite marathoners run at 80-85% of VO2 max for the entire race, while recreational runners sustain only 70-75%, making efficiency more predictive than raw aerobic power.
              </p>
              <p className="mb-3">
                <strong>Lactate Threshold (Anaerobic Threshold):</strong> Your lactate threshold pace represents the intensity where lactate production exceeds clearance, causing accumulation that eventually forces slowdown. Well-trained marathoners run slightly below lactate threshold for the entire race (typically 85-90% of maximum heart rate), maximizing pace while preventing premature fatigue. Training at or near threshold pace (tempo runs, marathon pace workouts) raises this ceiling, allowing faster sustainable speeds. Lactate threshold improvements explain why experienced marathoners run significantly faster than predictions based solely on VO2 max.
              </p>
              <p>
                <strong>Running Economy:</strong> This metric—oxygen cost per kilometer at a given pace—determines how efficiently you convert aerobic capacity into speed. Think of it as fuel efficiency: two runners with identical VO2 max can run vastly different paces if one requires 15% less oxygen per kilometer. Running economy improves through: high weekly mileage (50-70+ miles) which optimizes neuromuscular coordination, strength training (particularly plyometrics and heavy resistance work) improving elastic energy return, and running form refinements reducing wasted movement. Elite East African marathoners often demonstrate superior economy despite moderate VO2 max values, explaining their dominance at marathon distances.
              </p>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-l-4 border-purple-500">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Marathon Training Periodization</h3>
              <p className="mb-3">
                Successful marathon preparation follows periodized training phases that systematically build fitness while managing fatigue:
              </p>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Base Building Phase (6-12 weeks)</p>
                  <p className="text-sm">Focus on establishing aerobic foundation through high-volume, low-intensity mileage. Build weekly distance from current baseline to target peak (typically increasing 10% per week until reaching 80-90% of peak mileage). Include one long run weekly, progressively extending from 8-10 miles to 13-16 miles. All running at easy, conversational pace (60-70% max heart rate). This phase develops mitochondrial density, capillary networks, aerobic enzymes, and structural adaptations in tendons/ligaments.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Strength/Speed Phase (4-6 weeks)</p>
                  <p className="text-sm">Introduce threshold training and marathon-specific workouts while maintaining mileage. Weekly tempo runs of 4-6 miles at lactate threshold pace (~10K race pace, 'comfortably hard' effort). Marathon pace intervals: 3-5 mile repeats at goal marathon pace with short recovery. Long runs extend to 16-18 miles. This phase raises lactate threshold, improves running economy, and teaches body to clear lactate efficiently while running aerobically.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Peak Training Phase (3-4 weeks)</p>
                  <p className="text-sm">Highest weekly mileage (peak week), longest long runs (18-22 miles), and most intense race-specific workouts. Include 10-16 mile runs with significant portions at marathon pace. Practice race-day fueling strategy during long runs. Simulate race conditions (start time, terrain, weather if possible). This phase provides final physiological adaptations and mental confidence that you can sustain marathon effort.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Taper Phase (2-3 weeks)</p>
                  <p className="text-sm">Systematically reduce training volume while maintaining intensity to arrive at race day fresh but fit. Week 1 of taper: 75% of peak mileage, include one tempo run and one marathon pace session. Week 2: 50-60% of peak mileage, maintain some intensity but shorter durations. Race week: 30-40% of peak mileage, mostly easy running with one short session including 10-15 minutes at marathon pace. The taper allows glycogen supercompensation, muscle repair, immune system recovery, and nervous system freshness—studies show proper tapering improves performance by 3-6% compared to maintaining full training volume.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-l-4 border-orange-500">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Race Day Execution Strategies</h3>
              <p className="mb-3">
                Even perfect training can be undermined by execution errors on race day. Evidence-based strategies for optimal performance:
              </p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-800">Pacing Strategy</p>
                  <p>Even pacing (consistent mile splits throughout) is physiologically optimal, minimizing glycogen depletion and lactate accumulation. Analysis of world record performances shows negative splits (second half faster than first) or even pacing in 95%+ of cases. Positive splits (slowing in second half) always indicate pacing errors. Start conservatively—run first 3-5 miles 5-10 seconds per mile slower than goal pace to account for adrenaline. Settle into goal pace miles 6-20. If feeling strong miles 20+, increase pace by 5-15 seconds per mile for a negative split finish.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Fueling Protocol</p>
                  <p>Begin carbohydrate intake at mile 6-8 (before feeling depleted—glycogen restoration takes 30-45 minutes). Consume 30-60g carbohydrates per hour through gels, sports drinks, or combination. Practice exact race-day fueling during long runs to train gut absorption and identify tolerance. Most marathon failures result from inadequate fueling causing 'bonking' at miles 18-22 when glycogen depletes.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Hydration Balance</p>
                  <p>Drink to thirst rather than following rigid schedules. Consume 4-8 oz of fluid every 15-20 minutes based on sweat rate, weather conditions, and thirst cues. Over-hydration (drinking beyond thirst) risks hyponatremia (low blood sodium), causing confusion, nausea, and dangerous swelling. Under-hydration causes performance decline when body weight loss exceeds 2-3%. Sports drinks provide optimal combination of carbohydrates, electrolytes, and fluids.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Mental Strategies</p>
                  <p>Break the race into manageable segments rather than fixating on 26.2 miles: first 10K (establish rhythm, resist starting too fast), 10K-halfway (settle into goal pace, focus on form), halfway-20 miles (maintain pace, execute fueling plan), 20 miles-finish (dig deep, focus on process not outcome). Use mantras, focus on technique cues (posture, arm swing, cadence), and draw energy from crowds during difficult miles 18-23.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-xl p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Common Marathon Training Mistakes</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>Increasing Mileage Too Quickly:</strong> The 10% rule (never increase weekly mileage by more than 10%) prevents overuse injuries. Tendons, ligaments, and bones adapt more slowly than cardiovascular system—increasing volume aggressively causes stress fractures, tendinitis, and other structural damage requiring months of recovery.</li>
                <li><strong>Running All Miles Too Fast:</strong> 80% of training should be easy pace (conversational, below 70% max HR). Running easy runs too hard accumulates fatigue without providing adaptive stimulus, compromising hard workout quality and increasing injury risk. Save intensity for designated hard days.</li>
                <li><strong>Neglecting Long Runs:</strong> The long run is the most important marathon-specific workout, teaching your body to store and efficiently use glycogen, strengthening musculoskeletal system for hours of repetitive impact, and building mental resilience. Skipping or shortening long runs guarantees underperformance regardless of other training quality.</li>
                <li><strong>Inconsistent Training:</strong> Fitness accumulates through consistent weekly training over months—one great week followed by injury or burnout doesn't build marathon fitness. Better to maintain moderate consistent mileage (40 miles/week for 16 weeks) than spike to 60 miles for 4 weeks then crash.</li>
                <li><strong>Ignoring Recovery:</strong> Adaptations occur during recovery, not during workouts. Include 1-2 complete rest days weekly, schedule easy recovery weeks every 3-4 weeks (reduce mileage 20-30%), prioritize sleep (8-9 hours for heavy training), and fuel adequately (especially protein and carbohydrates for muscle repair and glycogen restoration).</li>
                <li><strong>Skipping the Taper:</strong> Fear of 'losing fitness' causes some runners to maintain full training volume into race week. Research definitively shows 2-3 week tapers (reducing volume 30-50% while maintaining some intensity) improve performance by 3-6% through physiological restoration without fitness loss.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <FirebaseFAQs pageId="marathon-time-calculator" fallbackFaqs={fallbackFaqs} />
        </div>

        <RelatedCalculatorCards calculators={relatedCalculators} />
      </div>
    </div>
  );
}
