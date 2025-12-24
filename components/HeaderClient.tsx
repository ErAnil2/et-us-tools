'use client';

import { useEffect, useState } from 'react';

export default function HeaderClient() {
  const [dateTime, setDateTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Update date/time
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      };
      setDateTime(now.toLocaleDateString('en-IN', options) + ' IST');
    };

    updateDateTime();

    // Close dropdown when clicking outside
    const handleClickOutside = () => setDropdownOpen(false);
    document.addEventListener('click', handleClickOutside);

    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="py-4">
      {/* Mobile Header */}
      <div className="block md:hidden mb-4">
        <div className="max-w-[1080px] mx-auto px-2">
          <div className="flex items-center relative">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex-shrink-0 p-1 text-gray-700 hover:text-gray-900"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>

            <div className="flex-1 mx-3">
              <a href="/us/tools" className="block">
                <img
                  src="https://img.etimg.com/photo/msid-74651805.cms"
                  alt="Economic Times Logo"
                  className="w-full h-auto object-contain hover:opacity-90 transition-opacity"
                />
              </a>
            </div>
          </div>

          <div className="text-gray-600 text-xs flex justify-center items-center gap-2 mt-2">
            <span>{dateTime || 'Loading...'}</span>
            <span>|</span>
            <a href="https://epaper.indiatimes.com/timesepaper/publication-the-economic-times,city-delhi.cms"
               className="text-blue-600 hover:text-blue-800 font-medium">
              ePaper
            </a>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} bg-white border-t border-gray-200 mt-2`}>
          <div className="max-w-[1080px] mx-auto px-2 py-4">
            <div className="grid grid-cols-3 gap-2">
              <a href="https://economictimes.indiatimes.com/" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Home</a>
              <a href="https://economictimes.indiatimes.com/prime" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">ETPrime</a>
              <a href="https://economictimes.indiatimes.com/markets" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Markets</a>
              <a href="https://economictimes.indiatimes.com/markets/ipo" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">IPO</a>
              <a href="https://economictimes.indiatimes.com/sme" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">SME</a>
              <a href="https://economictimes.indiatimes.com/mutual-funds" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">MF</a>
              <a href="https://economictimes.indiatimes.com/news" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">News</a>
              <a href="https://economictimes.indiatimes.com/news/politics" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Politics</a>
              <a href="https://economictimes.indiatimes.com/industry" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Industry</a>
              <a href="https://economictimes.indiatimes.com/tech" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Tech</a>
              <a href="https://ai.economictimes.com/" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">AI</a>
              <a href="https://economictimes.indiatimes.com/us" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">US</a>
              <a href="https://economictimes.indiatimes.com/nri" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">NRI</a>
              <a href="https://economictimes.indiatimes.com/panache" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Panache</a>
              <a href="https://economictimes.indiatimes.com/personal-finance" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Wealth</a>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="text-center mb-4">
          <div className="mb-2">
            <a href="/us/tools" className="inline-block">
              <img
                src="https://economictimes.indiatimes.com/photo/msid-74451948,quality-100/et-logo.jpg"
                alt="Economic Times Logo"
                className="h-14 w-auto object-contain mx-auto hover:opacity-90 transition-opacity"
                style={{ transform: 'scale(0.85)' }}
              />
            </a>
          </div>

          <div className="text-gray-600 text-sm flex justify-center items-center gap-4">
            <span>{dateTime || 'Loading...'}</span>
            <span>|</span>
            <a href="https://epaper.indiatimes.com/timesepaper/publication-the-economic-times,city-delhi.cms"
               className="text-blue-600 hover:text-blue-800 font-medium">
              Today's ePaper
            </a>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="max-w-[1080px] mx-auto px-2">
          <nav className="bg-pink-50 py-2 px-2 rounded">
            <div className="flex justify-center items-center flex-wrap gap-1">
              <div className="flex items-center mr-2">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </div>
              <a href="https://economictimes.indiatimes.com/" className="px-2 py-1 text-gray-700 hover:text-gray-900 transition-colors font-normal text-sm">Home</a>
              <a href="https://economictimes.indiatimes.com/prime" className="px-2 py-1 text-gray-700 hover:text-gray-900 transition-colors font-normal text-sm">ETPrime</a>
              <a href="https://economictimes.indiatimes.com/markets" className="px-2 py-1 text-gray-700 hover:text-gray-900 transition-colors font-normal text-sm">Markets</a>
              <a href="https://economictimes.indiatimes.com/us" className="px-2 py-1 text-gray-700 hover:text-gray-900 transition-colors font-normal text-sm">US</a>
              <a href="https://economictimes.indiatimes.com/markets/ipo" className="px-2 py-1 text-gray-700 hover:text-gray-900 transition-colors font-normal text-sm">IPO</a>
              <a href="https://economictimes.indiatimes.com/sme" className="px-2 py-1 text-gray-700 hover:text-gray-900 transition-colors font-normal text-sm">SME</a>
              <a href="https://economictimes.indiatimes.com/news" className="px-2 py-1 text-gray-700 hover:text-gray-900 transition-colors font-normal text-sm">News</a>
              <a href="https://economictimes.indiatimes.com/news/politics" className="px-2 py-1 text-gray-700 hover:text-gray-900 transition-colors font-normal text-sm">Politics</a>
              <a href="https://economictimes.indiatimes.com/industry" className="px-2 py-1 text-gray-700 hover:text-gray-900 transition-colors font-normal text-sm">Industry</a>
              <a href="https://economictimes.indiatimes.com/personal-finance" className="px-2 py-1 text-gray-700 hover:text-gray-900 transition-colors font-normal text-sm">Wealth</a>
              <a href="https://economictimes.indiatimes.com/mutual-funds" className="px-2 py-1 text-gray-700 hover:text-gray-900 transition-colors font-normal text-sm">MF</a>
              <a href="https://economictimes.indiatimes.com/tech" className="px-2 py-1 text-gray-700 hover:text-gray-900 transition-colors font-normal text-sm">Tech</a>
              <a href="https://ai.economictimes.com/" className="px-2 py-1 text-gray-700 hover:text-gray-900 transition-colors font-normal text-sm">AI</a>

              {/* Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(!dropdownOpen);
                  }}
                  className="px-2 py-1 text-gray-700 hover:text-gray-900 transition-colors"
                  aria-label="More options"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 6a2 2 0 110-4 2 2 0 010 4zM12 14a2 2 0 110-4 2 2 0 010 4zM12 22a2 2 0 110-4 2 2 0 010 4z"/>
                  </svg>
                </button>

                <div className={`${dropdownOpen ? 'block' : 'hidden'} absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50`}>
                  <div className="py-2">
                    <a href="https://economictimes.indiatimes.com/nri" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">NRI</a>
                    <a href="https://economictimes.indiatimes.com/panache" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">Panache</a>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
