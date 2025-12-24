'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface Subject {
  id: number;
  studyGoal: string;
  contentAmount: string;
  contentUnit: string;
  difficulty: string;
  learningStyle: string;
  experience: string;
  availableHours: string;
  daysAvailable: string;
  targetGrade: string;
  reading: boolean;
  practice: boolean;
  flashcards: boolean;
  notes: boolean;
  videos: boolean;
  group: boolean;
}

interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface StudyTimeCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Study Time Calculator?",
    answer: "A Study Time Calculator helps you calculate dates, times, or durations quickly. Whether you need to find the difference between dates or calculate future/past dates, this tool provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is the date calculation?",
    answer: "Our calculator accounts for leap years, varying month lengths, and other calendar complexities to provide accurate results. It uses the Gregorian calendar system.",
    order: 2
  },
  {
    id: '3',
    question: "What date formats are supported?",
    answer: "The calculator accepts common date formats and displays results in an easy-to-understand format. Simply enter dates in the format shown in the input fields.",
    order: 3
  },
  {
    id: '4',
    question: "Can I calculate dates far in the future or past?",
    answer: "Yes, the calculator can handle dates spanning many years. It's useful for planning, historical research, or any date-related calculations you need.",
    order: 4
  },
  {
    id: '5',
    question: "Is timezone considered in calculations?",
    answer: "Date calculations are based on calendar dates. For time-specific calculations, ensure you're considering your local timezone for the most accurate results.",
    order: 5
  }
];

export default function StudyTimeCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: StudyTimeCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('study-time-calculator');

  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: 1,
      studyGoal: 'exam',
      contentAmount: '300',
      contentUnit: 'pages',
      difficulty: 'moderate',
      learningStyle: 'average',
      experience: 'some',
      availableHours: '3',
      daysAvailable: '14',
      targetGrade: 'good',
      reading: true,
      practice: false,
      flashcards: false,
      notes: true,
      videos: false,
      group: false
    }
  ]);

  const [showResults, setShowResults] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [totalTimerSeconds, setTotalTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerStatus, setTimerStatus] = useState('Ready to start');
  const [sessionCount, setSessionCount] = useState(0);
  const [totalStudyMinutes, setTotalStudyMinutes] = useState(0);
  const [breakCount, setBreakCount] = useState(0);
  const [selectedTimerDuration, setSelectedTimerDuration] = useState(25);

  const [results, setResults] = useState({
    totalStudyTime: '',
    dailyStudyTime: '',
    studySessions: '',
    totalTimePercent: 0,
    dailyTimePercent: 0,
    daysRemaining: 0,
    hoursRemaining: 0,
    scheduleDetails: [] as string[],
    studyTips: [] as string[]
  });

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const calcTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Auto-calculate on mount with prefilled data
  useEffect(() => {
    const timer = setTimeout(() => {
      if (subjects[0].contentAmount && subjects[0].availableHours && subjects[0].daysAvailable) {
        calculateStudyTime();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Timer display update
  useEffect(() => {
    const progress = ((totalTimerSeconds - timerSeconds) / totalTimerSeconds) * 100;
    // Update progress bar
    const progressBar = document.getElementById('timerProgress');
    if (progressBar) {
      progressBar.style.width = progress + '%';
    }
  }, [timerSeconds, totalTimerSeconds]);

  const addSubject = () => {
    const newId = Math.max(...subjects.map(s => s.id)) + 1;
    setSubjects([...subjects, {
      id: newId,
      studyGoal: 'exam',
      contentAmount: '',
      contentUnit: 'pages',
      difficulty: 'moderate',
      learningStyle: 'average',
      experience: 'some',
      availableHours: '',
      daysAvailable: '',
      targetGrade: 'good',
      reading: false,
      practice: false,
      flashcards: false,
      notes: false,
      videos: false,
      group: false
    }]);
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    } else {
      alert('You must have at least one subject!');
    }
  };

  const updateSubject = (id: number, field: keyof Subject, value: string | boolean) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const savePlan = () => {
    localStorage.setItem('studyPlan', JSON.stringify(subjects));
    alert('✅ Study plan saved successfully!');
  };

  const loadPlan = () => {
    const saved = localStorage.getItem('studyPlan');
    if (!saved) {
      alert('❌ No saved study plan found.');
      return;
    }
    const loadedSubjects = JSON.parse(saved);
    setSubjects(loadedSubjects);
    alert('✅ Study plan loaded successfully!');
  };

  const toggleTimer = () => {
    setShowTimer(!showTimer);
  };

  const setTimerDuration = (minutes: number) => {
    if (timerRunning) {
      alert('⚠️ Please stop the timer before changing duration!');
      return;
    }
    setTotalTimerSeconds(minutes * 60);
    setTimerSeconds(minutes * 60);
    setTimerStatus(`Ready for ${minutes} min session`);
    setSelectedTimerDuration(minutes);
  };

  const setCustomTimer = () => {
    const input = document.getElementById('customTimerMinutes') as HTMLInputElement;
    const customMinutes = parseInt(input.value);
    if (!customMinutes || customMinutes < 1 || customMinutes > 180) {
      alert('⚠️ Please enter a valid duration (1-180 minutes)');
      return;
    }
    setTimerDuration(customMinutes);
    input.value = '';
  };

  const startTimer = () => {
    if (timerRunning) return;
    setTimerRunning(true);
    setTimerStatus('🔥 Studying...');

    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          completeSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const completeSession = () => {
    pauseTimer();
    const newSessionCount = sessionCount + 1;
    const sessionMinutes = Math.floor(totalTimerSeconds / 60);
    const newTotalStudyMinutes = totalStudyMinutes + sessionMinutes;

    setSessionCount(newSessionCount);
    setTotalStudyMinutes(newTotalStudyMinutes);

    // Play notification (if supported)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Study Session Complete! 🎉', {
        body: `Great work! You completed a ${sessionMinutes} minute session. Time for a break!`,
      });
    }

    alert('⏰ Study session complete! Time for a break!');
    const newBreakCount = breakCount + 1;
    setBreakCount(newBreakCount);

    resetTimer();
  };

  const pauseTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setTimerRunning(false);
    setTimerStatus('⏸️ Paused');
  };

  const resetTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setTimerRunning(false);
    setTimerSeconds(totalTimerSeconds);
    setTimerStatus('Ready to start');
  };

  const formatTimerDisplay = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateStudyTime = () => {
    const subject = subjects[0]; // Using first subject for calculation
    const contentAmount = parseInt(subject.contentAmount);
    const availableHours = parseFloat(subject.availableHours);
    const daysAvailable = parseInt(subject.daysAvailable);

    if (!contentAmount || !availableHours || !daysAvailable) {
      alert('Please fill in all required fields.');
      return;
    }

    // Base time calculations per unit (in hours)
    const baseTimePerUnit: { [key: string]: number } = {
      pages: 0.3,      // 20 minutes per page
      chapters: 2.5,   // 2.5 hours per chapter
      hours: 1.5,      // 1.5 hours study per 1 hour material
      topics: 1.2,     // 1.2 hours per topic
      lessons: 0.8,    // 48 minutes per lesson
      problems: 0.15   // 9 minutes per problem
    };

    let baseTime = contentAmount * baseTimePerUnit[subject.contentUnit];

    // Difficulty multipliers
    const difficultyMultipliers: { [key: string]: number } = {
      easy: 0.7,
      moderate: 1.0,
      hard: 1.4,
      expert: 1.8
    };

    // Learning style multipliers
    const learningMultipliers: { [key: string]: number } = {
      fast: 0.8,
      average: 1.0,
      thorough: 1.3,
      slow: 1.5
    };

    // Experience multipliers
    const experienceMultipliers: { [key: string]: number } = {
      beginner: 1.4,
      some: 1.1,
      familiar: 0.9,
      expert: 0.7
    };

    // Target performance multipliers
    const targetMultipliers: { [key: string]: number } = {
      pass: 1.0,
      good: 1.2,
      excellent: 1.5,
      perfect: 1.8
    };

    // Study goal multipliers
    const goalMultipliers: { [key: string]: number } = {
      exam: 1.3,        // Need review and practice
      course: 1.0,      // Base learning
      certification: 1.4, // Higher standards
      language: 1.2,    // Repeated practice needed
      skill: 1.1,       // Practical application
      research: 1.6,    // Deep analysis
      homework: 0.8     // More focused task
    };

    // Calculate total study time
    let totalTime = baseTime *
                   difficultyMultipliers[subject.difficulty] *
                   learningMultipliers[subject.learningStyle] *
                   experienceMultipliers[subject.experience] *
                   targetMultipliers[subject.targetGrade] *
                   goalMultipliers[subject.studyGoal];

    // Add time for selected study methods
    let methodMultiplier = 1.0;
    if (subject.practice) methodMultiplier += 0.3;
    if (subject.flashcards) methodMultiplier += 0.2;
    if (subject.notes) methodMultiplier += 0.15;
    if (subject.videos) methodMultiplier += 0.1;
    if (subject.group) methodMultiplier += 0.2;

    totalTime *= methodMultiplier;

    // Calculate feasibility
    const totalAvailableTime = availableHours * daysAvailable;
    const dailyTimeNeeded = totalTime / daysAvailable;
    const isAchievable = totalTime <= totalAvailableTime;

    // Calculate study sessions (assuming 1.5 hour sessions)
    const sessionLength = 1.5;
    const totalSessions = Math.ceil(totalTime / sessionLength);
    const sessionsPerDay = Math.ceil(dailyTimeNeeded / sessionLength);

    // Generate schedule breakdown
    const scheduleDetails = generateSchedule(totalTime, daysAvailable, dailyTimeNeeded, contentAmount, subject.contentUnit);

    // Generate personalized tips
    const studyTips = generateStudyTips(subject.learningStyle, subject.difficulty, subject.studyGoal, isAchievable);

    // Update results
    setResults({
      totalStudyTime: Math.round(totalTime) + ' hours',
      dailyStudyTime: dailyTimeNeeded.toFixed(1) + ' hours/day' + (dailyTimeNeeded > availableHours ? ' ⚠️' : ' ✅'),
      studySessions: totalSessions + ' sessions (' + sessionsPerDay + '/day)',
      totalTimePercent: Math.min((totalTime / (availableHours * daysAvailable)) * 100, 100),
      dailyTimePercent: Math.min((dailyTimeNeeded / 16) * 100, 100), // 16 hours max per day
      daysRemaining: daysAvailable,
      hoursRemaining: Math.round(totalTime),
      scheduleDetails,
      studyTips
    });

    setShowResults(true);
    setTimeout(() => {
      const resultsElement = document.getElementById('results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const generateSchedule = (totalTime: number, days: number, dailyTime: number, contentAmount: number, contentUnit: string): string[] => {
    const recommendations: string[] = [];

    if (dailyTime <= 2) {
      recommendations.push('📅 Schedule 1 focused study session per day');
    } else if (dailyTime <= 4) {
      recommendations.push('📅 Split into 2 study sessions per day with breaks');
    } else {
      recommendations.push('📅 Consider 3+ shorter sessions to maintain focus');
    }

    recommendations.push(`📖 Cover ~${Math.ceil(contentAmount/days)} ${contentUnit} per day`);

    if (days <= 7) {
      recommendations.push('⚡ Intensive study schedule - prioritize key concepts');
    } else if (days <= 14) {
      recommendations.push('🎯 Moderate pace - include regular review sessions');
    } else {
      recommendations.push('🌱 Gradual learning - use spaced repetition effectively');
    }

    const weeklyBreakdown = Math.ceil(days / 7);
    if (weeklyBreakdown > 1) {
      recommendations.push(`📊 Study for ${weeklyBreakdown} week${weeklyBreakdown > 1 ? 's' : ''} - plan weekly reviews`);
    }

    return recommendations;
  };

  const generateStudyTips = (learningStyle: string, difficulty: string, studyGoal: string, isAchievable: boolean): string[] => {
    const tips: string[] = [];

    // Learning style specific tips
    if (learningStyle === 'fast') {
      tips.push('• Challenge yourself with advanced problems to stay engaged');
      tips.push('• Use active recall techniques to test understanding quickly');
    } else if (learningStyle === 'thorough') {
      tips.push('• Create detailed notes and concept maps');
      tips.push('• Allow extra time for deep understanding and connections');
    } else if (learningStyle === 'slow') {
      tips.push('• Break complex topics into smaller, manageable chunks');
      tips.push('• Use repetition and multiple learning modalities');
    }

    // Difficulty specific tips
    if (difficulty === 'hard' || difficulty === 'expert') {
      tips.push('• Start with easier concepts to build confidence');
      tips.push('• Seek additional resources and explanations');
      tips.push('• Form study groups or find tutoring support');
    }

    // Goal specific tips
    if (studyGoal === 'exam') {
      tips.push('• Practice with past papers and time management');
      tips.push('• Focus on understanding common question patterns');
    } else if (studyGoal === 'certification') {
      tips.push('• Study official materials and practice tests');
      tips.push('• Join online forums and study communities');
    }

    // Feasibility warning
    if (!isAchievable) {
      tips.unshift('⚠️ Timeline may be challenging - consider extending deadline or reducing scope');
      tips.push('• Prioritize high-value topics if time is limited');
    }

    // General tips
    tips.push('• Take regular breaks to maintain focus and retention');
    tips.push('• Review previous material before starting new topics');
    tips.push('• Track progress and adjust schedule as needed');

    return tips;
  };

  // Auto-calculate when key fields change
  useEffect(() => {
    if (calcTimeoutRef.current) {
      clearTimeout(calcTimeoutRef.current);
    }

    const subject = subjects[0];
    if (subject.contentAmount && subject.availableHours && subject.daysAvailable) {
      calcTimeoutRef.current = setTimeout(() => {
        calculateStudyTime();
      }, 800);
    }

    return () => {
      if (calcTimeoutRef.current) {
        clearTimeout(calcTimeoutRef.current);
      }
    };
  }, [subjects[0]?.contentAmount, subjects[0]?.availableHours, subjects[0]?.daysAvailable]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 md:px-6 py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">{getH1('📚 Study Time Calculator')}</h1>
        <p className="text-sm md:text-lg lg:text-xl text-gray-600 mb-4 md:mb-6 max-w-3xl mx-auto">
          Plan your study schedule effectively with personalized time estimates for exams, courses, and learning goals.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-3 sm:mb-4 md:mb-6 justify-center">
        <button onClick={addSubject} className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all shadow-md hover:shadow-lg">
          ➕ Add Subject
        </button>
        <button onClick={savePlan} className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all shadow-md hover:shadow-lg">
          💾 Save Plan
        </button>
        <button onClick={loadPlan} className="flex-1 sm:flex-none bg-purple-500 hover:bg-purple-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all shadow-md hover:shadow-lg">
          📂 Load Plan
        </button>
        <button onClick={toggleTimer} id="timerButton" className="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all shadow-md hover:shadow-lg">
          ⏱️ Start Timer
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Calculator */}
        <div className="lg:col-span-2">
          {/* Study Timer */}
          <div id="studyTimer" className={`bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 ${showTimer ? '' : 'hidden'}`}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
              <div className="text-center sm:text-left flex-1">
                <h3 className="text-lg md:text-xl font-bold text-orange-800 mb-2">⏱️ Study Session Timer</h3>
                <div id="timerDisplay" className="text-3xl md:text-5xl font-bold text-orange-600">{formatTimerDisplay(timerSeconds)}</div>
                <div className="text-xs md:text-sm text-orange-700 mt-1" id="timerStatus">{timerStatus}</div>
              </div>

              {/* Timer Settings */}
              <div className="w-full lg:w-auto bg-white rounded-lg p-3 border border-orange-200">
                <label className="block text-xs font-medium text-orange-800 mb-2">⚙️ Duration (minutes)</label>
                <div className="flex gap-2 flex-wrap">
                  {[15, 25, 30, 45, 60].map(duration => (
                    <button
                      key={duration}
                      onClick={() => setTimerDuration(duration)}
                      className={`timer-preset ${selectedTimerDuration === duration ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700'} hover:bg-orange-600 hover:text-white px-3 py-1 rounded text-sm font-medium transition-colors`}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input type="number" id="customTimerMinutes" min="1" max="180" placeholder="Custom" className="w-20 px-2 py-1 text-sm border border-orange-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                  <button onClick={setCustomTimer} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors">Set</button>
                </div>
              </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

            </div>

            <div className="flex gap-2 justify-center mb-4">
              <button onClick={startTimer} className="bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-medium transition-all shadow-md hover:shadow-lg">▶ Start</button>
              <button onClick={pauseTimer} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-medium transition-all shadow-md hover:shadow-lg">⏸ Pause</button>
              <button onClick={resetTimer} className="bg-red-500 hover:bg-red-600 text-white px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-medium transition-all shadow-md hover:shadow-lg">⏹ Reset</button>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div id="timerProgress" className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-1000" style={{ width: '0%' }}></div>
            </div>

            {/* Timer Stats */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="bg-white rounded p-2">
                <div className="text-xs text-orange-600">Sessions</div>
                <div id="sessionCount" className="text-lg font-bold text-orange-800">{sessionCount}</div>
              </div>
              <div className="bg-white rounded p-2">
                <div className="text-xs text-orange-600">Total Time</div>
                <div id="totalStudyMinutes" className="text-lg font-bold text-orange-800">{totalStudyMinutes}m</div>
              </div>
<div className="bg-white rounded p-2">
                <div className="text-xs text-orange-600">Breaks</div>
                <div id="breakCount" className="text-lg font-bold text-orange-800">{breakCount}</div>
              </div>
            </div>
          </div>

          {/* Subjects Container */}
          <div id="subjectsContainer" className="space-y-4 md:space-y-6 mb-6 md:mb-8">
            {subjects.map((subject, index) => (
              <div key={subject.id} className="subject-card bg-white rounded-xl shadow-lg p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg md:text-2xl font-bold text-gray-900">Subject {index + 1}</h2>
                  <button onClick={() => removeSubject(subject.id)} className="text-red-500 hover:text-red-700 font-medium text-sm md:text-base">🗑️ Remove</button>
                </div>

                {/* Study Goal */}
                <div className="mb-4 md:mb-6">
                  <label htmlFor={`studyGoal-${subject.id}`} className="block text-xs md:text-sm font-medium text-gray-700 mb-2">📖 Study Goal</label>
                  <select
                    id={`studyGoal-${subject.id}`}
                    value={subject.studyGoal}
                    onChange={(e) => updateSubject(subject.id, 'studyGoal', e.target.value)}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="exam">Exam Preparation</option>
                    <option value="course">Complete Course/Subject</option>
                    <option value="certification">Certification Exam</option>
                    <option value="language">Language Learning</option>
                    <option value="skill">New Skill Development</option>
                    <option value="research">Research Project</option>
                    <option value="homework">Homework/Assignment</option>
                  </select>
                </div>

                {/* Content Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                  <div>
                    <label htmlFor={`contentAmount-${subject.id}`} className="block text-xs md:text-sm font-medium text-gray-700 mb-2">📚 Content Amount</label>
                    <div className="flex">
                      <input
                        type="number"
                        id={`contentAmount-${subject.id}`}
                        min="1"
                        value={subject.contentAmount}
                        onChange={(e) => updateSubject(subject.id, 'contentAmount', e.target.value)}
                        className="flex-1 px-2 md:px-3 py-2 text-sm md:text-base border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="300"
                      />
                      <select
                        id={`contentUnit-${subject.id}`}
                        value={subject.contentUnit}
                        onChange={(e) => updateSubject(subject.id, 'contentUnit', e.target.value)}
                        className="px-2 md:px-3 py-2 text-xs md:text-sm border-t border-r border-b border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pages">Pages</option>
                        <option value="chapters">Chapters</option>
                        <option value="hours">Hours</option>
                        <option value="topics">Topics</option>
                        <option value="lessons">Lessons</option>
                        <option value="problems">Problems</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`difficulty-${subject.id}`} className="block text-xs md:text-sm font-medium text-gray-700 mb-2">⚡ Difficulty Level</label>
                    <select
                      id={`difficulty-${subject.id}`}
                      value={subject.difficulty}
                      onChange={(e) => updateSubject(subject.id, 'difficulty', e.target.value)}
                      className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="easy">Easy/Review</option>
                      <option value="moderate">Moderate/New</option>
                      <option value="hard">Hard/Complex</option>
                      <option value="expert">Expert/Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Personal Factors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                  <div>
                    <label htmlFor={`learningStyle-${subject.id}`} className="block text-xs md:text-sm font-medium text-gray-700 mb-2">🧠 Learning Style</label>
                    <select
                      id={`learningStyle-${subject.id}`}
                      value={subject.learningStyle}
                      onChange={(e) => updateSubject(subject.id, 'learningStyle', e.target.value)}
                      className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="fast">Fast Learner</option>
                      <option value="average">Average</option>
                      <option value="thorough">Thorough</option>
                      <option value="slow">Need More Time</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`experience-${subject.id}`} className="block text-xs md:text-sm font-medium text-gray-700 mb-2">💡 Experience</label>
                    <select
                      id={`experience-${subject.id}`}
                      value={subject.experience}
                      onChange={(e) => updateSubject(subject.id, 'experience', e.target.value)}
                      className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="some">Some Knowledge</option>
                      <option value="familiar">Quite Familiar</option>
                      <option value="expert">Expert Level</option>
                    </select>
                  </div>
                </div>

                {/* Time Constraints */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                  <div>
                    <label htmlFor={`availableHours-${subject.id}`} className="block text-xs md:text-sm font-medium text-gray-700 mb-2">⏰ Hours/Day</label>
                    <input
                      type="number"
                      id={`availableHours-${subject.id}`}
                      step="0.5"
                      min="0.5"
                      max="16"
                      value={subject.availableHours}
                      onChange={(e) => updateSubject(subject.id, 'availableHours', e.target.value)}
                      className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="3"
                    />
                  </div>
                  <div>
                    <label htmlFor={`daysAvailable-${subject.id}`} className="block text-xs md:text-sm font-medium text-gray-700 mb-2">📅 Days Available</label>
                    <input
                      type="number"
                      id={`daysAvailable-${subject.id}`}
                      min="1"
                      max="365"
                      value={subject.daysAvailable}
                      onChange={(e) => updateSubject(subject.id, 'daysAvailable', e.target.value)}
                      className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="14"
                    />
                  </div>
                </div>

                {/* Additional Options */}
                <div className="mb-4 md:mb-6">
                  <h3 className="text-sm md:text-lg font-semibold text-gray-800 mb-3">📝 Study Methods</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subject.reading}
                        onChange={(e) => updateSubject(subject.id, 'reading', e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <span className="text-xs md:text-sm">Reading</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subject.practice}
                        onChange={(e) => updateSubject(subject.id, 'practice', e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <span className="text-xs md:text-sm">Practice</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subject.flashcards}
                        onChange={(e) => updateSubject(subject.id, 'flashcards', e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <span className="text-xs md:text-sm">Flashcards</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subject.notes}
                        onChange={(e) => updateSubject(subject.id, 'notes', e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <span className="text-xs md:text-sm">Notes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subject.videos}
                        onChange={(e) => updateSubject(subject.id, 'videos', e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <span className="text-xs md:text-sm">Videos</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subject.group}
                        onChange={(e) => updateSubject(subject.id, 'group', e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <span className="text-xs md:text-sm">Group Study</span>
                    </label>
                  </div>
                </div>

                {/* Target Grade */}
                <div className="mb-4 md:mb-6">
                  <label htmlFor={`targetGrade-${subject.id}`} className="block text-xs md:text-sm font-medium text-gray-700 mb-2">🎯 Target Performance</label>
                  <select
                    id={`targetGrade-${subject.id}`}
                    value={subject.targetGrade}
                    onChange={(e) => updateSubject(subject.id, 'targetGrade', e.target.value)}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pass">Pass (60-70%)</option>
                    <option value="good">Good (75-85%)</option>
                    <option value="excellent">Excellent (90-95%)</option>
                    <option value="perfect">Perfect (95-100%)</option>
                  </select>
                </div>

                <button
                  onClick={calculateStudyTime}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-3 sm:px-4 md:px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-base md:text-lg font-semibold shadow-lg hover:shadow-xl"
                >
                  🚀 Calculate Study Plan
                </button>
              </div>
            ))}
          </div>

          {/* Results */}
          <div id="results" className={`bg-white rounded-xl shadow-lg p-4 md:p-6 ${showResults ? '' : 'hidden'}`}>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">✨ Your Personalized Study Plan</h3>

            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              <div className="p-3 md:p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-xs md:text-sm font-medium text-blue-800">⏱️ Total Study Time:</span>
                  <span id="totalStudyTime" className="font-bold text-lg md:text-xl text-blue-600">{results.totalStudyTime}</span>
                </div>
                <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                  <div id="totalTimeProgress" className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${results.totalTimePercent}%` }}></div>
                </div>
              </div>

              <div className="p-3 md:p-4 bg-green-50 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-xs md:text-sm font-medium text-green-800">📅 Daily Study Time:</span>
                  <span id="dailyStudyTime" className="font-bold text-base md:text-lg text-green-600">{results.dailyStudyTime}</span>
                </div>
                <div className="mt-2 w-full bg-green-200 rounded-full h-2">
                  <div id="dailyTimeProgress" className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${results.dailyTimePercent}%` }}></div>
                </div>
              </div>

              <div className="p-3 md:p-4 bg-purple-50 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-xs md:text-sm font-medium text-purple-800">🎯 Study Sessions:</span>
                  <span id="studySessions" className="font-bold text-base md:text-lg text-purple-600">{results.studySessions}</span>
                </div>
              </div>
            </div>

            {/* Schedule Breakdown */}
            <div id="scheduleBreakdown" className="mb-3 sm:mb-4 md:mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Recommended Schedule</h4>
              <div id="scheduleDetails" className="space-y-2">
                {results.scheduleDetails.map((detail, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-sm">{detail}</div>
                ))}
              </div>
            </div>

            {/* Study Tips */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Personalized Study Tips</h4>
              <div id="studyTips" className="text-sm text-blue-700">
                {results.studyTips.map((tip, index) => (
                  <div key={index}>{tip}</div>
                ))}
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Track Your Progress</h4>
              <div className="grid md:grid-cols-3 gap-4 mt-3">
                <div className="text-center p-3 bg-white rounded">
                  <div className="text-2xl font-bold text-green-600" id="daysRemaining">{results.daysRemaining}</div>
                  <div className="text-xs text-gray-600">Days Remaining</div>
                </div>
                <div className="text-center p-3 bg-white rounded">
                  <div className="text-2xl font-bold text-blue-600" id="hoursRemaining">{results.hoursRemaining}</div>
                  <div className="text-xs text-gray-600">Hours Remaining</div>
                </div>
                <div className="text-center p-3 bg-white rounded">
                  <div className="text-2xl font-bold text-purple-600" id="progressPercentage">0%</div>
                  <div className="text-xs text-gray-600">Progress Made</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-blue-50 rounded-xl p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-blue-800 mb-3">📚 Study Guidelines</h3>
            <div className="space-y-2 text-xs md:text-sm text-blue-700">
              <div><strong>Reading:</strong> 2-4 pages/hour</div>
              <div><strong>Math Problems:</strong> 3-6/hour</div>
              <div><strong>Memorization:</strong> 10-20 items/hour</div>
              <div><strong>Note Review:</strong> 5-10 pages/hour</div>
              <div><strong>Practice Tests:</strong> 1.5x exam time</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-green-800 mb-3">⏰ Time Tips</h3>
            <ul className="space-y-2 text-xs md:text-sm text-green-700">
              <li>• Pomodoro Technique (25min)</li>
              <li>• Take 5-10 min breaks</li>
              <li>• Study at peak energy hours</li>
              <li>• Eliminate distractions</li>
              <li>• Review previous material</li>
            </ul>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-amber-800 mb-3">🎯 Strategies</h3>
            <ul className="space-y-2 text-xs md:text-sm text-amber-700">
              <li>• Active recall over reading</li>
              <li>• Spaced repetition</li>
              <li>• Practice testing</li>
              <li>• Teach concepts to others</li>
              <li>• Connect new knowledge</li>
            </ul>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-purple-800 mb-3">📈 Progress</h3>
            <ul className="space-y-2 text-xs md:text-sm text-purple-700">
              <li>• Set daily/weekly goals</li>
              <li>• Track completed topics</li>
              <li>• Monitor comprehension</li>
              <li>• Adjust schedule</li>
              <li>• Celebrate milestones</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="mt-8 md:mt-12 bg-white rounded-xl shadow-lg p-4 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">📖 Effective Study Planning</h2>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">🔬 The Science of Study Time</h3>
            <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
              Research shows that distributed practice (spreading study sessions over time) is more effective than
              cramming. The optimal study session length is typically 25-90 minutes with breaks.
            </p>

            <h4 className="text-sm md:text-base font-semibold mb-2">Key Principles:</h4>
            <ul className="space-y-1 text-gray-600 text-xs md:text-sm">
              <li>• Spacing effect: Review at increasing intervals</li>
              <li>• Testing effect: Self-testing improves retention</li>
              <li>• Elaboration: Connect new concepts</li>
              <li>• Interleaving: Mix different topics</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">🏠 Study Environment</h3>
            <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
              Your study environment significantly impacts learning efficiency. Create a dedicated,
              distraction-free space optimized for focus and retention.
            </p>

            <h4 className="text-sm md:text-base font-semibold mb-2">Environment Checklist:</h4>
            <ul className="space-y-1 text-gray-600 text-xs md:text-sm">
              <li>• Good lighting and comfortable temperature</li>
              <li>• Minimal distractions (phone, social media)</li>
              <li>• Organized materials and resources</li>
              <li>• Comfortable but alert seating</li>
              <li>• Background music or silence</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <div className="mt-8 md:mt-12">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 text-center">Related Converter Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className={`${calc.color || 'bg-gray-500'} rounded-xl p-4 md:p-6 text-white hover:shadow-xl transition-all transform hover:-translate-y-1`}>
              <h3 className="text-base md:text-lg font-bold mb-2">{calc.title}</h3>
              <p className="text-xs md:text-sm opacity-90">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="study-time-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
