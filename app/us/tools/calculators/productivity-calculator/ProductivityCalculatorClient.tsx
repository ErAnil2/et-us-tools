'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
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
    question: "What is a Productivity Calculator?",
    answer: "A Productivity Calculator is a free online tool designed to help you quickly and accurately calculate productivity-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Productivity Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Productivity Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Productivity Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function ProductivityCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  // Tab state
  const { getH1, getSubHeading } = usePageSEO('productivity-calculator');

  const [activeTab, setActiveTab] = useState<'daily' | 'task' | 'weekly'>('daily');

  // Daily Productivity states
  const [workHours, setWorkHours] = useState(8);
  const [breakTime, setBreakTime] = useState(60);
  const [tasksCompleted, setTasksCompleted] = useState(5);
  const [plannedTasks, setPlannedTasks] = useState(6);
  const [distractionTime, setDistractionTime] = useState(45);
  const [energyLevel, setEnergyLevel] = useState(7);

  // Task Analysis states
  const [taskName, setTaskName] = useState('Project Report');
  const [estimatedTime, setEstimatedTime] = useState(120);
  const [actualTime, setActualTime] = useState(150);
  const [qualityRating, setQualityRating] = useState(8);
  const [difficultyLevel, setDifficultyLevel] = useState(5);

  // Weekly Review states
  const [workDays, setWorkDays] = useState(5);
  const [totalHours, setTotalHours] = useState(40);
  const [weeklyTasksCompleted, setWeeklyTasksCompleted] = useState(25);
  const [goalsAchieved, setGoalsAchieved] = useState(3);
  const [goalsSet, setGoalsSet] = useState(4);
  const [stressLevel, setStressLevel] = useState(5);

  // Results state
  const [resultsHTML, setResultsHTML] = useState<string>(
    'Select a tab and enter your information to see detailed productivity analysis and recommendations.'
  );

  // Chart references
  const timeBreakdownChartRef = useRef<HTMLCanvasElement>(null);
  const performanceChartRef = useRef<HTMLCanvasElement>(null);
  const productivityChartRef = useRef<HTMLCanvasElement>(null);
  const timeBreakdownChartInstance = useRef<any>(null);
  const performanceChartInstance = useRef<any>(null);
  const productivityChartInstance = useRef<any>(null);

  // Chart data storage
  const chartData = useRef<{
    daily: any;
    task: any;
    weekly: any;
  }>({
    daily: null,
    task: null,
    weekly: null
  });

  // Load Chart.js
  useEffect(() => {
    const loadChartJS = async () => {
      if (typeof window !== 'undefined' && !window.Chart) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.async = true;
        document.body.appendChild(script);

        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Initialize with daily calculation
      setTimeout(() => {
        calculateDailyProductivity();
      }, 100);
    };

    loadChartJS();

    return () => {
      if (timeBreakdownChartInstance.current) timeBreakdownChartInstance.current.destroy();
      if (performanceChartInstance.current) performanceChartInstance.current.destroy();
      if (productivityChartInstance.current) productivityChartInstance.current.destroy();
    };
  }, []);

  // Auto-calculate when tab changes
  useEffect(() => {
    if (activeTab === 'daily') {
      calculateDailyProductivity();
    } else if (activeTab === 'task') {
      analyzeTask();
    } else if (activeTab === 'weekly') {
      calculateWeeklyProductivity();
    }
  }, [activeTab]);

  // Auto-calculate when daily inputs change
  useEffect(() => {
    if (activeTab === 'daily') {
      calculateDailyProductivity();
    }
  }, [workHours, breakTime, tasksCompleted, plannedTasks, distractionTime, energyLevel]);

  // Auto-calculate when task inputs change
  useEffect(() => {
    if (activeTab === 'task' && taskName && estimatedTime > 0 && actualTime > 0) {
      analyzeTask();
    }
  }, [taskName, estimatedTime, actualTime, qualityRating, difficultyLevel]);

  // Auto-calculate when weekly inputs change
  useEffect(() => {
    if (activeTab === 'weekly') {
      calculateWeeklyProductivity();
    }
  }, [workDays, totalHours, weeklyTasksCompleted, goalsAchieved, goalsSet, stressLevel]);

  const calculateDailyProductivity = () => {
    if (workHours <= 0) {
      alert('Please enter valid work hours');
      return;
    }

    // Calculate metrics
    const totalWorkMinutes = workHours * 60;
    const focusTime = totalWorkMinutes - breakTime - distractionTime;
    const focusTimeHours = Math.max(0, focusTime / 60);

    const efficiencyScore = (tasksCompleted / plannedTasks) * 100;
    const tasksPerHour = focusTimeHours > 0 ? tasksCompleted / focusTimeHours : 0;
    const focusPercentage = Math.max(0, (focusTime / totalWorkMinutes) * 100);

    // Productivity score calculation
    const productivityScore = Math.round(
      (efficiencyScore * 0.4) +
      (focusPercentage * 0.3) +
      (energyLevel * 10 * 0.2) +
      (tasksPerHour * 10 * 0.1)
    );

    // Recommendations
    let recommendations = [];
    if (efficiencyScore < 80) recommendations.push("Consider breaking down tasks into smaller, more manageable pieces");
    if (focusPercentage < 70) recommendations.push("Try to reduce distractions and take more structured breaks");
    if (energyLevel < 6) recommendations.push("Focus on energy management - ensure adequate sleep, nutrition, and exercise");
    if (tasksPerHour < 1) recommendations.push("Consider time-blocking techniques to improve task completion rate");

    const results = `
      <div class="space-y-4">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-600">${productivityScore}/100</div>
          <div class="text-sm text-gray-600">Daily Productivity Score</div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-blue-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-blue-600">${efficiencyScore.toFixed(1)}%</div>
            <div class="text-xs text-gray-600">Task Efficiency</div>
          </div>
          <div class="bg-green-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-green-600">${focusTimeHours.toFixed(1)}h</div>
            <div class="text-xs text-gray-600">Focus Time</div>
          </div>
          <div class="bg-purple-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-purple-600">${tasksPerHour.toFixed(1)}</div>
            <div class="text-xs text-gray-600">Tasks/Hour</div>
          </div>
          <div class="bg-orange-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-orange-600">${focusPercentage.toFixed(1)}%</div>
            <div class="text-xs text-gray-600">Focus Percentage</div>
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div class="bg-yellow-50 p-4 rounded-lg">
          <h4 class="font-semibold text-yellow-700 mb-2">💡 Recommendations:</h4>
          <ul class="text-sm text-gray-700 space-y-1">
            ${recommendations.map(rec => `<li>• ${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
      </div>
    `;

    setResultsHTML(results);

    // Store data for charts
    chartData.current.daily = {
      workHours,
      breakTime,
      distractionTime,
      focusTime: Math.max(0, focusTime),
      tasksCompleted,
      plannedTasks,
      efficiencyScore,
      energyLevel,
      productivityScore
    };

    // Update charts
    updateAllCharts();
  };

  const analyzeTask = () => {
    if (!taskName || estimatedTime <= 0 || actualTime <= 0) {
      return;
    }

    // Calculate metrics
    const timeAccuracy = ((estimatedTime / actualTime) * 100);
    const timeVariance = Math.abs(actualTime - estimatedTime);
    const efficiencyRating = (estimatedTime / actualTime) * qualityRating;
    const difficultyAdjustedScore = (qualityRating / difficultyLevel) * 10;

    // Performance rating
    let performanceCategory = 'Good';
    let performanceColor = 'text-green-600';

    if (efficiencyRating >= 8) {
      performanceCategory = 'Excellent';
      performanceColor = 'text-blue-600';
    } else if (efficiencyRating <= 5) {
      performanceCategory = 'Needs Improvement';
      performanceColor = 'text-red-600';
    } else if (efficiencyRating <= 6.5) {
      performanceCategory = 'Fair';
      performanceColor = 'text-orange-600';
    }

    // Task insights
    let insights = [];
    if (timeAccuracy < 80) insights.push("Work on improving time estimation accuracy");
    if (timeAccuracy > 120) insights.push("You may be overestimating task complexity");
    if (qualityRating >= 8 && actualTime <= estimatedTime) insights.push("Great balance of quality and efficiency!");
    if (difficultyLevel >= 8 && qualityRating >= 7) insights.push("Excellent performance on a challenging task");

    const results = `
      <div class="space-y-4">
        <div class="text-center">
          <h4 class="text-lg font-bold text-gray-800">${taskName}</h4>
          <div class="text-2xl font-bold ${performanceColor}">${performanceCategory}</div>
          <div class="text-sm text-gray-600">Overall Performance</div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-blue-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-blue-600">${timeAccuracy.toFixed(1)}%</div>
            <div class="text-xs text-gray-600">Time Accuracy</div>
          </div>
          <div class="bg-green-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-green-600">${efficiencyRating.toFixed(1)}</div>
            <div class="text-xs text-gray-600">Efficiency Rating</div>
          </div>
          <div class="bg-purple-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-purple-600">${timeVariance.toFixed(0)}min</div>
            <div class="text-xs text-gray-600">Time Variance</div>
          </div>
          <div class="bg-orange-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-orange-600">${difficultyAdjustedScore.toFixed(1)}</div>
            <div class="text-xs text-gray-600">Difficulty Score</div>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Estimated:</strong> ${estimatedTime} min</div>
            <div><strong>Actual:</strong> ${actualTime} min</div>
            <div><strong>Quality:</strong> ${qualityRating}/10</div>
            <div><strong>Difficulty:</strong> ${difficultyLevel}/10</div>
          </div>
        </div>

        ${insights.length > 0 ? `
        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="font-semibold text-blue-700 mb-2">📝 Insights:</h4>
          <ul class="text-sm text-gray-700 space-y-1">
            ${insights.map(insight => `<li>• ${insight}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
      </div>
    `;

    setResultsHTML(results);

    // Store data for charts
    chartData.current.task = {
      taskName,
      estimatedTime,
      actualTime,
      qualityRating,
      difficultyLevel,
      timeAccuracy,
      efficiencyRating,
      timeVariance,
      difficultyAdjustedScore
    };

    // Update charts
    updateAllCharts();
  };

  const calculateWeeklyProductivity = () => {
    if (workDays <= 0 || totalHours <= 0) {
      alert('Please enter valid work days and hours');
      return;
    }

    // Calculate metrics
    const hoursPerDay = totalHours / workDays;
    const tasksPerDay = weeklyTasksCompleted / workDays;
    const goalCompletionRate = (goalsAchieved / goalsSet) * 100;
    const workLifeBalance = Math.max(0, 10 - (stressLevel - 1));

    // Weekly productivity score
    const weeklyScore = Math.round(
      (goalCompletionRate * 0.4) +
      (tasksPerDay * 10 * 0.3) +
      (workLifeBalance * 10 * 0.2) +
      (Math.min(hoursPerDay / 8, 1) * 100 * 0.1)
    );

    // Weekly insights
    let weeklyInsights = [];
    if (goalCompletionRate >= 80) weeklyInsights.push("Excellent goal achievement this week!");
    if (goalCompletionRate < 60) weeklyInsights.push("Focus on breaking goals into smaller, achievable milestones");
    if (hoursPerDay > 10) weeklyInsights.push("Consider work-life balance - long hours may reduce long-term productivity");
    if (stressLevel >= 8) weeklyInsights.push("High stress levels detected - consider stress management techniques");
    if (tasksPerDay < 3) weeklyInsights.push("Try task batching to increase daily completion rate");

    const results = `
      <div class="space-y-4">
        <div class="text-center">
          <div class="text-3xl font-bold text-purple-600">${weeklyScore}/100</div>
          <div class="text-sm text-gray-600">Weekly Productivity Score</div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-purple-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-purple-600">${goalCompletionRate.toFixed(1)}%</div>
            <div class="text-xs text-gray-600">Goal Completion</div>
          </div>
          <div class="bg-green-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-green-600">${tasksPerDay.toFixed(1)}</div>
            <div class="text-xs text-gray-600">Tasks/Day</div>
          </div>
          <div class="bg-blue-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-blue-600">${hoursPerDay.toFixed(1)}h</div>
            <div class="text-xs text-gray-600">Hours/Day</div>
          </div>
          <div class="bg-orange-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-orange-600">${workLifeBalance.toFixed(1)}/10</div>
            <div class="text-xs text-gray-600">Balance Score</div>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Work Days:</strong> ${workDays}</div>
            <div><strong>Total Hours:</strong> ${totalHours}h</div>
            <div><strong>Tasks Done:</strong> ${weeklyTasksCompleted}</div>
            <div><strong>Goals:</strong> ${goalsAchieved}/${goalsSet}</div>
          </div>
        </div>

        ${weeklyInsights.length > 0 ? `
        <div class="bg-green-50 p-4 rounded-lg">
          <h4 class="font-semibold text-green-700 mb-2">🎯 Weekly Insights:</h4>
          <ul class="text-sm text-gray-700 space-y-1">
            ${weeklyInsights.map(insight => `<li>• ${insight}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
      </div>
    `;

    setResultsHTML(results);

    // Store data for charts
    chartData.current.weekly = {
      workDays,
      totalHours,
      weeklyTasksCompleted,
      goalsAchieved,
      goalsSet,
      stressLevel,
      hoursPerDay,
      tasksPerDay,
      goalCompletionRate,
      workLifeBalance,
      weeklyScore
    };

    // Update charts
    updateAllCharts();
  };

  const updateAllCharts = () => {
    setTimeout(() => {
      createTimeBreakdownChart();
      createPerformanceChart();
      createProductivityChart();
    }, 50);
  };

  const createProductivityChart = () => {
    if (!productivityChartRef.current || !window.Chart) return;

    const ctx = productivityChartRef.current.getContext('2d');
    if (!ctx) return;

    if (productivityChartInstance.current) {
      productivityChartInstance.current.destroy();
    }

    const data = chartData.current.daily || chartData.current.task || chartData.current.weekly;
    if (!data) return;

    let chartConfig;

    if (chartData.current.daily) {
      const d = chartData.current.daily;
      chartConfig = {
        type: 'doughnut',
        data: {
          labels: ['Completed Tasks', 'Remaining Tasks'],
          datasets: [{
            data: [d.tasksCompleted, Math.max(0, d.plannedTasks - d.tasksCompleted)],
            backgroundColor: ['#10B981', '#EF4444'],
            borderColor: ['#059669', '#DC2626'],
            borderWidth: 2
          }]
        }
      };
    } else if (chartData.current.weekly) {
      const w = chartData.current.weekly;
      chartConfig = {
        type: 'bar',
        data: {
          labels: ['Goal Completion', 'Task Rate', 'Work Balance'],
          datasets: [{
            label: 'Performance %',
            data: [w.goalCompletionRate, w.tasksPerDay * 10, w.workLifeBalance * 10],
            backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6'],
            borderColor: ['#1D4ED8', '#059669', '#7C3AED'],
            borderWidth: 2
          }]
        }
      };
    } else {
      return;
    }

    productivityChartInstance.current = new window.Chart(ctx, {
      ...chartConfig,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  };

  const createTimeBreakdownChart = () => {
    if (!timeBreakdownChartRef.current || !window.Chart) return;

    const ctx = timeBreakdownChartRef.current.getContext('2d');
    if (!ctx) return;

    if (timeBreakdownChartInstance.current) {
      timeBreakdownChartInstance.current.destroy();
    }

    const data = chartData.current.daily;
    if (!data) return;

    const focusMinutes = data.focusTime;
    const breakMinutes = data.breakTime;
    const distractionMinutes = data.distractionTime;

    timeBreakdownChartInstance.current = new window.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Focus Time', 'Break Time', 'Distractions'],
        datasets: [{
          data: [focusMinutes, breakMinutes, distractionMinutes],
          backgroundColor: ['#10B981', '#3B82F6', '#EF4444'],
          borderColor: ['#059669', '#1D4ED8', '#DC2626'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const minutes = context.raw;
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                return context.label + ': ' + hours + 'h ' + mins + 'm';
              }
            }
          }
        }
      }
    });
  };

  const createPerformanceChart = () => {
    if (!performanceChartRef.current || !window.Chart) return;

    const ctx = performanceChartRef.current.getContext('2d');
    if (!ctx) return;

    if (performanceChartInstance.current) {
      performanceChartInstance.current.destroy();
    }

    let labels;
    let values;

    if (chartData.current.task) {
      const data = chartData.current.task;
      labels = ['Time Accuracy', 'Quality Rating', 'Efficiency', 'Difficulty Adj.'];
      values = [
        data.timeAccuracy / 100 * 10,
        data.qualityRating,
        Math.min(data.efficiencyRating, 10),
        data.difficultyAdjustedScore
      ];
    } else if (chartData.current.daily) {
      const data = chartData.current.daily;
      labels = ['Efficiency', 'Focus %', 'Energy Level', 'Task Rate'];
      values = [
        data.efficiencyScore / 100 * 10,
        (data.focusTime / (data.workHours * 60)) * 10,
        data.energyLevel,
        Math.min(data.tasksCompleted / data.workHours * 2, 10)
      ];
    } else {
      return;
    }

    performanceChartInstance.current = new window.Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Performance Metrics',
          data: values,
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 2,
          pointBackgroundColor: 'rgb(99, 102, 241)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(99, 102, 241)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 10,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            angleLines: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            pointLabels: {
              font: {
                size: 12
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  };

  return (
    <div className="max-w-[1180px] mx-auto p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Productivity Calculator Online')}</h1>
        <p className="text-lg text-gray-600">Optimize work efficiency and track productivity metrics with detailed analytics</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Tab Navigation */}
            <div className="grid grid-cols-3 gap-2 mb-3 sm:mb-4 md:mb-6">
              <button
                onClick={() => setActiveTab('daily')}
                className={`px-3 py-2 border-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'daily'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-500'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setActiveTab('task')}
                className={`px-3 py-2 border-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'task'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-500'
                }`}
              >
                Task
              </button>
              <button
                onClick={() => setActiveTab('weekly')}
                className={`px-3 py-2 border-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'weekly'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-500'
                }`}
              >
                Weekly
              </button>
            </div>

            {/* Daily Productivity Tab */}
            {activeTab === 'daily' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Daily Work Analysis</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Work Hours</label>
                    <input
                      type="number"
                      value={workHours}
                      onChange={(e) => setWorkHours(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="8"
                      min="1"
                      max="24"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Break Time (minutes)</label>
                    <input
                      type="number"
                      value={breakTime}
                      onChange={(e) => setBreakTime(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="60"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tasks Completed</label>
                    <input
                      type="number"
                      value={tasksCompleted}
                      onChange={(e) => setTasksCompleted(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="5"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Planned Tasks</label>
                    <input
                      type="number"
                      value={plannedTasks}
                      onChange={(e) => setPlannedTasks(parseFloat(e.target.value) || 1)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="6"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Distraction Time (minutes)</label>
                    <input
                      type="number"
                      value={distractionTime}
                      onChange={(e) => setDistractionTime(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="45"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Energy Level (1-10)</label>
                    <input
                      type="range"
                      value={energyLevel}
                      onChange={(e) => setEnergyLevel(parseFloat(e.target.value))}
                      className="w-full"
                      min="1"
                      max="10"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Low (1)</span>
                      <span>{energyLevel}</span>
                      <span>High (10)</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={calculateDailyProductivity}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-3 sm:px-4 md:px-6 rounded-lg transition-colors"
                  >
                    Calculate Daily Productivity
                  </button>
                </div>
              </div>
            )}

            {/* Task Analysis Tab */}
            {activeTab === 'task' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Task Performance Analysis</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Task Name</label>
                    <input
                      type="text"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Project Report"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Time (minutes)</label>
                    <input
                      type="number"
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="120"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Actual Time (minutes)</label>
                    <input
                      type="number"
                      value={actualTime}
                      onChange={(e) => setActualTime(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="150"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quality Rating (1-10)</label>
                    <input
                      type="range"
                      value={qualityRating}
                      onChange={(e) => setQualityRating(parseFloat(e.target.value))}
                      className="w-full"
                      min="1"
                      max="10"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Poor (1)</span>
                      <span>{qualityRating}</span>
                      <span>Excellent (10)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level (1-10)</label>
                    <input
                      type="range"
                      value={difficultyLevel}
                      onChange={(e) => setDifficultyLevel(parseFloat(e.target.value))}
                      className="w-full"
                      min="1"
                      max="10"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Easy (1)</span>
                      <span>{difficultyLevel}</span>
                      <span>Hard (10)</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={analyzeTask}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-3 sm:px-4 md:px-6 rounded-lg transition-colors"
                  >
                    Analyze Task Performance
                  </button>
                </div>
              </div>
            )}

            {/* Weekly Review Tab */}
            {activeTab === 'weekly' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Weekly Productivity Review</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Work Days This Week</label>
                    <input
                      type="number"
                      value={workDays}
                      onChange={(e) => setWorkDays(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="5"
                      min="1"
                      max="7"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Hours Worked</label>
                    <input
                      type="number"
                      value={totalHours}
                      onChange={(e) => setTotalHours(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="40"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Tasks Completed</label>
                    <input
                      type="number"
                      value={weeklyTasksCompleted}
                      onChange={(e) => setWeeklyTasksCompleted(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="25"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Major Goals Achieved</label>
                    <input
                      type="number"
                      value={goalsAchieved}
                      onChange={(e) => setGoalsAchieved(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="3"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Major Goals Set</label>
                    <input
                      type="number"
                      value={goalsSet}
                      onChange={(e) => setGoalsSet(parseFloat(e.target.value) || 1)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="4"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Average Stress Level (1-10)</label>
                    <input
                      type="range"
                      value={stressLevel}
                      onChange={(e) => setStressLevel(parseFloat(e.target.value))}
                      className="w-full"
                      min="1"
                      max="10"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Low (1)</span>
                      <span>{stressLevel}</span>
                      <span>High (10)</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={calculateWeeklyProductivity}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-3 sm:px-4 md:px-6 rounded-lg transition-colors"
                  >
                    Review Weekly Performance
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Results</h3>
              <div dangerouslySetInnerHTML={{ __html: resultsHTML }} />
            </div>

            {/* Productivity Chart */}
            <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 border">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Productivity Breakdown</h4>
              <div className="relative h-64">
                <canvas ref={productivityChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productivity Analysis Chart */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6 text-center">Productivity Analysis Dashboard</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Time Breakdown Chart */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Time Breakdown</h4>
            <div className="relative h-64">
              <canvas ref={timeBreakdownChartRef}></canvas>
            </div>
          </div>

          {/* Performance Chart */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h4>
            <div className="relative h-64">
              <canvas ref={performanceChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
{/* Information Section */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Understanding Productivity Metrics</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-blue-700">
          <div>
            <h4 className="font-semibold mb-2">Key Formulas:</h4>
            <p className="mb-4">Efficiency = (Tasks Completed ÷ Planned Tasks) × 100</p>
            <p className="mb-4">Focus Percentage = (Work Time - Breaks - Distractions) ÷ Total Work Time</p>
            <h4 className="font-semibold mb-2">Daily Score:</h4>
            <p>Combines efficiency (40%), focus (30%), energy (20%), and task rate (10%)</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Productivity Tips:</h4>
            <ul className="space-y-1">
              <li>• Set realistic daily task goals</li>
              <li>• Minimize distractions during work</li>
              <li>• Take regular breaks to maintain energy</li>
              <li>• Track and analyze your patterns</li>
              <li>• Focus on quality over quantity</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="productivity-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Business Calculators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="block p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
            >
              <h4 className="font-semibold text-gray-800 mb-2">{calc.title}</h4>
              <p className="text-sm text-gray-600">{calc.description}</p>
            </Link>
          ))}
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      </div>
    </div>
  );
}
