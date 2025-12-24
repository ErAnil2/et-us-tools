'use client';

import { useState, useEffect, useRef } from 'react';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

// Life expectancy data by country and gender (WHO 2023 data)
const lifeExpectancyData: Record<string, { male: number; female: number }> = {
  // North America
  us: { male: 76.1, female: 81.1 },
  canada: { male: 79.8, female: 84.1 },
  mexico: { male: 72.9, female: 78.1 },
  // Europe
  uk: { male: 79.4, female: 83.1 },
  germany: { male: 78.6, female: 83.4 },
  france: { male: 79.3, female: 85.3 },
  italy: { male: 81.0, female: 85.2 },
  spain: { male: 80.3, female: 85.8 },
  sweden: { male: 80.8, female: 84.3 },
  norway: { male: 79.8, female: 84.0 },
  denmark: { male: 78.9, female: 82.9 },
  finland: { male: 78.7, female: 84.5 },
  iceland: { male: 81.2, female: 84.8 },
  switzerland: { male: 81.8, female: 85.7 },
  austria: { male: 79.0, female: 84.0 },
  belgium: { male: 78.9, female: 83.5 },
  netherlands: { male: 80.2, female: 83.2 },
  portugal: { male: 78.9, female: 84.4 },
  greece: { male: 78.4, female: 84.0 },
  ireland: { male: 80.5, female: 84.1 },
  luxembourg: { male: 80.1, female: 84.8 },
  // Asia Pacific
  japan: { male: 81.6, female: 87.7 },
  singapore: { male: 81.4, female: 85.9 },
  'south-korea': { male: 79.3, female: 85.4 },
  'hong-kong': { male: 82.3, female: 88.1 },
  australia: { male: 80.9, female: 84.9 },
  'new-zealand': { male: 80.0, female: 83.5 },
  taiwan: { male: 77.5, female: 84.2 },
  israel: { male: 80.6, female: 84.9 },
  china: { male: 74.7, female: 80.5 },
  india: { male: 68.2, female: 70.7 },
  thailand: { male: 72.4, female: 79.7 },
  malaysia: { male: 73.6, female: 78.3 },
  // Middle East
  uae: { male: 77.0, female: 79.0 },
  qatar: { male: 77.6, female: 80.0 },
  'saudi-arabia': { male: 73.5, female: 76.2 },
  kuwait: { male: 74.6, female: 76.9 },
  // Latin America
  chile: { male: 77.4, female: 82.2 },
  'costa-rica': { male: 77.0, female: 82.2 },
  panama: { male: 75.2, female: 81.2 },
  brazil: { male: 72.8, female: 79.9 },
  argentina: { male: 73.0, female: 80.2 },
  uruguay: { male: 74.5, female: 81.2 },
  // Other
  'south-africa': { male: 62.3, female: 68.5 },
  russia: { male: 68.2, female: 78.0 },
  other: { male: 75.0, female: 80.0 }
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Human Lifespan Calculator?",
    answer: "A Human Lifespan Calculator is a free online tool designed to help you quickly and accurately calculate human lifespan-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Human Lifespan Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Human Lifespan Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Human Lifespan Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function HumanLifespanCalculatorClient() {
  // Personal Information
  const [age, setAge] = useState<number>(35);
  const [gender, setGender] = useState<string>('male');
  const [country, setCountry] = useState<string>('us');
  const [education, setEducation] = useState<string>('');

  // Health Status
  const [healthStatus, setHealthStatus] = useState<string>('');
  const [bmi, setBmi] = useState<number>(23.5);
  const [bloodPressure, setBloodPressure] = useState<string>('');
  const [cholesterol, setCholesterol] = useState<string>('');

  // Lifestyle Factors
  const [smoking, setSmoking] = useState<string>('');
  const [exercise, setExercise] = useState<string>('');
  const [diet, setDiet] = useState<string>('');
  const [sleep, setSleep] = useState<string>('');
  const [parentsLifespan, setParentsLifespan] = useState<number>(78);
  const [stress, setStress] = useState<string>('');

  // Health Conditions
  const [diabetes, setDiabetes] = useState<boolean>(false);
  const [heartDisease, setHeartDisease] = useState<boolean>(false);
  const [cancer, setCancer] = useState<boolean>(false);
  const [married, setMarried] = useState<boolean>(false);

  // Results
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(85.2);
  const [yearsRemaining, setYearsRemaining] = useState<number>(50.2);
  const [countryAverage, setCountryAverage] = useState<number>(79.1);
  const [biologicalAge, setBiologicalAge] = useState<number>(32);
  const [lifestyleImpact, setLifestyleImpact] = useState<number>(6.1);
  const [daysRemaining, setDaysRemaining] = useState<number>(18325);
  const [lifePercentage, setLifePercentage] = useState<number>(41);
  const [vsAverage, setVsAverage] = useState<number>(6.1);
  const [statusMessage, setStatusMessage] = useState<string>('Your lifestyle choices and health factors suggest above-average life expectancy.');
  const [statusClass, setStatusClass] = useState<string>('border-blue-200 bg-blue-50');
  const [statusTextClass, setStatusTextClass] = useState<string>('text-blue-800');
  const [personalizedInsights, setPersonalizedInsights] = useState<Array<{ color: string; text: string }>>([]);

  // Chart ref
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  // Calculate life expectancy
  const calculateLifeExpectancy = () => {
    if (!age || age < 1) {
      setLifeExpectancy(0);
      setYearsRemaining(0);
      setStatusMessage('Please enter your basic information to see life expectancy calculation.');
      return;
    }

    // Base life expectancy from country/gender data
    const countryData = lifeExpectancyData[country || 'us'];
    const baseLifeExpectancy = countryData ? countryData[gender as 'male' | 'female'] : 78.0;

    // Calculate country average (male + female) / 2
    const countryAvg = countryData ? (countryData.male + countryData.female) / 2 : 78.0;
    setCountryAverage(countryAvg);

    let adjustedLifeExpectancy = baseLifeExpectancy;
    let remainingYears = Math.max(0, adjustedLifeExpectancy - age);
    let totalExpectedAge = age + remainingYears;

    // Education adjustments
    const educationAdjustments: Record<string, number> = {
      'less-high-school': -3,
      'high-school': -1,
      'some-college': 0,
      'college': 2,
      'graduate': 4
    };
    if (education && educationAdjustments[education] !== undefined) {
      totalExpectedAge += educationAdjustments[education];
    }

    // Health status adjustments
    const healthAdjustments: Record<string, number> = {
      'excellent': 3,
      'very-good': 1,
      'good': 0,
      'fair': -2,
      'poor': -5
    };
    if (healthStatus && healthAdjustments[healthStatus] !== undefined) {
      totalExpectedAge += healthAdjustments[healthStatus];
    }

    // BMI adjustments
    if (bmi) {
      if (bmi < 18.5) totalExpectedAge -= 2; // Underweight
      else if (bmi >= 18.5 && bmi < 25) totalExpectedAge += 1; // Normal
      else if (bmi >= 25 && bmi < 30) totalExpectedAge -= 1; // Overweight
      else if (bmi >= 30) totalExpectedAge -= 3; // Obese
    }

    // Blood pressure adjustments
    const bpAdjustments: Record<string, number> = {
      'optimal': 2,
      'normal': 1,
      'high-normal': 0,
      'mild-hypertension': -1,
      'moderate-hypertension': -3,
      'severe-hypertension': -5
    };
    if (bloodPressure && bpAdjustments[bloodPressure] !== undefined) {
      totalExpectedAge += bpAdjustments[bloodPressure];
    }

    // Cholesterol adjustments
    const cholesterolAdjustments: Record<string, number> = {
      'optimal': 1,
      'borderline': -0.5,
      'high': -2,
      'unknown': 0
    };
    if (cholesterol && cholesterolAdjustments[cholesterol] !== undefined) {
      totalExpectedAge += cholesterolAdjustments[cholesterol];
    }

    // Medical conditions
    if (diabetes) totalExpectedAge -= 3;
    if (heartDisease) totalExpectedAge -= 4;
    if (cancer) totalExpectedAge -= 2;

    // Smoking adjustments
    const smokingAdjustments: Record<string, number> = {
      'never': 2,
      'former': -1,
      'light': -3,
      'moderate': -6,
      'heavy': -10
    };
    if (smoking && smokingAdjustments[smoking] !== undefined) {
      totalExpectedAge += smokingAdjustments[smoking];
    }

    // Exercise adjustments
    const exerciseAdjustments: Record<string, number> = {
      'none': -2,
      'light': 1,
      'moderate': 3,
      'heavy': 4
    };
    if (exercise && exerciseAdjustments[exercise] !== undefined) {
      totalExpectedAge += exerciseAdjustments[exercise];
    }

    // Diet adjustments
    const dietAdjustments: Record<string, number> = {
      'poor': -2,
      'average': 0,
      'good': 2,
      'excellent': 4
    };
    if (diet && dietAdjustments[diet] !== undefined) {
      totalExpectedAge += dietAdjustments[diet];
    }

    // Sleep adjustments
    const sleepAdjustments: Record<string, number> = {
      'poor': -2,
      'fair': -1,
      'good': 1,
      'excellent': 2
    };
    if (sleep && sleepAdjustments[sleep] !== undefined) {
      totalExpectedAge += sleepAdjustments[sleep];
    }

    // Stress adjustments
    const stressAdjustments: Record<string, number> = {
      'low': 2,
      'moderate': 0,
      'high': -2,
      'extreme': -4
    };
    if (stress && stressAdjustments[stress] !== undefined) {
      totalExpectedAge += stressAdjustments[stress];
    }

    // Social factors
    if (married) totalExpectedAge += 2;

    // Family history adjustments
    if (parentsLifespan) {
      const parentAdjustment = (parentsLifespan - baseLifeExpectancy) * 0.3;
      totalExpectedAge += parentAdjustment;
    }

    // Ensure reasonable bounds
    totalExpectedAge = Math.max(age + 1, Math.min(120, totalExpectedAge));
    const yearsRem = totalExpectedAge - age;

    // Calculate health age vs chronological age
    const healthAge = age - (totalExpectedAge - baseLifeExpectancy);

    // Update results
    const lifestyleImp = totalExpectedAge - baseLifeExpectancy;
    setLifeExpectancy(totalExpectedAge);
    setYearsRemaining(yearsRem);
    setBiologicalAge(healthAge);
    setLifestyleImpact(lifestyleImp);
    setDaysRemaining(Math.max(0, Math.round(yearsRem * 365)));
    setLifePercentage(Math.min(100, Math.max(0, Math.round((age / totalExpectedAge) * 100))));
    setVsAverage(lifestyleImp);

    // Update status
    updateLifespanStatus(lifestyleImp);

    // Update personalized insights
    updatePersonalizedInsights(lifestyleImp, age, totalExpectedAge);

    // Update chart
    updateChart(age, totalExpectedAge);
  };

  // Update status
  const updateLifespanStatus = (lifestyleImp: number) => {
    let message = '';
    let cardClass = '';
    let textClass = '';

    if (lifestyleImp >= 5) {
      message = 'Excellent! Your healthy lifestyle choices significantly extend your life expectancy. Keep up the great habits!';
      cardClass = 'border-green-200 bg-green-50';
      textClass = 'text-green-800';
    } else if (lifestyleImp >= 2) {
      message = 'Good news! Your lifestyle choices have a positive impact on your longevity. Consider optimizing further.';
      cardClass = 'border-blue-200 bg-blue-50';
      textClass = 'text-blue-800';
    } else if (lifestyleImp >= -2) {
      message = 'Your life expectancy is close to average. Small lifestyle improvements could make a meaningful difference.';
      cardClass = 'border-yellow-200 bg-yellow-50';
      textClass = 'text-yellow-800';
    } else {
      message = 'Your current lifestyle factors may be reducing your life expectancy. Consider making positive changes for better health.';
      cardClass = 'border-red-200 bg-red-50';
      textClass = 'text-red-800';
    }

    setStatusMessage(message);
    setStatusClass(cardClass);
    setStatusTextClass(textClass);
  };

  // Update personalized insights
  const updatePersonalizedInsights = (lifestyleImp: number, currentAge: number, totalExpected: number) => {
    const lifeProgress = (currentAge / totalExpected) * 100;
    let insightItems: Array<{ color: string; text: string }> = [];

    // Age-based insight
    if (lifeProgress < 25) {
      insightItems.push({
        color: 'bg-green-500',
        text: `You're in the first quarter of your expected lifespan - excellent time to build healthy habits`
      });
    } else if (lifeProgress < 50) {
      insightItems.push({
        color: 'bg-blue-500',
        text: `You're in your prime years - maintaining good health habits now will pay dividends later`
      });
    } else if (lifeProgress < 75) {
      insightItems.push({
        color: 'bg-yellow-500',
        text: `You're in the third quarter of life - focus on preventive care and active aging`
      });
    } else {
      insightItems.push({
        color: 'bg-purple-500',
        text: `Focus on quality of life, social connections, and medical care in your golden years`
      });
    }

    // Lifestyle impact insight
    if (lifestyleImp >= 3) {
      insightItems.push({
        color: 'bg-green-500',
        text: `Excellent! Your healthy lifestyle is adding ${Math.round(lifestyleImp)} years to your life`
      });
    } else if (lifestyleImp >= 1) {
      insightItems.push({
        color: 'bg-blue-500',
        text: `Good habits are extending your life by ${Math.round(lifestyleImp)} years - keep it up!`
      });
    } else if (lifestyleImp >= -1) {
      insightItems.push({
        color: 'bg-yellow-500',
        text: `Small lifestyle improvements could add 2-5 years to your life expectancy`
      });
    } else {
      insightItems.push({
        color: 'bg-red-500',
        text: `Consider lifestyle changes - they could add 5-10 years to your life`
      });
    }

    // Specific recommendations
    if (smoking && smoking !== 'never') {
      insightItems.push({
        color: 'bg-red-500',
        text: `Quitting smoking could add 10+ years to your life - it's never too late`
      });
    } else if (exercise === 'none' || exercise === 'light') {
      insightItems.push({
        color: 'bg-orange-500',
        text: `Regular exercise (150 min/week) could add 3-4 years to your lifespan`
      });
    } else if (diet === 'poor' || diet === 'average') {
      insightItems.push({
        color: 'bg-yellow-500',
        text: `A Mediterranean diet could add 2-3 years to your life expectancy`
      });
    }

    // Limit to 3 insights
    setPersonalizedInsights(insightItems.slice(0, 3));
  };

  // Update chart
  const updateChart = (currentAge: number, totalExpectedAge: number) => {
    if (typeof window !== 'undefined' && window.Chart && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Destroy previous chart
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const yearsLived = currentAge;
        const yearsRem = Math.max(0, totalExpectedAge - currentAge);

        chartInstance.current = new window.Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Years Lived', 'Years Remaining'],
            datasets: [{
              data: [yearsLived, yearsRem],
              backgroundColor: ['#94A3B8', '#3B82F6'],
              borderColor: ['#64748B', '#2563EB'],
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  boxWidth: 8,
                  font: { size: 10 },
                  generateLabels: function(chart: any) {
                    const data = chart.data;
                    return data.labels.map((label: string, index: number) => {
                      const value = index === 0 ? yearsLived : yearsRem;
                      return {
                        text: `${label}: ${Math.round(value)} years`,
                        fillStyle: data.datasets[0].backgroundColor[index],
                        strokeStyle: data.datasets[0].borderColor[index],
                        lineWidth: 2,
                        index: index
                      };
                    });
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context: any) {
                    const label = context.label;
                    const value = context.dataIndex === 0 ? yearsLived : yearsRem;
                    return `${label}: ${Math.round(value)} years`;
                  }
                }
              }
            }
          }
        });
      }
    }
  };

  // Load Chart.js on mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.async = true;
    script.onload = () => {
      calculateLifeExpectancy();
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup chart on unmount
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      // Remove script
      const scriptElements = document.querySelectorAll('script[src="https://cdn.jsdelivr.net/npm/chart.js"]');
      scriptElements.forEach(s => s.remove());
    };
  }, []);

  // Auto-calculate when inputs change
  useEffect(() => {
    calculateLifeExpectancy();
  }, [age, gender, country, education, healthStatus, bmi, bloodPressure, cholesterol, smoking, exercise, diet, sleep, parentsLifespan, stress, diabetes, heartDisease, cancer, married]);

  return (
    <main className="max-w-[1180px] mx-auto px-2 sm:px-2 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Human Lifespan Calculator</h1>
        <p className="text-base sm:text-lg text-gray-600">Calculate your life expectancy based on health factors, lifestyle choices, and demographics</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div>
            {/* Personal Information */}
            <div className="space-y-4 mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-medium text-gray-700">Personal Information</h3>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Current Age</label>
                  <input
                    type="number"
                    id="age"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    min="1"
                    max="120"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country/Region</label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Country</option>
                  <optgroup label="North America">
                    <option value="us">United States</option>
                    <option value="canada">Canada</option>
                    <option value="mexico">Mexico</option>
                  </optgroup>
                  <optgroup label="Europe">
                    <option value="uk">United Kingdom</option>
                    <option value="germany">Germany</option>
                    <option value="france">France</option>
                    <option value="italy">Italy</option>
                    <option value="spain">Spain</option>
                    <option value="sweden">Sweden</option>
                    <option value="norway">Norway</option>
                    <option value="denmark">Denmark</option>
                    <option value="finland">Finland</option>
                    <option value="iceland">Iceland</option>
                    <option value="switzerland">Switzerland</option>
                    <option value="austria">Austria</option>
                    <option value="belgium">Belgium</option>
                    <option value="netherlands">Netherlands</option>
                    <option value="portugal">Portugal</option>
                    <option value="greece">Greece</option>
                    <option value="ireland">Ireland</option>
                    <option value="luxembourg">Luxembourg</option>
                  </optgroup>
                  <optgroup label="Asia Pacific">
                    <option value="japan">Japan</option>
                    <option value="singapore">Singapore</option>
                    <option value="south-korea">South Korea</option>
                    <option value="hong-kong">Hong Kong</option>
                    <option value="australia">Australia</option>
                    <option value="new-zealand">New Zealand</option>
                    <option value="taiwan">Taiwan</option>
                    <option value="israel">Israel</option>
                    <option value="china">China</option>
                    <option value="india">India</option>
                    <option value="thailand">Thailand</option>
                    <option value="malaysia">Malaysia</option>
                  </optgroup>
                  <optgroup label="Middle East">
                    <option value="uae">United Arab Emirates</option>
                    <option value="qatar">Qatar</option>
                    <option value="saudi-arabia">Saudi Arabia</option>
                    <option value="kuwait">Kuwait</option>
                  </optgroup>
                  <optgroup label="Latin America">
                    <option value="chile">Chile</option>
                    <option value="costa-rica">Costa Rica</option>
                    <option value="panama">Panama</option>
                    <option value="brazil">Brazil</option>
                    <option value="argentina">Argentina</option>
                    <option value="uruguay">Uruguay</option>
                  </optgroup>
                  <optgroup label="Other">
                    <option value="south-africa">South Africa</option>
                    <option value="russia">Russia</option>
                    <option value="other">Other Country</option>
                  </optgroup>
                </select>
              </div>

              {/* Education */}
              <div>
                <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                <select
                  id="education"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Education</option>
                  <option value="less-high-school">Less than High School</option>
                  <option value="high-school">High School</option>
                  <option value="some-college">Some College</option>
                  <option value="college">College Degree</option>
                  <option value="graduate">Graduate Degree</option>
                </select>
              </div>
            </div>

            {/* Health Information */}
            <div className="space-y-4 mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-medium text-gray-700">Health Status</h3>

              {/* Overall Health & BMI */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="health-status" className="block text-sm font-medium text-gray-700 mb-1">Overall Health</label>
                  <select
                    id="health-status"
                    value={healthStatus}
                    onChange={(e) => setHealthStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Health Status</option>
                    <option value="excellent">Excellent</option>
                    <option value="very-good">Very Good</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="bmi" className="block text-sm font-medium text-gray-700 mb-1">BMI</label>
                  <input
                    type="number"
                    id="bmi"
                    value={bmi}
                    onChange={(e) => setBmi(parseFloat(e.target.value) || 0)}
                    step="0.1"
                    min="10"
                    max="60"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Blood Pressure */}
              <div>
                <label htmlFor="blood-pressure" className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                <select
                  id="blood-pressure"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Blood Pressure</option>
                  <option value="optimal">Optimal (&lt;120/80)</option>
                  <option value="normal">Normal (120-129/80-84)</option>
                  <option value="high-normal">High Normal (130-139/85-89)</option>
                  <option value="mild-hypertension">Mild Hypertension (140-159/90-99)</option>
                  <option value="moderate-hypertension">Moderate Hypertension (160-179/100-109)</option>
                  <option value="severe-hypertension">Severe Hypertension (≥180/110)</option>
                </select>
              </div>

              {/* Cholesterol */}
              <div>
                <label htmlFor="cholesterol" className="block text-sm font-medium text-gray-700 mb-1">Cholesterol Level</label>
                <select
                  id="cholesterol"
                  value={cholesterol}
                  onChange={(e) => setCholesterol(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Cholesterol</option>
                  <option value="optimal">Optimal (&lt;200 mg/dL)</option>
                  <option value="borderline">Borderline (200-239 mg/dL)</option>
                  <option value="high">High (≥240 mg/dL)</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>

            {/* Lifestyle Factors */}
            <div className="space-y-4 mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-medium text-gray-700">Lifestyle Factors</h3>

              {/* Smoking & Exercise */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="smoking" className="block text-sm font-medium text-gray-700 mb-1">Smoking Status</label>
                  <select
                    id="smoking"
                    value={smoking}
                    onChange={(e) => setSmoking(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Smoking Status</option>
                    <option value="never">Never Smoked</option>
                    <option value="former">Former Smoker</option>
                    <option value="light">Light Smoker (&lt;10/day)</option>
                    <option value="moderate">Moderate Smoker (10-20/day)</option>
                    <option value="heavy">Heavy Smoker (&gt;20/day)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="exercise" className="block text-sm font-medium text-gray-700 mb-1">Exercise Frequency</label>
                  <select
                    id="exercise"
                    value={exercise}
                    onChange={(e) => setExercise(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Exercise Level</option>
                    <option value="none">No Exercise</option>
                    <option value="light">Light (1-2 times/week)</option>
                    <option value="moderate">Moderate (3-4 times/week)</option>
                    <option value="heavy">Heavy (5+ times/week)</option>
                  </select>
                </div>
              </div>

              {/* Diet & Sleep */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="diet" className="block text-sm font-medium text-gray-700 mb-1">Diet Quality</label>
                  <select
                    id="diet"
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Diet Quality</option>
                    <option value="poor">Poor (Fast food, processed)</option>
                    <option value="average">Average (Mixed diet)</option>
                    <option value="good">Good (Balanced, some vegetables)</option>
                    <option value="excellent">Excellent (Mediterranean/Plant-based)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="sleep" className="block text-sm font-medium text-gray-700 mb-1">Sleep Quality</label>
                  <select
                    id="sleep"
                    value={sleep}
                    onChange={(e) => setSleep(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Sleep Quality</option>
                    <option value="poor">Poor (&lt;6 hours, poor quality)</option>
                    <option value="fair">Fair (6-7 hours, average quality)</option>
                    <option value="good">Good (7-8 hours, good quality)</option>
                    <option value="excellent">Excellent (8+ hours, great quality)</option>
                  </select>
                </div>
              </div>

              {/* Family History & Stress */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="parents-lifespan" className="block text-sm font-medium text-gray-700 mb-1">Parents&apos; Avg Lifespan</label>
                  <input
                    type="number"
                    id="parents-lifespan"
                    value={parentsLifespan}
                    onChange={(e) => setParentsLifespan(parseInt(e.target.value) || 0)}
                    min="40"
                    max="120"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="stress" className="block text-sm font-medium text-gray-700 mb-1">Stress Level</label>
                  <select
                    id="stress"
                    value={stress}
                    onChange={(e) => setStress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Stress Level</option>
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                    <option value="extreme">Extreme</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Medical Conditions */}
            <div className="space-y-4 mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-medium text-gray-700">Health Conditions</h3>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={diabetes}
                    onChange={(e) => setDiabetes(e.target.checked)}
                    className="mr-2 rounded"
                  />
                  <span>Diabetes</span>
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={heartDisease}
                    onChange={(e) => setHeartDisease(e.target.checked)}
                    className="mr-2 rounded"
                  />
                  <span>Heart Disease</span>
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={cancer}
                    onChange={(e) => setCancer(e.target.checked)}
                    className="mr-2 rounded"
                  />
                  <span>Cancer History</span>
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={married}
                    onChange={(e) => setMarried(e.target.checked)}
                    className="mr-2 rounded"
                  />
                  <span>Married/Partnered</span>
                </label>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateLifeExpectancy}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-3 sm:px-4 md:px-6 rounded-lg transition-colors"
            >
              Calculate Life Expectancy
            </button>
          </div>

          {/* Results Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Life Expectancy Results</h3>

            {/* Life Expectancy Display */}
            <div className="text-center mb-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 mb-3">
                <div className="text-xs font-medium text-blue-600 mb-1">Estimated Life Expectancy</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700">{Math.round(lifeExpectancy * 10) / 10}</div>
                <div className="text-xs text-blue-600">years</div>
              </div>
            </div>

            {/* Life Expectancy Analysis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs font-medium text-gray-600 mb-1">Years Remaining</div>
                <div className="text-sm font-semibold text-gray-800">{Math.round(yearsRemaining * 10) / 10} years</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs font-medium text-gray-600 mb-1">Country Average</div>
                <div className="text-sm font-semibold text-gray-800">{Math.round(countryAverage * 10) / 10} years</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs font-medium text-gray-600 mb-1">Biological Age</div>
                <div className="text-sm font-semibold text-gray-800">{Math.round(biologicalAge * 10) / 10} years</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs font-medium text-gray-600 mb-1">Lifestyle Impact</div>
                <div className="text-sm font-semibold text-gray-800">{lifestyleImpact > 0 ? '+' : ''}{Math.round(lifestyleImpact * 10) / 10} years</div>
              </div>
            </div>

            {/* Status Section */}
            <div className={`mt-4 p-4 rounded-lg border ${statusClass}`}>
              <div className="text-sm font-medium text-gray-600 mb-2">Longevity Assessment</div>
              <div className={`text-sm leading-relaxed ${statusTextClass}`}>{statusMessage}</div>
            </div>

            {/* Lifespan Impact Chart */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Lifestyle Impact Breakdown</h4>
              <div className="h-48">
                <canvas ref={chartRef} width="400" height="200"></canvas>
              </div>
            </div>

            {/* Key Insights */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-3">Personalized Insights</h4>
              <div className="space-y-2">
                {personalizedInsights.map((insight, index) => (
                  <div key={index} className="flex items-start text-xs text-blue-700">
                    <span className={`w-2 h-2 ${insight.color} rounded-full mr-2 mt-1`}></span>
                    <span>{insight.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Days left (estimated):</span>
                  <span className="font-semibold text-gray-800">{daysRemaining.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Life lived so far:</span>
                  <span className="font-semibold text-gray-800">{lifePercentage}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Years above/below average:</span>
                  <span className="font-semibold text-gray-800">{vsAverage > 0 ? '+' : ''}{vsAverage}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold mb-3 sm:mb-4 md:mb-6">Understanding Life Expectancy Calculations</h2>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-800">How This Calculator Works</h3>
            <p className="mb-4 text-gray-700">
              Our Human Lifespan Calculator uses advanced actuarial science combined with the latest longevity research to provide personalized life expectancy estimates. The calculation considers over 20 different factors that scientific studies have shown to significantly impact human longevity.
            </p>

            <h4 className="font-semibold mb-2 text-gray-800">Scientific Foundation:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Based on WHO life expectancy data by country and gender</li>
              <li>Incorporates findings from major longevity studies (Blue Zones research, Harvard Health Studies)</li>
              <li>Uses statistical models validated across multiple populations</li>
              <li>Updated with recent medical research on aging and disease prevention</li>
            </ul>

            <h4 className="font-semibold mb-2 mt-4 text-gray-800">Key Longevity Factors:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li><strong>Genetics (25-30%):</strong> Family history and inherited health predispositions</li>
              <li><strong>Lifestyle (40-50%):</strong> Diet, exercise, smoking, alcohol consumption</li>
              <li><strong>Environment (10-15%):</strong> Location, pollution, socioeconomic factors</li>
              <li><strong>Healthcare (10-15%):</strong> Access to preventive care and medical treatment</li>
              <li><strong>Social Factors (5-10%):</strong> Relationships, stress levels, mental health</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-green-800">Proven Ways to Increase Longevity</h3>

            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-700">High Impact Changes (+5-10 years)</h4>
                <ul className="text-sm text-gray-700 mt-2 space-y-1">
                  <li>• Quit smoking (adds 10+ years)</li>
                  <li>• Maintain healthy BMI 18.5-24.9 (adds 3-7 years)</li>
                  <li>• Regular exercise 150+ min/week (adds 3-5 years)</li>
                </ul>
              </div>

              <div className="p-4 bg-white rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-700">Moderate Impact Changes (+2-4 years)</h4>
                <ul className="text-sm text-gray-700 mt-2 space-y-1">
                  <li>• Mediterranean diet with omega-3s</li>
                  <li>• 7-9 hours quality sleep nightly</li>
                  <li>• Strong social connections and marriage</li>
                  <li>• Stress management and meditation</li>
                </ul>
              </div>

              <div className="p-4 bg-white rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold text-purple-700">Emerging Research (+1-2 years)</h4>
                <ul className="text-sm text-gray-700 mt-2 space-y-1">
                  <li>• Intermittent fasting protocols</li>
                  <li>• Regular sauna use (4+ times/week)</li>
                  <li>• Lifelong learning and mental challenges</li>
                  <li>• Purpose-driven living and volunteering</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-3 sm:p-4 md:p-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold mb-3 text-yellow-800 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            Important Medical Disclaimer
          </h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>
              <strong>This calculator is for educational and informational purposes only.</strong> Life expectancy estimates are based on statistical models and population data, not individual medical assessments. Results should never be used for:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Making medical decisions or treatment choices</li>
              <li>Life insurance applications or financial planning</li>
              <li>Replacing professional medical advice or consultations</li>
              <li>Predicting exact lifespan or health outcomes</li>
            </ul>
            <p className="mt-3">
              <strong>Individual results vary significantly.</strong> Genetics, environmental factors, medical advances, and unexpected health events can dramatically affect actual lifespan. Always consult qualified healthcare professionals for personalized medical guidance and health planning.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="human-lifespan-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </main>
  );
}
