'use client';

import { FooterBanner } from './BannerPlacements';

export default function ETFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Footer Banner - Responsive */}
      <div className="py-4 xl:ml-[160px] xl:mr-[160px]">
        <div className="max-w-7xl mx-auto px-4">
          <FooterBanner />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 xl:ml-[160px] xl:mr-[160px]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {/* Popular Calculators */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Popular Calculators</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/us/tools/calculators/bmi-calculator" className="text-gray-600 hover:text-blue-600 text-sm">
                    BMI Calculator
                  </a>
                </li>
                <li>
                  <a href="/us/tools/calculators/sip-calculator" className="text-gray-600 hover:text-blue-600 text-sm">
                    SIP Calculator
                  </a>
                </li>
                <li>
                  <a href="/us/tools/calculators/emi-calculator" className="text-gray-600 hover:text-blue-600 text-sm">
                    EMI Calculator
                  </a>
                </li>
                <li>
                  <a href="/us/tools/calculators/percentage-calculator" className="text-gray-600 hover:text-blue-600 text-sm">
                    Percentage Calculator
                  </a>
                </li>
                <li>
                  <a href="/us/tools/calculators/age-calculator" className="text-gray-600 hover:text-blue-600 text-sm">
                    Age Calculator
                  </a>
                </li>
                <li>
                  <a href="/us/tools/calculators/calorie-calculator" className="text-gray-600 hover:text-blue-600 text-sm">
                    Calorie Calculator
                  </a>
                </li>
                <li>
                  <a href="/us/tools/all-calculators" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All Calculators →
                  </a>
                </li>
              </ul>
            </div>

            {/* Popular Games */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Popular Games</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/us/tools/games/chess" className="text-gray-600 hover:text-blue-600 text-sm">
                    Chess
                  </a>
                </li>
                <li>
                  <a href="/us/tools/games/2048-game" className="text-gray-600 hover:text-blue-600 text-sm">
                    2048 Game
                  </a>
                </li>
                <li>
                  <a href="/us/tools/games/snake-game" className="text-gray-600 hover:text-blue-600 text-sm">
                    Snake Game
                  </a>
                </li>
                <li>
                  <a href="/us/tools/games/crossword" className="text-gray-600 hover:text-blue-600 text-sm">
                    Crossword Puzzle
                  </a>
                </li>
                <li>
                  <a href="/us/tools/games/tic-tac-toe" className="text-gray-600 hover:text-blue-600 text-sm">
                    Tic Tac Toe
                  </a>
                </li>
                <li>
                  <a href="/us/tools/games/memory-cards" className="text-gray-600 hover:text-blue-600 text-sm">
                    Memory Cards
                  </a>
                </li>
                <li>
                  <a href="/us/tools/games" className="text-green-600 hover:text-green-700 text-sm font-medium">
                    View All Games →
                  </a>
                </li>
              </ul>
            </div>

            {/* Popular Apps */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Popular Apps</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/us/tools/apps/qr-generator" className="text-gray-600 hover:text-blue-600 text-sm">
                    QR Code Generator
                  </a>
                </li>
                <li>
                  <a href="/us/tools/apps/lucky-draw-picker" className="text-gray-600 hover:text-blue-600 text-sm">
                    Lucky Draw Picker
                  </a>
                </li>
                <li>
                  <a href="/us/tools/apps/pomodoro-timer" className="text-gray-600 hover:text-blue-600 text-sm">
                    Pomodoro Timer
                  </a>
                </li>
                <li>
                  <a href="/us/tools/apps/strong-password-generator" className="text-gray-600 hover:text-blue-600 text-sm">
                    Password Generator
                  </a>
                </li>
                <li>
                  <a href="/us/tools/apps/spin-wheel" className="text-gray-600 hover:text-blue-600 text-sm">
                    Spin Wheel
                  </a>
                </li>
                <li>
                  <a href="/us/tools/apps/word-counter" className="text-gray-600 hover:text-blue-600 text-sm">
                    Word Counter
                  </a>
                </li>
                <li>
                  <a href="/us/tools/apps" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    View All Apps →
                  </a>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/us/tools/finance" className="text-gray-600 hover:text-blue-600 text-sm">
                    Finance Calculators
                  </a>
                </li>
                <li>
                  <a href="/us/tools/health" className="text-gray-600 hover:text-blue-600 text-sm">
                    Health Calculators
                  </a>
                </li>
                <li>
                  <a href="/us/tools/math" className="text-gray-600 hover:text-blue-600 text-sm">
                    Math Calculators
                  </a>
                </li>
                <li>
                  <a href="/us/tools/time" className="text-gray-600 hover:text-blue-600 text-sm">
                    Time & Date Tools
                  </a>
                </li>
                <li>
                  <a href="/us/tools/physics" className="text-gray-600 hover:text-blue-600 text-sm">
                    Physics Calculators
                  </a>
                </li>
                <li>
                  <a href="/us/tools/all-calculators" className="text-gray-600 hover:text-blue-600 text-sm">
                    All Calculators
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col items-center gap-4">
              {/* Logo and Copyright - Stacked on mobile */}
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center">
                <img
                  src="https://economictimes.indiatimes.com/photo/msid-74451948,quality-100/et-logo.jpg"
                  alt="Economic Times Logo"
                  className="h-6 sm:h-8 w-auto object-contain"
                />
                <span className="text-gray-500 text-xs sm:text-sm">
                  © {currentYear} The Economic Times. All rights reserved.
                </span>
              </div>

              {/* Legal Links - Compact on mobile */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <a href="https://www.timesinternet.in/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 text-xs sm:text-sm">
                  About Us
                </a>
                <span className="text-gray-300 hidden sm:inline">|</span>
                <a href="https://economictimes.indiatimes.com/contact-us" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 text-xs sm:text-sm">
                  Contact
                </a>
                <span className="text-gray-300 hidden sm:inline">|</span>
                <a href="https://economictimes.indiatimes.com/privacypolicy.cms" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 text-xs sm:text-sm">
                  Privacy
                </a>
                <span className="text-gray-300 hidden sm:inline">|</span>
                <a href="https://economictimes.indiatimes.com/terms-conditions" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 text-xs sm:text-sm">
                  Terms
                </a>
              </div>

              {/* Disclaimer */}
              <p className="text-gray-400 text-[10px] sm:text-xs text-center max-w-3xl mt-2">
                Disclaimer: The tools provided are for informational purposes only and should not be considered as professional financial, medical, or legal advice.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
