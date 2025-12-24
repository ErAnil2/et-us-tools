'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import AdBanner from '@/components/AdBanner';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'How do I pick a color from an image?',
    answer: 'Click the "Upload Image" button and select any image from your device. Then click anywhere on the image to extract the color at that point. The color values will automatically update.',
    order: 1
  },
  {
    id: '2',
    question: 'What color formats are supported?',
    answer: 'Our color picker supports HEX, RGB, HSL, and CMYK formats. All conversions happen automatically when you select a color, and you can copy any format with one click.',
    order: 2
  },
  {
    id: '3',
    question: 'How do I generate a color palette?',
    answer: 'Select a base color and use the Generate button to create a harmonious palette. You can also use Color Harmony options (complementary, triadic, analogous) or Color Shades (lighter, darker, monochrome).',
    order: 3
  },
  {
    id: '4',
    question: 'Can I copy the color codes?',
    answer: 'Yes! Click the copy button next to any color format (HEX, RGB, HSL, CMYK) to copy it to your clipboard. You can also copy the entire palette at once.',
    order: 4
  },
  {
    id: '5',
    question: 'What is a complementary color?',
    answer: 'Complementary colors are opposite each other on the color wheel. They create high contrast and vibrant combinations. Our tool generates complementary, triadic, and analogous color schemes.',
    order: 5
  },
  {
    id: '6',
    question: 'How accurate are the color conversions?',
    answer: 'Our color conversions are mathematically precise. RGB, HEX, HSL, and CMYK values are calculated using standard color space conversion formulas.',
    order: 6
  }
];

export default function ColorPickerClient() {
  const [currentColor, setCurrentColor] = useState('#3B82F6');
  const [hexValue, setHexValue] = useState('#3B82F6');
  const [rgbValue, setRgbValue] = useState('rgb(59, 130, 246)');
  const [hslValue, setHslValue] = useState('hsl(217, 91%, 60%)');
  const [cmykValue, setCmykValue] = useState('76, 47, 0, 4');
  const [paletteColors, setPaletteColors] = useState<string[]>([]);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);

  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('color-picker');

  const webAppSchema = generateWebAppSchema(
    'Color Picker - Free Online Color Tool & Palette Generator',
    'Free online color picker with HEX, RGB, HSL, CMYK conversion. Generate color palettes, extract colors from images, and create harmonious color schemes.',
    'https://economictimes.indiatimes.com/us/tools/apps/color-picker',
    'DesignApplication'
  );

  // Color conversion utilities
  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }, []);

  const rgbToHex = useCallback((r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }, []);

  const rgbToHsl = useCallback((r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number, s: number, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }, []);

  const hslToHex = useCallback((h: number, s: number, l: number) => {
    h = h % 360;
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return rgbToHex(r, g, b);
  }, [rgbToHex]);

  const rgbToCmyk = useCallback((r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, Math.max(g, b));
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  }, []);

  const adjustColor = useCallback((hex: string, degrees: number) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const newHue = (hsl.h + degrees + 360) % 360;
    return hslToHex(newHue, hsl.s, hsl.l);
  }, [hexToRgb, rgbToHsl, hslToHex]);

  const updateColorValues = useCallback((color: string) => {
    const rgb = hexToRgb(color);
    if (!rgb) return;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    setHexValue(color);
    setRgbValue(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
    setHslValue(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
    setCmykValue(`${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}`);
  }, [hexToRgb, rgbToHsl, rgbToCmyk]);

  const generatePalette = useCallback((baseColor: string) => {
    const colors = [
      baseColor,
      adjustColor(baseColor, 30),
      adjustColor(baseColor, -30),
      adjustColor(baseColor, 60),
      adjustColor(baseColor, -60)
    ];
    setPaletteColors(colors);
  }, [adjustColor]);

  useEffect(() => {
    updateColorValues(currentColor);
    generatePalette(currentColor);
  }, [currentColor, updateColorValues, generatePalette]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentColor(e.target.value);
  };

  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const newColor = rgbToHex(r, g, b);
    setCurrentColor(newColor);
  };

  const copyValue = async (value: string, format: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setupImageCanvas(img);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const setupImageCanvas = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setImageUploaded(true);

    const maxWidth = 400;
    const maxHeight = 300;
    let width = img.width;
    let height = img.height;

    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;

    const newColor = rgbToHex(r, g, b);
    setCurrentColor(newColor);
  };

  const generateHarmony = (type: 'complementary' | 'triadic' | 'analogous') => {
    const rgb = hexToRgb(currentColor);
    if (!rgb) return;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    let colors: string[] = [];

    switch (type) {
      case 'complementary':
        colors = [
          currentColor,
          hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)
        ];
        break;
      case 'triadic':
        colors = [
          currentColor,
          hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
        ];
        break;
      case 'analogous':
        colors = [
          hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
          currentColor,
          hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l)
        ];
        break;
    }

    setPaletteColors(colors);
  };

  const generateShades = (type: 'lighter' | 'darker' | 'monochrome') => {
    const rgb = hexToRgb(currentColor);
    if (!rgb) return;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    let colors: string[] = [];

    switch (type) {
      case 'lighter':
        colors = Array.from({ length: 5 }, (_, i) =>
          hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + (i * 15)))
        );
        break;
      case 'darker':
        colors = Array.from({ length: 5 }, (_, i) =>
          hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - (i * 15)))
        );
        break;
      case 'monochrome':
        colors = Array.from({ length: 5 }, (_, i) =>
          hslToHex(hsl.h, Math.max(0, hsl.s - (i * 20)), hsl.l)
        );
        break;
    }

    setPaletteColors(colors);
  };

  const relatedTools = [
    { name: 'Color Palette', path: '/us/tools/apps/color-palette', icon: '🎨', color: 'bg-pink-100' },
    { name: 'Image Resizer', path: '/us/tools/apps/image-resizer', icon: '🖼️', color: 'bg-teal-100' },
    { name: 'Base64 Encoder', path: '/us/tools/apps/base64-encoder', icon: '🔐', color: 'bg-blue-100' },
    { name: 'Hash Generator', path: '/us/tools/apps/hash-generator', icon: '#️⃣', color: 'bg-indigo-100' },
  ];

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full mb-3 shadow-md">
            <span className="text-xl">🎨</span>
            <span className="text-white font-semibold text-sm">Color Picker</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {getH1('Color Picker & Palette Generator')}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {getSubHeading('Pick colors, generate palettes, and convert between HEX, RGB, HSL, and CMYK formats.')}
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Layout: Tool + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Tool Area */}
          <div className="flex-1 min-w-0">
            {/* Mobile Stats Bar */}
            <div className="grid grid-cols-4 gap-2 mb-4 lg:hidden">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] sm:text-xs font-medium opacity-90">HEX</div>
                <div className="text-xs sm:text-sm font-bold truncate">{hexValue}</div>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] sm:text-xs font-medium opacity-90">RGB</div>
                <div className="text-xs sm:text-sm font-bold truncate">R{hexToRgb(currentColor)?.r || 0}</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] sm:text-xs font-medium opacity-90">Palette</div>
                <div className="text-xs sm:text-sm font-bold">{paletteColors.length}</div>
              </div>
              <div className="bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] sm:text-xs font-medium opacity-90">Formats</div>
                <div className="text-xs sm:text-sm font-bold">4</div>
              </div>
            </div>

            {/* Color Picker Container */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-4 sm:p-6 border border-purple-100">
              {/* Color Display & Picker Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Color Display */}
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">🎯</span> Current Color
                  </h3>
                  <div
                    className="w-full aspect-square max-w-[200px] mx-auto rounded-2xl shadow-lg border-4 border-white cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: currentColor }}
                    onClick={() => document.getElementById('colorPicker')?.click()}
                  />
                  <div className="mt-4 space-y-3">
                    <input
                      type="color"
                      id="colorPicker"
                      value={currentColor}
                      onChange={handleColorChange}
                      className="w-full h-12 rounded-xl border-2 border-gray-200 cursor-pointer"
                    />
                    <button
                      onClick={generateRandomColor}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Random Color
                      </span>
                    </button>
                  </div>
                </div>

                {/* Image Color Picker */}
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">🖼️</span> Pick from Image
                  </h3>
                  <input
                    type="file"
                    ref={imageUploadRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-purple-200 rounded-xl p-4 min-h-[200px] flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                    {!imageUploaded ? (
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
                          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <button
                          onClick={() => imageUploadRef.current?.click()}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all"
                        >
                          Upload Image
                        </button>
                        <p className="text-xs text-gray-500 mt-2">Click on image to extract colors</p>
                      </div>
                    ) : (
                      <canvas
                        ref={canvasRef}
                        onClick={handleCanvasClick}
                        className="max-w-full rounded-lg cursor-crosshair border-2 border-white shadow-md"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Color Format Outputs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'HEX', value: hexValue, color: 'blue' },
                  { label: 'RGB', value: rgbValue, color: 'green' },
                  { label: 'HSL', value: hslValue, color: 'purple' },
                  { label: 'CMYK', value: cmykValue, color: 'orange' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white rounded-xl p-3 shadow-md">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full bg-${color}-500`}></span>
                      <span className="font-bold text-gray-800 text-sm">{label}</span>
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        value={value}
                        readOnly
                        className="flex-1 min-w-0 px-2 py-2 text-xs font-mono bg-gray-50 border border-gray-200 rounded-l-lg truncate"
                      />
                      <button
                        onClick={() => copyValue(value, label)}
                        className={`px-3 py-2 bg-${color}-500 hover:bg-${color}-600 text-white rounded-r-lg transition-colors flex-shrink-0`}
                      >
                        {copiedFormat === label ? '✓' : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Generated Palette */}
              <div className="bg-white/60 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-lg">🎨</span> Generated Palette
                  </h3>
                  <button
                    onClick={() => generatePalette(currentColor)}
                    className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                  >
                    Regenerate
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {paletteColors.map((color, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setCurrentColor(color);
                        copyValue(color, `palette-${index}`);
                      }}
                      className="cursor-pointer group"
                    >
                      <div
                        className="aspect-square rounded-xl shadow-md border-2 border-white group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                      <div className="text-[10px] font-mono text-center mt-1 text-gray-600 group-hover:text-purple-600">
                        {color}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Harmony Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/60 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 text-sm">Color Harmony</h4>
                  <div className="space-y-2">
                    {[
                      { type: 'complementary' as const, label: 'Complementary' },
                      { type: 'triadic' as const, label: 'Triadic' },
                      { type: 'analogous' as const, label: 'Analogous' },
                    ].map(({ type, label }) => (
                      <button
                        key={type}
                        onClick={() => generateHarmony(type)}
                        className="w-full px-3 py-2 bg-white hover:bg-purple-50 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200 hover:border-purple-300"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-white/60 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 text-sm">Color Shades</h4>
                  <div className="space-y-2">
                    {[
                      { type: 'lighter' as const, label: 'Lighter' },
                      { type: 'darker' as const, label: 'Darker' },
                      { type: 'monochrome' as const, label: 'Monochrome' },
                    ].map(({ type, label }) => (
                      <button
                        key={type}
                        onClick={() => generateShades(type)}
                        className="w-full px-3 py-2 bg-white hover:bg-pink-50 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200 hover:border-pink-300"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* How to Use */}
            <div className="mt-6 bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">📖</span> How to Use
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                {[
                  { num: 1, title: 'Pick a Color', desc: 'Use the color picker or upload an image' },
                  { num: 2, title: 'Copy Formats', desc: 'Click copy buttons for HEX, RGB, HSL, CMYK' },
                  { num: 3, title: 'Generate Palette', desc: 'Create harmonious color combinations' },
                  { num: 4, title: 'Use in Projects', desc: 'Paste codes into your design tools' },
                ].map(({ num, title, desc }) => (
                  <div key={num} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-bold">{num}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{title}</div>
                      <div className="text-gray-600">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
{/* Right Sidebar - 320px */}
          <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Desktop Stats */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Color Values</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                  <span className="text-gray-600 font-medium">HEX</span>
                  <span className="font-bold text-purple-600 font-mono">{hexValue}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl">
                  <span className="text-gray-600 font-medium">RGB</span>
                  <span className="font-bold text-pink-600 font-mono text-sm">{rgbValue}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">Palette</div>
                    <div className="text-xl font-bold text-gray-700">{paletteColors.length}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">Formats</div>
                    <div className="text-xl font-bold text-gray-700">4</div>
                  </div>
                </div>
              </div>
            </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

            {/* Color Preview */}
            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Preview</h3>
              <div
                className="w-full h-24 rounded-xl shadow-inner border-2 border-gray-200"
                style={{ backgroundColor: currentColor }}
              />
              <div className="mt-3 text-center">
                <span className="font-mono font-bold text-lg text-gray-800">{hexValue}</span>
              </div>
            </div>

            {/* Ad Banner */}
            {/* Ad banner replaced with MREC components */}
{/* Related Tools */}
            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Related Tools</h3>
              <div className="space-y-2">
                {relatedTools.map((tool) => (
                  <Link
                    key={tool.path}
                    href={tool.path}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-lg ${tool.color} flex items-center justify-center text-lg group-hover:scale-110 transition-transform`}>
                      {tool.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{tool.name}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/us/tools/apps" className="block mt-3 text-center text-sm text-purple-600 hover:text-purple-700 font-medium">
                View All Tools →
              </Link>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-4 text-white">
              <h3 className="text-lg font-bold mb-3">Quick Tips</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Click the color preview to open picker</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Upload images to extract colors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Use harmony options for schemes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Click palette colors to select them</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        

        {/* Mobile MREC2 - Before FAQs */}


        

        <GameAppMobileMrec2 />



        

        {/* FAQs Section */}
        <div className="mt-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
          <FirebaseFAQs pageId="color-picker" fallbackFaqs={fallbackFaqs} />
        </div>
      </div>
    </>
  );
}
