'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import AdBanner from '@/components/AdBanner';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'What types of color palettes can I generate?',
    answer: 'Our tool generates several palette types: Complementary (opposite colors), Analogous (adjacent colors), Triadic (evenly spaced), Split-Complementary, Tetradic (rectangular), and Monochromatic (shades of one color).',
    order: 1
  },
  {
    id: '2',
    question: 'How do I copy colors to use in my projects?',
    answer: 'Click on any color to copy its hex code to your clipboard. You can also view RGB and HSL values by hovering over the color. The hex codes work in CSS, design tools, and most graphics applications.',
    order: 2
  },
  {
    id: '3',
    question: 'What is color harmony?',
    answer: 'Color harmony refers to pleasing color combinations based on their positions on the color wheel. Harmonious palettes use mathematical relationships between hues to create visually balanced designs.',
    order: 3
  },
  {
    id: '4',
    question: 'Can I save my generated palettes?',
    answer: 'You can export your palette as CSS variables or copy individual colors. For permanent storage, we recommend copying the palette to a design tool or document as we do not store data on our servers.',
    order: 4
  },
  {
    id: '5',
    question: 'What is the difference between analogous and complementary?',
    answer: 'Analogous colors are neighbors on the color wheel (like red, orange, yellow) creating a harmonious feel. Complementary colors are opposites (like red and green) creating high contrast and visual impact.',
    order: 5
  },
  {
    id: '6',
    question: 'How do I choose a good base color?',
    answer: 'Start with your brand color, a color from an image you like, or simply pick one that fits your mood. The palette generator will create harmonious colors that work well together from any starting point.',
    order: 6
  }
];

type PaletteType = 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'tetradic' | 'monochromatic';

interface ColorInfo {
  hex: string;
  rgb: string;
  hsl: string;
  name: string;
}

export default function ColorPaletteClient() {
  const [baseColor, setBaseColor] = useState('#6366F1');
  const [paletteType, setPaletteType] = useState<PaletteType>('analogous');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('color-palette');

  const webAppSchema = generateWebAppSchema(
    'Color Palette Generator - Free Color Scheme Tool',
    'Generate beautiful color palettes from any base color. Create complementary, analogous, triadic, and more color schemes for web design and graphics.',
    'https://economictimes.indiatimes.com/us/tools/apps/color-palette',
    'DesignApplication'
  );

  // Convert hex to HSL
  const hexToHsl = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [0, 0, 0];

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  // Convert HSL to hex
  const hslToHex = (h: number, s: number, l: number): string => {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    const toHex = (n: number) => {
      const hex = Math.round((n + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  };

  // Convert hex to RGB
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return 'rgb(0, 0, 0)';
    return `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`;
  };

  // Generate palette based on type
  const palette = useMemo((): ColorInfo[] => {
    const [h, s, l] = hexToHsl(baseColor);
    let colors: { hex: string; name: string }[] = [];

    switch (paletteType) {
      case 'complementary':
        colors = [
          { hex: baseColor, name: 'Base' },
          { hex: hslToHex(h + 180, s, l), name: 'Complement' },
          { hex: hslToHex(h, s, Math.min(l + 20, 90)), name: 'Light Base' },
          { hex: hslToHex(h + 180, s, Math.min(l + 20, 90)), name: 'Light Complement' },
          { hex: hslToHex(h, s, Math.max(l - 20, 10)), name: 'Dark Base' },
        ];
        break;

      case 'analogous':
        colors = [
          { hex: hslToHex(h - 30, s, l), name: 'Analogous -30' },
          { hex: hslToHex(h - 15, s, l), name: 'Analogous -15' },
          { hex: baseColor, name: 'Base' },
          { hex: hslToHex(h + 15, s, l), name: 'Analogous +15' },
          { hex: hslToHex(h + 30, s, l), name: 'Analogous +30' },
        ];
        break;

      case 'triadic':
        colors = [
          { hex: baseColor, name: 'Base' },
          { hex: hslToHex(h + 120, s, l), name: 'Triadic +120' },
          { hex: hslToHex(h + 240, s, l), name: 'Triadic +240' },
          { hex: hslToHex(h, s, Math.min(l + 15, 90)), name: 'Light Base' },
          { hex: hslToHex(h, s, Math.max(l - 15, 10)), name: 'Dark Base' },
        ];
        break;

      case 'split-complementary':
        colors = [
          { hex: baseColor, name: 'Base' },
          { hex: hslToHex(h + 150, s, l), name: 'Split +150' },
          { hex: hslToHex(h + 210, s, l), name: 'Split +210' },
          { hex: hslToHex(h, s, Math.min(l + 20, 90)), name: 'Light Base' },
          { hex: hslToHex(h, s, Math.max(l - 20, 10)), name: 'Dark Base' },
        ];
        break;

      case 'tetradic':
        colors = [
          { hex: baseColor, name: 'Base' },
          { hex: hslToHex(h + 90, s, l), name: 'Tetradic +90' },
          { hex: hslToHex(h + 180, s, l), name: 'Tetradic +180' },
          { hex: hslToHex(h + 270, s, l), name: 'Tetradic +270' },
          { hex: hslToHex(h, s, Math.min(l + 20, 90)), name: 'Light Accent' },
        ];
        break;

      case 'monochromatic':
        colors = [
          { hex: hslToHex(h, s, 95), name: 'Lightest' },
          { hex: hslToHex(h, s, 75), name: 'Light' },
          { hex: baseColor, name: 'Base' },
          { hex: hslToHex(h, s, 35), name: 'Dark' },
          { hex: hslToHex(h, s, 15), name: 'Darkest' },
        ];
        break;
    }

    return colors.map(c => {
      const [ch, cs, cl] = hexToHsl(c.hex);
      return {
        hex: c.hex,
        rgb: hexToRgb(c.hex),
        hsl: `hsl(${ch}, ${cs}%, ${cl}%)`,
        name: c.name };
    });
  }, [baseColor, paletteType]);

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const exportAsCSS = () => {
    const css = `:root {\n${palette.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`;
    navigator.clipboard.writeText(css);
    setCopiedColor('css');
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const randomColor = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
    setBaseColor(randomHex);
  };

  const paletteTypes: { type: PaletteType; label: string; description: string }[] = [
    { type: 'analogous', label: 'Analogous', description: 'Adjacent colors' },
    { type: 'complementary', label: 'Complementary', description: 'Opposite colors' },
    { type: 'triadic', label: 'Triadic', description: 'Evenly spaced' },
    { type: 'split-complementary', label: 'Split-Comp', description: 'Split opposites' },
    { type: 'tetradic', label: 'Tetradic', description: 'Rectangle' },
    { type: 'monochromatic', label: 'Monochromatic', description: 'One hue' },
  ];

  // Determine if text should be light or dark based on background
  const getContrastColor = (hex: string): string => {
    const [, , l] = hexToHsl(hex);
    return l > 50 ? '#1F2937' : '#FFFFFF';
  };

  const relatedTools = [
    { name: 'Color Picker', path: '/us/tools/apps/color-picker', icon: '🎨', color: 'bg-purple-100' },
    { name: 'Image Resizer', path: '/us/tools/apps/image-resizer', icon: '🖼️', color: 'bg-teal-100' },
    { name: 'Gradient Generator', path: '/us/tools/apps/gradient-generator', icon: '🌈', color: 'bg-orange-100' },
    { name: 'Base64 Encoder', path: '/us/tools/apps/base64-encoder', icon: '🔐', color: 'bg-blue-100' },
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 rounded-full mb-3 shadow-md">
            <span className="text-xl">🎨</span>
            <span className="text-white font-semibold text-sm">Palette Generator</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {getH1('Color Palette Generator')}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {getSubHeading('Create beautiful, harmonious color schemes from any base color for web design and graphics.')}
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
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] sm:text-xs font-medium opacity-90">BASE</div>
                <div className="text-xs sm:text-sm font-bold truncate">{baseColor}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] sm:text-xs font-medium opacity-90">TYPE</div>
                <div className="text-xs sm:text-sm font-bold capitalize truncate">{paletteType.split('-')[0]}</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] sm:text-xs font-medium opacity-90">COLORS</div>
                <div className="text-xs sm:text-sm font-bold">{palette.length}</div>
              </div>
              <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] sm:text-xs font-medium opacity-90">SCHEMES</div>
                <div className="text-xs sm:text-sm font-bold">6</div>
              </div>
            </div>

            {/* Palette Generator Container */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg p-4 sm:p-6 border border-pink-100">
              {/* Color Picker & Type Selection */}
              <div className="bg-white rounded-xl p-4 shadow-md mb-6">
                <div className="flex flex-wrap gap-4 items-center justify-center mb-4">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Base Color:</label>
                    <div className="relative">
                      <input
                        type="color"
                        value={baseColor}
                        onChange={(e) => setBaseColor(e.target.value.toUpperCase())}
                        className="w-14 h-14 rounded-xl cursor-pointer border-2 border-gray-200 shadow-md"
                      />
                    </div>
                    <input
                      type="text"
                      value={baseColor}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                          setBaseColor(val.toUpperCase());
                        }
                      }}
                      className="w-24 px-3 py-2 font-mono text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      maxLength={7}
                    />
                  </div>
                  <button
                    onClick={randomColor}
                    className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Random
                    </span>
                  </button>
                </div>

                {/* Palette Type Selection */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {paletteTypes.map(({ type, label, description }) => (
                    <button
                      key={type}
                      onClick={() => setPaletteType(type)}
                      className={`p-2.5 rounded-xl text-center transition-all ${
                        paletteType === type
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="font-semibold text-sm">{label}</div>
                      <div className={`text-[10px] ${paletteType === type ? 'text-pink-100' : 'text-gray-500'}`}>
                        {description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generated Palette Display */}
              <div className="bg-white rounded-xl p-4 shadow-md mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-lg">🎨</span> Generated Palette
                  </h3>
                  <button
                    onClick={exportAsCSS}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                  >
                    {copiedColor === 'css' ? '✓ Copied!' : '📋 Export CSS'}
                  </button>
                </div>

                {/* Large palette display */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                  {palette.map((color, index) => (
                    <div
                      key={index}
                      onClick={() => copyColor(color.hex)}
                      className="group relative cursor-pointer overflow-hidden rounded-xl transition-all hover:scale-105 shadow-md"
                      style={{ backgroundColor: color.hex }}
                    >
                      <div className="h-24 sm:h-28 flex items-center justify-center">
                        <span
                          className="font-mono font-bold text-sm opacity-90"
                          style={{ color: getContrastColor(color.hex) }}
                        >
                          {copiedColor === color.hex ? '✓ Copied!' : color.hex}
                        </span>
                      </div>
                      <div
                        className="absolute bottom-0 left-0 right-0 p-2 bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: '#FFFFFF' }}
                      >
                        <div className="text-[10px] font-medium">{color.name}</div>
                        <div className="text-[10px] opacity-80">{color.rgb}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Color details */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 text-gray-600 text-xs">Color</th>
                        <th className="text-left py-2 px-2 text-gray-600 text-xs">Name</th>
                        <th className="text-left py-2 px-2 text-gray-600 text-xs">HEX</th>
                        <th className="text-left py-2 px-2 text-gray-600 text-xs hidden sm:table-cell">RGB</th>
                      </tr>
                    </thead>
                    <tbody>
                      {palette.map((color, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-2 px-2">
                            <div
                              className="w-6 h-6 rounded-lg border border-gray-200 shadow-sm"
                              style={{ backgroundColor: color.hex }}
                            />
                          </td>
                          <td className="py-2 px-2 text-gray-800 text-xs">{color.name}</td>
                          <td className="py-2 px-2">
                            <code
                              className="cursor-pointer hover:bg-pink-100 px-2 py-1 rounded text-xs font-mono"
                              onClick={() => copyColor(color.hex)}
                            >
                              {color.hex}
                            </code>
                          </td>
                          <td className="py-2 px-2 font-mono text-gray-600 text-xs hidden sm:table-cell">{color.rgb}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Color Harmony Info */}
            <div className="mt-6 bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">📖</span> Understanding Color Harmonies
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { title: 'Analogous', desc: 'Neighbors on the wheel. Harmonious, cohesive designs.', color: 'bg-pink-50 border-pink-200' },
                  { title: 'Complementary', desc: 'Opposites on the wheel. High contrast, vibrant.', color: 'bg-purple-50 border-purple-200' },
                  { title: 'Triadic', desc: 'Three evenly spaced. Balanced yet colorful.', color: 'bg-indigo-50 border-indigo-200' },
                  { title: 'Split-Comp', desc: 'Base + two adjacent to complement. More variety.', color: 'bg-violet-50 border-violet-200' },
                  { title: 'Tetradic', desc: 'Four colors in rectangle. Rich palettes.', color: 'bg-fuchsia-50 border-fuchsia-200' },
                  { title: 'Monochromatic', desc: 'One hue, varying lightness. Clean, professional.', color: 'bg-rose-50 border-rose-200' },
                ].map(({ title, desc, color }) => (
                  <div key={title} className={`rounded-lg p-3 border ${color}`}>
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">{title}</h4>
                    <p className="text-xs text-gray-600">{desc}</p>
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
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Palette Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl">
                  <span className="text-gray-600 font-medium">Base Color</span>
                  <span className="font-bold text-pink-600 font-mono">{baseColor}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                  <span className="text-gray-600 font-medium">Scheme</span>
                  <span className="font-bold text-purple-600 capitalize">{paletteType.split('-')[0]}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">Colors</div>
                    <div className="text-xl font-bold text-gray-700">{palette.length}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">Schemes</div>
                    <div className="text-xl font-bold text-gray-700">6</div>
                  </div>
                </div>
              </div>
            </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

            {/* Base Color Preview */}
            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Base Color</h3>
              <div
                className="w-full h-20 rounded-xl shadow-inner border-2 border-gray-200"
                style={{ backgroundColor: baseColor }}
              />
              <div className="mt-3 text-center">
                <span className="font-mono font-bold text-lg text-gray-800">{baseColor}</span>
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
              <Link href="/us/tools/apps" className="block mt-3 text-center text-sm text-pink-600 hover:text-pink-700 font-medium">
                View All Tools →
              </Link>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-lg p-4 text-white">
              <h3 className="text-lg font-bold mb-3">Pro Tips</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Start with your brand color</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Try random for inspiration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Click any color to copy HEX</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Export CSS for development</span>
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
          <FirebaseFAQs pageId="color-palette" fallbackFaqs={fallbackFaqs} />
        </div>
      </div>
    </>
  );
}
