'use client';


import React from 'react';
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

interface BabyData {
  size: string;
  weight: string;
  development: string[];
  symptoms: string[];
}

interface BabyDataMap {
  [key: number]: BabyData;
}

interface Milestone {
  week: number;
  title: string;
  description: string;
}

export default function PregnancyDueDateCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('pregnancy-due-date-calculator');

  const fallbackFaqs = [
    {
      id: '1',
      question: "How accurate is the pregnancy due date calculator?",
      answer: "The pregnancy due date calculator provides an estimated due date based on the first day of your last menstrual period or conception date. Only about 5% of babies are born on their exact due date, with most babies (90%) arriving within 2 weeks of the estimated date. Ultrasounds performed in the first trimester can provide a more accurate estimate of your baby's gestational age.",
      order: 1
    },
    {
      id: '2',
      question: "How is the due date calculated?",
      answer: "The due date is typically calculated using Naegele's rule: add 280 days (40 weeks) to the first day of your last menstrual period. This assumes a 28-day menstrual cycle and ovulation occurring on day 14. If your cycle is longer or shorter, the calculator can adjust accordingly. The calculation can also be based on conception date or IVF transfer date for more accuracy.",
      order: 2
    },
    {
      id: '3',
      question: "What is the difference between gestational age and fetal age?",
      answer: "Gestational age is calculated from the first day of your last menstrual period and is the standard used by healthcare providers. Fetal age (or conceptional age) is calculated from the actual date of conception and is typically about 2 weeks less than gestational age. Medical professionals use gestational age because it's more reliable and easier to track.",
      order: 3
    },
    {
      id: '4',
      question: "Can my due date change?",
      answer: "Yes, your due date may be adjusted based on early ultrasound measurements, especially if performed between 8-13 weeks. Ultrasounds at this stage can measure the baby's size with high accuracy and may adjust the due date by several days. However, once established in the first trimester, the due date typically remains consistent throughout the pregnancy.",
      order: 4
    },
    {
      id: '5',
      question: "What are the different trimesters and their key milestones?",
      answer: "Pregnancy is divided into three trimesters: First trimester (weeks 1-12) involves organ formation and highest miscarriage risk; Second trimester (weeks 13-27) is when energy returns, you feel baby movements, and find out the sex; Third trimester (weeks 28-40+) involves rapid growth, final organ maturation, and preparation for birth. Each trimester has specific prenatal appointments and screening tests.",
      order: 5
    },
    {
      id: '6',
      question: "When should I schedule my first prenatal visit?",
      answer: "Schedule your first prenatal visit as soon as you get a positive pregnancy test, typically around 6-8 weeks after your last menstrual period. Your healthcare provider will confirm the pregnancy, calculate your due date, review your medical history, perform initial blood tests, and discuss prenatal vitamins and lifestyle changes. Early prenatal care is crucial for a healthy pregnancy.",
      order: 6
    }
  ];

  const [activeTab, setActiveTab] = useState<'lmp' | 'conception' | 'ivf'>('lmp');
  const [lmpDate, setLmpDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [conceptionDate, setConceptionDate] = useState('');
  const [transferDate, setTransferDate] = useState('');
  const [embryoAge, setEmbryoAge] = useState(5);
  const [showResults, setShowResults] = useState(false);

  // Results state
  const [dueDate, setDueDate] = useState('');
  const [currentWeeks, setCurrentWeeks] = useState(0);
  const [currentDays, setCurrentDays] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [currentTrimester, setCurrentTrimester] = useState('');
  const [babySize, setBabySize] = useState('');
  const [babyWeight, setBabyWeight] = useState('');
  const [developmentText, setDevelopmentText] = useState('');
  const [babyDevelopment, setBabyDevelopment] = useState<string[]>([]);
  const [motherSymptoms, setMotherSymptoms] = useState<string[]>([]);
  const [timeline, setTimeline] = useState<React.ReactElement[]>([]);

  // Baby size and weight data by week
  const babyData: BabyDataMap = {
    4: { size: "Poppy seed", weight: "< 1g", development: ["Neural tube forming", "Heart begins to beat"], symptoms: ["Implantation bleeding possible", "Very early pregnancy symptoms"] },
    5: { size: "Apple seed", weight: "< 1g", development: ["Brain and spinal cord developing", "Arm and leg buds appear"], symptoms: ["Missed period", "Fatigue may begin"] },
    6: { size: "Sweet pea", weight: "< 1g", development: ["Heart chambers forming", "Facial features beginning"], symptoms: ["Morning sickness may start", "Breast tenderness"] },
    8: { size: "Raspberry", weight: "1g", development: ["All major organs present", "Limbs developing"], symptoms: ["Nausea and vomiting", "Food aversions"] },
    10: { size: "Prune", weight: "4g", development: ["Fingers and toes forming", "Vital organs functioning"], symptoms: ["Fatigue", "Frequent urination"] },
    12: { size: "Lime", weight: "14g", development: ["Reflexes developing", "Sex organs forming"], symptoms: ["Morning sickness may improve", "Energy may return"] },
    16: { size: "Avocado", weight: "100g", development: ["Can hear sounds", "Facial expressions"], symptoms: ["Round ligament pain", "Skin changes"] },
    20: { size: "Banana", weight: "300g", development: ["Movements felt by mom", "Hair and nails growing"], symptoms: ["Fetal movements", "Back pain"] },
    24: { size: "Corn on the cob", weight: "600g", development: ["Lungs developing", "Can respond to sounds"], symptoms: ["Leg cramps", "Heartburn"] },
    28: { size: "Eggplant", weight: "1000g", development: ["Eyes can open and close", "Brain tissue increasing"], symptoms: ["Shortness of breath", "Braxton Hicks contractions"] },
    32: { size: "Jicama", weight: "1700g", development: ["Bones hardening", "Practicing breathing"], symptoms: ["Pelvic pressure", "Frequent urination returns"] },
    36: { size: "Romaine lettuce", weight: "2600g", development: ["Immune system developing", "Fat accumulating"], symptoms: ["Nesting instinct", "Swelling"] },
    40: { size: "Watermelon", weight: "3400g", development: ["Fully developed", "Ready for birth"], symptoms: ["Contractions", "Cervical changes"] }
  };

  // Set default date (30 days ago) on mount
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    setLmpDate(thirtyDaysAgo.toISOString().split('T')[0]);
  }, []);

  const handleCalculateLMP = () => {
    if (!lmpDate) {
      alert('Please select the first day of your last menstrual period.');
      return;
    }

    const lmpDateObj = new Date(lmpDate);
    calculateDueDate(lmpDateObj, 280 - (28 - cycleLength));
  };

  const handleCalculateConception = () => {
    if (!conceptionDate) {
      alert('Please select your conception date.');
      return;
    }

    const conceptionDateObj = new Date(conceptionDate);
    const lmpDateObj = new Date(conceptionDateObj.getTime() - (14 * 24 * 60 * 60 * 1000));
    calculateDueDate(lmpDateObj, 280);
  };

  const handleCalculateIVF = () => {
    if (!transferDate) {
      alert('Please select your transfer date.');
      return;
    }

    const transferDateObj = new Date(transferDate);
    const daysToAdd = embryoAge === 3 ? 17 : (embryoAge === 5 ? 19 : 20);
    const lmpDateObj = new Date(transferDateObj.getTime() - (daysToAdd * 24 * 60 * 60 * 1000));
    calculateDueDate(lmpDateObj, 280);
  };

  const calculateDueDate = (lmpDateObj: Date, pregnancyLength: number) => {
    const today = new Date();
    const dueDateObj = new Date(lmpDateObj.getTime() + (pregnancyLength * 24 * 60 * 60 * 1000));

    // Calculate current pregnancy info
    const daysSinceLMP = Math.floor((today.getTime() - lmpDateObj.getTime()) / (24 * 60 * 60 * 1000));
    const weeks = Math.floor(daysSinceLMP / 7);
    const days = daysSinceLMP % 7;
    const remaining = Math.floor((dueDateObj.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    const progress = Math.min(Math.round((daysSinceLMP / pregnancyLength) * 100), 100);

    // Determine trimester
    let trimester = '';
    if (weeks <= 12) {
      trimester = 'First Trimester';
    } else if (weeks <= 27) {
      trimester = 'Second Trimester';
    } else {
      trimester = 'Third Trimester';
    }

    // Get baby data for current week
    const babyWeek = Math.min(Math.max(weeks, 4), 40);
    const weekData = babyData[babyWeek] || babyData[40];

    // Update state
    setDueDate(dueDateObj.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }));
    setCurrentWeeks(weeks);
    setCurrentDays(days);
    setDaysRemaining(remaining);
    setProgressPercentage(progress);
    setCurrentTrimester(trimester);
    setBabySize(weekData.size);
    setBabyWeight(weekData.weight);
    setDevelopmentText(`At ${weeks} weeks, your baby is about the size of a ${weekData.size.toLowerCase()}.`);
    setBabyDevelopment(weekData.development);
    setMotherSymptoms(weekData.symptoms);

    // Create timeline
    createTimeline(lmpDateObj, dueDateObj, weeks);

    setShowResults(true);
  };

  const createTimeline = (lmpDateObj: Date, dueDateObj: Date, weeks: number) => {
    const milestones: Milestone[] = [
      { week: 4, title: 'Missed Period', description: 'First sign of pregnancy' },
      { week: 6, title: 'First Prenatal Visit', description: 'Confirm pregnancy, initial checkup' },
      { week: 12, title: 'End of First Trimester', description: 'Lower risk of miscarriage' },
      { week: 16, title: 'Gender Reveal Possible', description: 'May be able to determine sex' },
      { week: 20, title: 'Anatomy Scan', description: 'Detailed ultrasound, halfway point' },
      { week: 24, title: 'Viability Milestone', description: 'Baby could survive outside womb' },
      { week: 28, title: 'Third Trimester Begins', description: 'Final stretch begins' },
      { week: 32, title: 'Baby Shower Time', description: 'Traditional time for baby shower' },
      { week: 37, title: 'Full Term', description: 'Baby is considered full term' },
      { week: 40, title: 'Due Date', description: 'Expected delivery date' }
    ];

    const timelineElements = milestones.map((milestone, index) => {
      const milestoneDate = new Date(lmpDateObj.getTime() + (milestone.week * 7 * 24 * 60 * 60 * 1000));
      const isPast = weeks >= milestone.week;
      const statusClass = isPast ? 'bg-green-100 text-green-800' :
                         (weeks + 2 >= milestone.week ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600');
      const statusIcon = isPast ? '✅' : (weeks + 2 >= milestone.week ? '⏰' : '⏳');

      return (
        <div key={index} className={`flex items-start space-x-3 p-3 ${statusClass} rounded-lg`}>
          <div className="text-lg">{statusIcon}</div>
          <div className="flex-1">
            <div className="font-semibold">{milestone.title} (Week {milestone.week})</div>
            <div className="text-sm">{milestone.description}</div>
            <div className="text-xs mt-1">{milestoneDate.toLocaleDateString()}</div>
          </div>
        </div>
      );
    });

    setTimeline(timelineElements);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{getH1('👶 Pregnancy Due Date Calculator')}</h1>
        <p className="text-xl text-gray-600 max-w-[1180px] mx-auto">
          Calculate your baby's due date and track your pregnancy timeline with important milestones,
          appointments, and developmental stages throughout your pregnancy journey.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
        {/* Main Calculator */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 sm:p-5 md:p-8 border border-gray-200">
            <div className="mb-4 sm:mb-6 md:mb-8">
              <div className="flex gap-4 mb-3 sm:mb-4 md:mb-6">
                <button
                  onClick={() => setActiveTab('lmp')}
                  className={`tab-button px-6 py-3 rounded-lg font-medium ${
                    activeTab === 'lmp'
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Last Menstrual Period
                </button>
                <button
                  onClick={() => setActiveTab('conception')}
                  className={`tab-button px-6 py-3 rounded-lg font-medium ${
                    activeTab === 'conception'
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Conception Date
                </button>
                <button
                  onClick={() => setActiveTab('ivf')}
                  className={`tab-button px-6 py-3 rounded-lg font-medium ${
                    activeTab === 'ivf'
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  IVF Transfer
                </button>
              </div>
            </div>

            {/* LMP Calculator Tab */}
            {activeTab === 'lmp' && (
              <div className="tab-content">
                <h2 className="text-2xl font-bold mb-3 sm:mb-4 md:mb-6">📅 Last Menstrual Period Method</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Day of Last Menstrual Period</label>
                    <input
                      type="date"
                      value={lmpDate}
                      onChange={(e) => setLmpDate(e.target.value)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">This is the most common method used by healthcare providers</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Average Cycle Length</label>
                    <select
                      value={cycleLength}
                      onChange={(e) => setCycleLength(parseInt(e.target.value))}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="21">21 days</option>
                      <option value="22">22 days</option>
                      <option value="23">23 days</option>
                      <option value="24">24 days</option>
                      <option value="25">25 days</option>
                      <option value="26">26 days</option>
                      <option value="27">27 days</option>
                      <option value="28">28 days</option>
                      <option value="29">29 days</option>
                      <option value="30">30 days</option>
                      <option value="31">31 days</option>
                      <option value="32">32 days</option>
                      <option value="33">33 days</option>
                      <option value="34">34 days</option>
                      <option value="35">35 days</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleCalculateLMP}
                  className="w-full bg-pink-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-lg hover:bg-pink-700 font-semibold text-lg"
                >
                  Calculate Due Date
                </button>
              </div>
            )}

            {/* Conception Date Tab */}
            {activeTab === 'conception' && (
              <div className="tab-content">
                <h2 className="text-2xl font-bold mb-3 sm:mb-4 md:mb-6">🌟 Conception Date Method</h2>

                <div className="mb-4 sm:mb-6 md:mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Conception Date</label>
                  <input
                    type="date"
                    value={conceptionDate}
                    onChange={(e) => setConceptionDate(e.target.value)}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">If you know the exact date of conception or ovulation</p>
                </div>

                <button
                  onClick={handleCalculateConception}
                  className="w-full bg-pink-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-lg hover:bg-pink-700 font-semibold text-lg"
                >
                  Calculate Due Date
                </button>
              </div>
            )}

            {/* IVF Transfer Tab */}
            {activeTab === 'ivf' && (
              <div className="tab-content">
                <h2 className="text-2xl font-bold mb-3 sm:mb-4 md:mb-6">🧪 IVF Transfer Method</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Date</label>
                    <input
                      type="date"
                      value={transferDate}
                      onChange={(e) => setTransferDate(e.target.value)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Embryo Age at Transfer</label>
                    <select
                      value={embryoAge}
                      onChange={(e) => setEmbryoAge(parseInt(e.target.value))}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="3">Day 3 (Cleavage stage)</option>
                      <option value="5">Day 5 (Blastocyst)</option>
                      <option value="6">Day 6 (Blastocyst)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleCalculateIVF}
                  className="w-full bg-pink-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-lg hover:bg-pink-700 font-semibold text-lg"
                >
                  Calculate Due Date
                </button>
              </div>
            )}

            {/* Results Section */}
            {showResults && (
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">🎉 Your Pregnancy Information</h3>

                {/* Key Dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 sm:mb-6 md:mb-8">
                  <div className="bg-pink-50 p-3 sm:p-4 md:p-6 rounded-lg text-center border border-pink-200">
                    <div className="text-2xl font-bold text-pink-600">{dueDate}</div>
                    <div className="text-sm text-gray-600">Due Date</div>
                  </div>
                  <div className="bg-blue-50 p-3 sm:p-4 md:p-6 rounded-lg text-center border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{currentWeeks} weeks</div>
                    <div className="text-sm text-gray-600">{currentDays} days</div>
                  </div>
                  <div className="bg-green-50 p-3 sm:p-4 md:p-6 rounded-lg text-center border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{daysRemaining > 0 ? daysRemaining : 'Baby is here!'}</div>
                    <div className="text-sm text-gray-600">Days Remaining</div>
                  </div>
                </div>

                {/* Pregnancy Progress */}
                <div className="bg-purple-50 p-3 sm:p-4 md:p-6 rounded-lg border border-purple-200 mb-4 sm:mb-6 md:mb-8">
                  <h4 className="text-lg font-semibold text-purple-800 mb-4">📊 Pregnancy Progress</h4>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-pink-400 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-purple-700">{currentTrimester}</div>
                      <div className="text-gray-600">Current Trimester</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-purple-700">{babySize}</div>
                      <div className="text-gray-600">Baby Size</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-purple-700">{babyWeight}</div>
                      <div className="text-gray-600">Approximate Weight</div>
                    </div>
                  </div>
                </div>

                {/* Important Dates Timeline */}
                <div className="bg-yellow-50 p-3 sm:p-4 md:p-6 rounded-lg border border-yellow-200 mb-4 sm:mb-6 md:mb-8">
                  <h4 className="text-lg font-semibold text-yellow-800 mb-4">📋 Important Dates & Milestones</h4>
                  <div className="space-y-3">
                    {timeline}
                  </div>
                </div>

                {/* Current Week Development */}
                <div className="bg-green-50 p-3 sm:p-4 md:p-6 rounded-lg border border-green-200">
                  <h4 className="text-lg font-semibold text-green-800 mb-4">🌱 Development This Week</h4>
                  <div>
                    <p className="text-gray-700 mb-4">{developmentText}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-green-700 mb-2">Baby's Development</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {babyDevelopment.map((item, index) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-green-700 mb-2">What You Might Experience</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {motherSymptoms.map((item, index) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        </div>

        {/* Sidebar */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Quick Facts */}
          <div className="bg-pink-50 p-3 sm:p-4 md:p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">📖 Pregnancy Facts</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Average pregnancy: 280 days (40 weeks)</li>
              <li>• Full term: 37-42 weeks</li>
              <li>• Only 5% of babies are born on due date</li>
              <li>• Most babies (90%) are born within 2 weeks of due date</li>
              <li>• First babies often arrive late</li>
              <li>• Due dates are estimates, not exact predictions</li>
            </ul>
          </div>

          {/* Trimesters */}
          <div className="bg-blue-50 p-3 sm:p-4 md:p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">📊 Trimesters</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-white rounded border border-blue-200">
                <div className="font-semibold text-blue-700">First Trimester</div>
                <div className="text-gray-600">Weeks 1-12</div>
                <div className="text-xs text-gray-500">Organ formation, morning sickness</div>
              </div>
              <div className="p-3 bg-white rounded border border-blue-200">
                <div className="font-semibold text-blue-700">Second Trimester</div>
                <div className="text-gray-600">Weeks 13-27</div>
                <div className="text-xs text-gray-500">Energy returns, baby movements</div>
              </div>
<div className="p-3 bg-white rounded border border-blue-200">
                <div className="font-semibold text-blue-700">Third Trimester</div>
                <div className="text-gray-600">Weeks 28-40+</div>
                <div className="text-xs text-gray-500">Rapid growth, preparation for birth</div>
              </div>
            </div>
          </div>

          {/* Key Appointments */}
          <div className="bg-green-50 p-3 sm:p-4 md:p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">🏥 Key Appointments</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>First prenatal visit:</span>
                <span className="font-medium">6-8 weeks</span>
              </div>
              <div className="flex justify-between">
                <span>NT screening:</span>
                <span className="font-medium">11-14 weeks</span>
              </div>
              <div className="flex justify-between">
                <span>Anatomy scan:</span>
                <span className="font-medium">18-22 weeks</span>
              </div>
              <div className="flex justify-between">
                <span>Glucose test:</span>
                <span className="font-medium">24-28 weeks</span>
              </div>
              <div className="flex justify-between">
                <span>Group B Strep:</span>
                <span className="font-medium">35-37 weeks</span>
              </div>
            </div>
          </div>

          {/* Prenatal Vitamins */}
          <div className="bg-orange-50 p-3 sm:p-4 md:p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">💊 Important Nutrients</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Folic Acid:</span>
                <span className="font-medium">400-800 mcg</span>
              </div>
              <div className="flex justify-between">
                <span>Iron:</span>
                <span className="font-medium">27 mg</span>
              </div>
              <div className="flex justify-between">
                <span>Calcium:</span>
                <span className="font-medium">1,000 mg</span>
              </div>
              <div className="flex justify-between">
                <span>DHA:</span>
                <span className="font-medium">200-300 mg</span>
              </div>
              <div className="flex justify-between">
                <span>Vitamin D:</span>
                <span className="font-medium">600 IU</span>
              </div>
            </div>
          </div>

          {/* Warning Signs */}
          <div className="bg-red-50 p-3 sm:p-4 md:p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-red-800">⚠️ Contact Doctor If</h3>
            <ul className="space-y-1 text-sm text-red-700">
              <li>• Severe abdominal pain</li>
              <li>• Heavy bleeding</li>
              <li>• Severe headaches</li>
              <li>• Vision changes</li>
              <li>• Decreased fetal movement</li>
              <li>• Signs of preterm labor</li>
              <li>• Severe nausea/vomiting</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}

      {/* SEO Content Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Understanding Your Pregnancy Due Date</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
          Your pregnancy due date is one of the first pieces of information you'll want to know when expecting a baby. While only about 5% of babies arrive on their exact due date, this estimated delivery date helps you and your healthcare provider track your baby's development, schedule important prenatal appointments, and prepare for your new arrival. Understanding how your due date is calculated and what it means can help you feel more informed and confident throughout your pregnancy journey.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-pink-50 rounded-lg p-3 sm:p-4 border border-pink-100">
            <h3 className="font-semibold text-pink-800 mb-2 text-sm sm:text-base">Gestational Age</h3>
            <p className="text-xs text-gray-600">The standard measurement used by healthcare providers, calculated from the first day of your last menstrual period. Full-term pregnancy is 37-42 weeks gestation.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 sm:p-4 border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2 text-sm sm:text-base">Naegele's Rule</h3>
            <p className="text-xs text-gray-600">The traditional method of calculating due dates by adding 280 days (40 weeks) to the first day of your last menstrual period, assuming a 28-day cycle.</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Ultrasound Dating</h3>
            <p className="text-xs text-gray-600">First-trimester ultrasounds can provide the most accurate due date estimate by measuring the baby's size, often used to confirm or adjust the initial calculation.</p>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">How Due Date Calculation Works</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-3 sm:mb-4 md:mb-6">
          <p className="text-sm text-gray-600 mb-3">There are three main methods to calculate your pregnancy due date:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">Last Menstrual Period (LMP):</h4>
              <p className="text-xs sm:text-sm bg-white p-2 rounded border">Add 280 days (40 weeks) to the first day of your last period. Adjust for cycle length if different from 28 days.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">Conception Date:</h4>
              <p className="text-xs sm:text-sm bg-white p-2 rounded border">Add 266 days (38 weeks) to the known or estimated conception date. More accurate if you track ovulation.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">IVF Transfer Date:</h4>
              <p className="text-xs sm:text-sm bg-white p-2 rounded border">Add specific days based on embryo age at transfer. Most accurate method for those who conceived through IVF.</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            All methods provide an estimated date, not a prediction. Your healthcare provider may adjust your due date based on early ultrasound measurements for increased accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Pregnancy Milestones by Trimester</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg">
                <span className="text-pink-500 text-lg">🌸</span>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">First Trimester (Weeks 1-12)</h4>
                  <p className="text-xs text-gray-600">Rapid organ development, confirmation ultrasound, early prenatal testing (NT scan), and managing morning sickness. Highest risk period for miscarriage.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <span className="text-purple-500 text-lg">💜</span>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">Second Trimester (Weeks 13-27)</h4>
                  <p className="text-xs text-gray-600">Energy returns, baby movements begin, anatomy scan (18-22 weeks), glucose screening, and gender reveal possible. Often called the "honeymoon phase."</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-500 text-lg">👶</span>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">Third Trimester (Weeks 28-40+)</h4>
                  <p className="text-xs text-gray-600">Rapid baby growth, childbirth classes, hospital bag preparation, Group B Strep test, and more frequent prenatal visits. Baby could arrive any time after 37 weeks.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Important Facts About Due Dates</h3>
            <p className="text-sm text-gray-600 mb-3">Understanding the reality of due dates helps set appropriate expectations:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                <span className="font-bold text-green-600 w-12 text-xs">5%</span>
                <span className="text-xs text-gray-600 flex-1">Only about 5% of babies are born on their exact due date</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                <span className="font-bold text-blue-600 w-12 text-xs">90%</span>
                <span className="text-xs text-gray-600 flex-1">90% of babies arrive within 2 weeks before or after the due date</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-purple-50 rounded">
                <span className="font-bold text-purple-600 w-12 text-xs">37-42</span>
                <span className="text-xs text-gray-600 flex-1">Weeks is considered full-term; deliveries in this range are normal</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-orange-50 rounded">
                <span className="font-bold text-orange-600 w-12 text-xs">Late</span>
                <span className="text-xs text-gray-600 flex-1">First-time mothers are more likely to deliver after their due date</span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Tips for a Healthy Pregnancy</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-green-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">Prenatal Care</h4>
            <p className="text-xs text-gray-600">Schedule regular prenatal visits starting at 6-8 weeks. These appointments monitor your health and baby's development, perform necessary screenings, and address any concerns.</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Prenatal Vitamins</h4>
            <p className="text-xs text-gray-600">Take prenatal vitamins with folic acid (400-800 mcg) daily, ideally starting before conception. Folic acid prevents neural tube defects during early development.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Healthy Lifestyle</h4>
            <p className="text-xs text-gray-600">Avoid alcohol, smoking, and certain medications. Eat a balanced diet, stay hydrated, get moderate exercise, and prioritize sleep for optimal pregnancy outcomes.</p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="pregnancy-due-date-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* Medical Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 md:mb-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-2xl">⚠️</div>
          <div>
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Medical Disclaimer</h3>
            <p className="text-xs sm:text-sm text-amber-700">
              This pregnancy due date calculator is for informational purposes only and should not replace professional medical advice.
              Due dates are estimates, and normal pregnancies can vary in length. Always consult with your healthcare provider or obstetrician
              for personalized pregnancy care, accurate dating ultrasounds, and medical guidance throughout your pregnancy.
            </p>
          </div>
        </div>
      </div>

{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8 mt-8">
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
    </div>
  );
}
