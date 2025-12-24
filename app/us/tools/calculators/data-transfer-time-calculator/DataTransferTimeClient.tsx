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

interface DataTransferTimeClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface ConnectionType {
  name: string;
  speed: number;
  unit: string;
  bestFor: string;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Data Transfer Time Calculator?",
    answer: "A Data Transfer Time Calculator helps you calculate dates, times, or durations quickly. Whether you need to find the difference between dates or calculate future/past dates, this tool provides instant results.",
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

export default function DataTransferTimeClient({ relatedCalculators = defaultRelatedCalculators }: DataTransferTimeClientProps) {
  const { getH1, getSubHeading } = usePageSEO('data-transfer-time-calculator');

  const [fileSize, setFileSize] = useState<number>(1);
  const [fileSizeUnit, setFileSizeUnit] = useState<string>('GB');
  const [transferSpeed, setTransferSpeed] = useState<number>(100);
  const [speedUnit, setSpeedUnit] = useState<string>('Mbps');
  const [efficiency, setEfficiency] = useState<number>(85);

  // Results
  const [transferTime, setTransferTime] = useState<string>('21 minutes');
  const [displayFileSize, setDisplayFileSize] = useState<string>('1.00 GB');
  const [actualSpeed, setActualSpeed] = useState<string>('85 Mbps');
  const [speedInBytes, setSpeedInBytes] = useState<string>('10.625 MB/s');
  const [totalData, setTotalData] = useState<string>('1,073,741,824 bytes');
  const [timeSeconds, setTimeSeconds] = useState<string>('1,274');
  const [timeMinutes, setTimeMinutes] = useState<string>('21.2');
  const [timeHours, setTimeHours] = useState<string>('0.35');
  const [timeDays, setTimeDays] = useState<string>('0.01');
  const [speedComparison, setSpeedComparison] = useState<ConnectionType[]>([]);

  const speedConnections: ConnectionType[] = [
    { name: 'Dial-up', speed: 0.056, unit: 'Mbps', bestFor: 'Email, basic web' },
    { name: 'DSL', speed: 25, unit: 'Mbps', bestFor: 'Web browsing, streaming' },
    { name: 'Cable', speed: 100, unit: 'Mbps', bestFor: 'HD streaming, gaming' },
    { name: 'Fiber', speed: 1000, unit: 'Mbps', bestFor: '4K streaming, large files' },
    { name: 'Satellite', speed: 25, unit: 'Mbps', bestFor: 'Rural areas' },
    { name: '4G LTE', speed: 50, unit: 'Mbps', bestFor: 'Mobile internet' },
    { name: '5G', speed: 200, unit: 'Mbps', bestFor: 'Mobile, low latency' },
    { name: 'USB 2.0', speed: 480, unit: 'Mbps', bestFor: 'Local file transfer' },
    { name: 'USB 3.0', speed: 5000, unit: 'Mbps', bestFor: 'Fast local transfer' },
    { name: 'Ethernet (Gigabit)', speed: 1000, unit: 'Mbps', bestFor: 'Local network' }
  ];

  const convertToBytes = (size: number, unit: string): number => {
    const units: Record<string, number> = {
      'B': 1,
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024,
      'TB': 1024 * 1024 * 1024 * 1024,
      'PB': 1024 * 1024 * 1024 * 1024 * 1024
    };

    return size * (units[unit] || 1);
  };

  const convertToBps = (speed: number, unit: string): number => {
    const units: Record<string, number> = {
      'bps': 1,
      'Kbps': 1000,
      'Mbps': 1000 * 1000,
      'Gbps': 1000 * 1000 * 1000,
      'Bps': 8,
      'KBps': 8 * 1024,
      'MBps': 8 * 1024 * 1024,
      'GBps': 8 * 1024 * 1024 * 1024
    };

    return speed * (units[unit] || 1);
  };

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return size.toFixed(2) + ' ' + units[unitIndex];
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return Math.round(seconds) + ' seconds';
    } else if (seconds < 3600) {
      const minutes = Math.round(seconds / 60);
      return minutes + ' minute' + (minutes !== 1 ? 's' : '');
    } else if (seconds < 86400) {
      const hours = (seconds / 3600).toFixed(1);
      return hours + ' hour' + (hours !== '1.0' ? 's' : '');
    } else {
      const days = (seconds / 86400).toFixed(1);
      return days + ' day' + (days !== '1.0' ? 's' : '');
    }
  };

  const calculateTransferTime = () => {
    if (fileSize <= 0 || transferSpeed <= 0) {
      resetResults();
      return;
    }

    // Convert file size to bytes
    const fileSizeInBytes = convertToBytes(fileSize, fileSizeUnit);

    // Convert transfer speed to bits per second
    const speedInBps = convertToBps(transferSpeed, speedUnit);

    // Apply efficiency factor
    const efficiencyFactor = efficiency / 100;
    const actualSpeedBps = speedInBps * efficiencyFactor;

    // Convert to bytes per second (8 bits = 1 byte)
    const speedInBytesPerSecond = actualSpeedBps / 8;

    // Calculate transfer time in seconds
    const transferTimeSeconds = fileSizeInBytes / speedInBytesPerSecond;

    // Update results
    setDisplayFileSize(formatFileSize(fileSizeInBytes));
    const actualSpeedMbps = actualSpeedBps / (1000 * 1000);
    setActualSpeed(actualSpeedMbps.toFixed(1) + ' Mbps');
    const speedMBps = speedInBytesPerSecond / (1024 * 1024);
    setSpeedInBytes(speedMBps.toFixed(3) + ' MB/s');
    setTotalData(fileSizeInBytes.toLocaleString() + ' bytes');
    setTransferTime(formatTime(transferTimeSeconds));
    setTimeSeconds(Math.round(transferTimeSeconds).toLocaleString());
    setTimeMinutes((transferTimeSeconds / 60).toFixed(1));
    setTimeHours((transferTimeSeconds / 3600).toFixed(2));
    setTimeDays((transferTimeSeconds / 86400).toFixed(3));

    // Update speed comparison
    updateSpeedComparison(fileSizeInBytes);
  };

  const updateSpeedComparison = (fileSizeInBytes: number) => {
    const comparisonData = speedConnections.map(conn => {
      const speedBps = convertToBps(conn.speed, conn.unit);
      const actualSpeedBps = speedBps * 0.85; // Assume 85% efficiency
      const speedBytesPerSec = actualSpeedBps / 8;
      const timeSeconds = fileSizeInBytes / speedBytesPerSec;

      return {
        ...conn,
        transferTime: formatTime(timeSeconds)
      };
    });

    setSpeedComparison(comparisonData as any);
  };

  const resetResults = () => {
    setTransferTime('0 seconds');
    setDisplayFileSize('0 B');
    setActualSpeed('0 Mbps');
    setSpeedInBytes('0 MB/s');
    setTotalData('0 bytes');
    setTimeSeconds('0');
    setTimeMinutes('0');
    setTimeHours('0');
    setTimeDays('0');
    setSpeedComparison([]);
  };

  const loadScenario = (size: number, unit: string, speed: number, speedUnitVal: string) => {
    setFileSize(size);
    setFileSizeUnit(unit);
    setTransferSpeed(speed);
    setSpeedUnit(speedUnitVal);
  };

  useEffect(() => {
    calculateTransferTime();
  }, [fileSize, fileSizeUnit, transferSpeed, speedUnit, efficiency]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-4 sm:py-6 md:py-8 px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8">
      <article className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">{getH1('Data Transfer Time Calculator')}</h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Calculate download and upload times for files, backups, and streaming content
          </p>
        </header>

        {/* Main Calculator Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {/* Input Section */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Transfer Details</h2>

              {/* File Size */}
              <div>
                <label htmlFor="fileSize" className="block text-sm font-semibold text-gray-700 mb-2">
                  File Size
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    id="fileSize"
                    value={fileSize}
                    onChange={(e) => setFileSize(parseFloat(e.target.value) || 0)}
                    step="0.1"
                    min="0.001"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={fileSizeUnit}
                    onChange={(e) => setFileSizeUnit(e.target.value)}
                    className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="B">Bytes (B)</option>
                    <option value="KB">Kilobytes (KB)</option>
                    <option value="MB">Megabytes (MB)</option>
                    <option value="GB">Gigabytes (GB)</option>
                    <option value="TB">Terabytes (TB)</option>
                    <option value="PB">Petabytes (PB)</option>
                  </select>
                </div>
              </div>

              {/* Transfer Speed */}
              <div>
                <label htmlFor="transferSpeed" className="block text-sm font-semibold text-gray-700 mb-2">
                  Transfer Speed
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    id="transferSpeed"
                    value={transferSpeed}
                    onChange={(e) => setTransferSpeed(parseFloat(e.target.value) || 0)}
                    step="0.1"
                    min="0.1"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={speedUnit}
                    onChange={(e) => setSpeedUnit(e.target.value)}
                    className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="bps">bits/second</option>
                    <option value="Kbps">Kbps (Kilobits/s)</option>
                    <option value="Mbps">Mbps (Megabits/s)</option>
                    <option value="Gbps">Gbps (Gigabits/s)</option>
                    <option value="Bps">Bytes/second</option>
                    <option value="KBps">KB/s (Kilobytes/s)</option>
                    <option value="MBps">MB/s (Megabytes/s)</option>
                    <option value="GBps">GB/s (Gigabytes/s)</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Note: ISPs typically advertise in bits/second (Mbps), actual downloads show bytes/second
                </p>
              </div>

              {/* Efficiency Factor */}
              <div>
                <label htmlFor="efficiency" className="block text-sm font-semibold text-gray-700 mb-2">
                  Network Efficiency
                </label>
                <select
                  id="efficiency"
                  value={efficiency}
                  onChange={(e) => setEfficiency(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="100">100% - Perfect conditions</option>
                  <option value="95">95% - Excellent network</option>
                  <option value="90">90% - Good network</option>
                  <option value="85">85% - Average network</option>
                  <option value="80">80% - Fair network</option>
                  <option value="75">75% - Poor network</option>
                  <option value="70">70% - Very poor network</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Real-world networks rarely achieve theoretical maximum speeds
                </p>
              </div>

              {/* Common Scenarios */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">Quick Scenarios</h4>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => loadScenario(4, 'GB', 25, 'Mbps')}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors text-left"
                  >
                    4K Movie Download (4GB @ 25 Mbps)
                  </button>
                  <button
                    onClick={() => loadScenario(50, 'MB', 10, 'Mbps')}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors text-left"
                  >
                    Large Photo Album (50MB @ 10 Mbps)
                  </button>
                  <button
                    onClick={() => loadScenario(500, 'GB', 1000, 'Mbps')}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors text-left"
                  >
                    Backup to Cloud (500GB @ Gigabit)
                  </button>
                  <button
                    onClick={() => loadScenario(2, 'GB', 5, 'Mbps')}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors text-left"
                  >
                    Game Download (2GB @ 5 Mbps)
                  </button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Transfer Time</h3>

              {/* Main Transfer Time */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 sm:p-4 md:p-6 text-center text-white">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{transferTime}</div>
                <div className="text-lg font-semibold">Estimated Transfer Time</div>
              </div>

              {/* Transfer Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">File Size:</span>
                  <span className="font-semibold text-gray-900">{displayFileSize}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Actual Speed:</span>
                  <span className="font-semibold text-blue-600">{actualSpeed}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Speed (bytes/sec):</span>
                  <span className="font-semibold text-gray-900">{speedInBytes}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Total Data:</span>
                  <span className="font-semibold text-gray-900">{totalData}</span>
                </div>
              </div>

              {/* Time Breakdown */}
              <div className="mt-6 p-4 bg-white rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Time Breakdown</h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Seconds:</span>
                    <span className="font-semibold">{timeSeconds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minutes:</span>
                    <span className="font-semibold">{timeMinutes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hours:</span>
                    <span className="font-semibold">{timeHours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Days:</span>
                    <span className="font-semibold">{timeDays}</span>
                  </div>
                </div>
              </div>

              {/* Progress Visualization */}
              <div className="mt-6 p-4 bg-white rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Transfer Visualization</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress Bar Example:</span>
                    <span>25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full animate-pulse" style={{ width: '25%' }}></div>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    Simulated progress - actual transfers may vary
                  </div>
                </div>
              </div>
</div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Speed Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Speed Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Connection Type</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Typical Speed</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Transfer Time</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Best For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {speedComparison.map((conn, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{conn.name}</td>
                    <td className="px-4 py-3 text-center">{conn.speed} {conn.unit}</td>
                    <td className="px-4 py-3 text-center">{(conn as any).transferTime}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{conn.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-purple-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-xl font-bold text-purple-800 mb-4">Understanding Data Transfer</h3>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-purple-700">
            <div>
              <h4 className="font-semibold mb-2">Bits vs Bytes:</h4>
              <ul className="space-y-1 text-sm">
                <li>• <strong>Bits (b):</strong> Basic unit, used for internet speeds</li>
                <li>• <strong>Bytes (B):</strong> 8 bits = 1 byte, used for file sizes</li>
                <li>• <strong>100 Mbps:</strong> = 12.5 MB/s maximum</li>
                <li>• <strong>Overhead:</strong> Real speeds are 80-90% of maximum</li>
                <li>• <strong>1 KB:</strong> = 1,024 bytes (binary)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Factors Affecting Speed:</h4>
              <ul className="space-y-1 text-sm">
                <li>• <strong>Network congestion:</strong> Peak hours are slower</li>
                <li>• <strong>Server capacity:</strong> Popular sites may throttle</li>
                <li>• <strong>Distance:</strong> Farther servers = higher latency</li>
                <li>• <strong>Protocol overhead:</strong> TCP/IP adds ~10% overhead</li>
                <li>• <strong>Device performance:</strong> CPU, RAM, storage speed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-xl font-bold text-yellow-800 mb-4">Optimize Transfer Speeds</h3>
          <div className="grid md:grid-cols-3 gap-4 text-yellow-700">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold mb-2">Network Optimization</h4>
              <ul className="text-sm space-y-1">
                <li>• Use wired connection when possible</li>
                <li>• Close other bandwidth-heavy apps</li>
                <li>• Download during off-peak hours</li>
                <li>• Use download managers for large files</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold mb-2">For Large Transfers</h4>
              <ul className="text-sm space-y-1">
                <li>• Consider compression first</li>
                <li>• Split into multiple smaller files</li>
                <li>• Use resume-capable tools</li>
                <li>• Physical transfer for TB+ data</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold mb-2">Speed Testing</h4>
              <ul className="text-sm space-y-1">
                <li>• Test with multiple servers</li>
                <li>• Test at different times of day</li>
                <li>• Compare upload vs download speeds</li>
                <li>• Account for data caps and throttling</li>
              </ul>
            </div>
          </div>
        </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedCalculators.map((calc, index) => (
              <Link
                key={index}
                href={calc.href}
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{calc.title}</h3>
                <p className="text-sm text-gray-600">{calc.description}</p>
              </Link>
            ))}
          </div>
        
      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="data-transfer-time-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
      </div>
      </article>
    </div>
  );
}
