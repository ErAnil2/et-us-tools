'use client';

import { useState, useEffect, useRef } from 'react';
import RelatedCalculatorCards from '@/components/RelatedCalculatorCards';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color: string;
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];

import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { usePageSEO } from '@/lib/usePageSEO';
interface DownloadTimeClientProps {
  relatedCalculators: Array<{
    href: string;
    title: string;
    description: string;
  }>;
}

type FileSizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB';
type SpeedUnit = 'Kbps' | 'Mbps' | 'Gbps' | 'KBps' | 'MBps' | 'GBps';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Download Time Calculator?",
    answer: "A Download Time Calculator helps you calculate dates, times, or durations quickly. Whether you need to find the difference between dates or calculate future/past dates, this tool provides instant results.",
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

export default function DownloadTimeClient({ relatedCalculators = defaultRelatedCalculators }: DownloadTimeClientProps) {
  const { getH1, getSubHeading } = usePageSEO('download-time-calculator');

  const [fileSize, setFileSize] = useState<number>(1);
  const [fileSizeUnit, setFileSizeUnit] = useState<FileSizeUnit>('GB');
  const [downloadSpeed, setDownloadSpeed] = useState<number>(100);
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>('Mbps');
  const [fileCount, setFileCount] = useState<number>(1);

  const [downloadTime, setDownloadTime] = useState<string>('');
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [speedMBps, setSpeedMBps] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);

  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const fileSizeUnits: Record<FileSizeUnit, number> = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024
  };

  const speedUnits: Record<SpeedUnit, number> = {
    'Kbps': 1000 / 8,  // Convert to bytes per second
    'Mbps': 1000000 / 8,
    'Gbps': 1000000000 / 8,
    'KBps': 1024,
    'MBps': 1024 * 1024,
    'GBps': 1024 * 1024 * 1024
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 1) return 'Less than 1 second';

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    let result = '';
    if (h > 0) result += `${h} hour${h !== 1 ? 's' : ''} `;
    if (m > 0) result += `${m} minute${m !== 1 ? 's' : ''} `;
    if (s > 0 && h === 0) result += `${s} second${s !== 1 ? 's' : ''}`;

    return result.trim();
  };

  const formatTimeShort = (seconds: number): string => {
    if (seconds < 1) return '< 1s';

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  useEffect(() => {
    // Convert file size to bytes
    const fileSizeBytes = fileSize * fileSizeUnits[fileSizeUnit];

    // Convert speed to bytes per second
    const speedBytesPerSec = downloadSpeed * speedUnits[speedUnit];

    if (speedBytesPerSec === 0) {
      setDownloadTime('0 seconds');
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      setSpeedMBps(0);
      setTotalSeconds(0);
      return;
    }

    // Calculate download time in seconds
    const timeSeconds = fileSizeBytes / speedBytesPerSec;
    const totalTimeSeconds = timeSeconds * fileCount;

    const h = Math.floor(totalTimeSeconds / 3600);
    const m = Math.floor((totalTimeSeconds % 3600) / 60);
    const s = Math.floor(totalTimeSeconds % 60);

    setDownloadTime(formatTime(totalTimeSeconds));
    setHours(h);
    setMinutes(m);
    setSeconds(s);
    setTotalSeconds(totalTimeSeconds);

    // Convert speed to MB/s for display
    const mbps = speedBytesPerSec / (1024 * 1024);
    setSpeedMBps(mbps);

    // Reset simulation when inputs change
    stopSimulation();
  }, [fileSize, fileSizeUnit, downloadSpeed, speedUnit, fileCount, fileSizeUnits, speedUnits]);

  const stopSimulation = () => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setProgressPercent(0);
    setIsSimulating(false);
  };

  const startSimulation = () => {
    if (totalSeconds <= 0) return;

    stopSimulation();
    setIsSimulating(true);
    startTimeRef.current = Date.now();
    const simulationDuration = Math.min(totalSeconds * 1000, 30000); // Max 30 seconds simulation

    simulationIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min((elapsed / simulationDuration) * 100, 100);

      setProgressPercent(progress);

      if (progress >= 100) {
        stopSimulation();
      }
    }, 100);
  };

  const setSpeedPreset = (speed: number, unit: SpeedUnit) => {
    setDownloadSpeed(speed);
    setSpeedUnit(unit);
  };

  const setFilePreset = (size: number, unit: FileSizeUnit) => {
    setFileSize(size);
    setFileSizeUnit(unit);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      {/* Header */}
      <header className="text-center mb-6 md:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{getH1('Download Time Calculator')}</h1>
        <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
          Calculate how long it takes to download files based on your internet connection speed. Get accurate time estimates for downloads, backups, and file transfers.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Calculator Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="space-y-4 md:space-y-6">
              {/* File Size Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                <label htmlFor="fileSize" className="block text-sm font-medium text-gray-700 mb-3">📁 File Size</label>
                <div className="flex">
                  <input
                    type="number"
                    id="fileSize"
                    className="flex-1 px-2 py-2.5 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={fileSize}
                    onChange={(e) => setFileSize(Math.max(0, parseFloat(e.target.value) || 0))}
                    min="0"
                    step="0.01"
                  />
                  <select
                    id="fileSizeUnit"
                    value={fileSizeUnit}
                    onChange={(e) => setFileSizeUnit(e.target.value as FileSizeUnit)}
                    className="px-3 py-2.5 rounded-r-lg border border-l-0 border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="B">Bytes</option>
                    <option value="KB">KB</option>
                    <option value="MB">MB</option>
                    <option value="GB">GB</option>
                    <option value="TB">TB</option>
                  </select>
                </div>
              </div>

              {/* Download Speed Section */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                <label htmlFor="downloadSpeed" className="block text-sm font-medium text-gray-700 mb-3">⚡ Download Speed</label>
                <div className="flex">
                  <input
                    type="number"
                    id="downloadSpeed"
                    className="flex-1 px-2 py-2.5 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={downloadSpeed}
                    onChange={(e) => setDownloadSpeed(Math.max(0, parseFloat(e.target.value) || 0))}
                    min="0"
                    step="0.01"
                  />
                  <select
                    id="speedUnit"
                    value={speedUnit}
                    onChange={(e) => setSpeedUnit(e.target.value as SpeedUnit)}
                    className="px-3 py-2.5 rounded-r-lg border border-l-0 border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="Mbps">Mbps</option>
                    <option value="Kbps">Kbps</option>
                    <option value="Gbps">Gbps</option>
                    <option value="MBps">MB/s</option>
                    <option value="KBps">KB/s</option>
                    <option value="GBps">GB/s</option>
                  </select>
                </div>
              </div>

              {/* Common Speed Presets */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
                <label className="block text-sm font-medium text-gray-700 mb-3">🚀 Common Connection Speeds</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <button type="button" onClick={() => setSpeedPreset(1, 'Mbps')} className="px-3 py-2 text-xs md:text-sm border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors bg-white">
                    Dial-up (1 Mbps)
                  </button>
                  <button type="button" onClick={() => setSpeedPreset(10, 'Mbps')} className="px-3 py-2 text-xs md:text-sm border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors bg-white">
                    Basic (10 Mbps)
                  </button>
                  <button type="button" onClick={() => setSpeedPreset(25, 'Mbps')} className="px-3 py-2 text-xs md:text-sm border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors bg-white">
                    Standard (25 Mbps)
                  </button>
                  <button type="button" onClick={() => setSpeedPreset(50, 'Mbps')} className="px-3 py-2 text-xs md:text-sm border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors bg-white">
                    Fast (50 Mbps)
                  </button>
                  <button type="button" onClick={() => setSpeedPreset(100, 'Mbps')} className="px-3 py-2 text-xs md:text-sm border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors bg-white">
                    Very Fast (100 Mbps)
                  </button>
                  <button type="button" onClick={() => setSpeedPreset(1, 'Gbps')} className="px-3 py-2 text-xs md:text-sm border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors bg-white">
                    Gigabit (1 Gbps)
                  </button>
                </div>
              </div>

              {/* File Type Examples */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-100">
                <label className="block text-sm font-medium text-gray-700 mb-3">💾 Common File Sizes</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <button type="button" onClick={() => setFilePreset(5, 'MB')} className="px-3 py-2 text-xs md:text-sm border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left bg-white">
                    📸 HD Photo (~5 MB)
                  </button>
                  <button type="button" onClick={() => setFilePreset(50, 'MB')} className="px-3 py-2 text-xs md:text-sm border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left bg-white">
                    🎵 Music Album (~50 MB)
                  </button>
                  <button type="button" onClick={() => setFilePreset(700, 'MB')} className="px-3 py-2 text-xs md:text-sm border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left bg-white">
                    📀 CD/Movie (~700 MB)
                  </button>
                  <button type="button" onClick={() => setFilePreset(4.7, 'GB')} className="px-3 py-2 text-xs md:text-sm border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left bg-white">
                    📀 DVD Movie (~4.7 GB)
                  </button>
                  <button type="button" onClick={() => setFilePreset(25, 'GB')} className="px-3 py-2 text-xs md:text-sm border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left bg-white">
                    💿 Blu-ray Movie (~25 GB)
                  </button>
                  <button type="button" onClick={() => setFilePreset(100, 'GB')} className="px-3 py-2 text-xs md:text-sm border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left bg-white">
                    🎮 Game Download (~100 GB)
                  </button>
                </div>
              </div>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Information Cards */}
          <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bandwidth Basics */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-5 rounded-xl border border-blue-100">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">Bandwidth Basics</h3>
              <p className="text-sm text-gray-600">
                Internet speed is measured in bits per second (bps), while file sizes are in bytes. 1 byte = 8 bits, so a 100 Mbps connection downloads at about 12.5 MB/s.
              </p>
            </div>

            {/* Network Overhead */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-5 rounded-xl border border-green-100">
              <div className="text-2xl mb-2">🔄</div>
              <h3 className="font-semibold text-gray-900 mb-2">Network Overhead</h3>
              <p className="text-sm text-gray-600">
                Actual download times may be 10-20% longer due to network protocols, packet headers, and connection overhead. Our calculator shows ideal speeds.
              </p>
            </div>

            {/* Server Limits */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-5 rounded-xl border border-purple-100">
              <div className="text-2xl mb-2">🖥️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Server Limits</h3>
              <p className="text-sm text-gray-600">
                Download speed also depends on the server&apos;s upload capacity. Even with a fast connection, the server might limit your download to a lower speed.
              </p>
            </div>

            {/* Network Congestion */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 md:p-5 rounded-xl border border-orange-100">
              <div className="text-2xl mb-2">🌐</div>
              <h3 className="font-semibold text-gray-900 mb-2">Network Congestion</h3>
              <p className="text-sm text-gray-600">
                Peak usage times can slow down your connection. Downloads at night or early morning often achieve faster speeds than during busy hours.
              </p>
            </div>

            {/* Wired vs Wireless */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 md:p-5 rounded-xl border border-cyan-100">
              <div className="text-2xl mb-2">📡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Wired vs Wireless</h3>
              <p className="text-sm text-gray-600">
                Ethernet connections provide more stable speeds than Wi-Fi. For large downloads, use a wired connection to avoid interference and signal degradation.
              </p>
            </div>

            {/* File Transfer Tips */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-4 md:p-5 rounded-xl border border-rose-100">
              <div className="text-2xl mb-2">💡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Transfer Tips</h3>
              <p className="text-sm text-gray-600">
                For very large files, use a download manager that supports resume functionality. This protects against interruptions and connection drops.
              </p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg p-3 sm:p-4 md:p-6 border border-purple-100 lg:sticky lg:top-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Download Time Results</h2>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <div className="text-sm text-gray-600 mb-1">Estimated Download Time</div>
                <div className="text-2xl font-bold text-purple-600">{downloadTime}</div>
              </div>
<div className="bg-white rounded-lg p-4 border border-purple-100">
                <div className="text-sm text-gray-600 mb-2">Time Breakdown</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hours:</span>
                    <span className="font-semibold">{hours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minutes:</span>
                    <span className="font-semibold">{minutes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seconds:</span>
                    <span className="font-semibold">{seconds}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <div className="text-sm text-gray-600 mb-2">File Information</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">File Size:</span>
                    <span className="font-semibold">{fileSize} {fileSizeUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Speed:</span>
                    <span className="font-semibold">{downloadSpeed} {speedUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">In MB/s:</span>
                    <span className="font-semibold">{speedMBps.toFixed(2)} MB/s</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <div className="text-sm text-gray-600 mb-3">Multiple Files</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={fileCount}
                      onChange={(e) => setFileCount(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      className="w-16 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-600">files</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Total Time:</span>
                    <span className="font-semibold ml-1">{downloadTime}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <div className="text-sm text-gray-600 mb-2">Progress Simulation</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  <span>{Math.round(progressPercent)}%</span>
                  <span>
                    {progressPercent >= 100 ? 'Complete!' : `${formatTimeShort(totalSeconds * (1 - progressPercent / 100))} remaining`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={isSimulating ? stopSimulation : startSimulation}
                  className="w-full px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="download-time-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      <RelatedCalculatorCards calculators={relatedCalculators} />
    </div>
  );
}
