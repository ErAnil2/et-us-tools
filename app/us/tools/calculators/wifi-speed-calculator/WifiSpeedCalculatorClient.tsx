'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
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

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Wifi Speed Calculator?",
    answer: "A Wifi Speed Calculator is a free online tool designed to help you quickly and accurately calculate wifi speed-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Wifi Speed Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Wifi Speed Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Wifi Speed Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function WifiSpeedCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  // Speed Test State
  const { getH1, getSubHeading } = usePageSEO('wifi-speed-calculator');

  const [currentDownload, setCurrentDownload] = useState('100');
  const [currentUpload, setCurrentUpload] = useState('20');
  const [currentPing, setCurrentPing] = useState('25');

  // Device Count State
  const [smartphones, setSmartphones] = useState('2');
  const [tablets, setTablets] = useState('1');
  const [laptops, setLaptops] = useState('2');
  const [smartTV, setSmartTV] = useState('2');
  const [gaming, setGaming] = useState('1');
  const [iot, setIot] = useState('5');

  // Activity State
  const [basicBrowsing, setBasicBrowsing] = useState(true);
  const [socialMedia, setSocialMedia] = useState(true);
  const [hdStreaming, setHdStreaming] = useState(true);
  const [uhd4kStreaming, setUhd4kStreaming] = useState(false);
  const [onlineGaming, setOnlineGaming] = useState(false);
  const [videoConferencing, setVideoConferencing] = useState(true);
  const [fileDownloading, setFileDownloading] = useState(false);
  const [cloudBackup, setCloudBackup] = useState(false);
  const [homeOffice, setHomeOffice] = useState(false);
  const [streaming4k, setStreaming4k] = useState(false);

  // Peak Usage
  const [peakHours, setPeakHours] = useState('moderate');

  // Troubleshooting State
  const [slowSpeed, setSlowSpeed] = useState(false);
  const [connectionDrops, setConnectionDrops] = useState(false);
  const [poorRange, setPoorRange] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [gamingLag, setGamingLag] = useState(false);
  const [cantConnect, setCantConnect] = useState(false);
  const [interference, setInterference] = useState(false);
  const [obstacles, setObstacles] = useState(false);
  const [oldRouter, setOldRouter] = useState(false);
  const [manyDevices, setManyDevices] = useState(false);
  const [microwave, setMicrowave] = useState(false);

  // Security State
  const [securityType, setSecurityType] = useState('wpa2');
  const [passwordStrength, setPasswordStrength] = useState('medium');
  const [guestNetwork, setGuestNetwork] = useState(false);
  const [firmwareUpdated, setFirmwareUpdated] = useState(true);
  const [wpsDisabled, setWpsDisabled] = useState(true);
  const [accessControl, setAccessControl] = useState(false);
  const [hiddenSSID, setHiddenSSID] = useState(false);

  // ISP Plan State
  const [planASpeed, setPlanASpeed] = useState('100');
  const [planAPrice, setPlanAPrice] = useState('50');
  const [planAProvider, setPlanAProvider] = useState('Provider A');
  const [planBSpeed, setPlanBSpeed] = useState('200');
  const [planBPrice, setPlanBPrice] = useState('75');
  const [planBProvider, setPlanBProvider] = useState('Provider B');
  const [planCSpeed, setPlanCSpeed] = useState('500');
  const [planCPrice, setPlanCPrice] = useState('120');
  const [planCProvider, setPlanCProvider] = useState('Provider C');

  // Results State
  const [recommendedDownload, setRecommendedDownload] = useState('');
  const [recommendedUpload, setRecommendedUpload] = useState('');
  const [totalDevices, setTotalDevices] = useState('');
  const [speedAssessment, setSpeedAssessment] = useState('');
  const [speedAssessmentColor, setSpeedAssessmentColor] = useState('');
  const [bandwidthPerDevice, setBandwidthPerDevice] = useState('');
  const [networkUtilization, setNetworkUtilization] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [troubleshootingSolutions, setTroubleshootingSolutions] = useState<Array<{title: string, steps: string[]}>>([]);
  const [securityScore, setSecurityScore] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [riskColor, setRiskColor] = useState('');
  const [securityAdvice, setSecurityAdvice] = useState<string[]>([]);
  const [comparisonResults, setComparisonResults] = useState('');
  const [valueRecommendation, setValueRecommendation] = useState('');

  useEffect(() => {
    calculateSpeedRequirements();
    generateTroubleshootingSolutions();
    analyzeNetworkSecurity();
    compareISPPlans();
  }, []);

  const calculateSpeedRequirements = () => {
    const smartphonesCount = parseInt(smartphones) || 0;
    const tabletsCount = parseInt(tablets) || 0;
    const laptopsCount = parseInt(laptops) || 0;
    const smartTVCount = parseInt(smartTV) || 0;
    const gamingCount = parseInt(gaming) || 0;
    const iotCount = parseInt(iot) || 0;

    const totalDevicesCount = smartphonesCount + tabletsCount + laptopsCount + smartTVCount + gamingCount + iotCount;

    const deviceRequirements = {
      smartphones: 2,
      tablets: 3,
      laptops: 5,
      smartTV: 15,
      gaming: 10,
      iot: 0.5
    };

    let baseDownload = (smartphonesCount * deviceRequirements.smartphones) +
                       (tabletsCount * deviceRequirements.tablets) +
                       (laptopsCount * deviceRequirements.laptops) +
                       (smartTVCount * deviceRequirements.smartTV) +
                       (gamingCount * deviceRequirements.gaming) +
                       (iotCount * deviceRequirements.iot);

    let baseUpload = baseDownload * 0.15;

    const activities = {
      basicBrowsing: { down: 1.0, up: 1.0 },
      socialMedia: { down: 1.1, up: 1.2 },
      hdStreaming: { down: 1.5, up: 1.1 },
      uhd4kStreaming: { down: 2.5, up: 1.2 },
      onlineGaming: { down: 1.3, up: 1.5 },
      videoConferencing: { down: 1.4, up: 2.0 },
      fileDownloading: { down: 2.0, up: 1.1 },
      cloudBackup: { down: 1.2, up: 3.0 },
      homeOffice: { down: 1.6, up: 2.5 },
      streaming4k: { down: 3.0, up: 1.3 }
    };

    let downMultiplier = 1.0;
    let upMultiplier = 1.0;

    const activityStates: Record<string, boolean> = {
      basicBrowsing,
      socialMedia,
      hdStreaming,
      uhd4kStreaming,
      onlineGaming,
      videoConferencing,
      fileDownloading,
      cloudBackup,
      homeOffice,
      streaming4k
    };

    Object.keys(activities).forEach(activity => {
      if (activityStates[activity]) {
        downMultiplier = Math.max(downMultiplier, activities[activity as keyof typeof activities].down);
        upMultiplier = Math.max(upMultiplier, activities[activity as keyof typeof activities].up);
      }
    });

    const peakMultipliers: Record<string, number> = {
      light: 1.2,
      moderate: 1.5,
      heavy: 1.8,
      extreme: 2.2
    };

    const peakMultiplier = peakMultipliers[peakHours];

    const calcRecommendedDownload = Math.round(baseDownload * downMultiplier * peakMultiplier);
    const calcRecommendedUpload = Math.round(baseUpload * upMultiplier * peakMultiplier);

    const downloadSpeed = parseFloat(currentDownload) || 0;
    const uploadSpeed = parseFloat(currentUpload) || 0;
    const ping = parseInt(currentPing) || 0;

    let assessment, assessmentColor;
    if (downloadSpeed === 0) {
      assessment = 'Enter your current speed for comparison';
      assessmentColor = 'bg-gray-100 text-gray-700';
    } else if (downloadSpeed >= calcRecommendedDownload * 0.8) {
      assessment = 'Your current speed should handle your usage well';
      assessmentColor = 'bg-green-100 text-green-800';
    } else if (downloadSpeed >= calcRecommendedDownload * 0.6) {
      assessment = 'Your speed may be adequate but could benefit from an upgrade';
      assessmentColor = 'bg-yellow-100 text-yellow-800';
    } else {
      assessment = 'Your current speed may not be sufficient for optimal performance';
      assessmentColor = 'bg-red-100 text-red-800';
    }

    const bandwidth = downloadSpeed > 0 ? (downloadSpeed / totalDevicesCount).toFixed(1) : 'N/A';
    const utilization = downloadSpeed > 0 ? Math.min((calcRecommendedDownload / downloadSpeed) * 100, 100).toFixed(0) + '%' : 'N/A';

    const recs: string[] = [];

    if (downloadSpeed > 0 && downloadSpeed < calcRecommendedDownload) {
      recs.push('• Consider upgrading to a higher speed plan');
    }

    if (ping > 50) {
      recs.push('• High latency detected - check for network congestion or contact ISP');
    }

    if (totalDevicesCount > 10) {
      recs.push('• Consider a mesh network system for better coverage');
      recs.push('• Use WiFi 6 router for better device handling');
    }

    if (uhd4kStreaming || streaming4k) {
      recs.push('• Ensure 4K streaming devices use wired or 5GHz WiFi connection');
    }

    if (onlineGaming) {
      recs.push('• Use wired connection for gaming devices when possible');
      recs.push('• Enable gaming mode or QoS on your router');
    }

    recs.push('• Position router centrally and away from interference');
    recs.push('• Regularly restart router to maintain optimal performance');

    if (recs.length === 0) {
      recs.push('• Your setup looks good! Monitor performance regularly');
    }

    setRecommendedDownload(calcRecommendedDownload + ' Mbps');
    setRecommendedUpload(calcRecommendedUpload + ' Mbps');
    setTotalDevices(totalDevicesCount + ' devices');
    setSpeedAssessment(assessment);
    setSpeedAssessmentColor(assessmentColor);
    setBandwidthPerDevice(bandwidth + ' Mbps');
    setNetworkUtilization(utilization);
    setRecommendations(recs);
  };

  const generateTroubleshootingSolutions = () => {
    const issues = {
      slowSpeed,
      connectionDrops,
      poorRange,
      buffering,
      gamingLag,
      cantConnect,
      interference,
      obstacles,
      oldRouter,
      manyDevices,
      microwave
    };

    const solutions: Array<{title: string, steps: string[]}> = [];

    if (issues.slowSpeed) {
      solutions.push({
        title: "Slow Internet Speeds",
        steps: [
          "• Test speed at different times to identify peak congestion",
          "• Use wired connection for speed test to isolate WiFi issues",
          "• Contact ISP if speeds consistently below advertised rates",
          "• Upgrade router to WiFi 6 for better throughput"
        ]
      });
    }

    if (issues.connectionDrops) {
      solutions.push({
        title: "Frequent Connection Drops",
        steps: [
          "• Update device WiFi drivers and router firmware",
          "• Change WiFi channel to avoid interference (try 1, 6, or 11 for 2.4GHz)",
          "• Reduce distance between device and router",
          "• Check for overheating - ensure router has proper ventilation"
        ]
      });
    }

    if (issues.poorRange || issues.obstacles) {
      solutions.push({
        title: "Poor WiFi Range/Coverage",
        steps: [
          "• Reposition router to central, elevated location",
          "• Use WiFi extender or mesh system for larger homes",
          "• Switch to 2.4GHz band for better range (lower speed)",
          "• Remove physical obstructions between router and devices"
        ]
      });
    }

    if (issues.buffering) {
      solutions.push({
        title: "Video Buffering Issues",
        steps: [
          "• Use 5GHz band for streaming devices near router",
          "• Enable Quality of Service (QoS) to prioritize streaming",
          "• Reduce number of simultaneous streams",
          "• Consider wired connection for 4K streaming devices"
        ]
      });
    }

    if (issues.gamingLag) {
      solutions.push({
        title: "Gaming Lag/High Ping",
        steps: [
          "• Use wired ethernet connection for gaming devices",
          "• Enable gaming mode or QoS prioritization",
          "• Close bandwidth-heavy applications during gaming",
          "• Choose gaming server closest to your location"
        ]
      });
    }

    if (issues.cantConnect) {
      solutions.push({
        title: "Connection Problems",
        steps: [
          "• Verify correct WiFi password entry",
          "• Restart both router and device",
          "• 'Forget' and reconnect to the WiFi network",
          "• Check if MAC address filtering is blocking device"
        ]
      });
    }

    if (issues.interference) {
      solutions.push({
        title: "WiFi Interference",
        steps: [
          "• Use WiFi analyzer app to find less congested channels",
          "• Switch to 5GHz band to avoid 2.4GHz congestion",
          "• Enable automatic channel selection on router",
          "• Move router away from other electronic devices"
        ]
      });
    }

    if (issues.oldRouter) {
      solutions.push({
        title: "Outdated Router",
        steps: [
          "• Upgrade to WiFi 6 (802.11ax) router for latest features",
          "• Look for routers with MU-MIMO technology",
          "• Ensure router supports your internet speed plan",
          "• Consider mesh system for whole-home coverage"
        ]
      });
    }

    if (issues.manyDevices) {
      solutions.push({
        title: "Network Congestion",
        steps: [
          "• Upgrade to higher-capacity router (WiFi 6 recommended)",
          "• Use separate guest network for IoT devices",
          "• Implement device bandwidth limits",
          "• Schedule automatic updates during off-peak hours"
        ]
      });
    }

    if (issues.microwave) {
      solutions.push({
        title: "Interference Issues",
        steps: [
          "• Keep router away from microwave, baby monitors, and Bluetooth devices",
          "• Use 5GHz band to avoid 2.4GHz interference",
          "• Replace old wireless devices that may cause interference",
          "• Consider router placement in different room"
        ]
      });
    }

    if (solutions.length === 0) {
      solutions.push({
        title: "General Optimization",
        steps: [
          "• Restart router monthly for optimal performance",
          "• Keep router firmware updated",
          "• Position router in central, elevated location",
          "• Use strong WiFi password for security"
        ]
      });
    }

    setTroubleshootingSolutions(solutions);
  };

  const analyzeNetworkSecurity = () => {
    let score = 0;
    const recs: string[] = [];

    const securityScores: Record<string, number> = {
      wpa3: 30,
      wpa2: 25,
      wpa: 15,
      wep: 5,
      open: 0
    };
    score += securityScores[securityType];

    if (securityType === 'wep' || securityType === 'open') {
      recs.push('• Immediately upgrade to WPA2 or WPA3 encryption');
    }
    if (securityType === 'wpa') {
      recs.push('• Upgrade to WPA2 or WPA3 for better security');
    }

    const passwordScores: Record<string, number> = {
      strong: 25,
      medium: 15,
      weak: 5
    };
    score += passwordScores[passwordStrength];

    if (passwordStrength === 'weak') {
      recs.push('• Use a strong password with 12+ characters, including letters, numbers, and symbols');
    }
    if (passwordStrength === 'medium') {
      recs.push('• Consider strengthening password with more characters and complexity');
    }

    if (guestNetwork) score += 10;
    else recs.push('• Enable guest network to isolate visitor devices');

    if (firmwareUpdated) score += 10;
    else recs.push('• Regularly update router firmware for security patches');

    if (wpsDisabled) score += 10;
    else recs.push('• Disable WPS as it can be a security vulnerability');

    if (accessControl) score += 5;
    if (hiddenSSID) score += 5;

    let risk, color;
    if (score >= 80) {
      risk = 'Low Risk';
      color = 'text-green-600';
    } else if (score >= 60) {
      risk = 'Medium Risk';
      color = 'text-yellow-600';
    } else if (score >= 40) {
      risk = 'High Risk';
      color = 'text-orange-600';
    } else {
      risk = 'Critical Risk';
      color = 'text-red-600';
    }

    if (score >= 80) {
      recs.push('• Excellent security! Continue monitoring and updating regularly');
    } else {
      recs.push('• Consider enabling additional security features');
      recs.push('• Monitor connected devices regularly');
      recs.push('• Change passwords if you suspect unauthorized access');
    }

    setSecurityScore(`${score}/100`);
    setRiskLevel(risk);
    setRiskColor(color);
    setSecurityAdvice(recs);
  };

  const compareISPPlans = () => {
    const plans = [
      {
        name: planAProvider || 'Plan A',
        speed: parseFloat(planASpeed) || 0,
        price: parseFloat(planAPrice) || 0
      },
      {
        name: planBProvider || 'Plan B',
        speed: parseFloat(planBSpeed) || 0,
        price: parseFloat(planBPrice) || 0
      },
      {
        name: planCProvider || 'Plan C',
        speed: parseFloat(planCSpeed) || 0,
        price: parseFloat(planCPrice) || 0
      }
    ];

    const validPlans = plans.filter(plan => plan.speed > 0 && plan.price > 0);

    if (validPlans.length < 2) {
      setComparisonResults('<div className="text-center text-gray-500">Enter valid data for at least 2 plans</div>');
      return;
    }

    const planAnalysis = validPlans.map(plan => {
      const pricePerMbps = plan.price / plan.speed;
      const yearlyPrice = plan.price * 12;
      const recSpeed = parseFloat(recommendedDownload) || 100;
      const speedSufficiency = plan.speed >= recSpeed ? 'Sufficient' : 'Insufficient';

      return {
        ...plan,
        pricePerMbps,
        yearlyPrice,
        speedSufficiency
      };
    });

    const sortedByValue = [...planAnalysis].sort((a, b) => a.pricePerMbps - b.pricePerMbps);
    const bestValue = sortedByValue[0];

    const sortedBySpeed = [...planAnalysis].sort((a, b) => b.speed - a.speed);
    const fastestPlan = sortedBySpeed[0];

    const sortedByPrice = [...planAnalysis].sort((a, b) => a.price - b.price);
    const cheapestPlan = sortedByPrice[0];

    const comparisonHTML = planAnalysis.map(plan => {
      let badges = [];
      if (plan === bestValue) badges.push('<span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">Best Value</span>');
      if (plan === fastestPlan) badges.push('<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">Fastest</span>');
      if (plan === cheapestPlan) badges.push('<span class="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mr-2">Cheapest</span>');

      const speedColor = plan.speedSufficiency === 'Sufficient' ? 'text-green-600' : 'text-red-600';

      return `
        <div class="p-3 bg-white border border-gray-200 rounded-lg">
          <div class="flex justify-between items-start mb-2">
            <h5 class="font-semibold text-gray-800 text-sm">${plan.name}</h5>
            <div>${badges.join('')}</div>
          </div>
          <div class="space-y-1 text-xs">
            <div class="flex justify-between">
              <span class="text-gray-600">Speed:</span>
              <span class="font-medium">${plan.speed} Mbps</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Monthly:</span>
              <span class="font-medium">$${plan.price}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">$/Mbps:</span>
              <span class="font-medium">$${plan.pricePerMbps.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Status:</span>
              <span class="font-medium ${speedColor}">${plan.speedSufficiency}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const recSpeed = parseFloat(recommendedDownload) || 100;
    const suitablePlans = planAnalysis.filter(plan => plan.speed >= recSpeed);

    let recommendation;
    if (suitablePlans.length > 0) {
      const bestSuitablePlan = suitablePlans.sort((a, b) => a.pricePerMbps - b.pricePerMbps)[0];
      recommendation = `
        <strong>Recommended:</strong> ${bestSuitablePlan.name}<br />
        <strong>Reason:</strong> Best value among plans that meet your ${recSpeed} Mbps requirement<br />
        <strong>Value:</strong> $${bestSuitablePlan.pricePerMbps.toFixed(2)} per Mbps
      `;
    } else {
      recommendation = `
        <strong>Note:</strong> None of the plans meet your ${recSpeed} Mbps requirement<br />
        <strong>Suggestion:</strong> Consider ${fastestPlan.name} (closest to your needs) or look for higher-speed plans<br />
        <strong>Best available:</strong> ${fastestPlan.name} with ${fastestPlan.speed} Mbps at $${fastestPlan.pricePerMbps.toFixed(2)} per Mbps
      `;
    }

    setComparisonResults(comparisonHTML);
    setValueRecommendation(recommendation);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{getH1('WiFi Speed Calculator')}</h1>
        <p className="text-xl text-gray-600 mb-3 sm:mb-4 md:mb-6 max-w-3xl mx-auto">
          Calculate your internet speed requirements based on usage patterns and optimize your WiFi network for multiple devices and activities.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
        {/* Calculator */}
        <div className="lg:col-span-2">
          {/* Current Speed Test */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Speed Test Simulator</h2>

            <div className="grid md:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
              <div>
                <label htmlFor="currentDownload" className="block text-sm font-medium text-gray-700 mb-2">Current Download Speed (Mbps)</label>
                <input
                  type="number"
                  id="currentDownload"
                  step="0.1"
                  min="0"
                  value={currentDownload}
                  onChange={(e) => setCurrentDownload(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="100"
                />
              </div>
              <div>
                <label htmlFor="currentUpload" className="block text-sm font-medium text-gray-700 mb-2">Current Upload Speed (Mbps)</label>
                <input
                  type="number"
                  id="currentUpload"
                  step="0.1"
                  min="0"
                  value={currentUpload}
                  onChange={(e) => setCurrentUpload(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="currentPing" className="block text-sm font-medium text-gray-700 mb-2">Ping/Latency (ms)</label>
              <input
                type="number"
                id="currentPing"
                min="0"
                max="1000"
                value={currentPing}
                onChange={(e) => setCurrentPing(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="25"
              />
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Usage Calculator */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Calculate Speed Requirements</h2>

            {/* Device Count */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Connected Devices</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="smartphones" className="block text-sm font-medium text-gray-700 mb-2">Smartphones</label>
                  <input
                    type="number"
                    id="smartphones"
                    min="0"
                    max="20"
                    value={smartphones}
                    onChange={(e) => setSmartphones(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="tablets" className="block text-sm font-medium text-gray-700 mb-2">Tablets</label>
                  <input
                    type="number"
                    id="tablets"
                    min="0"
                    max="10"
                    value={tablets}
                    onChange={(e) => setTablets(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="laptops" className="block text-sm font-medium text-gray-700 mb-2">Laptops/Computers</label>
                  <input
                    type="number"
                    id="laptops"
                    min="0"
                    max="10"
                    value={laptops}
                    onChange={(e) => setLaptops(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="smartTV" className="block text-sm font-medium text-gray-700 mb-2">Smart TVs/Streaming Devices</label>
                  <input
                    type="number"
                    id="smartTV"
                    min="0"
                    max="10"
                    value={smartTV}
                    onChange={(e) => setSmartTV(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="gaming" className="block text-sm font-medium text-gray-700 mb-2">Gaming Consoles</label>
                  <input
                    type="number"
                    id="gaming"
                    min="0"
                    max="5"
                    value={gaming}
                    onChange={(e) => setGaming(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="iot" className="block text-sm font-medium text-gray-700 mb-2">IoT Devices (Smart Home)</label>
                  <input
                    type="number"
                    id="iot"
                    min="0"
                    max="50"
                    value={iot}
                    onChange={(e) => setIot(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Usage Activities */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Primary Activities (Select all that apply)</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <label className="flex items-center">
                  <input type="checkbox" checked={basicBrowsing} onChange={(e) => setBasicBrowsing(e.target.checked)} className="mr-2" />
                  <span className="text-sm">Basic web browsing & email</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={socialMedia} onChange={(e) => setSocialMedia(e.target.checked)} className="mr-2" />
                  <span className="text-sm">Social media & messaging</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={hdStreaming} onChange={(e) => setHdStreaming(e.target.checked)} className="mr-2" />
                  <span className="text-sm">HD video streaming (Netflix, YouTube)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={uhd4kStreaming} onChange={(e) => setUhd4kStreaming(e.target.checked)} className="mr-2" />
                  <span className="text-sm">4K/UHD streaming</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={onlineGaming} onChange={(e) => setOnlineGaming(e.target.checked)} className="mr-2" />
                  <span className="text-sm">Online gaming</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={videoConferencing} onChange={(e) => setVideoConferencing(e.target.checked)} className="mr-2" />
                  <span className="text-sm">Video conferencing (Zoom, Teams)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={fileDownloading} onChange={(e) => setFileDownloading(e.target.checked)} className="mr-2" />
                  <span className="text-sm">Large file downloads</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={cloudBackup} onChange={(e) => setCloudBackup(e.target.checked)} className="mr-2" />
                  <span className="text-sm">Cloud backup & sync</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={homeOffice} onChange={(e) => setHomeOffice(e.target.checked)} className="mr-2" />
                  <span className="text-sm">Work from home (VPN, file sharing)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={streaming4k} onChange={(e) => setStreaming4k(e.target.checked)} className="mr-2" />
                  <span className="text-sm">Multiple simultaneous 4K streams</span>
                </label>
              </div>
            </div>

            {/* Peak Usage */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <label htmlFor="peakHours" className="block text-sm font-medium text-gray-700 mb-2">Peak Usage Pattern</label>
              <select
                id="peakHours"
                value={peakHours}
                onChange={(e) => setPeakHours(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">Light usage - Not everyone online simultaneously</option>
                <option value="moderate">Moderate usage - Some overlap in usage times</option>
                <option value="heavy">Heavy usage - Most devices active simultaneously</option>
                <option value="extreme">Extreme usage - All devices active with high demand</option>
              </select>
            </div>

            <button
              onClick={calculateSpeedRequirements}
              className="w-full bg-blue-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Calculate Speed Requirements
            </button>
          </div>

          {/* Troubleshooting Input Tool */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🔧 WiFi Troubleshooting Assistant</h3>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Common Issues</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" checked={slowSpeed} onChange={(e) => setSlowSpeed(e.target.checked)} className="mr-2" />
                    <span className="text-sm">Slow internet speeds</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked={connectionDrops} onChange={(e) => setConnectionDrops(e.target.checked)} className="mr-2" />
                    <span className="text-sm">Frequent connection drops</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked={poorRange} onChange={(e) => setPoorRange(e.target.checked)} className="mr-2" />
                    <span className="text-sm">Poor WiFi range/coverage</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked={buffering} onChange={(e) => setBuffering(e.target.checked)} className="mr-2" />
                    <span className="text-sm">Video buffering/streaming issues</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked={gamingLag} onChange={(e) => setGamingLag(e.target.checked)} className="mr-2" />
                    <span className="text-sm">Gaming lag/high ping</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked={cantConnect} onChange={(e) => setCantConnect(e.target.checked)} className="mr-2" />
                    <span className="text-sm">Can&apos;t connect to WiFi</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Environment Factors</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" checked={interference} onChange={(e) => setInterference(e.target.checked)} className="mr-2" />
                    <span className="text-sm">Many nearby WiFi networks</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked={obstacles} onChange={(e) => setObstacles(e.target.checked)} className="mr-2" />
                    <span className="text-sm">Walls/floors between router and device</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked={oldRouter} onChange={(e) => setOldRouter(e.target.checked)} className="mr-2" />
                    <span className="text-sm">Router is 3+ years old</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked={manyDevices} onChange={(e) => setManyDevices(e.target.checked)} className="mr-2" />
                    <span className="text-sm">Many devices connected simultaneously</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked={microwave} onChange={(e) => setMicrowave(e.target.checked)} className="mr-2" />
                    <span className="text-sm">Microwave/Bluetooth interference</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={generateTroubleshootingSolutions}
              className="w-full bg-red-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold mt-6"
            >
              Get Troubleshooting Solutions
            </button>
          </div>
{/* Security Input Tool */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🔒 Network Security Analysis</h3>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Security Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="securityType" className="block text-sm font-medium text-gray-700 mb-2">WiFi Security Type</label>
                    <select
                      id="securityType"
                      value={securityType}
                      onChange={(e) => setSecurityType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="wpa3">WPA3 (Most Secure)</option>
                      <option value="wpa2">WPA2 (Secure)</option>
                      <option value="wpa">WPA (Weak)</option>
                      <option value="wep">WEP (Very Weak)</option>
                      <option value="open">Open (No Security)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="passwordStrength" className="block text-sm font-medium text-gray-700 mb-2">Password Strength</label>
                    <select
                      id="passwordStrength"
                      value={passwordStrength}
                      onChange={(e) => setPasswordStrength(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="strong">Strong (12+ chars, mixed)</option>
                      <option value="medium">Medium (8-11 chars)</option>
                      <option value="weak">Weak (&lt; 8 chars or simple)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Additional Security</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" checked={guestNetwork} onChange={(e) => setGuestNetwork(e.target.checked)} className="mr-2" />
                    <span className="text-sm">Guest network enabled</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked={firmwareUpdated} onChange={(e) => setFirmwareUpdated(e.target.checked)} className="mr-2" />
                    <span className="text-sm">Router firmware updated regularly</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked={wpsDisabled} onChange={(e) => setWpsDisabled(e.target.checked)} className="mr-2" />
                    <span className="text-sm">WPS disabled</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked={accessControl} onChange={(e) => setAccessControl(e.target.checked)} className="mr-2" />
                    <span className="text-sm">MAC address filtering enabled</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked={hiddenSSID} onChange={(e) => setHiddenSSID(e.target.checked)} className="mr-2" />
                    <span className="text-sm">Network name (SSID) hidden</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={analyzeNetworkSecurity}
              className="w-full bg-green-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold mt-6"
            >
              Analyze Network Security
            </button>
          </div>

          {/* ISP Plan Input Tool */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📊 ISP Plan Comparison</h3>

            <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Plan A</h4>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="planASpeed" className="block text-sm font-medium text-gray-700 mb-1">Speed (Mbps)</label>
                    <input
                      type="number"
                      id="planASpeed"
                      value={planASpeed}
                      onChange={(e) => setPlanASpeed(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="planAPrice" className="block text-sm font-medium text-gray-700 mb-1">Monthly Price ($)</label>
                    <input
                      type="number"
                      id="planAPrice"
                      value={planAPrice}
                      onChange={(e) => setPlanAPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="planAProvider" className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                    <input
                      type="text"
                      id="planAProvider"
                      value={planAProvider}
                      onChange={(e) => setPlanAProvider(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Plan B</h4>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="planBSpeed" className="block text-sm font-medium text-gray-700 mb-1">Speed (Mbps)</label>
                    <input
                      type="number"
                      id="planBSpeed"
                      value={planBSpeed}
                      onChange={(e) => setPlanBSpeed(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="planBPrice" className="block text-sm font-medium text-gray-700 mb-1">Monthly Price ($)</label>
                    <input
                      type="number"
                      id="planBPrice"
                      value={planBPrice}
                      onChange={(e) => setPlanBPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="planBProvider" className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                    <input
                      type="text"
                      id="planBProvider"
                      value={planBProvider}
                      onChange={(e) => setPlanBProvider(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Plan C</h4>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="planCSpeed" className="block text-sm font-medium text-gray-700 mb-1">Speed (Mbps)</label>
                    <input
                      type="number"
                      id="planCSpeed"
                      value={planCSpeed}
                      onChange={(e) => setPlanCSpeed(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="planCPrice" className="block text-sm font-medium text-gray-700 mb-1">Monthly Price ($)</label>
                    <input
                      type="number"
                      id="planCPrice"
                      value={planCPrice}
                      onChange={(e) => setPlanCPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="planCProvider" className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                    <input
                      type="text"
                      id="planCProvider"
                      value={planCProvider}
                      onChange={(e) => setPlanCProvider(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={compareISPPlans}
              className="w-full bg-purple-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold mt-6"
            >
              Compare Plans
            </button>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Speed Analysis Results */}
          <div className="bg-blue-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-blue-800 mb-3">📊 Speed Analysis</h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center p-3 bg-white rounded border-l-4 border-blue-500">
                <span className="font-medium text-blue-800 text-sm">Download:</span>
                <span className="font-bold text-blue-800">{recommendedDownload}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded">
                <span className="font-medium text-sm">Upload:</span>
                <span className="font-bold">{recommendedUpload}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded">
                <span className="font-medium text-sm">Devices:</span>
                <span className="font-bold">{totalDevices}</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-blue-800 mb-2 text-sm">Current Speed Assessment</h4>
              <div className={`p-3 rounded-lg text-xs ${speedAssessmentColor}`}>{speedAssessment}</div>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-4">
              <div className="p-3 bg-white rounded">
                <span className="font-medium text-xs">Bandwidth/Device:</span>
                <span className="font-bold ml-2">{bandwidthPerDevice}</span>
              </div>
              <div className="p-3 bg-white rounded">
                <span className="font-medium text-xs">Utilization:</span>
                <span className="font-bold ml-2">{networkUtilization}</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2 text-sm">Recommendations</h4>
              <div className="text-xs text-blue-700">
                {recommendations.map((rec, i) => (
                  <div key={i}>{rec}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Troubleshooting Results */}
          <div className="bg-red-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-red-800 mb-3">🛠️ Troubleshooting</h3>
            <div className="space-y-3">
              {troubleshootingSolutions.map((solution, i) => (
                <div key={i} className="p-3 bg-white rounded-lg border-l-4 border-red-500">
                  <h5 className="font-semibold text-red-800 mb-2 text-sm">{solution.title}</h5>
                  <div className="text-xs text-red-700">
                    {solution.steps.map((step, j) => (
                      <div key={j}>{step}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Analysis Results */}
          <div className="bg-green-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-green-800 mb-3">🔒 Security Analysis</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-white rounded">
                <span className="font-medium text-sm">Score:</span>
                <span className="font-bold ml-2">{securityScore}</span>
              </div>
              <div className="p-3 bg-white rounded">
                <span className="font-medium text-sm">Risk:</span>
                <span className={`font-bold ml-2 ${riskColor}`}>{riskLevel}</span>
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <h5 className="font-semibold text-green-800 mb-2 text-sm">Security Recommendations</h5>
              <div className="text-xs text-green-700">
                {securityAdvice.map((advice, i) => (
                  <div key={i}>{advice}</div>
                ))}
              </div>
            </div>
          </div>

          {/* ISP Comparison Results */}
          <div className="bg-purple-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-purple-800 mb-3">📈 Plan Comparison</h3>
            <div className="space-y-3 mb-4" dangerouslySetInnerHTML={{__html: comparisonResults}} />
            <div className="p-3 bg-white rounded-lg">
              <h5 className="font-semibold text-purple-800 mb-2 text-sm">💰 Best Value</h5>
              <div className="text-xs text-purple-700" dangerouslySetInnerHTML={{__html: valueRecommendation}} />
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="mt-12 bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding Internet Speed Requirements</h2>

        <div className="grid md:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Download vs Upload</h3>
            <p className="text-gray-600 mb-4">
              <strong>Download speed</strong> affects streaming, web browsing, and file downloads.
              <strong>Upload speed</strong> is crucial for video calls, file uploads, and cloud backup.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Bandwidth Sharing</h3>
            <p className="text-gray-600 mb-4">
              Your internet speed is shared among all connected devices. More devices mean less bandwidth per device,
              especially during peak usage times.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Quality of Service</h3>
            <p className="text-gray-600 mb-4">
              Modern routers offer QoS features to prioritize traffic for important activities like video calls or gaming
              over less critical background tasks.
            </p>
          </div>
        </div>

        <div className="mt-8 p-3 sm:p-4 md:p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Speed Test Tips</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• Test at different times of day to see variation</li>
            <li>• Use wired connection for most accurate results</li>
            <li>• Close other applications during testing</li>
            <li>• Test from multiple devices and locations</li>
            <li>• Compare results with your ISP&apos;s promised speeds</li>
          </ul>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
      {/* Disclaimer */}
      <div className="mt-12 bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 border-l-4 border-yellow-400">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">⚠️ Important Disclaimer</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>Educational Tool Only:</strong> This WiFi speed calculator is designed for educational and planning purposes only. Actual internet speeds may vary based on numerous factors including network congestion, device capabilities, and ISP infrastructure.
          </p>
          <p>
            <strong>Speed Test Limitations:</strong> The speed test simulator provides estimates based on your inputs. For accurate speed measurements, use official speed test tools from your ISP or services like Speedtest.net.
          </p>
          <p>
            <strong>Network Security:</strong> The security analysis provides general recommendations. For comprehensive network security, consult with IT professionals or cybersecurity experts.
          </p>
          <p>
            <strong>ISP Comparisons:</strong> Plan comparisons are based on the data you provide. Always verify current pricing, terms, and availability directly with internet service providers.
          </p>
          <p>
            <strong>No Liability:</strong> We are not liable for any decisions made based on this calculator&apos;s results or any issues arising from following the recommendations provided.
          </p>
        </div>
      </div>
{/* Related Calculators */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Science Calculators</h2>
        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="block p-3 sm:p-4 md:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{calc.title}</h3>
              <p className="text-gray-600 text-sm">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="wifi-speed-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
