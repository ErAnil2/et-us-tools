'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate transforms only after mounting to avoid hydration mismatch
  const getTransform = (multiplier: number) => {
    if (!mounted) return undefined;
    return `translate(${mousePosition.x * multiplier}px, ${mousePosition.y * multiplier}px)`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center px-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl transition-transform duration-100"
          style={{ transform: getTransform(0.5) }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl transition-transform duration-100"
          style={{ transform: getTransform(-0.3) }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-100/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1
            className="text-[180px] md:text-[220px] font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 leading-none select-none transition-transform duration-100"
            style={{
              transform: getTransform(0.1),
              textShadow: '0 20px 40px rgba(249, 115, 22, 0.2)'
            }}
          >
            404
          </h1>

          {/* Floating elements around 404 */}
          <div
            className="absolute top-4 right-4 md:right-16 w-8 h-8 bg-orange-400 rounded-lg opacity-60 transition-transform duration-100"
            style={{ transform: mounted ? `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px) rotate(12deg)` : 'rotate(12deg)' }}
          />
          <div
            className="absolute bottom-8 left-4 md:left-20 w-6 h-6 bg-orange-300 rounded-full opacity-50 transition-transform duration-100"
            style={{ transform: getTransform(-0.4) }}
          />
          <div
            className="absolute top-1/2 left-0 w-4 h-4 bg-orange-500 rounded opacity-40 transition-transform duration-100"
            style={{ transform: getTransform(0.2) }}
          />
        </div>

        {/* Message */}
        <div className="space-y-4 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            The page you&apos;re looking for seems to have wandered off.
            Let&apos;s get you back on track.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/us/tools"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Homepage
            <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:text-orange-600 hover:scale-105 transition-all duration-300 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
        </div>

        {/* Quick links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Or try one of these:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/us/tools/calculators"
              className="px-4 py-2 text-sm text-gray-600 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:text-orange-600 transition-colors"
            >
              Calculators
            </Link>
            <Link
              href="/us/tools/games"
              className="px-4 py-2 text-sm text-gray-600 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:text-orange-600 transition-colors"
            >
              Games
            </Link>
            <Link
              href="/us/tools/apps"
              className="px-4 py-2 text-sm text-gray-600 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:text-orange-600 transition-colors"
            >
              Apps
            </Link>
          </div>
        </div>

        {/* Branding */}
        <div className="mt-12 flex items-center justify-center gap-2 text-gray-400">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">ET</span>
          </div>
          <span className="text-sm">The Economic Times Tools</span>
        </div>
      </div>
    </div>
  );
}
