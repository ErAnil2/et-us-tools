'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { usePageSEO } from '@/lib/usePageSEO';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface DataUsageClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface UsageBreakdown {
  name: string;
  usage: number;
  percentage: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Data Usage Calculator?",
    answer: "A Data Usage Calculator helps you calculate dates, times, or durations quickly. Whether you need to find the difference between dates or calculate future/past dates, this tool provides instant results.",
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

export default function DataUsageClient({ relatedCalculators = defaultRelatedCalculators }: DataUsageClientProps) {
  // Activity inputs
  const { getH1, getSubHeading } = usePageSEO('data-usage-calculator');

  const [youtubeHours, setYoutubeHours] = useState<number>(1);
  const [streamingHD, setStreamingHD] = useState<number>(0.5);
  const [streaming4K, setStreaming4K] = useState<number>(0);
  const [musicStreaming, setMusicStreaming] = useState<number>(2);
  const [podcasts, setPodcasts] = useState<number>(0.5);
  const [webBrowsing, setWebBrowsing] = useState<number>(3);
  const [socialMedia, setSocialMedia] = useState<number>(2);
  const [emailMessaging, setEmailMessaging] = useState<number>(1);
  const [videoCalls, setVideoCalls] = useState<number>(1);
  const [cloudSync, setCloudSync] = useState<number>(0.5);
  const [gaming, setGaming] = useState<number>(1);
  const [downloads, setDownloads] = useState<number>(0.2);

  // Usage pattern
  const [usagePattern, setUsagePattern] = useState<string>('weekends');
  const [wifiAvailability, setWifiAvailability] = useState<string>('medium');

  // Results
  const [dailyUsage, setDailyUsage] = useState<string>('');
  const [monthlyUsage, setMonthlyUsage] = useState<string>('');
  const [peakUsage, setPeakUsage] = useState<string>('');
  const [usageBreakdown, setUsageBreakdown] = useState<UsageBreakdown[]>([]);
  const [planRecommendations, setPlanRecommendations] = useState<string[]>([]);
  const [dataTips, setDataTips] = useState<string[]>([]);

  // Data usage rates (MB per hour or GB as specified)
  const dataRates: Record<string, number> = {
    youtubeHours: 500,
    streamingHD: 1024,
    streaming4K: 7168,
    musicStreaming: 100,
    podcasts: 50,
    webBrowsing: 25,
    socialMedia: 200,
    emailMessaging: 5,
    videoCalls: 200,
    gaming: 50,
    cloudSync: 1024,
    downloads: 1024
  };

  const getActivityName = (activity: string): string => {
    const names: Record<string, string> = {
      youtubeHours: 'YouTube/Social Video',
      streamingHD: 'HD Streaming',
      streaming4K: '4K Streaming',
      musicStreaming: 'Music Streaming',
      podcasts: 'Podcasts',
      webBrowsing: 'Web Browsing',
      socialMedia: 'Social Media',
      emailMessaging: 'Email/Messaging',
      videoCalls: 'Video Calls',
      gaming: 'Online Gaming',
      cloudSync: 'Cloud Sync',
      downloads: 'Downloads'
    };
    return names[activity] || activity;
  };

  const formatDataSize = (mb: number): string => {
    if (mb < 1024) {
      return Math.round(mb) + ' MB';
    } else {
      return (mb / 1024).toFixed(1) + ' GB';
    }
  };

  const calculateDataUsage = () => {
    const activities = {
      youtubeHours,
      streamingHD,
      streaming4K,
      musicStreaming,
      podcasts,
      webBrowsing,
      socialMedia,
      emailMessaging,
      videoCalls,
      gaming,
      cloudSync,
      downloads
    };

    let totalDailyMB = 0;
    const breakdown: UsageBreakdown[] = [];

    // Calculate usage for each activity
    Object.entries(activities).forEach(([activity, value]) => {
      const rate = dataRates[activity];
      let activityUsage = 0;

      if (activity === 'cloudSync' || activity === 'downloads') {
        activityUsage = value * rate; // Direct GB to MB conversion
      } else {
        activityUsage = value * rate; // Hours × MB per hour
      }

      if (activityUsage > 0) {
        totalDailyMB += activityUsage;
        breakdown.push({
          name: getActivityName(activity),
          usage: activityUsage,
          percentage: 0
        });
      }
    });

    // Calculate percentages
    breakdown.forEach(item => {
      item.percentage = (item.usage / totalDailyMB) * 100;
    });

    // Sort by usage
    breakdown.sort((a, b) => b.usage - a.usage);

    // Apply usage patterns
    const adjustedUsage = applyUsagePatterns(totalDailyMB);

    // Update state
    setDailyUsage(formatDataSize(adjustedUsage.daily));
    setMonthlyUsage(formatDataSize(adjustedUsage.monthly));
    setPeakUsage(formatDataSize(adjustedUsage.peak));
    setUsageBreakdown(breakdown);

    // Generate recommendations
    generatePlanRecommendations(adjustedUsage.monthly);
    generateDataTips(adjustedUsage.monthly, breakdown);
  };

  const applyUsagePatterns = (dailyMB: number) => {
    let weekdayMB = dailyMB;
    let weekendMB = dailyMB;
    let peakMB = dailyMB;

    switch (usagePattern) {
      case 'weekdays':
        weekdayMB = dailyMB * 1.3;
        weekendMB = dailyMB * 0.7;
        peakMB = weekdayMB;
        break;
      case 'weekends':
        weekdayMB = dailyMB * 0.8;
        weekendMB = dailyMB * 1.4;
        peakMB = weekendMB;
        break;
      case 'variable':
        peakMB = dailyMB * 1.5;
        break;
      default:
        peakMB = dailyMB * 1.1;
    }

    // Adjust for WiFi availability
    const wifiReduction: Record<string, number> = {
      high: 0.3,
      medium: 0.5,
      low: 0.9
    };

    const reduction = wifiReduction[wifiAvailability] || 0.5;
    const averageDailyMB = ((weekdayMB * 5) + (weekendMB * 2)) / 7;
    const adjustedDailyMB = averageDailyMB * reduction;
    const adjustedPeakMB = peakMB * reduction;

    return {
      daily: adjustedDailyMB,
      monthly: adjustedDailyMB * 30,
      peak: adjustedPeakMB
    };
  };

  const generatePlanRecommendations = (monthlyMB: number) => {
    const monthlyGB = monthlyMB / 1024;
    const recs: string[] = [];

    if (monthlyGB < 2) {
      recs.push('2GB Plan - Perfect fit with good buffer');
      recs.push('5GB Plan - Oversized for your usage');
    } else if (monthlyGB < 5) {
      recs.push('5GB Plan - Good fit for your usage');
      recs.push('10GB Plan - Safe choice with extra buffer');
    } else if (monthlyGB < 10) {
      recs.push('10GB Plan - Matches your usage well');
      recs.push('15GB Plan - Room for occasional heavy usage');
    } else if (monthlyGB < 20) {
      recs.push('20GB Plan - Minimum, monitor usage');
      recs.push('Unlimited Plan - Recommended for heavy usage');
    } else {
      recs.push('Unlimited Plan - Essential for your usage');
      recs.push('High-capacity Plan - 50GB+ if available');
    }

    setPlanRecommendations(recs);
  };

  const generateDataTips = (monthlyMB: number, breakdown: UsageBreakdown[]) => {
    const tips: string[] = [];
    const monthlyGB = monthlyMB / 1024;
    const topActivity = breakdown[0];

    if (monthlyGB > 10) {
      tips.push('Your usage is quite high - consider unlimited plans');
    }

    if (topActivity && topActivity.name.includes('Video')) {
      tips.push('Video streaming is your biggest consumer - use lower quality on mobile');
      tips.push('Download videos for offline viewing on WiFi');
    }

    tips.push('Connect to WiFi whenever possible');
    tips.push('Enable data saver modes in apps');
    tips.push('Monitor background app refresh');

    setDataTips(tips);
  };

  useEffect(() => {
    calculateDataUsage();
  }, [
    youtubeHours, streamingHD, streaming4K, musicStreaming, podcasts,
    webBrowsing, socialMedia, emailMessaging, videoCalls, cloudSync,
    gaming, downloads, usagePattern, wifiAvailability
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-4 sm:py-6 md:py-8 px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8">
      <article className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">{getH1('Data Usage Calculator')}</h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Calculate your mobile data and internet usage to choose the right data plan and avoid overage charges.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
          {/* Main Calculator */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
            {/* Daily Activity Usage */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Daily Activity Usage</h2>

              {/* Streaming & Video */}
              <div className="mb-3 sm:mb-4 md:mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">🎬 Streaming & Video</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 items-center">
                    <label className="text-sm font-medium text-gray-700">YouTube/Social Media</label>
                    <input
                      type="number"
                      value={youtubeHours}
                      onChange={(e) => setYoutubeHours(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="24"
                      step="0.5"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600">hours/day</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 items-center">
                    <label className="text-sm font-medium text-gray-700">Netflix/Streaming (HD)</label>
                    <input
                      type="number"
                      value={streamingHD}
                      onChange={(e) => setStreamingHD(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="24"
                      step="0.5"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600">hours/day</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 items-center">
                    <label className="text-sm font-medium text-gray-700">4K/Ultra HD Streaming</label>
                    <input
                      type="number"
                      value={streaming4K}
                      onChange={(e) => setStreaming4K(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="24"
                      step="0.5"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600">hours/day</span>
                  </div>
                </div>
              </div>

              {/* Music & Audio */}
              <div className="mb-3 sm:mb-4 md:mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">🎵 Music & Audio</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 items-center">
                    <label className="text-sm font-medium text-gray-700">Music Streaming</label>
                    <input
                      type="number"
                      value={musicStreaming}
                      onChange={(e) => setMusicStreaming(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="24"
                      step="0.5"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600">hours/day</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 items-center">
                    <label className="text-sm font-medium text-gray-700">Podcasts</label>
                    <input
                      type="number"
                      value={podcasts}
                      onChange={(e) => setPodcasts(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="24"
                      step="0.5"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600">hours/day</span>
                  </div>
                </div>
              </div>

              {/* Web & Apps */}
              <div className="mb-3 sm:mb-4 md:mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">🌐 Web & Apps</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 items-center">
                    <label className="text-sm font-medium text-gray-700">Web Browsing</label>
                    <input
                      type="number"
                      value={webBrowsing}
                      onChange={(e) => setWebBrowsing(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="24"
                      step="0.5"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600">hours/day</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 items-center">
                    <label className="text-sm font-medium text-gray-700">Social Media Apps</label>
                    <input
                      type="number"
                      value={socialMedia}
                      onChange={(e) => setSocialMedia(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="24"
                      step="0.5"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600">hours/day</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 items-center">
                    <label className="text-sm font-medium text-gray-700">Email & Messaging</label>
                    <input
                      type="number"
                      value={emailMessaging}
                      onChange={(e) => setEmailMessaging(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="24"
                      step="0.5"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600">hours/day</span>
                  </div>
                </div>
              </div>

              {/* Video Calls & Work */}
              <div className="mb-3 sm:mb-4 md:mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">💼 Video Calls & Work</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 items-center">
                    <label className="text-sm font-medium text-gray-700">Video Calls</label>
                    <input
                      type="number"
                      value={videoCalls}
                      onChange={(e) => setVideoCalls(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="24"
                      step="0.5"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600">hours/day</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 items-center">
                    <label className="text-sm font-medium text-gray-700">Cloud Storage Sync</label>
                    <input
                      type="number"
                      value={cloudSync}
                      onChange={(e) => setCloudSync(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="10"
                      step="0.1"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600">GB/day</span>
                  </div>
                </div>
              </div>

              {/* Gaming & Downloads */}
              <div className="mb-3 sm:mb-4 md:mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">🎮 Gaming & Downloads</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 items-center">
                    <label className="text-sm font-medium text-gray-700">Online Gaming</label>
                    <input
                      type="number"
                      value={gaming}
                      onChange={(e) => setGaming(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="24"
                      step="0.5"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600">hours/day</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 items-center">
                    <label className="text-sm font-medium text-gray-700">App/Game Downloads</label>
                    <input
                      type="number"
                      value={downloads}
                      onChange={(e) => setDownloads(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="50"
                      step="0.1"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600">GB/day</span>
                  </div>
                </div>
              </div>

              {/* Usage Pattern */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Usage Pattern</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Daily Pattern</label>
                    <select
                      value={usagePattern}
                      onChange={(e) => setUsagePattern(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="consistent">Consistent daily usage</option>
                      <option value="weekdays">Weekdays higher</option>
                      <option value="weekends">Weekends higher</option>
                      <option value="variable">Highly variable</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WiFi Access</label>
                    <select
                      value={wifiAvailability}
                      onChange={(e) => setWifiAvailability(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="high">High (home/office WiFi)</option>
                      <option value="medium">Medium (some WiFi available)</option>
                      <option value="low">Low (mostly mobile data)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

            {/* Data Usage Guide */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">📱 Data Usage Guide</h2>
              <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Usage Categories</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div><strong>Light:</strong> &lt;2GB/month</div>
                    <div><strong>Moderate:</strong> 2-8GB/month</div>
                    <div><strong>Heavy:</strong> 8-20GB/month</div>
                    <div><strong>Extreme:</strong> &gt;20GB/month</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Data Usage per Hour</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div><strong>HD Video:</strong> ~1GB</div>
                    <div><strong>4K Video:</strong> ~7GB</div>
                    <div><strong>Music:</strong> ~100MB</div>
                    <div><strong>Web Browse:</strong> ~25MB</div>
                    <div><strong>Video Call:</strong> ~200MB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Your Data Usage</h3>

              {/* Usage Summary */}
              <div className="space-y-3 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="text-xs text-blue-600 mb-1">Daily Usage</div>
                  <div className="text-lg font-bold text-blue-800">{dailyUsage}</div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="text-xs text-green-600 mb-1">Monthly Usage</div>
                  <div className="text-lg font-bold text-green-800">{monthlyUsage}</div>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="text-xs text-purple-600 mb-1">Peak Day Usage</div>
                  <div className="text-lg font-bold text-purple-800">{peakUsage}</div>
                </div>
              </div>

              {/* Usage Breakdown */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Usage Breakdown</h4>
                <div className="space-y-1">
                  {usageBreakdown.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded mr-2"></div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatDataSize(item.usage)}</div>
                        <div className="text-xs text-gray-600">{item.percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan Recommendations */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Recommended Plans</h4>
                <div className="space-y-2">
                  {planRecommendations.map((rec, index) => (
                    <div key={index} className="p-2 bg-green-50 rounded text-xs text-green-700">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Tips */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Data Tips</h4>
                <div className="text-xs text-blue-700 space-y-1">
                  {dataTips.map((tip, index) => (
                    <div key={index}>• {tip}</div>
                  ))}
                </div>
              </div>
            </div>
</div>
        </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedCalculators.map((calc, index) => (
              <Link
                key={index}
                href={calc.href}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{calc.title}</h3>
                <p className="text-sm text-gray-600">{calc.description}</p>
              </Link>
            ))}
          </div>
        
      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="data-usage-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
      </div>
      </article>
    </div>
  );
}
