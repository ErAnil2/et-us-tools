'use client';

import { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Color Palette Calculator?",
    answer: "A Color Palette Calculator is a free online tool designed to help you quickly and accurately calculate color palette-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Color Palette Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Color Palette Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Color Palette Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function ColorPaletteCalculatorClient() {
  const [currentColor, setCurrentColor] = useState<RGB>({ r: 59, g: 130, b: 246 });
  const [harmonyType, setHarmonyType] = useState('complementary');
  const [currentPalette, setCurrentPalette] = useState<RGB[]>([]);

  // Color conversion functions
  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const hexToRgb = (hex: string): RGB | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number): HSL => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const hslToRgb = (h: number, s: number, l: number): RGB => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number): CMYK => {
    const c = 1 - (r / 255);
    const m = 1 - (g / 255);
    const y = 1 - (b / 255);
    const k = Math.min(c, m, y);

    return {
      c: Math.round(((c - k) / (1 - k) || 0) * 100),
      m: Math.round(((m - k) / (1 - k) || 0) * 100),
      y: Math.round(((y - k) / (1 - k) || 0) * 100),
      k: Math.round(k * 100)
    };
  };

  const calculateLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const calculateContrastRatio = (rgb1: RGB, rgb2: RGB): number => {
    const l1 = calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = calculateLuminance(rgb2.r, rgb2.g, rgb2.b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  const generatePalette = (color: RGB, harmony: string): RGB[] => {
    const hsl = rgbToHsl(color.r, color.g, color.b);
    let colors: RGB[] = [];

    switch (harmony) {
      case 'complementary':
        colors = [
          color,
          hslToRgb((hsl.h + 180) % 360, hsl.s, hsl.l)
        ];
        break;
      case 'triadic':
        colors = [
          color,
          hslToRgb((hsl.h + 120) % 360, hsl.s, hsl.l),
          hslToRgb((hsl.h + 240) % 360, hsl.s, hsl.l)
        ];
        break;
      case 'analogous':
        colors = [
          hslToRgb((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
          color,
          hslToRgb((hsl.h + 30) % 360, hsl.s, hsl.l)
        ];
        break;
      case 'tetradic':
        colors = [
          color,
          hslToRgb((hsl.h + 90) % 360, hsl.s, hsl.l),
          hslToRgb((hsl.h + 180) % 360, hsl.s, hsl.l),
          hslToRgb((hsl.h + 270) % 360, hsl.s, hsl.l)
        ];
        break;
      case 'monochromatic':
        colors = [
          hslToRgb(hsl.h, hsl.s, Math.max(10, hsl.l - 40)),
          hslToRgb(hsl.h, hsl.s, Math.max(10, hsl.l - 20)),
          color,
          hslToRgb(hsl.h, hsl.s, Math.min(90, hsl.l + 20)),
          hslToRgb(hsl.h, hsl.s, Math.min(90, hsl.l + 40))
        ];
        break;
      case 'split-complementary':
        colors = [
          color,
          hslToRgb((hsl.h + 150) % 360, hsl.s, hsl.l),
          hslToRgb((hsl.h + 210) % 360, hsl.s, hsl.l)
        ];
        break;
    }

    return colors;
  };

  useEffect(() => {
    setCurrentPalette(generatePalette(currentColor, harmonyType));
  }, [currentColor, harmonyType]);

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rgb = hexToRgb(e.target.value);
    if (rgb) setCurrentColor(rgb);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rgb = hexToRgb(e.target.value);
    if (rgb) setCurrentColor(rgb);
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: string) => {
    const numValue = Math.max(0, Math.min(255, parseInt(value) || 0));
    setCurrentColor(prev => ({ ...prev, [channel]: numValue }));
  };

  const handleHslChange = (h: string, s: string, l: string) => {
    const hVal = Math.max(0, Math.min(360, parseInt(h) || 0));
    const sVal = Math.max(0, Math.min(100, parseInt(s) || 0));
    const lVal = Math.max(0, Math.min(100, parseInt(l) || 0));
    setCurrentColor(hslToRgb(hVal, sVal, lVal));
  };

  const setPresetColor = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (rgb) setCurrentColor(rgb);
  };

  const exportPalette = (format: 'css' | 'scss' | 'json') => {
    let output = '';

    switch (format) {
      case 'css':
        output = ':root {\n';
        currentPalette.forEach((color, index) => {
          const hex = rgbToHex(color.r, color.g, color.b);
          output += `  --color-${index + 1}: ${hex};\n`;
        });
        output += '}';
        break;
      case 'scss':
        currentPalette.forEach((color, index) => {
          const hex = rgbToHex(color.r, color.g, color.b);
          output += `$color-${index + 1}: ${hex};\n`;
        });
        break;
      case 'json':
        const colorObj: any = {};
        currentPalette.forEach((color, index) => {
          colorObj[`color${index + 1}`] = rgbToHex(color.r, color.g, color.b);
        });
        output = JSON.stringify(colorObj, null, 2);
        break;
    }

    navigator.clipboard.writeText(output).then(() => {
      alert(`${format.toUpperCase()} palette copied to clipboard!`);
    });
  };

  const copyPalette = () => {
    const hexColors = currentPalette.map(color =>
      rgbToHex(color.r, color.g, color.b)
    ).join(', ');

    navigator.clipboard.writeText(hexColors).then(() => {
      alert('HEX colors copied to clipboard!');
    });
  };

  // Derived values
  const hex = rgbToHex(currentColor.r, currentColor.g, currentColor.b);
  const hsl = rgbToHsl(currentColor.r, currentColor.g, currentColor.b);
  const cmyk = rgbToCmyk(currentColor.r, currentColor.g, currentColor.b);
  const brightness = (currentColor.r * 299 + currentColor.g * 587 + currentColor.b * 114) / 1000;
  const temperature = (currentColor.r - currentColor.b) > 0 ? 'Warm' : 'Cool';
  const whiteRatio = calculateContrastRatio(currentColor, { r: 255, g: 255, b: 255 });
  const blackRatio = calculateContrastRatio(currentColor, { r: 0, g: 0, b: 0 });

  const contrastExamples = [
    { bg: currentColor, text: { r: 255, g: 255, b: 255 }, label: 'White Text' },
    { bg: currentColor, text: { r: 0, g: 0, b: 0 }, label: 'Black Text' },
    { bg: { r: 255, g: 255, b: 255 }, text: currentColor, label: 'Color on White' },
    { bg: { r: 0, g: 0, b: 0 }, text: currentColor, label: 'Color on Black' }
  ];

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">Color Palette Calculator</h1>
        <p className="text-lg text-gray-600">Generate harmonious color schemes and convert between color formats</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Color Input Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Controls */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Base Color Input</h2>

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Base Color</label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={hex}
                  onChange={handleColorPickerChange}
                  className="w-16 h-16 border border-gray-300 rounded-lg cursor-pointer"
                />
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={hex}
                    onChange={handleHexInputChange}
                    placeholder="#3b82f6"
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-xs text-gray-500">Enter HEX, RGB, or HSL values</div>
                </div>
              </div>
            </div>

            {/* RGB Inputs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">RGB Values</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Red (0-255)</label>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={currentColor.r}
                    onChange={(e) => handleRgbChange('r', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Green (0-255)</label>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={currentColor.g}
                    onChange={(e) => handleRgbChange('g', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Blue (0-255)</label>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={currentColor.b}
                    onChange={(e) => handleRgbChange('b', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* HSL Inputs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">HSL Values</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Hue (0-360)</label>
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={hsl.h}
                    onChange={(e) => handleHslChange(e.target.value, hsl.s.toString(), hsl.l.toString())}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Saturation (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={hsl.s}
                    onChange={(e) => handleHslChange(hsl.h.toString(), e.target.value, hsl.l.toString())}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Lightness (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={hsl.l}
                    onChange={(e) => handleHslChange(hsl.h.toString(), hsl.s.toString(), e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Harmony Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color Harmony Type</label>
              <select
                value={harmonyType}
                onChange={(e) => setHarmonyType(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="complementary">Complementary (2 colors)</option>
                <option value="triadic">Triadic (3 colors)</option>
                <option value="analogous">Analogous (3 colors)</option>
                <option value="tetradic">Tetradic (4 colors)</option>
                <option value="monochromatic">Monochromatic (5 shades)</option>
                <option value="split-complementary">Split Complementary (3 colors)</option>
              </select>
            </div>
          </div>

          {/* Color Information */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Color Information</h3>

            {/* Base Color Display */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <div
                className="w-full h-24 rounded-lg border-2 border-gray-200 mb-3"
                style={{ backgroundColor: hex }}
              ></div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">HEX:</span>
                  <span className="font-mono">{hex.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">RGB:</span>
                  <span className="font-mono">rgb({currentColor.r}, {currentColor.g}, {currentColor.b})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">HSL:</span>
                  <span className="font-mono">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CMYK:</span>
                  <span className="font-mono">cmyk({cmyk.c}%, {cmyk.m}%, {cmyk.y}%, {cmyk.k}%)</span>
                </div>
              </div>
            </div>

            {/* Color Properties */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Brightness:</span>
                <span className="font-medium">{brightness > 128 ? 'Light' : 'Dark'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Temperature:</span>
                <span className="font-medium">{temperature}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contrast Ratio:</span>
                <span className="font-medium">{whiteRatio.toFixed(1)}:1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Color Palette */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Generated Color Palette</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {currentPalette.map((color, index) => {
            const colorHex = rgbToHex(color.r, color.g, color.b);
            const isBase = index === 0 || (harmonyType === 'analogous' && index === 1) || (harmonyType === 'monochromatic' && index === 2);

            return (
              <div
                key={index}
                className={`color-swatch ${isBase ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setCurrentColor(color)}
              >
                <div
                  className="w-full h-24 rounded-lg cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: colorHex }}
                ></div>
                <div className="mt-2 text-center space-y-1">
                  <div className="text-xs font-mono text-gray-600">{colorHex.toUpperCase()}</div>
                  <div className="text-xs text-gray-500">rgb({color.r}, {color.g}, {color.b})</div>
                  {isBase && <div className="text-xs text-blue-600 font-medium">Base Color</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Export Options */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => exportPalette('css')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 md:px-6 py-2 rounded-lg transition-colors"
          >
            Export CSS
          </button>
          <button
            onClick={() => exportPalette('scss')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 md:px-6 py-2 rounded-lg transition-colors"
          >
            Export SCSS
          </button>
          <button
            onClick={() => exportPalette('json')}
            className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 md:px-6 py-2 rounded-lg transition-colors"
          >
            Export JSON
          </button>
          <button
            onClick={copyPalette}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 md:px-6 py-2 rounded-lg transition-colors"
          >
            Copy HEX Values
          </button>
        </div>
      </div>

      {/* Accessibility Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Accessibility & Contrast</h3>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Contrast Examples */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Text Contrast Examples</h4>
            <div className="space-y-3">
              {contrastExamples.map((example, index) => {
                const bgHex = rgbToHex(example.bg.r, example.bg.g, example.bg.b);
                const textHex = rgbToHex(example.text.r, example.text.g, example.text.b);
                const ratio = calculateContrastRatio(example.bg, example.text);
                const isAccessible = ratio >= 4.5;

                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className="px-2 py-2 rounded"
                      style={{ backgroundColor: bgHex, color: textHex }}
                    >
                      Sample Text
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">{example.label}</div>
                      <div className="text-gray-500">{ratio.toFixed(1)}:1 {isAccessible ? '✅' : '❌'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WCAG Guidelines */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4">WCAG Compliance</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>AA Normal Text (4.5:1):</span>
                  <span className="font-medium">{whiteRatio >= 4.5 ? '✅ Pass' : '❌ Fail'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>AA Large Text (3:1):</span>
                  <span className="font-medium">{whiteRatio >= 3 ? '✅ Pass' : '❌ Fail'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>AAA Normal Text (7:1):</span>
                  <span className="font-medium">{whiteRatio >= 7 ? '✅ Pass' : '❌ Fail'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>AAA Large Text (4.5:1):</span>
                  <span className="font-medium">{whiteRatio >= 4.5 ? '✅ Pass' : '❌ Fail'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Color Presets */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Popular Color Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button
            onClick={() => setPresetColor('#e11d48')}
            className="color-preset bg-rose-600 hover:bg-rose-700 text-white px-2 py-2 rounded-lg transition-colors text-sm"
          >
            Rose
          </button>
          <button
            onClick={() => setPresetColor('#f59e0b')}
            className="color-preset bg-amber-500 hover:bg-amber-600 text-white px-2 py-2 rounded-lg transition-colors text-sm"
          >
            Amber
          </button>
          <button
            onClick={() => setPresetColor('#10b981')}
            className="color-preset bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-2 rounded-lg transition-colors text-sm"
          >
            Emerald
          </button>
          <button
            onClick={() => setPresetColor('#3b82f6')}
            className="color-preset bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded-lg transition-colors text-sm"
          >
            Blue
          </button>
          <button
            onClick={() => setPresetColor('#8b5cf6')}
            className="color-preset bg-violet-500 hover:bg-violet-600 text-white px-2 py-2 rounded-lg transition-colors text-sm"
          >
            Violet
          </button>
          <button
            onClick={() => setPresetColor('#ec4899')}
            className="color-preset bg-pink-500 hover:bg-pink-600 text-white px-2 py-2 rounded-lg transition-colors text-sm"
          >
            Pink
          </button>
        </div>
      </div>

      {/* Color Theory Guide */}
      <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6">
        <h3 className="text-xl font-semibold text-green-800 mb-4">Color Harmony Guide</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 text-green-700">
          <div>
            <h4 className="font-semibold mb-2">Complementary</h4>
            <p className="text-sm">Colors opposite on the color wheel. Creates high contrast and vibrant combinations.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Triadic</h4>
            <p className="text-sm">Three colors evenly spaced on the color wheel. Offers strong contrast while maintaining balance.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Analogous</h4>
            <p className="text-sm">Adjacent colors on the wheel. Creates serene and comfortable designs with natural harmony.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Tetradic</h4>
            <p className="text-sm">Four colors arranged in two complementary pairs. Offers rich color variety with good balance.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Monochromatic</h4>
            <p className="text-sm">Different shades of the same color. Creates elegant, cohesive designs with subtle variations.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Split Complementary</h4>
            <p className="text-sm">Base color plus two colors adjacent to its complement. Less jarring than complementary.</p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="color-palette-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
