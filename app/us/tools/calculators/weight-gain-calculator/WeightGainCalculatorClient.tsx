'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface WeightGainCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

type GainRate = 'slow' | 'moderate' | 'fast' | 'aggressive';

interface GainRateInfo {
  label: string;
  lbsPerWeek: number;
  description: string;
  emoji: string;
}

const gainRateInfo: Record<GainRate, GainRateInfo> = {
  slow: { label: 'Lean Gain', lbsPerWeek: 0.5, description: 'Minimal fat gain', emoji: '🎯' },
  moderate: { label: 'Balanced', lbsPerWeek: 1, description: 'Optimal muscle growth', emoji: '⚖️' },
  fast: { label: 'Fast Bulk', lbsPerWeek: 1.5, description: 'Quick results', emoji: '🚀' },
  aggressive: { label: 'Max Bulk', lbsPerWeek: 2, description: 'Maximum weight gain', emoji: '💪' }
};

const activityLevels = [
  { value: 1.2, label: 'Sedentary', description: 'Desk job, no exercise', emoji: '🪑' },
  { value: 1.375, label: 'Light', description: '1-3 days/week', emoji: '🚶' },
  { value: 1.55, label: 'Moderate', description: '3-5 days/week', emoji: '🏃' },
  { value: 1.725, label: 'Very Active', description: '6-7 days/week', emoji: '🏋️' },
  { value: 1.9, label: 'Extreme', description: 'Athlete level', emoji: '🏆' }
];

const fallbackFaqs = [
  {
    id: '1',
    question: "How much weight can I safely gain per week?",
    answer: "Safe and sustainable weight gain rates depend on your training experience, body composition goals, and whether you're prioritizing muscle mass over total weight. For muscle-focused weight gain (lean bulking): Beginners to resistance training: 0.5-1 lb (0.25-0.5 kg) per week is optimal. New trainees benefit from 'newbie gains'—the enhanced ability to build muscle rapidly during the first 6-12 months of structured training. During this period, beginners can gain 2-3 lbs of muscle monthly while maintaining relatively lean body composition with proper training and nutrition. Intermediate lifters (1-3 years training): 0.25-0.5 lb (0.1-0.25 kg) per week becomes more realistic as the rate of muscle protein synthesis slows. Expecting 1-1.5 lbs of muscle gain monthly is reasonable with progressive overload and adequate nutrition. Advanced lifters (3+ years training): 0.1-0.25 lb (0.05-0.1 kg) per week represents near the upper limit of natural muscle building potential. Gains of 2-5 lbs of muscle annually become the norm as you approach your genetic ceiling. For faster bulking (accepting more fat gain): 1-1.5 lbs (0.5-0.7 kg) per week allows rapid strength and size increases but results in higher body fat accumulation—approximately 50-60% of gained weight will be fat rather than muscle. This approach may benefit powerlifters prioritizing absolute strength or very lean individuals needing to increase body mass quickly. 1.5-2+ lbs (0.7-1 kg) per week produces very rapid weight gain with 60-70%+ of gained weight being fat. This aggressive surplus rarely improves muscle building rates beyond moderate approaches and creates a longer, more difficult cutting phase later. Key principle: The body can synthesize muscle at a limited rate regardless of calorie surplus—consuming 1,000 calories above maintenance doesn't build muscle twice as fast as 500-calorie surplus, it simply stores the excess as adipose tissue. Research shows protein synthesis rates max out with moderate surpluses (300-500 calories), making larger surpluses counterproductive for body composition.",
    order: 1
  },
  {
    id: '2',
    question: "What is the optimal calorie surplus for building muscle?",
    answer: "The ideal calorie surplus balances maximizing muscle protein synthesis while minimizing unnecessary fat accumulation. Research on body recomposition provides clear guidelines: Moderate surplus (300-500 calories above TDEE) is optimal for most individuals focused on muscle gain with acceptable fat gain. Studies show this range maximizes muscle protein synthesis without excessive adipose tissue storage. Example: if your maintenance is 2,500 calories, consuming 2,800-3,000 daily supports muscle growth. This approach typically yields 0.5-1 lb weekly gain for beginners/intermediates, with roughly 60-70% being lean mass (muscle, glycogen, water) and 30-40% fat—an acceptable ratio for bulking phases. Small surplus (200-300 calories above TDEE) suits advanced lifters approaching genetic limits or individuals who gain fat easily. This conservative approach slows overall weight gain (0.25-0.5 lb weekly) but maximizes the muscle-to-fat ratio, keeping body fat percentage relatively stable. Ideal for those wanting to stay visible lean year-round or preparing for bodybuilding/physique competitions. Large surplus (500-1,000 calories above TDEE) accelerates weight gain (1-2 lbs weekly) but significantly increases fat accumulation. While strength may increase faster (helpful for powerlifters), muscle building rates don't proportionally increase—the extra calories primarily convert to fat storage. This approach may suit extremely lean individuals (men <10% body fat, women <18%) who need substantial mass gain, or those recovering from prolonged calorie deficits. Metabolic and training adaptations: Calorie surplus increases anabolic hormones (testosterone, IGF-1, insulin) and decreases catabolic hormones (cortisol), creating an optimal environment for muscle protein synthesis. Surplus calories improve training performance through increased muscle glycogen stores, allowing higher volume and intensity—critical for progressive overload and muscle stimulus. However, excessive surplus (1,000+ calories) doesn't further enhance these adaptations, primarily serving to expand fat cells. Why more isn't better: Muscle protein synthesis rates have an upper limit determined by training stimulus, genetics, and hormones—not simply calorie availability. Once protein and energy needs for muscle building are met (~300-500 calorie surplus), additional calories default to fat storage through de novo lipogenesis (conversion of carbohydrates to fatty acids) and direct dietary fat storage. Practical application: Start with a 300-400 calorie surplus and monitor weekly weight changes and body composition (progress photos, measurements, body fat estimates). Adjust surplus up if gaining <0.5 lb weekly or down if gaining >1 lb weekly and body fat is increasing faster than desired.",
    order: 2
  },
  {
    id: '3',
    question: "How much protein do I need to build muscle effectively?",
    answer: "Protein intake is the single most critical macronutrient for muscle hypertrophy, providing amino acids essential for muscle protein synthesis (MPS) and recovery. Evidence-based protein recommendations for muscle gain: Optimal intake range: 1.6-2.2 g per kg body weight (0.7-1.0 g per pound). Meta-analyses of resistance training studies show this range maximizes muscle protein synthesis rates, with minimal additional benefit beyond 2.2 g/kg even during calorie surplus and heavy training. For a 180 lb (82 kg) individual: 130-180 grams of protein daily represents the sweet spot. Beginners and enhanced recovery needs: Athletes training with very high volume (10-20+ sets per muscle group weekly), beginners experiencing rapid muscle growth, or individuals in calorie deficits to preserve muscle may benefit from the higher end (2.0-2.2 g/kg or 0.9-1.0 g/lb). Protein distribution throughout the day matters: Rather than consuming all protein in 1-2 meals, spreading intake across 4-6 meals optimizes muscle protein synthesis. Each meal should contain 20-40 grams of protein (0.25-0.4 g/kg per meal). This frequent stimulation maintains elevated MPS rates throughout the day, as the anabolic response to protein intake lasts approximately 3-5 hours. Leucine threshold: Each protein feeding should contain 2-3 grams of leucine—the primary amino acid triggering MPS—found in 20-30 grams of high-quality protein. Post-workout protein timing: While the 'anabolic window' is less critical than once believed (as long as daily protein totals are met), consuming 20-40 grams of protein within 2-3 hours post-training supports optimal recovery and MPS rates during the period when muscles are most sensitive to amino acid delivery. Protein quality matters: Complete proteins containing all nine essential amino acids (meat, fish, poultry, eggs, dairy, soy) are superior for muscle building compared to incomplete proteins (most plant sources). Vegetarians/vegans should combine complementary proteins (rice + beans, hummus + whole wheat) or consume larger total amounts (2.0-2.2 g/kg) to ensure adequate essential amino acid intake. Exceeding protein needs: Consuming >2.5 g/kg (>1.1 g/lb) provides no additional muscle-building benefit based on current research. Excess protein is either oxidized for energy (converted to glucose through gluconeogenesis) or excreted, making super-high protein intakes (3+ g/kg) an expensive and unnecessary approach. However, protein has the highest thermic effect of food (20-30% of protein calories burned during digestion), so higher protein diets may support fat loss efforts through increased energy expenditure and satiety. Practical application: Calculate your protein target (1.6-2.2 g/kg bodyweight), then divide by 4-6 meals throughout the day. Track intake for 1-2 weeks using a food app to ensure you're consistently meeting targets. Prioritize whole food protein sources, using supplements (whey, casein, plant-based powders) to fill gaps when whole foods are impractical.",
    order: 3
  },
  {
    id: '4',
    question: "Should I do cardio while trying to gain weight and build muscle?",
    answer: "Cardiovascular exercise during muscle-building phases requires strategic balance—enough to maintain cardiovascular health and work capacity without interfering with muscle growth or creating excessive calorie deficits. Evidence-based cardio approach for muscle gain: Minimal to moderate cardio (2-3 sessions of 20-30 minutes weekly) maintains cardiovascular health, improves nutrient delivery to muscles through enhanced capillary density, supports work capacity for resistance training by improving conditioning and recovery between sets, and helps manage body fat accumulation during surplus. This volume doesn't significantly interfere with muscle growth when properly fueled. Low-Intensity Steady State (LISS) is preferred: Walking, light cycling, or incline treadmill at 60-70% max heart rate minimizes interference with muscle recovery and glycogen depletion, burns some calories while preserving muscle tissue, and can be performed on rest days or after resistance training without impacting strength performance. LISS improves parasympathetic recovery and may actually enhance muscle growth indirectly through improved circulation and nutrient delivery. Avoid excessive cardio that interferes with gains: High-Intensity Interval Training (HIIT) and long-duration cardio (60+ minutes) significantly deplete muscle glycogen stores needed for optimal resistance training performance, activate AMPK pathways that inhibit mTOR signaling (the primary muscle growth pathway), create substantial additional calorie burn requiring even larger food intake (potentially difficult for hard-gainers), and increase cortisol (catabolic hormone) and overall stress load, impairing recovery. If performing HIIT: limit to 1-2 short sessions (15-20 minutes) weekly and ensure adequate carbohydrate intake to replenish glycogen. The interference effect: Concurrent endurance and resistance training can blunt muscle protein synthesis signaling compared to resistance training alone. This effect becomes pronounced when cardio volume exceeds 3-4 hours weekly or when performed immediately before strength training. The molecular basis: cardio activates AMPK (promoting fat oxidation and mitochondrial biogenesis) while resistance training activates mTOR (promoting protein synthesis and hypertrophy)—these pathways antagonize each other to some degree. Timing strategies to minimize interference: Perform cardio on separate days from resistance training when possible, or at least 6-8 hours apart to allow recovery of anabolic signaling. If same-session cardio is necessary, perform resistance training first while glycogen stores and nervous system are fresh, then add 15-20 minutes of LISS cardio afterward. Never perform intense cardio immediately before resistance training—it impairs strength output and motor unit recruitment. Fuel cardio sessions properly: Consume carbohydrates before and after cardio during bulking phases to prevent muscle glycogen depletion that could compromise resistance training performance or trigger muscle protein breakdown. Special populations: Hard-gainers (ectomorphs, high NEAT individuals) should minimize cardio to 1-2 short LISS sessions weekly, as they burn significant calories through daily activity already. Athletes requiring sport-specific conditioning must accept some interference effect and compensate with higher calorie intakes and prioritized recovery. Individuals who gain fat very easily may benefit from 3-4 cardio sessions weekly to control body fat accumulation during surplus, accepting slightly slower muscle gain as a tradeoff for better body composition.",
    order: 4
  },
  {
    id: '5',
    question: "Why am I not gaining weight despite eating more?",
    answer: "Failure to gain weight despite perceived increased food intake is extremely common and typically results from one or more measurable factors. Systematic troubleshooting reveals the actual cause: Underestimating calorie needs (most common): Your calculated TDEE may underestimate actual energy expenditure due to high NEAT (non-exercise activity thermogenesis)—fidgeting, posture maintenance, spontaneous movement can burn 300-800 calories daily beyond intentional exercise. Occupation matters: laborers, teachers (standing/walking), retail workers burn significantly more than desk-based workers despite identical exercise routines. Previous dieting or low body weight: Adaptive thermogenesis increases metabolism 10-15% above predicted TDEE in formerly lean individuals as the body attempts to defend against further weight loss. Genetic factors: Some individuals have naturally elevated BMR 10-20% above population averages due to thyroid hormone sensitivity, brown adipose tissue activity, or fidgeting tendencies. Solution: Increase calorie target by 300-500 calories beyond your calculated maintenance and reassess weekly weight changes. Inaccurate calorie tracking (very common): Research using doubly-labeled water (gold standard metabolism measurement) shows untrained individuals underestimate calorie intake by 30-50% on average. Common errors include: not weighing foods (eyeballing portions underestimates by 20-40%), forgetting to log cooking oils, butter, condiments, beverages (easily 200-500 calories daily), inconsistent logging (tracking 5 days but not weekends creates illusion of surplus), and restaurant/prepared foods containing 20-40% more calories than listed. Solution: Weigh all foods using a digital scale for 2-3 weeks. Log everything including cooking fats, sauces, drinks. Use a calorie tracking app (MyFitnessPal, Cronometer) consistently for at least 14 days. Inconsistent intake (weekday vs weekend variation): Eating well Monday-Friday but under-eating weekends due to social activities, sleeping through meals, or simply forgetting creates a weekly deficit despite daily surplus. Example: +500 calories Mon-Fri (+2,500 weekly) but -300 calories Sat-Sun (-600 weekly) = net +1,900 weekly instead of targeted +3,500. Solution: Plan meals in advance for entire week, including weekends. Set phone reminders to eat if you forget meals. Prepare grab-and-go high-calorie foods. Increased activity offsetting surplus: Subconsciously increasing daily movement (more walking, fidgeting, restlessness) in response to increased food intake—a well-documented adaptive response that can burn 200-400 extra calories daily. Starting new training program or increasing training volume burns more calories than accounted for in activity multiplier. Solution: Reduce unnecessary movement if trying to gain weight, or further increase calorie intake by 200-300 calories to offset. Poor sleep and recovery: Inadequate sleep (<7 hours nightly) impairs muscle protein synthesis by 20-30%, elevates cortisol (catabolic hormone), and reduces testosterone and growth hormone secretion. Chronic stress similarly increases cortisol and suppresses anabolic hormones, making weight gain difficult despite calorie surplus. Solution: Prioritize 7-9 hours of sleep nightly. Manage stress through meditation, reduced commitments, or therapy. Medical conditions: Hyperthyroidism increases metabolic rate 20-50% above normal, making weight gain extremely difficult. Diabetes (type 1) causes weight loss despite increased eating due to glucose excretion in urine. Malabsorption disorders (celiac disease, Crohn's disease, IBS) prevent proper nutrient absorption from food. Parasitic infections reduce nutrient availability. Solution: Consult physician if unexplained weight loss continues despite verified calorie surplus for 4+ weeks. Request thyroid panel, diabetes screening, and GI evaluation. Practical troubleshooting protocol: Week 1-2: Meticulously track all food intake using food scale and app—no estimates. Week 2: Compare average daily calories to TDEE calculation. If eating ≥500 calories over TDEE consistently but no weight gain, increase calories by 300-500 and reassess. Week 3-4: Monitor weekly weigh-ins (same time, same day, same conditions). Aim for 0.5-1 lb weekly increase. If still no change after 4 weeks of verified calorie surplus and consistent tracking, consult healthcare provider for medical evaluation.",
    order: 5
  },
  {
    id: '6',
    question: "What is the best workout routine for building muscle and gaining weight?",
    answer: "Effective muscle-building programs share core principles regardless of specific exercise selection or split—progressive overload, adequate volume, appropriate frequency, and proper recovery. Evidence-based training fundamentals for hypertrophy: Progressive overload (non-negotiable requirement): Muscles adapt to stress by growing larger and stronger. You must consistently increase the challenge through: Adding weight/resistance (e.g., squatting 135 lbs → 140 lbs → 145 lbs over weeks), increasing repetitions (e.g., 3 sets of 8 reps → 3 sets of 9 → 3 sets of 10), adding sets (3 sets → 4 sets → 5 sets for a particular exercise), or decreasing rest periods (90 seconds → 75 seconds → 60 seconds between sets). Training logs documenting exercises, weights, reps, sets are essential for tracking progression. Without progressive overload, muscles have no stimulus to grow beyond current capacity. Optimal training volume: Meta-analyses show 10-20 sets per muscle group per week maximizes hypertrophy for most individuals. Beginners (0-1 year): 10-12 sets per muscle group weekly produces excellent results. Example: 3 exercises × 3-4 sets each for chest. Intermediates (1-3 years): 12-18 sets per muscle group weekly as adaptation requires increased volume. Advanced (3+ years): 15-20+ sets may be necessary, though individual recovery capacity varies widely. More volume doesn't always equal more growth—excessive volume impairs recovery and can reduce gains. Frequency (training muscle groups multiple times weekly): Training each muscle 2-3x per week through full-body or upper/lower splits produces superior hypertrophy compared to body-part splits (training each muscle once weekly). Example: hitting chest Monday and Thursday (2x weekly) with 6-9 sets each session totals 12-18 weekly sets with better protein synthesis stimulation than one 12-18 set marathon session. Muscle protein synthesis elevates for 24-48 hours post-training, so hitting muscles more frequently maximizes time spent in anabolic state. Recommended training splits: Full-Body (3x weekly): Train all major muscle groups each session. Ideal for beginners, time-efficient, maximum frequency. Example: Monday/Wednesday/Friday—squats, bench press, rows, overhead press, Romanian deadlifts, 3-4 sets each. Upper/Lower (4x weekly): Alternate upper body and lower body days. Balances volume and recovery. Example: Monday (upper), Tuesday (lower), Thursday (upper), Friday (lower). Push/Pull/Legs (6x weekly or 3x weekly): Separate pushing movements (chest, shoulders, triceps), pulling (back, biceps), and legs. Allows high volume per session with adequate recovery. Can run 3x weekly (Monday push, Wednesday pull, Friday legs) or 6x weekly (repeat the cycle twice). Avoid traditional body-part splits: Training chest Monday, back Tuesday, shoulders Wednesday, legs Thursday, arms Friday (each muscle once weekly) produces inferior results compared to higher-frequency approaches for natural lifters. This approach suits enhanced athletes (steroids) who recover faster but underutilizes natural protein synthesis response. Exercise selection prioritization: Compound movements (exercises using multiple joints/muscle groups) should form the foundation: Squats, deadlifts, bench press, overhead press, rows, pull-ups, dips—these exercises allow heavy loading and stimulate multiple muscle groups simultaneously, creating the greatest hypertrophy stimulus and hormonal response. Aim for 70-80% of training volume from compounds. Isolation exercises (single-joint movements) supplement compounds for targeted muscle development: Bicep curls, tricep extensions, lateral raises, leg curls, calf raises—useful for bringing up lagging muscle groups or adding volume without excessive systemic fatigue. Rep ranges and intensity: Hypertrophy occurs across a range of intensities when sets are taken close to failure: 6-12 reps (70-85% 1RM): Traditional hypertrophy range, balances mechanical tension and metabolic stress effectively. 12-20 reps (60-70% 1RM): Higher rep training equally effective for muscle growth when taken near failure, though requires more discomfort tolerance. 5-6 reps (85-90% 1RM): Emphasizes strength but builds muscle when combined with adequate volume. Variety across rep ranges provides comprehensive stimulus—heavy (5-6 reps), moderate (8-12 reps), and higher (15-20 reps) all have merit. Rest and recovery: Train each muscle group with 48-72 hours recovery between sessions. Sleep 7-9 hours nightly for optimal protein synthesis and hormonal balance (growth hormone, testosterone). Deload weeks (reduced volume/intensity) every 4-6 weeks prevent accumulated fatigue and overtraining. Beginner sample program (3 days/week full-body): Day A: Squats 3×8-10, Bench Press 3×8-10, Barbell Rows 3×8-10, Overhead Press 2×10-12, Romanian Deadlifts 2×10-12, Bicep Curls 2×12-15. Day B: Deadlifts 3×6-8, Incline Dumbbell Press 3×10-12, Pull-Ups 3×8-12, Dumbbell Shoulder Press 2×10-12, Leg Press 2×12-15, Tricep Pushdowns 2×12-15. Day C: Front Squats 3×10-12, Dumbbell Bench Press 3×10-12, Seated Cable Rows 3×10-12, Lateral Raises 3×12-15, Leg Curls 2×12-15, Hammer Curls 2×12-15. Progressive overload: Aim to add 5 lbs to lower body lifts and 2.5 lbs to upper body lifts weekly, or add 1-2 reps when weight increases aren't possible.",
    order: 6
  }
];

export default function WeightGainCalculatorClient({ relatedCalculators = [] }: WeightGainCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('weight-gain-calculator');

  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(25);
  const [currentWeight, setCurrentWeight] = useState(150);
  const [goalWeight, setGoalWeight] = useState(170);
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(10);
  const [heightCm, setHeightCm] = useState(178);
  const [activityLevel, setActivityLevel] = useState(1.55);
  const [gainRate, setGainRate] = useState<GainRate>('moderate');
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [heightUnit, setHeightUnit] = useState<'ft' | 'cm'>('ft');

  const [results, setResults] = useState({
    bmr: 0,
    maintenanceCalories: 0,
    dailyCalories: 0,
    dailySurplus: 0,
    weeksToGoal: 0,
    totalToGain: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });

  useEffect(() => {
    calculateWeightGain();
  }, [gender, age, currentWeight, goalWeight, feet, inches, heightCm, activityLevel, gainRate, weightUnit, heightUnit]);

  const calculateWeightGain = () => {
    // Convert weight to kg
    const weightKg = weightUnit === 'lbs' ? currentWeight * 0.453592 : currentWeight;
    const goalWeightKg = weightUnit === 'lbs' ? goalWeight * 0.453592 : goalWeight;

    // Convert height to cm
    const heightInCm = heightUnit === 'ft' ? (feet * 12 + inches) * 2.54 : heightCm;

    // Mifflin-St Jeor BMR
    let bmr: number;
    if (gender === 'male') {
      bmr = (10 * weightKg) + (6.25 * heightInCm) - (5 * age) + 5;
    } else {
      bmr = (10 * weightKg) + (6.25 * heightInCm) - (5 * age) - 161;
    }

    const maintenanceCalories = Math.round(bmr * activityLevel);

    // Calculate surplus based on gain rate
    const lbsPerWeek = gainRateInfo[gainRate].lbsPerWeek;
    const weeklyCalorieSurplus = lbsPerWeek * 3500; // 3500 cal = 1 lb
    const dailySurplus = Math.round(weeklyCalorieSurplus / 7);
    const dailyCalories = maintenanceCalories + dailySurplus;

    // Calculate time to goal
    const totalToGainKg = goalWeightKg - weightKg;
    const totalToGainLbs = totalToGainKg * 2.20462;
    const weeksToGoal = Math.max(0, Math.round(totalToGainLbs / lbsPerWeek));

    // Calculate macros (25% protein, 45% carbs, 30% fats)
    const protein = Math.round((dailyCalories * 0.25) / 4);
    const carbs = Math.round((dailyCalories * 0.45) / 4);
    const fats = Math.round((dailyCalories * 0.30) / 9);

    setResults({
      bmr: Math.round(bmr),
      maintenanceCalories,
      dailyCalories,
      dailySurplus,
      weeksToGoal,
      totalToGain: weightUnit === 'lbs' ? Math.round(totalToGainLbs * 10) / 10 : Math.round(totalToGainKg * 10) / 10,
      protein,
      carbs,
      fats
    });
  };

  const handleWeightUnitChange = (unit: 'lbs' | 'kg') => {
    if (unit !== weightUnit) {
      if (unit === 'kg') {
        setCurrentWeight(Math.round(currentWeight * 0.453592 * 10) / 10);
        setGoalWeight(Math.round(goalWeight * 0.453592 * 10) / 10);
      } else {
        setCurrentWeight(Math.round(currentWeight / 0.453592));
        setGoalWeight(Math.round(goalWeight / 0.453592));
      }
      setWeightUnit(unit);
    }
  };

  const handleHeightUnitChange = (unit: 'ft' | 'cm') => {
    if (unit !== heightUnit) {
      if (unit === 'cm') {
        const totalInches = feet * 12 + inches;
        setHeightCm(Math.round(totalInches * 2.54));
      } else {
        const totalInches = Math.round(heightCm / 2.54);
        setFeet(Math.floor(totalInches / 12));
        setInches(totalInches % 12);
      }
      setHeightUnit(unit);
    }
  };

  return (
    <main className="flex-grow">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">{getH1('Weight Gain Calculator')}</h1>
          <p className="text-gray-600">Calculate calories and macros for healthy weight gain and muscle building</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          {/* Gender Selection */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Gender</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  gender === 'male'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <span className="text-2xl mb-1 block">👨</span>
                <span className="font-medium">Male</span>
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  gender === 'female'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <span className="text-2xl mb-1 block">👩</span>
                <span className="font-medium">Female</span>
              </button>
            </div>
          </div>

          {/* Age Slider */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Age</label>
              <span className="text-lg font-bold text-blue-600">{age} years</span>
            </div>
            <input
              type="range"
              min="15"
              max="80"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>15</span>
              <span>80</span>
            </div>
          </div>

          {/* Current Weight */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Current Weight</label>
              <div className="inline-flex bg-gray-100 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => handleWeightUnitChange('lbs')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    weightUnit === 'lbs' ? 'bg-white shadow text-blue-600' : 'text-gray-500'
                  }`}
                >
                  lbs
                </button>
                <button
                  type="button"
                  onClick={() => handleWeightUnitChange('kg')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    weightUnit === 'kg' ? 'bg-white shadow text-blue-600' : 'text-gray-500'
                  }`}
                >
                  kg
                </button>
              </div>
            </div>
            <input
              type="number"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              min="50"
              step="0.1"
            />
          </div>

          {/* Goal Weight */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Goal Weight</label>
              <span className="text-sm text-gray-500">{weightUnit}</span>
            </div>
            <input
              type="number"
              value={goalWeight}
              onChange={(e) => setGoalWeight(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              min="50"
              step="0.1"
            />
          </div>

          {/* Height */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Height</label>
              <div className="inline-flex bg-gray-100 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => handleHeightUnitChange('ft')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    heightUnit === 'ft' ? 'bg-white shadow text-blue-600' : 'text-gray-500'
                  }`}
                >
                  ft/in
                </button>
                <button
                  type="button"
                  onClick={() => handleHeightUnitChange('cm')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    heightUnit === 'cm' ? 'bg-white shadow text-blue-600' : 'text-gray-500'
                  }`}
                >
                  cm
                </button>
              </div>
            </div>
            {heightUnit === 'ft' ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="number"
                    value={feet}
                    onChange={(e) => setFeet(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    min="3"
                    max="8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">ft</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={inches}
                    onChange={(e) => setInches(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    min="0"
                    max="11"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">in</span>
                </div>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  min="100"
                  max="250"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">cm</span>
              </div>
            )}
          </div>

          {/* Activity Level */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Activity Level</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {activityLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setActivityLevel(level.value)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    activityLevel === level.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <span className="text-xl block mb-1">{level.emoji}</span>
                  <span className="text-xs font-medium block">{level.label}</span>
                  <span className="text-[10px] text-gray-500 block">{level.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Weight Gain Rate */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Weight Gain Rate</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(gainRateInfo) as GainRate[]).map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setGainRate(rate)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    gainRate === rate
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <span className="text-xl block mb-1">{gainRateInfo[rate].emoji}</span>
                  <span className="text-xs font-medium block">{gainRateInfo[rate].label}</span>
                  <span className="text-[10px] text-gray-500 block">{gainRateInfo[rate].lbsPerWeek} lb/wk</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Primary Result - Daily Calories */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-3 sm:p-4 md:p-6 text-white">
              <div className="text-center">
                <div className="text-green-100 text-sm font-medium mb-1">Daily Calories for Weight Gain</div>
                <div className="text-4xl sm:text-5xl font-bold mb-2">{results.dailyCalories.toLocaleString()}</div>
                <div className="text-green-100 text-sm">calories per day</div>
              </div>
            </div>

            {/* Secondary Results Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white text-center">
                <div className="text-blue-100 text-xs mb-1">Calorie Surplus</div>
                <div className="text-2xl font-bold">+{results.dailySurplus}</div>
                <div className="text-blue-100 text-xs">cal/day</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white text-center">
                <div className="text-orange-100 text-xs mb-1">Time to Goal</div>
                <div className="text-2xl font-bold">{results.weeksToGoal}</div>
                <div className="text-orange-100 text-xs">weeks</div>
              </div>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-gray-500 text-xs mb-1">Maintenance</div>
                <div className="text-xl font-bold text-gray-800">{results.maintenanceCalories.toLocaleString()}</div>
                <div className="text-gray-400 text-xs">calories</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-gray-500 text-xs mb-1">Weight to Gain</div>
                <div className="text-xl font-bold text-gray-800">{results.totalToGain}</div>
                <div className="text-gray-400 text-xs">{weightUnit}</div>
              </div>
            </div>

            {/* Macro Distribution */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Daily Macros</h4>
              <div className="h-4 rounded-full overflow-hidden flex mb-3">
                <div className="bg-red-500" style={{ width: '25%' }}></div>
                <div className="bg-yellow-500" style={{ width: '45%' }}></div>
                <div className="bg-blue-500" style={{ width: '30%' }}></div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-red-600">{results.protein}g</div>
                  <div className="text-xs text-gray-500">Protein (25%)</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-600">{results.carbs}g</div>
                  <div className="text-xs text-gray-500">Carbs (45%)</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">{results.fats}g</div>
                  <div className="text-xs text-gray-500">Fats (30%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Tips Section */}
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-green-50 rounded-2xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
              <span>🥗</span> Nutrition Tips
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                Eat protein with every meal (eggs, chicken, fish, legumes)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                Include calorie-dense foods (nuts, avocado, olive oil)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                Eat 5-6 smaller meals instead of 3 large ones
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                Post-workout nutrition is crucial for muscle growth
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-2xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
              <span>🏋️</span> Training Tips
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                Focus on compound exercises (squats, deadlifts, bench press)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                Progressive overload - gradually increase weights
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                Rest 48-72 hours between training same muscle groups
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                Get 7-9 hours of sleep for optimal recovery
              </li>
            </ul>
          </div>
        </div>

        {/* High Calorie Foods */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Calorie-Dense Foods for Weight Gain</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl block mb-2">🥜</span>
              <div className="font-semibold text-gray-800">Nuts & Nut Butter</div>
              <div className="text-xs text-gray-500">~170 cal/oz</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl block mb-2">🥑</span>
              <div className="font-semibold text-gray-800">Avocado</div>
              <div className="text-xs text-gray-500">~320 cal/fruit</div>
            </div>
<div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl block mb-2">🫒</span>
              <div className="font-semibold text-gray-800">Olive Oil</div>
              <div className="text-xs text-gray-500">~120 cal/tbsp</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl block mb-2">🧀</span>
              <div className="font-semibold text-gray-800">Cheese</div>
              <div className="text-xs text-gray-500">~110 cal/oz</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl block mb-2">🍌</span>
              <div className="font-semibold text-gray-800">Banana</div>
              <div className="text-xs text-gray-500">~105 cal/fruit</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl block mb-2">🥛</span>
              <div className="font-semibold text-gray-800">Whole Milk</div>
              <div className="text-xs text-gray-500">~150 cal/cup</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl block mb-2">🥣</span>
              <div className="font-semibold text-gray-800">Oats</div>
              <div className="text-xs text-gray-500">~300 cal/cup</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl block mb-2">🍯</span>
              <div className="font-semibold text-gray-800">Honey</div>
              <div className="text-xs text-gray-500">~64 cal/tbsp</div>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-12 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">The Science of Healthy Weight Gain and Muscle Building</h2>

          <div className="space-y-3 sm:space-y-4 md:space-y-6 text-gray-700">
            <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-l-4 border-green-500">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Understanding Energy Balance for Weight Gain</h3>
              <p className="mb-3">
                Weight gain fundamentally requires a caloric surplus—consuming more energy than your body expends. However, the quality of that surplus determines whether gained weight consists primarily of muscle mass or adipose tissue (body fat). Strategic weight gain maximizes lean mass accumulation while limiting fat gain.
              </p>
              <p>
                This calculator employs the Mifflin-St Jeor equation to establish your Basal Metabolic Rate (BMR)—the calories your body burns at complete rest maintaining essential physiological functions. BMR is then multiplied by your activity factor (1.2-1.9) to determine Total Daily Energy Expenditure (TDEE). Adding a calculated surplus based on your desired gain rate produces your target daily calorie intake. The 3,500-calorie rule (3,500 calories ≈ 1 pound of body mass) allows estimation of weekly gain rates, though individual variation exists due to metabolic efficiency, Non-Exercise Activity Thermogenesis (NEAT), and macronutrient composition.
              </p>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-l-4 border-blue-500">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Muscle Protein Synthesis and Hypertrophy</h3>
              <p className="mb-3">
                Muscle growth (hypertrophy) occurs when muscle protein synthesis (MPS) exceeds muscle protein breakdown (MPB) over extended periods. Resistance training creates mechanical tension, metabolic stress, and muscle damage—stimuli that trigger cellular signaling pathways (primarily mTOR) to initiate protein synthesis.
              </p>
              <p className="mb-3">
                <strong>The Role of Calorie Surplus:</strong> Adequate energy availability ensures your body directs consumed protein toward muscle building rather than oxidizing it for energy. Calorie surplus also optimizes anabolic hormone profiles—testosterone, insulin-like growth factor-1 (IGF-1), and insulin—while reducing catabolic cortisol. However, muscle protein synthesis rates have an upper limit: consuming 1,000 calories above maintenance doesn't build muscle twice as fast as a 500-calorie surplus. Beyond ~300-500 calorie surplus, additional energy primarily stores as adipose tissue.
              </p>
              <p>
                <strong>Training-Nutrition Synergy:</strong> Progressive resistance training (consistently increasing weight, reps, or volume) provides the stimulus for adaptation, while adequate protein (1.6-2.2 g/kg bodyweight) and calorie surplus provide the resources. Neither alone suffices—training without surplus leads to limited or zero muscle gain, while surplus without training produces pure fat accumulation.
              </p>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-l-4 border-purple-500">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Macronutrient Distribution for Muscle Growth</h3>
              <p className="mb-3">
                While total calorie intake determines overall weight change, macronutrient composition influences the ratio of muscle to fat gained:
              </p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-800">Protein (0.7-1.0 g/lb or 1.6-2.2 g/kg bodyweight)</p>
                  <p>The most critical macronutrient for muscle building. Protein provides essential amino acids—particularly leucine, isoleucine, and valine (branched-chain amino acids)—that trigger mTOR signaling and provide building blocks for muscle tissue. Distribute protein across 4-6 meals (20-40g per meal) to maintain elevated MPS throughout the day rather than one or two large doses.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Carbohydrates (40-50% of calories or 2-4 g/lb bodyweight)</p>
                  <p>Carbohydrates fuel intense resistance training by replenishing muscle glycogen stores depleted during workouts. Adequate carb intake spares protein from being oxidized for energy, allowing it to be used for muscle building instead. Post-workout carbohydrates combined with protein maximize muscle glycogen resynthesis and protein synthesis. Complex carbohydrates (oats, rice, potatoes, whole grains) provide sustained energy, while simple carbs around training support performance and recovery.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Fats (20-35% of calories or 0.3-0.5 g/lb bodyweight)</p>
                  <p>Dietary fat is essential for hormone production—testosterone and growth hormone synthesis both require adequate fat intake (particularly saturated and monounsaturated fats). Fat provides 9 calories per gram (versus 4 for protein and carbs), making it calorie-dense and useful for hard-gainers who struggle to consume sufficient total calories. Prioritize healthy fats: olive oil, avocados, nuts, fatty fish, whole eggs. Avoid trans fats entirely and limit excessive saturated fat to {'<'}10% of calories.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-l-4 border-orange-500">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Optimizing Gain Rate for Body Composition</h3>
              <p className="mb-3">
                The rate of weight gain dramatically affects whether accumulated mass is primarily muscle or fat. Research and practical experience reveal optimal approaches for different training levels:
              </p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-800">Beginners (0-1 year resistance training)</p>
                  <p>Can gain 1-2 lbs monthly of pure muscle tissue during the first year—the 'newbie gains' phenomenon. Targeting 0.5-1 lb weekly total weight gain allows maximal muscle accumulation with acceptable fat gain (~30-40% of gained weight). Higher gain rates don't accelerate muscle building beyond this natural limit.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Intermediate Lifters (1-3 years)</p>
                  <p>Muscle building slows to 0.5-1 lb monthly. Targeting 0.25-0.5 lb weekly total gain prevents excessive fat accumulation while supporting continued muscle growth. Patience becomes critical—forcing faster gains through larger surpluses primarily adds body fat.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Advanced Lifters (3+ years)</p>
                  <p>Approaching genetic potential, with 2-5 lbs annual muscle gain representing excellent progress. Very slow weight gain (0.1-0.25 lb weekly) or even body recomposition approaches (gaining muscle while maintaining or losing fat) become appropriate. Large calorie surpluses serve no purpose at this stage.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Common Weight Gain Mistakes to Avoid</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>Excessive Calorie Surplus ("Dirty Bulking"):</strong> Consuming 1,000+ calories above maintenance rapidly increases body fat without proportionally increasing muscle gain. This creates a longer, more difficult cutting phase later and may impair insulin sensitivity and metabolic health.</li>
                <li><strong>Neglecting Protein Intake:</strong> Failing to consume adequate protein (1.6-2.2 g/kg) limits muscle protein synthesis regardless of total calories. Protein is the building block—calories without sufficient protein build fat, not muscle.</li>
                <li><strong>Inconsistent Training:</strong> Muscle growth requires progressive overload—consistently increasing training stimulus through added weight, reps, or volume. Random workouts without progression provide no growth stimulus despite calorie surplus.</li>
                <li><strong>Ignoring Sleep and Recovery:</strong> Muscle protein synthesis, testosterone production, and growth hormone secretion all peak during deep sleep. Chronic sleep deprivation ({'<'}7 hours nightly) can reduce muscle gains by 20-30% despite perfect nutrition and training.</li>
                <li><strong>Underestimating Calorie Needs:</strong> Hard-gainers with high NEAT (fidgeting, frequent movement) or physically demanding jobs may require 3,500-4,500+ calories daily for surplus. Failing to eat enough prevents any weight gain despite perceived 'eating more.'</li>
                <li><strong>Impatience with Results:</strong> Natural muscle building is slow—expecting more than 2-3 lbs muscle monthly (beginners) or 0.5-1 lb monthly (intermediates) leads to unnecessarily aggressive bulks that add mostly fat.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQ Section */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <FirebaseFAQs pageId="weight-gain-calculator" fallbackFaqs={fallbackFaqs} />
        </div>
{/* Related Calculators */}
        {relatedCalculators.length > 0 && (
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedCalculators.map((calc) => (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                  <div className={`w-10 h-10 ${calc.color || 'bg-gray-500'} rounded-lg flex items-center justify-center mb-3`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                  <p className="text-xs text-gray-500">{calc.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 text-center">
          <p className="text-sm text-gray-600">
            <strong>Disclaimer:</strong> This calculator provides estimates based on standard formulas. Individual results may vary based on metabolism, genetics, and other factors. Consult a healthcare provider or registered dietitian before starting any weight gain program.
          </p>
        </div>
      </div>
    </main>
  );
}
