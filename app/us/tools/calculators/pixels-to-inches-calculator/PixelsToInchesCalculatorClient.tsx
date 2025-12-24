'use client';

import { useState, useEffect } from 'react';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Pixels To Inches Calculator?",
    answer: "A Pixels To Inches Calculator is a free online tool designed to help you quickly and accurately calculate pixels to inches-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Pixels To Inches Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Pixels To Inches Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Pixels To Inches Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function PixelsToInchesCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('pixels-to-inches-calculator');

  const [direction, setDirection] = useState<'px-to-in' | 'in-to-px'>('px-to-in');
  const [pixels, setPixels] = useState(300);
  const [dpi, setDpi] = useState(300);
  const [inches, setInches] = useState(1);
  const [dpi2, setDpi2] = useState(300);
  const [imageWidth, setImageWidth] = useState(1920);
  const [imageHeight, setImageHeight] = useState(1080);
  const [dpiSlider, setDpiSlider] = useState(300);
  const [dpiSlider2, setDpiSlider2] = useState(300);

  const formatNumber = (num: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const getAspectRatio = (width: number, height: number): string => {
    const divisor = gcd(width, height);
    const w = width / divisor;
    const h = height / divisor;

    if (w === 16 && h === 9) return '16:9';
    if (w === 4 && h === 3) return '4:3';
    if (w === 3 && h === 2) return '3:2';
    if (w === 5 && h === 4) return '5:4';
    if (w === 1 && h === 1) return '1:1';

    return `${w}:${h}`;
  };

  const getQualityLevel = (dpiValue: number): string => {
    if (dpiValue >= 300) return 'High Quality Print';
    if (dpiValue >= 150) return 'Standard Print';
    if (dpiValue >= 96) return 'High Resolution Screen';
    if (dpiValue >= 72) return 'Standard Screen';
    return 'Low Resolution';
  };

  const getBestUse = (dpiValue: number): string => {
    if (dpiValue >= 300) return 'Professional Print';
    if (dpiValue >= 150) return 'Home Printing';
    if (dpiValue >= 96) return 'High-DPI Displays';
    if (dpiValue >= 72) return 'Web/Screen Display';
    return 'Low Quality Display';
  };

  const [results, setResults] = useState({
    mainResult: '1.00 inches',
    resultLabel: 'Inches',
    calculationSteps: '300 px ÷ 300 DPI = 1.00 in',
    centimeters: '2.54 cm',
    millimeters: '25.4 mm',
    points: '72 pt',
    physicalWidth: '6.4 in',
    physicalHeight: '3.6 in',
    physicalDiagonal: '7.3 in',
    aspectRatio: '16:9',
    currentDPI: '300 DPI',
    qualityLevel: 'High Quality Print',
    bestUse: 'Professional Print',
    printSizes: [] as { dpi: number; width: string; height: string }[]
  });

  const [visualPreview, setVisualPreview] = useState({
    width: 120,
    height: 67.5,
    dimensions: '1920×1080'
  });

  useEffect(() => {
    calculate();
  }, [direction, pixels, dpi, inches, dpi2, imageWidth, imageHeight]);

  useEffect(() => {
    setDpi(dpiSlider);
  }, [dpiSlider]);

  useEffect(() => {
    setDpi2(dpiSlider2);
  }, [dpiSlider2]);

  const calculate = () => {
    let result: number;
    let dpiValue: number;
    let calculationText: string;
    let resultLabel: string;
    let mainResult: string;

    if (direction === 'px-to-in') {
      dpiValue = dpi || 1;
      result = pixels / dpiValue;
      resultLabel = 'Inches';
      mainResult = `${formatNumber(result)} inches`;
      calculationText = `${pixels} px ÷ ${dpiValue} DPI = ${formatNumber(result)} in`;
    } else {
      dpiValue = dpi2 || 1;
      result = inches * dpiValue;
      resultLabel = 'Pixels';
      mainResult = `${Math.round(result)} pixels`;
      calculationText = `${inches} in × ${dpiValue} DPI = ${Math.round(result)} px`;
    }

    // Update alternative units
    const inchesValue = direction === 'px-to-in' ? result : inches;
    const cm = inchesValue * 2.54;
    const mm = cm * 10;
    const points = inchesValue * 72;

    // Update image dimensions
    const physicalWidth = imageWidth / dpiValue;
    const physicalHeight = imageHeight / dpiValue;
    const physicalDiagonal = Math.sqrt(physicalWidth * physicalWidth + physicalHeight * physicalHeight);

    // Update print sizes
    const dpis = [72, 96, 150, 300, 600];
    const printSizes = dpis.map(dpiVal => ({
      dpi: dpiVal,
      width: formatNumber(imageWidth / dpiVal, 1),
      height: formatNumber(imageHeight / dpiVal, 1)
    }));

    // Update visual preview
    const maxSize = 200;
    const aspectRatio = imageWidth / imageHeight;
    let displayWidth: number, displayHeight: number;

    if (aspectRatio > 1) {
      displayWidth = Math.min(maxSize, imageWidth / 10);
      displayHeight = displayWidth / aspectRatio;
    } else {
      displayHeight = Math.min(maxSize, imageHeight / 10);
      displayWidth = displayHeight * aspectRatio;
    }

    setVisualPreview({
      width: displayWidth,
      height: displayHeight,
      dimensions: `${imageWidth}×${imageHeight}`
    });

    setResults({
      mainResult,
      resultLabel,
      calculationSteps: calculationText,
      centimeters: `${formatNumber(cm)} cm`,
      millimeters: `${formatNumber(mm)} mm`,
      points: `${formatNumber(points)} pt`,
      physicalWidth: `${formatNumber(physicalWidth)} in`,
      physicalHeight: `${formatNumber(physicalHeight)} in`,
      physicalDiagonal: `${formatNumber(physicalDiagonal)} in`,
      aspectRatio: getAspectRatio(imageWidth, imageHeight),
      currentDPI: `${dpiValue} DPI`,
      qualityLevel: getQualityLevel(dpiValue),
      bestUse: getBestUse(dpiValue),
      printSizes
    });
  };

  const copyResults = () => {
    const resultsText = `
${results.mainResult}
${results.calculationSteps}

Alternative Units:
${results.centimeters}
${results.millimeters}
${results.points}

Physical Size:
Width: ${results.physicalWidth}
Height: ${results.physicalHeight}
Diagonal: ${results.physicalDiagonal}
Aspect Ratio: ${results.aspectRatio}
    `.trim();

    navigator.clipboard.writeText(resultsText).then(() => {
      alert('✅ Results copied to clipboard!');
    });
  };

  const handleDpiPreset = (dpiValue: number) => {
    if (direction === 'px-to-in') {
      setDpi(dpiValue);
      setDpiSlider(dpiValue);
    } else {
      setDpi2(dpiValue);
      setDpiSlider2(dpiValue);
    }
  };

  const handleSizePreset = (width: number, height: number) => {
    setImageWidth(width);
    setImageHeight(height);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 md:px-6 py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{getH1('Pixels to Inches Calculator')}</h1>
        <p className="text-sm md:text-lg text-gray-600 mb-4 md:mb-6 max-w-3xl mx-auto">
          Convert between pixels and inches with DPI/PPI resolution. Perfect for print design, web development, and understanding digital to physical dimensions
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
        {/* Left Column: Input Forms */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Conversion Direction Toggle */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-3 mb-3 sm:mb-4 md:mb-6">
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="direction"
                  value="px-to-in"
                  className="peer sr-only"
                  checked={direction === 'px-to-in'}
                  onChange={(e) => setDirection(e.target.value as 'px-to-in')}
                />
                <div className="px-2 py-3 border-2 border-gray-300 rounded-lg text-center peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 transition-all hover:bg-gray-50">
                  <div className="text-lg font-semibold">📐 Pixels → Inches</div>
                  <div className="text-xs text-gray-500">Convert pixels to physical size</div>
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="direction"
                  value="in-to-px"
                  className="peer sr-only"
                  checked={direction === 'in-to-px'}
                  onChange={(e) => setDirection(e.target.value as 'in-to-px')}
                />
                <div className="px-2 py-3 border-2 border-gray-300 rounded-lg text-center peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 transition-all hover:bg-gray-50">
                  <div className="text-lg font-semibold">📏 Inches → Pixels</div>
                  <div className="text-xs text-gray-500">Convert physical size to pixels</div>
                </div>
              </label>
            </div>

            {/* Pixels to Inches Section */}
            {direction === 'px-to-in' && (
              <div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="pixels" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Pixels (px)
                      </label>
                      <input
                        type="number"
                        id="pixels"
                        value={pixels}
                        onChange={(e) => setPixels(Number(e.target.value))}
                        min="0"
                        step="1"
                        placeholder="Enter pixels"
                        className="w-full px-3 md:px-2 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      />
                    </div>

                    <div>
                      <label htmlFor="dpi" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Resolution (DPI/PPI)
                      </label>
                      <input
                        type="number"
                        id="dpi"
                        value={dpi}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setDpi(value);
                          setDpiSlider(value);
                        }}
                        min="1"
                        step="1"
                        placeholder="Dots per inch"
                        className="w-full px-3 md:px-2 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      />
                    </div>
                  </div>

                  {/* DPI Slider */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      DPI Slider: <span className="text-blue-600 font-bold">{dpiSlider}</span>
                    </label>
                    <input
                      type="range"
                      value={dpiSlider}
                      onChange={(e) => setDpiSlider(Number(e.target.value))}
                      min="72"
                      max="600"
                      step="1"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>72 (Web)</span>
                      <span>150 (Standard Print)</span>
                      <span>300 (HD Print)</span>
                      <span>600 (Pro)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Inches to Pixels Section */}
            {direction === 'in-to-px' && (
              <div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="inches" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Inches (in)
                      </label>
                      <input
                        type="number"
                        id="inches"
                        value={inches}
                        onChange={(e) => setInches(Number(e.target.value))}
                        min="0"
                        step="0.01"
                        placeholder="Enter inches"
                        className="w-full px-3 md:px-2 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      />
                    </div>

                    <div>
                      <label htmlFor="dpi2" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Resolution (DPI/PPI)
                      </label>
                      <input
                        type="number"
                        id="dpi2"
                        value={dpi2}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setDpi2(value);
                          setDpiSlider2(value);
                        }}
                        min="1"
                        step="1"
                        placeholder="Dots per inch"
                        className="w-full px-3 md:px-2 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      />
                    </div>
                  </div>

                  {/* DPI Slider for Inches to Pixels */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      DPI Slider: <span className="text-blue-600 font-bold">{dpiSlider2}</span>
                    </label>
                    <input
                      type="range"
                      value={dpiSlider2}
                      onChange={(e) => setDpiSlider2(Number(e.target.value))}
                      min="72"
                      max="600"
                      step="1"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>72</span>
                      <span>300</span>
                      <span>600</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Common DPI Presets */}
            <div className="mt-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-3">🎯 Common DPI Presets:</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleDpiPreset(72)}
                  className="px-3 py-2 text-xs md:text-sm border-2 border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all"
                >
                  72 DPI<br /><span className="text-xs text-gray-500">Web</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDpiPreset(96)}
                  className="px-3 py-2 text-xs md:text-sm border-2 border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all"
                >
                  96 DPI<br /><span className="text-xs text-gray-500">Screen</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDpiPreset(150)}
                  className="px-3 py-2 text-xs md:text-sm border-2 border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all"
                >
                  150 DPI<br /><span className="text-xs text-gray-500">Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDpiPreset(300)}
                  className="px-3 py-2 text-xs md:text-sm border-2 border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all"
                >
                  300 DPI<br /><span className="text-xs text-gray-500">HD Print</span>
                </button>
              </div>
            </div>

            {/* Formula Display */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="text-xs md:text-sm font-semibold text-purple-800 mb-2">📐 Formula:</div>
              <div className="space-y-1">
                <div className="font-mono text-xs md:text-sm text-purple-700 bg-white px-3 py-2 rounded">Inches = Pixels ÷ DPI</div>
                <div className="font-mono text-xs md:text-sm text-purple-700 bg-white px-3 py-2 rounded">Pixels = Inches × DPI</div>
</div>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Image Dimensions Calculator */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">🖼️ Image Dimensions Calculator</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="imageWidth" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Width (pixels)</label>
                <input
                  type="number"
                  id="imageWidth"
                  value={imageWidth}
                  onChange={(e) => setImageWidth(Number(e.target.value))}
                  min="0"
                  step="1"
                  className="w-full px-3 md:px-2 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                />
              </div>

              <div>
                <label htmlFor="imageHeight" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Height (pixels)</label>
                <input
                  type="number"
                  id="imageHeight"
                  value={imageHeight}
                  onChange={(e) => setImageHeight(Number(e.target.value))}
                  min="0"
                  step="1"
                  className="w-full px-3 md:px-2 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                />
              </div>
            </div>

            {/* Common Image Size Presets */}
            <div className="mt-4">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-3">📱 Common Image Sizes:</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSizePreset(1920, 1080)}
                  className="px-3 py-2 text-xs border-2 border-green-200 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all"
                >
                  1920×1080<br /><span className="text-gray-500">Full HD</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSizePreset(1280, 720)}
                  className="px-3 py-2 text-xs border-2 border-green-200 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all"
                >
                  1280×720<br /><span className="text-gray-500">HD</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSizePreset(3840, 2160)}
                  className="px-3 py-2 text-xs border-2 border-green-200 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all"
                >
                  3840×2160<br /><span className="text-gray-500">4K</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSizePreset(1024, 768)}
                  className="px-3 py-2 text-xs border-2 border-green-200 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all"
                >
                  1024×768<br /><span className="text-gray-500">XGA</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSizePreset(800, 600)}
                  className="px-3 py-2 text-xs border-2 border-green-200 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all"
                >
                  800×600<br /><span className="text-gray-500">SVGA</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSizePreset(2550, 3300)}
                  className="px-3 py-2 text-xs border-2 border-green-200 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all"
                >
                  2550×3300<br /><span className="text-gray-500">8.5×11&quot; @300DPI</span>
                </button>
              </div>
            </div>

            {/* Visual Preview */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-xs md:text-sm font-semibold text-gray-700 mb-3">📏 Visual Preview:</div>
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center" style={{ minHeight: '150px' }}>
                <div
                  className="bg-gradient-to-br from-blue-400 to-purple-500 rounded shadow-lg transition-all duration-300"
                  style={{ width: `${visualPreview.width}px`, height: `${visualPreview.height}px` }}
                >
                  <div className="h-full flex items-center justify-center text-white text-xs font-mono">
                    <span>{visualPreview.dimensions}</span>
                  </div>
                </div>
              </div>
              <div className="text-center text-xs text-gray-500 mt-2">
                Scaled representation (not actual size)
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="space-y-6 md:space-y-8">
          {/* Main Result */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">📊 Results</h3>
              <button
                onClick={copyResults}
                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
              >
                📋 Copy
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-center mb-4">
              <div className="text-xs text-blue-100 mb-1">{results.resultLabel}</div>
              <div className="text-xl md:text-2xl font-bold text-white font-mono">{results.mainResult}</div>
            </div>

            {/* Calculation Steps */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="text-xs text-gray-600 mb-1">Calculation:</div>
              <div className="text-xs font-mono text-gray-900">{results.calculationSteps}</div>
            </div>

            {/* Alternative Units */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-700 mb-2">Other Units:</div>
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                <span className="text-xs text-gray-600">Centimeters:</span>
                <span className="text-xs font-mono font-semibold text-gray-900">{results.centimeters}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                <span className="text-xs text-gray-600">Millimeters:</span>
                <span className="text-xs font-mono font-semibold text-gray-900">{results.millimeters}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                <span className="text-xs text-gray-600">Points (typography):</span>
                <span className="text-xs font-mono font-semibold text-gray-900">{results.points}</span>
              </div>
            </div>
          </div>

          {/* Image Physical Size */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h4 className="text-base md:text-lg font-bold text-gray-900 mb-3">🖼️ Physical Size</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded border-l-4 border-green-500">
                <span className="text-xs text-green-700">Width:</span>
                <span className="text-xs font-mono font-semibold text-green-700">{results.physicalWidth}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded border-l-4 border-green-500">
                <span className="text-xs text-green-700">Height:</span>
                <span className="text-xs font-mono font-semibold text-green-700">{results.physicalHeight}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded border-l-4 border-blue-500">
                <span className="text-xs text-blue-700">Diagonal:</span>
                <span className="text-xs font-mono font-semibold text-blue-700">{results.physicalDiagonal}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-purple-50 rounded border-l-4 border-purple-500">
                <span className="text-xs text-purple-700">Aspect Ratio:</span>
                <span className="text-xs font-bold text-purple-700">{results.aspectRatio}</span>
              </div>
            </div>
          </div>

          {/* DPI Information */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h4 className="text-base md:text-lg font-bold text-gray-900 mb-3">ℹ️ DPI Info</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                <span className="text-xs text-gray-600">Current DPI:</span>
                <span className="text-xs font-bold text-gray-900">{results.currentDPI}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-orange-50 rounded">
                <span className="text-xs text-orange-700">Quality Level:</span>
                <span className="text-xs font-bold text-orange-700">{results.qualityLevel}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-indigo-50 rounded">
                <span className="text-xs text-indigo-700">Best Use:</span>
                <span className="text-xs font-bold text-indigo-700">{results.bestUse}</span>
              </div>
            </div>
          </div>

          {/* Print Size Guide */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg p-4">
            <h4 className="text-sm font-bold text-amber-900 mb-3">🖨️ Print Sizes</h4>
            <div className="space-y-1 text-xs">
              {results.printSizes.map((size) => (
                <div key={size.dpi} className="flex justify-between py-1">
                  <span className="text-gray-600">{size.dpi} DPI:</span>
                  <span className="font-semibold">{size.width}&quot; × {size.height}&quot;</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2">🌐 Web Standards</h3>
          <ul className="space-y-1 text-xs text-gray-700">
            <li><strong>72 DPI:</strong> Standard web</li>
            <li><strong>96 DPI:</strong> Windows default</li>
            <li><strong>144 DPI:</strong> Retina displays</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2">🖨️ Print Standards</h3>
          <ul className="space-y-1 text-xs text-gray-700">
            <li><strong>150 DPI:</strong> Standard print</li>
            <li><strong>300 DPI:</strong> High quality</li>
            <li><strong>600 DPI:</strong> Professional</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2">📐 Quick Guide</h3>
          <ul className="space-y-1 text-xs text-gray-700">
            <li>• Higher DPI = Better quality</li>
            <li>• Lower DPI = Larger size</li>
            <li>• Print needs higher DPI</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2">💡 Tips</h3>
          <ul className="space-y-1 text-xs text-gray-700">
            <li>• Use 300 DPI for photos</li>
            <li>• Use 72-96 DPI for web</li>
            <li>• Match DPI to output</li>
          </ul>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="pixels-to-inches-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
