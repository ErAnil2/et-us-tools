'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { allTools, searchTools, SearchItem } from '@/data/searchData';

export default function HomePageClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.length >= 2) {
        const results = searchTools(searchTerm, 8);
        setSearchResults(results);
        setShowResults(true);
        setSelectedIndex(-1);
      } else {
        setShowResults(false);
        setSearchResults([]);
      }
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showResults || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : searchResults.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          window.location.href = searchResults[selectedIndex].url;
        }
        break;
      case 'Escape':
        setShowResults(false);
        break;
    }
  }, [showResults, searchResults, selectedIndex]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Calculator': return 'bg-blue-100 text-blue-700';
      case 'Game': return 'bg-green-100 text-green-700';
      case 'App': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-8" ref={searchRef}>
      <div className="relative">
        {/* Search Input */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search calculators, games, apps... (e.g., 'BMI', 'chess', 'timer')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
            className="w-full px-5 py-4 text-base rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm hover:shadow-md pl-12 bg-white"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button
              onClick={() => { setSearchTerm(''); setShowResults(false); inputRef.current?.focus(); }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl max-h-[400px] overflow-y-auto z-50 border border-gray-200">
            {searchResults.length > 0 ? (
              <>
                <div className="p-2">
                  {searchResults.map((tool, index) => (
                    <Link
                      key={tool.url}
                      href={tool.url}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        index === selectedIndex
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setShowResults(false)}
                    >
                      <span className="text-2xl flex-shrink-0">{tool.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{tool.name}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {tool.keywords.slice(0, 3).join(' - ')}
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${getCategoryColor(tool.category)}`}>
                        {tool.category}
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-100 p-3 bg-gray-50 rounded-b-2xl">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{searchResults.length} results found</span>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-white rounded border text-gray-600">↑</kbd>
                      <kbd className="px-2 py-1 bg-white rounded border text-gray-600">↓</kbd>
                      <span>to navigate</span>
                      <kbd className="px-2 py-1 bg-white rounded border text-gray-600">Enter</kbd>
                      <span>to select</span>
                    </div>
                  </div>
                </div>
              </>
            ) : searchTerm.length >= 2 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <div className="text-gray-600 font-medium">No tools found for "{searchTerm}"</div>
                <div className="text-gray-400 text-sm mt-1">Try a different search term</div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Quick Search Suggestions */}
      {!showResults && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <span className="text-sm text-gray-500">Popular:</span>
          {['BMI', 'SIP', '2048', 'Chess', 'Timer', 'Password', 'Lucky Draw'].map(term => (
            <button
              key={term}
              onClick={() => { setSearchTerm(term); inputRef.current?.focus(); }}
              className="text-sm px-3 py-1 bg-white border border-gray-200 rounded-full hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
