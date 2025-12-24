'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface MinecraftCircleCalculatorClientProps {
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
    question: "What is a Minecraft Circle Calculator?",
    answer: "A Minecraft Circle Calculator is a free online tool designed to help you quickly and accurately calculate minecraft circle-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Minecraft Circle Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Minecraft Circle Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Minecraft Circle Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function MinecraftCircleCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: MinecraftCircleCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('minecraft-circle-calculator');

  const [diameter, setDiameter] = useState(15);
  const [circleType, setCircleType] = useState('filled');
  const [thickness, setThickness] = useState(1);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showCenter, setShowCenter] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(1.0);

  const [totalBlocks, setTotalBlocks] = useState(177);
  const [diameterDisplay, setDiameterDisplay] = useState('15 blocks');
  const [radiusDisplay, setRadiusDisplay] = useState('7.5 blocks');
  const [areaDisplay, setAreaDisplay] = useState('177 blocks²');
  const [circumferenceDisplay, setCircumferenceDisplay] = useState('47 blocks');
  const [buildTime, setBuildTime] = useState('~9 minutes');
  const [stacksNeeded, setStacksNeeded] = useState('2 stacks + 49');
  const [circleGridHTML, setCircleGridHTML] = useState('');

  const gridContainerRef = useRef<HTMLDivElement>(null);
  const initialDistanceRef = useRef(0);
  const initialZoomRef = useRef(1.0);

  const adjustZoom = (delta: number) => {
    setCurrentZoom(prev => Math.max(0.5, Math.min(3.0, prev + delta)));
  };

  const resetZoom = () => {
    setCurrentZoom(1.0);
  };

  const setDiameterValue = (size: number) => {
    setDiameter(size);
  };

  const generateCircle = () => {
    const radius = diameter / 2;
    const center = Math.floor(diameter / 2);

    // Create grid
    let grid: boolean[][] = [];
    let totalBlocksCount = 0;
    let circumferenceBlocks = 0;

    for (let y = 0; y < diameter; y++) {
      grid[y] = [];
      for (let x = 0; x < diameter; x++) {
        const dx = x - center;
        const dy = y - center;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let shouldPlace = false;

        if (circleType === 'filled') {
          shouldPlace = distance <= radius;
        } else if (circleType === 'outline') {
          shouldPlace = Math.abs(distance - radius) <= 0.5;
        } else if (circleType === 'hollow') {
          const innerRadius = radius - thickness;
          shouldPlace = distance <= radius && distance > innerRadius;
        }

        grid[y][x] = shouldPlace;
        if (shouldPlace) {
          totalBlocksCount++;
          if (Math.abs(distance - radius) <= 0.5) {
            circumferenceBlocks++;
          }
        }
      }
    }

    // Generate visual grid with better mobile visibility
    let html = '<div style="display: inline-block;">';

    for (let y = 0; y < diameter; y++) {
      html += '<div style="white-space: nowrap; line-height: 1.15;">';
      for (let x = 0; x < diameter; x++) {
        const isCenter = (x === center && y === center && diameter % 2 === 1) ||
                        (x >= center && x < center + 1 && y >= center && y < center + 1 && diameter % 2 === 0);

        let char = '□';
        let color = '#d1d5db';
        let fontWeight = 'normal';

        if (grid[y][x]) {
          char = '■';
          color = '#3b82f6';
          fontWeight = 'bold';
        }

        if (showCenter && isCenter) {
          char = '+';
          color = '#ef4444';
          fontWeight = 'bold';
        }

        const coordinate = showCoordinates ? ` title="(${x - center}, ${y - center})"` : '';
        html += `<span style="color: ${color}; font-weight: ${fontWeight}; display: inline-block; width: 1.1em; text-align: center;"${coordinate}>${char}</span>`;
      }
      html += '</div>';
    }
    html += '</div>';

    setCircleGridHTML(html);

    // Update stats
    const actualRadius = radius;
    const area = circleType === 'filled' ? totalBlocksCount : Math.PI * Math.pow(actualRadius, 2);
    const circumference = 2 * Math.PI * actualRadius;
    const buildTimeMinutes = Math.ceil(totalBlocksCount / 20); // ~20 blocks per minute
    const stacks = Math.floor(totalBlocksCount / 64);
    const remainingBlocks = totalBlocksCount % 64;

    setTotalBlocks(totalBlocksCount);
    setDiameterDisplay(diameter + ' blocks');
    setRadiusDisplay(actualRadius.toFixed(1) + ' blocks');
    setAreaDisplay(Math.round(area) + ' blocks²');
    setCircumferenceDisplay(Math.round(circumference) + ' blocks');
    setBuildTime(`~${buildTimeMinutes} minutes`);

    if (stacks > 0) {
      setStacksNeeded(`${stacks} stacks + ${remainingBlocks}`);
    } else {
      setStacksNeeded(`${remainingBlocks}`);
    }
  };

  const exportPattern = () => {
    let text = `Minecraft Circle Pattern\n`;
    text += `Diameter: ${diameter} blocks\n`;
    text += `Type: ${circleType}\n`;
    text += `Total blocks needed: ${totalBlocks}\n\n`;
    text += `Legend: ■ = Place block, □ = Empty space, + = Center\n\n`;

    const lines = circleGridHTML.split('<br />');
    lines.forEach(line => {
      const cleanLine = line.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
      if (cleanLine.trim()) {
        text += cleanLine + '\n';
      }
    });

    // Create download
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minecraft-circle-${diameter}x${diameter}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyCoordinates = () => {
    const center = Math.floor(diameter / 2);

    let coordinates: string[] = [];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = circleGridHTML;
    const spans = tempDiv.querySelectorAll('span');
    let x = 0, y = 0;

    spans.forEach(span => {
      if (span.textContent === '■') {
        coordinates.push(`(${x - center}, ${y - center})`);
      }
      x++;
      if (x >= diameter) {
        x = 0;
        y++;
      }
    });

    const coordText = `Block coordinates for ${diameter}x${diameter} circle:\n` + coordinates.join(', ');

    navigator.clipboard.writeText(coordText).then(() => {
      alert('Coordinates copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      initialDistanceRef.current = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      initialZoomRef.current = currentZoom;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      const scale = currentDistance / initialDistanceRef.current;
      setCurrentZoom(Math.max(0.5, Math.min(3.0, initialZoomRef.current * scale)));
    }
  };

  useEffect(() => {
    generateCircle();
  }, [diameter, circleType, thickness, showCoordinates, showGrid, showCenter]);

  useEffect(() => {
    const container = gridContainerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart as any, { passive: false });
      container.addEventListener('touchmove', handleTouchMove as any, { passive: false });

      return () => {
        container.removeEventListener('touchstart', handleTouchStart as any);
        container.removeEventListener('touchmove', handleTouchMove as any);
      };
    }
  }, [currentZoom]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Minecraft Circle Generator')}</h1>
        <p className="text-base md:text-lg text-gray-600">Generate perfect pixel circles and spheres for your Minecraft builds</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Input Section */}
          <div className="space-y-4 sm:space-y-4 md:space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Circle Settings</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Circle Type</label>
              <select
                id="circleType"
                value={circleType}
                onChange={(e) => setCircleType(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="filled">Filled Circle</option>
                <option value="hollow">Hollow Circle (Ring)</option>
                <option value="outline">Circle Outline Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Diameter (blocks)</label>
              <input
                type="number"
                id="diameter"
                min="3"
                max="100"
                value={diameter}
                onChange={(e) => setDiameter(parseInt(e.target.value) || 15)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 5-50 blocks for best results</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Wall Thickness (hollow circles)</label>
              <input
                type="number"
                id="thickness"
                min="1"
                max="10"
                value={thickness}
                onChange={(e) => setThickness(parseInt(e.target.value) || 1)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Quick Size Presets */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Popular Sizes</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button onClick={() => setDiameterValue(7)} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm font-medium">7</button>
                <button onClick={() => setDiameterValue(11)} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm font-medium">11</button>
                <button onClick={() => setDiameterValue(15)} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm font-medium">15</button>
                <button onClick={() => setDiameterValue(21)} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm font-medium">21</button>
                <button onClick={() => setDiameterValue(31)} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm font-medium">31</button>
                <button onClick={() => setDiameterValue(41)} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm font-medium">41</button>
                <button onClick={() => setDiameterValue(51)} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm font-medium">51</button>
                <button onClick={() => setDiameterValue(61)} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm font-medium">61</button>
              </div>
            </div>

            {/* Display Options */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3">Display Options</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id="showCoordinates"
                    checked={showCoordinates}
                    onChange={(e) => setShowCoordinates(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-green-700 text-sm">Show coordinates</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id="showGrid"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-green-700 text-sm">Show grid lines</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id="showCenter"
                    checked={showCenter}
                    onChange={(e) => setShowCenter(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-green-700 text-sm">Show center point</span>
                </label>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Circle Stats</h3>

            <div className="space-y-4">
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600" id="totalBlocks">{totalBlocks}</div>
                <div className="text-green-700">Total Blocks</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Diameter:</span>
                  <span id="diameterDisplay" className="font-semibold">{diameterDisplay}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Radius:</span>
                  <span id="radiusDisplay" className="font-semibold">{radiusDisplay}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Area:</span>
                  <span id="areaDisplay" className="font-semibold">{areaDisplay}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Circumference:</span>
                  <span id="circumferenceDisplay" className="font-semibold">{circumferenceDisplay}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Build time:</span>
                  <span id="buildTime" className="font-semibold">{buildTime}</span>
                </div>
              </div>

              {/* Material Calculator */}
              <div className="bg-yellow-100 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Material Needed</h4>
                <div className="text-yellow-700 text-sm">
                  <p><span id="stacksNeeded" className="font-semibold">{stacksNeeded}</span> blocks</p>
                  <p className="text-xs mt-1">Based on 64 blocks per stack</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Circle Visualization */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-3 sm:mb-4 md:mb-6">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Circle Preview</h3>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button onClick={exportPattern} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base font-medium whitespace-nowrap">Export Pattern</button>
            <button onClick={copyCoordinates} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base font-medium whitespace-nowrap">Copy Coordinates</button>
          </div>
        </div>

        {/* Zoom Controls for Mobile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3 bg-gray-50 p-3 rounded-lg">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Grid Scale:</span>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={() => adjustZoom(-0.1)} className="flex-1 sm:flex-none px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-bold text-lg active:bg-gray-400 transition-colors">-</button>
            <span id="zoomLevel" className="flex-1 sm:flex-none px-3 py-2 bg-white border-2 border-gray-300 rounded text-sm font-bold min-w-[70px] text-center">{Math.round(currentZoom * 100)}%</span>
            <button onClick={() => adjustZoom(0.1)} className="flex-1 sm:flex-none px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-bold text-lg active:bg-gray-400 transition-colors">+</button>
            <button onClick={resetZoom} className="flex-1 sm:flex-none px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 text-sm font-medium transition-colors">Reset</button>
          </div>
        </div>

        <div className="overflow-auto max-h-[400px] sm:max-h-[500px] border-2 border-gray-300 rounded-lg bg-gray-100 touch-pan-x touch-pan-y" style={{scrollbarWidth: 'thin'}}>
          <div
            id="circleGridContainer"
            ref={gridContainerRef}
            style={{
              transformOrigin: 'top left',
              transition: 'transform 0.2s ease',
              transform: `scale(${currentZoom})`
            }}
          >
            <div
              id="circleGrid"
              className="inline-block p-3 sm:p-4 font-mono leading-tight"
              style={{fontSize: `${12 * currentZoom}px`, lineHeight: '1.1'}}
              dangerouslySetInnerHTML={{__html: circleGridHTML}}
            />
          </div>
        </div>

        <div className="mt-4 text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 rounded space-y-1">
          <p><strong>Legend:</strong> <span className="text-blue-600 font-bold">■</span> = Block to place, <span className="text-gray-400">□</span> = Empty space, <span className="text-red-500 font-bold">+</span> = Center point</p>
          <p className="text-xs text-gray-500">💡 Use zoom buttons above or scroll to navigate the grid</p>
        </div>
      </div>

      {/* Layer-by-Layer Instructions */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Building Instructions</h3>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-blue-800 mb-3 sm:mb-4 text-base sm:text-lg">Step-by-Step Guide</h4>
            <ol className="text-blue-700 space-y-2 text-sm">
              <li>1. <strong>Find your center:</strong> Place a temporary block at your chosen center point</li>
              <li>2. <strong>Mark the axes:</strong> Count blocks horizontally and vertically from center</li>
              <li>3. <strong>Place corner blocks:</strong> Start with the outermost blocks in each direction</li>
              <li>4. <strong>Fill in layers:</strong> Work from outside to inside (hollow) or inside to outside (filled)</li>
              <li>5. <strong>Check symmetry:</strong> Ensure your circle looks even from all angles</li>
              <li>6. <strong>Remove markers:</strong> Clean up any temporary guide blocks</li>
            </ol>
          </div>

          <div className="bg-green-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-green-800 mb-3 sm:mb-4 text-base sm:text-lg">Pro Tips</h4>
            <ul className="text-green-700 space-y-2 text-sm">
              <li>• Use odd diameters for perfect symmetry</li>
              <li>• Start with smaller circles to practice</li>
              <li>• Use WorldEdit for large circles (//cyl command)</li>
              <li>• Place blocks on the ground first, then build up</li>
              <li>• Use different materials to test the pattern</li>
              <li>• Double-check your measurements before starting</li>
            </ul>
          </div>
        </div>
      </div>
{/* Common Circle Sizes */}
      <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-lg md:text-xl font-semibold text-yellow-800 mb-4">Popular Minecraft Circle Sizes</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2 text-yellow-800">Small Builds (5-15 blocks)</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Diameter 7: Well, small room (38 blocks)</li>
              <li>• Diameter 11: Tower base (95 blocks)</li>
              <li>• Diameter 15: House foundation (177 blocks)</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2 text-yellow-800">Medium Builds (17-35 blocks)</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Diameter 21: Castle courtyard (347 blocks)</li>
              <li>• Diameter 25: Large tower (491 blocks)</li>
              <li>• Diameter 31: Town square (755 blocks)</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2 text-yellow-800">Large Builds (40+ blocks)</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Diameter 41: Arena (1,321 blocks)</li>
              <li>• Diameter 51: City center (2,041 blocks)</li>
              <li>• Diameter 61: Massive dome (2,921 blocks)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
        <h3 className="text-lg md:text-xl font-semibold text-blue-800 mb-4">About Minecraft Circles</h3>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-4 md:gap-6 text-blue-700">
          <div>
            <h4 className="font-semibold mb-2">Circle Types:</h4>
            <ul className="space-y-2">
              <li>• <strong>Filled:</strong> Solid circle with all interior blocks</li>
              <li>• <strong>Hollow:</strong> Ring shape with empty center</li>
              <li>• <strong>Outline:</strong> Just the perimeter blocks</li>
              <li>• <strong>Thick walls:</strong> Hollow with multiple block thickness</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Building Tips:</h4>
            <ul className="space-y-2">
              <li>• Odd diameters create perfect center blocks</li>
              <li>• Even diameters have a 2x2 center area</li>
              <li>• Use coordinates to stay accurate</li>
              <li>• Consider your build height (spheres vs circles)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="minecraft-circle-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
{/* Related Calculators */}
      {relatedCalculators && relatedCalculators.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Math Calculators</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedCalculators.map((calc, index) => (
              <Link
                key={index}
                href={calc.href}
                className={`${calc.color} rounded-lg p-6 text-white hover:opacity-90 transition-opacity`}
              >
                <h4 className="font-semibold text-lg mb-2">{calc.title}</h4>
                <p className="text-sm opacity-90">{calc.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
