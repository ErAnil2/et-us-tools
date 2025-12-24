'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import AdBanner from '@/components/AdBanner';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'Is my image uploaded to a server?',
    answer: 'No! All image processing happens entirely in your browser. Your images never leave your device, ensuring complete privacy and security.',
    order: 1
  },
  {
    id: '2',
    question: 'What image formats are supported?',
    answer: 'This tool supports common image formats including JPEG, PNG, GIF, WebP, and BMP. You can also convert between formats when downloading.',
    order: 2
  },
  {
    id: '3',
    question: 'Will resizing reduce image quality?',
    answer: 'Enlarging images may reduce quality as pixels are interpolated. Reducing size maintains quality. Use the quality slider for JPEG/WebP to balance file size and quality.',
    order: 3
  },
  {
    id: '4',
    question: 'How do I maintain aspect ratio?',
    answer: 'The "Lock Aspect Ratio" option is enabled by default. When locked, changing width automatically adjusts height proportionally, and vice versa.',
    order: 4
  },
  {
    id: '5',
    question: 'What\'s the maximum image size I can process?',
    answer: 'Since processing happens in your browser, the limit depends on your device\'s memory. Most modern devices can handle images up to 50 megapixels without issues.',
    order: 5
  },
  {
    id: '6',
    question: 'Can I resize multiple images at once?',
    answer: 'Currently, this tool processes one image at a time for optimal quality control. Upload a new image after downloading to process the next one.',
    order: 6
  }
];

interface ImageData {
  file: File;
  url: string;
  width: number;
  height: number;
}

type OutputFormat = 'jpeg' | 'png' | 'webp';

export default function ImageResizerClient() {
  const [image, setImage] = useState<ImageData | null>(null);
  const [newWidth, setNewWidth] = useState<number>(0);
  const [newHeight, setNewHeight] = useState<number>(0);
  const [lockRatio, setLockRatio] = useState(true);
  const [quality, setQuality] = useState(90);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('jpeg');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('image-resizer');

  const webAppSchema = generateWebAppSchema(
    'Image Resizer - Free Online Image Resize Tool',
    'Free online image resizer. Resize images, change dimensions, convert formats. Process locally in your browser - no upload required. Private and secure.',
    'https://economictimes.indiatimes.com/us/tools/apps/image-resizer',
    'Utility'
  );

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImage({
        file,
        url,
        width: img.width,
        height: img.height
      });
      setNewWidth(img.width);
      setNewHeight(img.height);
      setPreviewUrl('');
    };
    img.src = url;
  }, []);

  const handleWidthChange = (value: number) => {
    setNewWidth(value);
    if (lockRatio && image) {
      const ratio = image.height / image.width;
      setNewHeight(Math.round(value * ratio));
    }
  };

  const handleHeightChange = (value: number) => {
    setNewHeight(value);
    if (lockRatio && image) {
      const ratio = image.width / image.height;
      setNewWidth(Math.round(value * ratio));
    }
  };

  const applyPreset = (preset: { width: number; height: number; name: string }) => {
    setNewWidth(preset.width);
    setNewHeight(preset.height);
    setLockRatio(false);
  };

  const processImage = useCallback(() => {
    if (!image || !canvasRef.current) return;

    setIsProcessing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = newWidth;
    canvas.height = newHeight;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      const mimeType = `image/${outputFormat}`;
      const qualityValue = outputFormat === 'png' ? undefined : quality / 100;
      const dataUrl = canvas.toDataURL(mimeType, qualityValue);
      setPreviewUrl(dataUrl);
      setIsProcessing(false);
    };
    img.src = image.url;
  }, [image, newWidth, newHeight, outputFormat, quality]);

  const downloadImage = () => {
    if (!previewUrl) return;

    const link = document.createElement('a');
    link.href = previewUrl;
    const originalName = image?.file.name.split('.')[0] || 'image';
    link.download = `${originalName}_${newWidth}x${newHeight}.${outputFormat}`;
    link.click();
  };

  const resetImage = () => {
    if (image) {
      setNewWidth(image.width);
      setNewHeight(image.height);
      setPreviewUrl('');
    }
  };

  const clearAll = () => {
    if (image?.url) URL.revokeObjectURL(image.url);
    setImage(null);
    setNewWidth(0);
    setNewHeight(0);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const presets = [
    { name: 'HD (1280×720)', width: 1280, height: 720 },
    { name: 'Full HD (1920×1080)', width: 1920, height: 1080 },
    { name: '4K (3840×2160)', width: 3840, height: 2160 },
    { name: 'Instagram Square', width: 1080, height: 1080 },
    { name: 'Instagram Portrait', width: 1080, height: 1350 },
    { name: 'Facebook Cover', width: 820, height: 312 },
    { name: 'Twitter Header', width: 1500, height: 500 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  ];

  const getEstimatedSize = () => {
    if (!previewUrl) return null;
    const base64Length = previewUrl.length - previewUrl.indexOf(',') - 1;
    const bytes = (base64Length * 3) / 4;
    if (bytes < 1024) return `${bytes.toFixed(0)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const relatedTools = [
    { name: 'Color Picker', path: '/us/tools/apps/color-picker', icon: '🎨', color: 'bg-purple-100' },
    { name: 'Color Palette', path: '/us/tools/apps/color-palette', icon: '🎨', color: 'bg-pink-100' },
    { name: 'Base64 Encoder', path: '/us/tools/apps/base64-encoder', icon: '🔐', color: 'bg-blue-100' },
    { name: 'QR Code Generator', path: '/us/tools/apps/qr-code-generator', icon: '📱', color: 'bg-indigo-100' },
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

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 rounded-full mb-3 shadow-md">
            <span className="text-xl">🖼️</span>
            <span className="text-white font-semibold text-sm">Image Resizer</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            {getH1('Free Online Image Resizer')}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {getSubHeading('Resize images instantly in your browser. No upload needed - your images stay private on your device.')}
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
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] sm:text-xs font-medium opacity-90">WIDTH</div>
                <div className="text-xs sm:text-sm font-bold">{newWidth || '-'}</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] sm:text-xs font-medium opacity-90">HEIGHT</div>
                <div className="text-xs sm:text-sm font-bold">{newHeight || '-'}</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] sm:text-xs font-medium opacity-90">QUALITY</div>
                <div className="text-xs sm:text-sm font-bold">{quality}%</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] sm:text-xs font-medium opacity-90">FORMAT</div>
                <div className="text-xs sm:text-sm font-bold uppercase">{outputFormat}</div>
              </div>
            </div>

            {/* Image Resizer Container */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl shadow-lg p-4 sm:p-6 border border-teal-100">
              {!image ? (
                /* Upload Section */
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-teal-300 rounded-2xl p-8 sm:p-12 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all"
                  >
                    <div className="w-20 h-20 mx-auto bg-teal-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Drop an image here or click to upload</h3>
                    <p className="text-gray-500 text-sm">Supports JPEG, PNG, GIF, WebP, BMP</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                /* Resize Controls & Preview */
                <div className="space-y-4">
                  {/* Controls */}
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-lg">⚙️</span> Resize Options
                      </h2>
                      <button
                        onClick={clearAll}
                        className="text-red-500 hover:text-red-700 font-medium text-sm"
                      >
                        Remove Image
                      </button>
                    </div>

                    {/* Original Info */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-4">
                      <div className="text-xs text-gray-500 mb-1">Original Size</div>
                      <div className="font-semibold text-gray-800">
                        {image.width} × {image.height} px
                        <span className="text-gray-500 font-normal ml-2">
                          ({(image.file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    </div>

                    {/* Dimensions */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Dimensions</label>
                      <div className="flex gap-3 items-center">
                        <div className="flex-1">
                          <label className="text-xs text-gray-500">Width (px)</label>
                          <input
                            type="number"
                            value={newWidth}
                            onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                          />
                        </div>
                        <button
                          onClick={() => setLockRatio(!lockRatio)}
                          className={`p-2.5 rounded-lg transition-colors mt-4 ${
                            lockRatio ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'
                          }`}
                          title={lockRatio ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
                        >
                          {lockRatio ? '🔒' : '🔓'}
                        </button>
                        <div className="flex-1">
                          <label className="text-xs text-gray-500">Height (px)</label>
                          <input
                            type="number"
                            value={newHeight}
                            onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick Scale */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quick Scale</label>
                      <div className="flex gap-2 flex-wrap">
                        {[25, 50, 75, 100, 150, 200].map(scale => (
                          <button
                            key={scale}
                            onClick={() => {
                              const w = Math.round(image.width * (scale / 100));
                              const h = Math.round(image.height * (scale / 100));
                              setNewWidth(w);
                              setNewHeight(h);
                            }}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-teal-100 rounded-lg text-xs font-medium transition-colors"
                          >
                            {scale}%
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Output Format & Quality */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                        <div className="flex gap-2">
                          {(['jpeg', 'png', 'webp'] as OutputFormat[]).map(format => (
                            <button
                              key={format}
                              onClick={() => setOutputFormat(format)}
                              className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                                outputFormat === format
                                  ? 'bg-teal-500 text-white shadow-md'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {format.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                      {outputFormat !== 'png' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quality: {quality}%
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={quality}
                            onChange={(e) => setQuality(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                          />
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={processImage}
                        disabled={isProcessing}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50 shadow-md hover:shadow-lg active:scale-95"
                      >
                        {isProcessing ? 'Processing...' : 'Resize Image'}
                      </button>
                      <button
                        onClick={resetImage}
                        className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-lg">👁️</span> Preview
                    </h2>
                    <div className="bg-gray-100 rounded-xl p-4 min-h-[200px] flex items-center justify-center">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Resized preview"
                          className="max-w-full max-h-[300px] rounded-lg shadow-md"
                        />
                      ) : (
                        <img
                          src={image.url}
                          alt="Original"
                          className="max-w-full max-h-[300px] rounded-lg shadow-md opacity-75"
                        />
                      )}
                    </div>

                    {previewUrl && (
                      <>
                        <div className="bg-teal-50 rounded-xl p-3 mt-4 mb-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">New Size:</span>
                              <span className="ml-2 font-semibold">{newWidth} × {newHeight} px</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Est. File Size:</span>
                              <span className="ml-2 font-semibold">{getEstimatedSize()}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={downloadImage}
                          className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Resized Image
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Presets Section */}
            <div className="mt-6 bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">📐</span> Common Presets
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {presets.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => image && applyPreset(preset)}
                    disabled={!image}
                    className="px-3 py-2.5 bg-gray-50 hover:bg-teal-50 rounded-lg text-xs font-medium text-left transition-colors border border-gray-100 hover:border-teal-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mt-6 bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">✨</span> Features
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: '🔒', title: '100% Private', desc: 'Images never leave your device' },
                  { icon: '⚡', title: 'Instant', desc: 'Fast browser processing' },
                  { icon: '🎨', title: 'Format Convert', desc: 'JPEG, PNG, WebP' },
                  { icon: '📐', title: 'Precise Control', desc: 'Custom dimensions' },
                ].map(feature => (
                  <div key={feature.title} className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-2xl mb-1">{feature.icon}</div>
                    <div className="font-semibold text-gray-800 text-xs">{feature.title}</div>
                    <div className="text-[10px] text-gray-500">{feature.desc}</div>
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
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Image Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl">
                  <span className="text-gray-600 font-medium">Width</span>
                  <span className="font-bold text-teal-600">{newWidth || '-'} px</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl">
                  <span className="text-gray-600 font-medium">Height</span>
                  <span className="font-bold text-cyan-600">{newHeight || '-'} px</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">Quality</div>
                    <div className="text-xl font-bold text-gray-700">{quality}%</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">Format</div>
                    <div className="text-xl font-bold text-gray-700 uppercase">{outputFormat}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

            {/* Original Image Info */}
            {image && (
              <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Original Image</h3>
                <div className="bg-gray-100 rounded-xl p-2 mb-3">
                  <img
                    src={image.url}
                    alt="Original"
                    className="w-full h-32 object-contain rounded-lg"
                  />
                </div>
                <div className="text-sm text-center">
                  <div className="font-semibold text-gray-800">{image.width} × {image.height}</div>
                  <div className="text-gray-500 text-xs">{(image.file.size / 1024).toFixed(1)} KB</div>
                </div>
              </div>
            )}

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
              <Link href="/us/tools/apps" className="block mt-3 text-center text-sm text-teal-600 hover:text-teal-700 font-medium">
                View All Tools →
              </Link>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-lg p-4 text-white">
              <h3 className="text-lg font-bold mb-3">Pro Tips</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Lock aspect ratio to prevent distortion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Use presets for social media sizes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Lower quality = smaller file size</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>PNG for transparency, JPEG for photos</span>
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
          <FirebaseFAQs pageId="image-resizer" fallbackFaqs={fallbackFaqs} />
        </div>
      </div>
    </>
  );
}
