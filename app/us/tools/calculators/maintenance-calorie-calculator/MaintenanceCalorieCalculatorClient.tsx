'use client';

import { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner, CalculatorMobileMrec2 } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: "What are maintenance calories and how do they work?",
    answer: "Maintenance calories are the exact number of calories you need to consume daily to maintain your current body weight—neither gaining nor losing. This number equals your Total Daily Energy Expenditure (TDEE), which combines your Basal Metabolic Rate (BMR)—the calories your body burns at rest for basic functions like breathing, circulation, and cell production—with the calories burned through daily activities and exercise. Your body weight remains stable when calorie intake matches TDEE because energy input equals energy output. If you consistently eat more than your maintenance calories, you create a surplus that gets stored as body mass (fat and muscle), leading to weight gain. Conversely, eating fewer calories than your TDEE creates a deficit, forcing your body to tap into stored energy (primarily fat), resulting in weight loss.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate are maintenance calorie calculators?",
    answer: "Maintenance calorie calculators provide estimates that are typically accurate within ±10-20% for most people. The Mifflin-St Jeor equation used by this calculator is one of the most validated formulas, with research showing it accurately predicts metabolic rate for approximately 70% of the population. However, individual variation exists due to factors not captured by basic formulas: genetics can influence metabolic rate by up to 30%, muscle mass significantly increases calorie burn (muscle tissue burns more calories at rest than fat tissue), hormonal conditions (thyroid disorders, PCOS, menopause) can alter metabolism, medication side effects may affect energy expenditure, previous dieting history and metabolic adaptation can lower BMR, and non-exercise activity thermogenesis (NEAT)—fidgeting, posture, spontaneous movement—varies considerably between individuals. The calculator provides a scientifically-based starting point, but you should monitor your actual weight changes over 2-4 weeks and adjust your calorie intake by 100-200 calories based on real-world results.",
    order: 2
  },
  {
    id: '3',
    question: "How should I adjust my activity level selection?",
    answer: "Selecting the correct activity level multiplier is crucial for accurate results because it can change your TDEE by 500-1000+ calories. Sedentary (1.2): You have a desk job, drive everywhere, and exercise less than 30 minutes per week—most Americans fall into this category despite overestimating their activity. Lightly Active (1.375): You walk or do light exercise 1-3 days per week for 30-60 minutes, or you have a job that requires occasional walking/standing. Moderately Active (1.55): You engage in moderate exercise (brisk walking, cycling, recreational sports) 3-5 days per week for 45-60 minutes, or you have a job requiring regular physical activity (server, retail, nurse). Very Active (1.725): You perform vigorous exercise 6-7 days per week (running, HIIT, competitive sports) or combine moderate daily exercise with an active job. Extremely Active (1.9): You're an athlete training multiple hours daily, have a highly physical job (construction, farming) while also exercising, or engage in heavy physical training twice per day. Research shows people tend to overestimate their activity level by 1-2 categories—if uncertain, choose the lower activity level and adjust based on actual results.",
    order: 3
  },
  {
    id: '4',
    question: "What's a safe calorie deficit for weight loss?",
    answer: "A safe and sustainable calorie deficit balances effective fat loss with preservation of muscle mass, metabolic health, and adherence. The evidence-based recommendations are: Mild deficit (250-300 calories below TDEE) produces 0.5 lb/week loss—ideal for those close to their goal weight, athletes maintaining performance, or individuals who have struggled with restrictive diets. This rate minimizes muscle loss and metabolic adaptation. Moderate deficit (500 calories below TDEE) produces 1 lb/week loss—the gold standard recommendation for most people, balancing meaningful progress with sustainability. Studies show this rate optimizes fat loss while preserving lean mass when combined with protein intake of 0.7-1g per pound of body weight and resistance training. Aggressive deficit (750-1000 calories below TDEE) produces 1.5-2 lbs/week loss—appropriate only for those with significant weight to lose (BMI >30) and under professional supervision. This rate increases risk of muscle loss, metabolic slowdown, nutrient deficiencies, and gallstone formation. Never go below 1,200 calories (women) or 1,500 calories (men) regardless of calculations, as extreme restriction severely impairs hormonal function, immune health, and can trigger binge eating patterns.",
    order: 4
  },
  {
    id: '5',
    question: "How many calories do I need for muscle gain?",
    answer: "Building muscle requires a calorie surplus combined with progressive resistance training and adequate protein intake. Research on body recomposition shows: Small surplus (200-300 calories above TDEE) is optimal for lean muscle gain with minimal fat accumulation—studies show trained individuals can gain 0.25-0.5 lbs of muscle per week at this rate. This approach is ideal for those who want to stay lean, have been training for years, or are concerned about gaining fat. Moderate surplus (300-500 calories above TDEE) supports faster muscle growth for beginners and intermediates who can build muscle more rapidly—new trainees may gain 1-2 lbs per month of muscle tissue. This traditional 'clean bulk' approach requires monitoring body composition to ensure weight gain is primarily muscle rather than fat. Aggressive surplus (500-1000+ calories) produces rapid weight gain but research shows it doesn't proportionally increase muscle protein synthesis—the extra calories largely convert to fat storage. The maximum rate of muscle gain is determined by training status, genetics, and hormones, not simply eating more. Critical factors beyond calories include: protein intake of 0.7-1g per pound of bodyweight daily, progressive overload in resistance training (increasing weight, reps, or volume over time), and adequate sleep (7-9 hours) for muscle recovery and growth hormone release.",
    order: 5
  },
  {
    id: '6',
    question: "Why isn't my weight changing even though I'm following my calculated calories?",
    answer: "Weight plateaus or unexpected changes despite following calculated calories occur due to several well-documented factors. Calorie tracking errors are the most common culprit—research shows people underestimate food intake by 20-50% on average due to: inaccurate portion sizes (measuring cups vs food scales), not tracking cooking oils, condiments, beverages, and 'tastes' while cooking, restaurant meals containing 20-50% more calories than listed, and weekends having significantly higher intake than weekdays. Even with perfect tracking, several physiological factors affect the scale: water retention can mask fat loss for 1-3 weeks due to increased sodium intake, hormonal fluctuations (menstrual cycle can cause 2-5 lb water weight swings), new exercise routines causing muscle inflammation and water retention, or higher carbohydrate intake (each gram of stored carbohydrate binds 3-4 grams of water). Metabolic adaptation occurs after prolonged dieting—your body reduces TDEE through decreased NEAT (fewer spontaneous movements), improved metabolic efficiency, and hormonal changes (reduced thyroid hormones, leptin, testosterone) that can lower actual calorie needs by 10-25% below predicted values. If weight hasn't changed in 3-4 weeks despite consistent adherence, adjust intake by 100-200 calories and reassess in another 2-3 weeks.",
    order: 6
  }
];

export default function MaintenanceCalorieCalculatorClient() {
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState(170);
  const [weightUnit, setWeightUnit] = useState('lbs');
  const [height, setHeight] = useState(70);
  const [heightUnit, setHeightUnit] = useState('inches');
  const [activityLevel, setActivityLevel] = useState(1.55);
  const [results, setResults] = useState<any>(null);

  const calculateMaintenance = () => {
    let weightKg = weightUnit === 'lbs' ? weight * 0.453592 : weight;
    let heightCm = heightUnit === 'inches' ? height * 2.54 : height;

    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    const tdee = bmr * activityLevel;

    // Calculate different goals
    const maintain = tdee;
    const mildWeightLoss = tdee - 250;
    const weightLoss = tdee - 500;
    const extremeWeightLoss = tdee - 1000;
    const mildWeightGain = tdee + 250;
    const weightGain = tdee + 500;

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      maintain: Math.round(maintain),
      mildWeightLoss: Math.round(mildWeightLoss),
      weightLoss: Math.round(weightLoss),
      extremeWeightLoss: Math.round(extremeWeightLoss),
      mildWeightGain: Math.round(mildWeightGain),
      weightGain: Math.round(weightGain)
    });
  };

  useEffect(() => {
    if (weight > 0 && height > 0 && age > 0) {
      calculateMaintenance();
    }
  }, [age, gender, weight, weightUnit, height, heightUnit, activityLevel]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Maintenance Calorie Calculator</h1>
        <p className="text-lg text-gray-600">Calculate your daily calorie needs to maintain, lose, or gain weight</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Your Information</h2>

          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  min="15"
                  max="100"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="lbs">lbs</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={heightUnit}
                  onChange={(e) => setHeightUnit(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="inches">inches</option>
                  <option value="cm">cm</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Activity Level</label>
              <div className="space-y-2">
                {[
                  { value: 1.2, label: 'Sedentary', desc: 'Little/no exercise' },
                  { value: 1.375, label: 'Light', desc: '1-3 days/week' },
                  { value: 1.55, label: 'Moderate', desc: '3-5 days/week' },
                  { value: 1.725, label: 'Active', desc: '6-7 days/week' },
                  { value: 1.9, label: 'Very Active', desc: 'Physical job + exercise' }
                ].map((activity) => (
                  <label
                    key={activity.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                      activityLevel === activity.value ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={activityLevel === activity.value}
                      onChange={() => setActivityLevel(activity.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{activity.label}</div>
                      <div className="text-xs text-gray-600">{activity.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {results && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Your Results</h3>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-sm text-gray-600">BMR</div>
                      <div className="text-2xl font-bold text-blue-600">{results.bmr}</div>
                      <div className="text-xs text-gray-500">Basal Rate</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">TDEE</div>
                      <div className="text-2xl font-bold text-green-600">{results.tdee}</div>
                      <div className="text-xs text-gray-500">Total Energy</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-green-800">Maintain Weight</div>
                        <div className="text-xs text-green-600">Keep current weight</div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{results.maintain}</div>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-orange-800">Mild Weight Loss</div>
                        <div className="text-xs text-orange-600">-0.5 lbs/week</div>
                      </div>
                      <div className="text-xl font-bold text-orange-600">{results.mildWeightLoss}</div>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-red-800">Weight Loss</div>
                        <div className="text-xs text-red-600">-1 lb/week</div>
                      </div>
                      <div className="text-xl font-bold text-red-600">{results.weightLoss}</div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-purple-800">Extreme Loss</div>
                        <div className="text-xs text-purple-600">-2 lbs/week</div>
                      </div>
                      <div className="text-xl font-bold text-purple-600">{results.extremeWeightLoss}</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-blue-800">Mild Weight Gain</div>
                        <div className="text-xs text-blue-600">+0.5 lbs/week</div>
                      </div>
                      <div className="text-xl font-bold text-blue-600">{results.mildWeightGain}</div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-indigo-800">Weight Gain</div>
                        <div className="text-xs text-indigo-600">+1 lb/week</div>
                      </div>
                      <div className="text-xl font-bold text-indigo-600">{results.weightGain}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-3 sm:p-4 md:p-6">
              <h4 className="font-semibold text-yellow-800 mb-3">⚠️ Important Notes</h4>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li>• These are estimates based on formulas</li>
                <li>• Monitor progress and adjust as needed</li>
                <li>• Don't go below 1200 cal (women) or 1500 cal (men)</li>
                <li>• Extreme deficits can harm metabolism</li>
                <li>• Consult professional for medical advice</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-blue-800 mb-2">Maintenance Calories</h3>
          <p className="text-sm text-blue-700">
            The amount of calories you need daily to maintain your current weight without gaining or losing.
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-green-800 mb-2">Calorie Deficit</h3>
          <p className="text-sm text-green-700">
            500 cal deficit = ~1 lb/week loss. 1000 cal deficit = ~2 lbs/week loss. Sustainable loss is 1-2 lbs/week.
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-purple-800 mb-2">Calorie Surplus</h3>
          <p className="text-sm text-purple-700">
            250-500 cal surplus for muscle gain. Combine with strength training for optimal results.
          </p>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-3 sm:p-5 md:p-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Understanding Maintenance Calories and Energy Balance</h2>

        <div className="space-y-3 sm:space-y-4 md:space-y-6 text-gray-700">
          <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">The Science of Energy Balance</h3>
            <p className="mb-3">
              Your maintenance calories represent the precise point of energy equilibrium where calories consumed equal calories expended. This fundamental concept, governed by the first law of thermodynamics, determines whether your body weight increases, decreases, or remains stable over time.
            </p>
            <p>
              <strong>Total Daily Energy Expenditure (TDEE)</strong> consists of four primary components: <strong>Basal Metabolic Rate (BMR)</strong>—comprising 60-75% of total expenditure—includes the energy required for essential physiological functions like cardiovascular circulation, respiratory function, cellular metabolism, protein synthesis, and maintaining body temperature. <strong>Thermic Effect of Food (TEF)</strong>—accounting for 8-15% of TDEE—represents calories burned during digestion, absorption, and nutrient processing (protein requires 20-30% of its calories for digestion, carbohydrates 5-10%, and fats 0-3%). <strong>Exercise Activity Thermogenesis (EAT)</strong>—varying from 5-30% depending on training volume—includes structured physical activity and intentional exercise. <strong>Non-Exercise Activity Thermogenesis (NEAT)</strong>—contributing 15-30% in active individuals—encompasses all movement outside formal exercise, including occupational activities, fidgeting, maintaining posture, and spontaneous physical activity.
            </p>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-l-4 border-green-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">The Mifflin-St Jeor Equation Explained</h3>
            <p className="mb-3">
              This calculator uses the Mifflin-St Jeor equation, developed in 1990 and validated as the most accurate predictor of resting metabolic rate in multiple peer-reviewed studies. The formula is:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-3 font-mono text-sm">
              <div className="mb-2"><strong>Men:</strong> BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5</div>
              <div><strong>Women:</strong> BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161</div>
            </div>
            <p>
              The equation accounts for several metabolic realities: weight correlates positively with metabolic rate because larger bodies require more energy to maintain cellular function across greater tissue mass; height increases metabolic demands through higher surface area requiring temperature regulation and increased organ size; age is inversely related to BMR as lean muscle mass naturally declines by 3-8% per decade after age 30, and metabolic efficiency increases with aging; and sex differences in body composition—men typically carry 10-15% more muscle mass than women—explain the 161-calorie differential favoring male metabolic rates.
            </p>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-l-4 border-purple-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Practical Application for Weight Management</h3>
            <p className="mb-3">
              Once you've calculated your maintenance calories, creating an effective nutrition strategy requires understanding the principles of energy manipulation:
            </p>
            <p className="mb-3">
              <strong>For Fat Loss:</strong> The fundamental requirement is a sustained caloric deficit. Research demonstrates that 3,500 calories roughly equals one pound of stored body fat, meaning a daily 500-calorie deficit theoretically produces one pound of weekly fat loss. However, metabolic adaptation complicates this simple math—prolonged restriction triggers hormonal responses (decreased leptin, thyroid hormones, testosterone; increased cortisol and ghrelin) that reduce actual energy expenditure by 10-25% below predicted values. To counteract adaptation: implement diet breaks (eating at maintenance for 1-2 weeks every 8-12 weeks of dieting), prioritize protein intake (0.7-1g per pound bodyweight) to preserve lean mass, maintain resistance training to signal muscle retention, and consider reverse dieting when transitioning to maintenance.
            </p>
            <p className="mb-3">
              <strong>For Muscle Gain:</strong> Building appreciable muscle mass requires a caloric surplus to support protein synthesis, increased training volume, and tissue growth. However, research shows the body can synthesize muscle at a limited rate—natural lifters typically gain 0.25-0.5 lbs of muscle weekly when optimally trained and fed. Exceeding this rate through excessive surplus simply accelerates fat gain. The most effective approach: maintain a modest 200-400 calorie surplus, ensure protein intake of 0.7-1g per pound bodyweight, follow a progressive overload resistance training program, and monitor body composition monthly to ensure weight gain is primarily lean mass rather than adipose tissue.
            </p>
            <p>
              <strong>For Weight Maintenance:</strong> Contrary to popular belief, maintenance isn't passive—it requires the same attention and tracking as weight change phases. Key strategies include: tracking long-term weight trends (weekly averages rather than daily fluctuations), establishing a maintenance range (±3-5 lbs) rather than a single number, continuing strength training to preserve muscle mass, and periodically reassessing TDEE as body composition and activity levels evolve.
            </p>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-l-4 border-orange-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Common Pitfalls and How to Avoid Them</h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-800 mb-1">Tracking Inaccuracy</p>
                <p className="text-sm">The primary reason calculated calories don't match real-world results is measurement error. Studies using doubly labeled water (the gold standard for measuring energy expenditure) show people underestimate intake by 20-50%. Solutions: use a digital food scale for all portions, track everything including cooking oils, beverages, and condiments, log foods before eating to prevent retrospective estimation errors, and recognize that restaurant nutrition information can understate calories by 20-50%.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">Activity Level Overestimation</p>
                <p className="text-sm">Most individuals overestimate their activity multiplier by 1-2 categories. Three 45-minute gym sessions weekly doesn't make you "very active" if you're otherwise sedentary. Be conservative with your selection—it's easier to adjust upward if losing weight too quickly than to salvage a stalled diet from overestimation.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">Ignoring Individual Variation</p>
                <p className="text-sm">Formulas provide population averages, but individual metabolic rates can vary by ±20% from predictions. Former athletes often have elevated TDEE from years of training adaptations. People with PCOS, hypothyroidism, or metabolic syndrome may have suppressed metabolic rates. Use the calculator as your starting point, then adjust based on 3-4 weeks of real-world data.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">Expecting Linear Progress</p>
                <p className="text-sm">Body weight fluctuates 2-5 lbs daily due to water retention, digestive contents, sodium intake, carbohydrate consumption (which binds water), menstrual cycle hormones, inflammation from exercise, and sleep quality. Focus on weekly averages and 4-week trends rather than daily scale readings. Take weekly progress photos and body measurements as alternative metrics of change.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Optimizing Your Nutrition Strategy</h3>
            <p className="mb-3">
              Beyond simply hitting your calorie target, the quality and composition of those calories significantly impacts satiety, performance, body composition, and long-term adherence:
            </p>
            <ul className="space-y-2 text-sm">
              <li><strong>Protein Priority:</strong> Aim for 0.7-1g per pound of bodyweight. Protein has the highest thermic effect (burns 20-30% of its calories during digestion), maximizes satiety per calorie, and preserves muscle mass during deficits or supports growth during surplus.</li>
              <li><strong>Fat Floor:</strong> Never drop below 0.3g per pound of bodyweight (typically 20-30% of total calories). Dietary fat is essential for hormone production (testosterone, estrogen), vitamin absorption (A, D, E, K), cellular membrane structure, and brain function.</li>
              <li><strong>Carbohydrate Flexibility:</strong> After meeting protein and fat requirements, fill remaining calories with carbohydrates based on activity level, training intensity, and personal preference. Higher carb intakes (45-60% of calories) support intense training, improve performance, and enhance recovery, while lower carb approaches (20-40%) may improve satiety and metabolic flexibility for sedentary individuals.</li>
              <li><strong>Meal Timing:</strong> While total daily intake matters most for weight change, strategic timing can optimize performance and recovery. Consider placing 40-50% of daily carbohydrates around training sessions, consuming protein every 3-5 hours to maximize muscle protein synthesis, and frontloading calories earlier in the day if it improves adherence and energy levels.</li>
              <li><strong>Fiber Target:</strong> Aim for 25-35g daily from vegetables, fruits, whole grains, and legumes. Fiber slows gastric emptying (increasing satiety), stabilizes blood sugar, supports gut microbiome health, and reduces cardiovascular disease risk independent of caloric intake.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="mt-12">
        <FirebaseFAQs pageId="maintenance-calorie-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
