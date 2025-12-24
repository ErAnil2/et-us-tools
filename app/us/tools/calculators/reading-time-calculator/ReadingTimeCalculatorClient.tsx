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
  color: string;
  icon: string;
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
    question: "What is a Reading Time Calculator?",
    answer: "A Reading Time Calculator helps you calculate dates, times, or durations quickly. Whether you need to find the difference between dates or calculate future/past dates, this tool provides instant results.",
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

export default function ReadingTimeCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('reading-time-calculator');

  const [inputMethod, setInputMethod] = useState('text');
  const [textContent, setTextContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [wordsPerPage, setWordsPerPage] = useState(250);
  const [readingSpeed, setReadingSpeed] = useState('238');
  const [customSpeed, setCustomSpeed] = useState(0);
  const [contentType, setContentType] = useState('1.0');

  const [liveWordCount, setLiveWordCount] = useState(0);
  const [liveCharCount, setLiveCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState('0 min');
  const [totalWords, setTotalWords] = useState(0);
  const [displaySpeed, setDisplaySpeed] = useState('238 WPM');
  const [minutesOnly, setMinutesOnly] = useState('0 min');
  const [secondsTotal, setSecondsTotal] = useState('0 sec');
  const [displayContentType, setDisplayContentType] = useState('General Text');
  const [speedComparison, setSpeedComparison] = useState<string[]>([
    '• Slow reader (180 WPM): 0 min',
    '• Average reader (238 WPM): 0 min',
    '• Fast reader (400 WPM): 0 min'
  ]);

  useEffect(() => {
    calculateReadingTime();
  }, [inputMethod, textContent, wordCount, pageCount, wordsPerPage, readingSpeed, customSpeed, contentType]);

  const calculateReadingTime = () => {
    const contentTypeMultiplier = parseFloat(contentType);

    let calculatedTotalWords = 0;
    let calculatedReadingSpeed = 238; // Default average

    // Determine reading speed
    if (readingSpeed === 'custom') {
      calculatedReadingSpeed = customSpeed || 238;
    } else {
      calculatedReadingSpeed = parseInt(readingSpeed);
    }

    // Calculate total words based on input method
    switch(inputMethod) {
      case 'text':
        const text = textContent.trim();
        calculatedTotalWords = text ? text.split(/\s+/).filter(word => word.length > 0).length : 0;
        break;

      case 'words':
        calculatedTotalWords = wordCount || 0;
        break;

      case 'pages':
        calculatedTotalWords = pageCount * wordsPerPage;
        break;
    }

    if (calculatedTotalWords <= 0 || calculatedReadingSpeed <= 0) {
      resetResults();
      return;
    }

    // Apply content type multiplier
    const adjustedSpeed = calculatedReadingSpeed / contentTypeMultiplier;

    // Calculate reading time
    const totalMinutes = calculatedTotalWords / adjustedSpeed;
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.round((totalMinutes - minutes) * 60);
    const totalSeconds = Math.round(totalMinutes * 60);

    // Format reading time
    let readingTimeText;
    if (totalMinutes < 1) {
      readingTimeText = `${totalSeconds} sec`;
    } else if (totalMinutes < 60) {
      readingTimeText = seconds > 0 ? `${minutes} min ${seconds} sec` : `${minutes} min`;
    } else {
      const hours = Math.floor(totalMinutes / 60);
      const remainingMinutes = Math.floor(totalMinutes % 60);
      readingTimeText = `${hours}h ${remainingMinutes}m`;
    }

    // Update display
    setReadingTime(readingTimeText);
    setTotalWords(calculatedTotalWords);
    setDisplaySpeed(`${calculatedReadingSpeed} WPM`);
    setMinutesOnly(`${Math.ceil(totalMinutes)} min`);
    setSecondsTotal(`${totalSeconds} sec`);

    // Update content type display
    const contentTypeOptions: { [key: string]: string } = {
      '1.0': 'General Text',
      '1.2': 'Technical/Academic',
      '0.9': 'Fiction/Novel',
      '1.3': 'Legal Document',
      '1.1': 'News Article',
      '0.8': "Children's Book"
    };
    setDisplayContentType(contentTypeOptions[contentType] || 'General Text');

    // Calculate speed comparison
    updateSpeedComparison(calculatedTotalWords, contentTypeMultiplier);
  };

  const updateSpeedComparison = (words: number, contentTypeMultiplier: number) => {
    const speeds = [
      { label: 'Slow reader (180 WPM)', speed: 180 },
      { label: 'Average reader (238 WPM)', speed: 238 },
      { label: 'Fast reader (400 WPM)', speed: 400 }
    ];

    const comparisons = speeds.map(speedData => {
      const adjustedSpeed = speedData.speed / contentTypeMultiplier;
      const minutes = words / adjustedSpeed;
      const timeText = minutes < 1 ?
        `${Math.round(minutes * 60)} sec` :
        `${Math.round(minutes)} min`;
      return `• ${speedData.label}: ${timeText}`;
    });

    setSpeedComparison(comparisons);
  };

  const updateLiveCount = (text: string) => {
    const trimmedText = text.trim();
    const words = trimmedText ? trimmedText.split(/\s+/).filter(word => word.length > 0).length : 0;
    const chars = text.length;

    setLiveWordCount(words);
    setLiveCharCount(chars);
  };

  const resetResults = () => {
    setReadingTime('0 min');
    setTotalWords(0);
    setDisplaySpeed('238 WPM');
    setMinutesOnly('0 min');
    setSecondsTotal('0 sec');
    setDisplayContentType('General Text');
    setSpeedComparison([
      '• Slow reader (180 WPM): 0 sec',
      '• Average reader (238 WPM): 0 sec',
      '• Fast reader (400 WPM): 0 sec'
    ]);
  };

  const handleTextChange = (text: string) => {
    setTextContent(text);
    updateLiveCount(text);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Reading Time Calculator')}</h1>
        <p className="text-lg text-gray-600">Calculate reading time for articles, books, and documents based on word count and reading speed</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Text Input</h2>

            {/* Text Input Methods */}
            <div>
              <label htmlFor="inputMethod" className="block text-sm font-medium text-gray-700 mb-2">Input Method</label>
              <select
                id="inputMethod"
                value={inputMethod}
                onChange={(e) => setInputMethod(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="text">Paste Text</option>
                <option value="words">Enter Word Count</option>
                <option value="pages">Number of Pages</option>
              </select>
            </div>

            {/* Text Area Input */}
            {inputMethod === 'text' && (
              <div>
                <label htmlFor="textContent" className="block text-sm font-medium text-gray-700 mb-2">Paste Your Text</label>
                <textarea
                  id="textContent"
                  rows={8}
                  value={textContent}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder="Paste your article, blog post, or any text here to calculate reading time..."
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                ></textarea>
                <div className="mt-2 text-sm text-gray-500">
                  <span>{liveWordCount} words</span> • <span>{liveCharCount} characters</span>
                </div>
              </div>
            )}

            {/* Word Count Input */}
            {inputMethod === 'words' && (
              <div>
                <label htmlFor="wordCount" className="block text-sm font-medium text-gray-700 mb-2">Word Count</label>
                <input
                  type="number"
                  id="wordCount"
                  value={wordCount || ''}
                  onChange={(e) => setWordCount(parseInt(e.target.value) || 0)}
                  min="1"
                  placeholder="e.g., 1500"
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Pages Input */}
            {inputMethod === 'pages' && (
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pageCount" className="block text-sm font-medium text-gray-700 mb-2">Number of Pages</label>
                    <input
                      type="number"
                      id="pageCount"
                      value={pageCount || ''}
                      onChange={(e) => setPageCount(parseInt(e.target.value) || 0)}
                      min="1"
                      placeholder="e.g., 10"
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="wordsPerPage" className="block text-sm font-medium text-gray-700 mb-2">Words per Page</label>
                    <select
                      id="wordsPerPage"
                      value={wordsPerPage}
                      onChange={(e) => setWordsPerPage(parseInt(e.target.value))}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="200">200 - Large print book</option>
                      <option value="250">250 - Average book</option>
                      <option value="300">300 - Dense text</option>
                      <option value="500">500 - Academic paper</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Reading Speed */}
            <div>
              <label htmlFor="readingSpeed" className="block text-sm font-medium text-gray-700 mb-2">Reading Speed</label>
              <select
                id="readingSpeed"
                value={readingSpeed}
                onChange={(e) => setReadingSpeed(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="180">Slow Reader (180 WPM)</option>
                <option value="200">Below Average (200 WPM)</option>
                <option value="238">Average Adult (238 WPM)</option>
                <option value="300">Above Average (300 WPM)</option>
                <option value="400">Fast Reader (400 WPM)</option>
                <option value="500">Speed Reader (500 WPM)</option>
                <option value="custom">Custom Speed</option>
              </select>
            </div>

            {/* Custom Speed Input */}
            {readingSpeed === 'custom' && (
              <div>
                <label htmlFor="customSpeed" className="block text-sm font-medium text-gray-700 mb-2">Custom Speed (WPM)</label>
                <input
                  type="number"
                  id="customSpeed"
                  value={customSpeed || ''}
                  onChange={(e) => setCustomSpeed(parseInt(e.target.value) || 0)}
                  min="50"
                  max="1000"
                  placeholder="e.g., 275"
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Content Type Adjustment */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Content Type</h4>
              <select
                id="contentType"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="1.0">General Text</option>
                <option value="1.2">Technical/Academic</option>
                <option value="0.9">Fiction/Novel</option>
                <option value="1.3">Legal Document</option>
                <option value="1.1">News Article</option>
                <option value="0.8">Children&apos;s Book</option>
              </select>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Reading Time Results</h3>

            <div className="space-y-4">
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">{readingTime}</div>
                <div className="text-green-700">Estimated Reading Time</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Total Words:</span>
                  <span className="font-semibold">{totalWords.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Reading Speed:</span>
                  <span className="font-semibold">{displaySpeed}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Minutes:</span>
                  <span className="font-semibold text-blue-600">{minutesOnly}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Seconds:</span>
                  <span className="font-semibold">{secondsTotal}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Content Type:</span>
                  <span className="font-semibold">{displayContentType}</span>
                </div>
              </div>
            </div>

            {/* Speed Comparison */}
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Speed Comparison</h4>
              <div className="text-purple-700 space-y-1 text-sm">
                {speedComparison.map((comparison, index) => (
                  <div key={index}>{comparison}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Information Section */}
      <div className="bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Reading Speed Guidelines</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-purple-700">
          <div>
            <h4 className="font-semibold mb-2">Average Reading Speeds:</h4>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Elementary school:</strong> 80-158 WPM</li>
              <li>• <strong>Middle school:</strong> 158-204 WPM</li>
              <li>• <strong>High school:</strong> 200-300 WPM</li>
              <li>• <strong>College student:</strong> 200-400 WPM</li>
              <li>• <strong>Average adult:</strong> 238 WPM</li>
              <li>• <strong>Speed readers:</strong> 400-1000+ WPM</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Factors Affecting Reading Speed:</h4>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Text complexity:</strong> Technical content slower</li>
              <li>• <strong>Familiarity:</strong> Known topics read faster</li>
              <li>• <strong>Purpose:</strong> Skimming vs. studying</li>
              <li>• <strong>Environment:</strong> Distractions slow reading</li>
              <li>• <strong>Font &amp; formatting:</strong> Affects readability</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-6">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">Reading Tips &amp; Applications</h3>
        <div className="grid md:grid-cols-3 gap-4 text-yellow-700">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">For Content Creators</h4>
            <ul className="text-sm space-y-1">
              <li>• Include reading time in articles</li>
              <li>• Optimize content length</li>
              <li>• Break long content into sections</li>
              <li>• Consider audience attention span</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">For Students</h4>
            <ul className="text-sm space-y-1">
              <li>• Plan study time effectively</li>
              <li>• Set realistic reading goals</li>
              <li>• Track reading progress</li>
              <li>• Improve reading speed gradually</li>
            </ul>
          </div>
<div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Speed Reading Tips</h4>
            <ul className="text-sm space-y-1">
              <li>• Minimize subvocalization</li>
              <li>• Use finger as pacer</li>
              <li>• Practice peripheral vision</li>
              <li>• Avoid regression</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Converter Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">📏</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="reading-time-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
