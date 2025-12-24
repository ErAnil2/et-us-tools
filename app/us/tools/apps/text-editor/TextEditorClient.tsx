'use client';

import { useState, useMemo } from 'react';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import AdBanner from '@/components/AdBanner';
import Link from 'next/link';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'What can I do with this text editor?',
    answer: 'Our text editor offers powerful text manipulation features including case conversion (uppercase, lowercase, title case), find and replace, text cleaning (remove extra spaces, duplicates), sorting lines, numbering lines, and comprehensive text statistics.',
    order: 1
  },
  {
    id: '2',
    question: 'How do I convert text to uppercase or lowercase?',
    answer: 'Simply paste or type your text in the editor, then use the case conversion buttons in the toolbar. Options include UPPERCASE, lowercase, Title Case, and Sentence case for different formatting needs.',
    order: 2
  },
  {
    id: '3',
    question: 'Can I find and replace text?',
    answer: 'Yes! Use the Find & Replace feature in the toolbar. Enter the text you want to find and what to replace it with, then choose to replace individual occurrences or all at once. Case-sensitive matching is also available.',
    order: 3
  },
  {
    id: '4',
    question: 'How do I remove duplicate lines?',
    answer: 'Click the "Remove Duplicates" button in the Line Operations section. This will keep only unique lines while maintaining the original order of first occurrences.',
    order: 4
  },
  {
    id: '5',
    question: 'Can I save my text?',
    answer: 'Yes! You can export your text as a .txt file using the Export button, or copy it to your clipboard. The editor also tracks your text statistics in real-time.',
    order: 5
  },
  {
    id: '6',
    question: 'Is my text stored on your servers?',
    answer: 'No. All text processing happens entirely in your browser. Your content is never sent to any server, ensuring complete privacy for sensitive documents.',
    order: 6
  }
];

export default function TextEditorClient() {
  const [text, setText] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const { getH1, getSubHeading } = usePageSEO('text-editor');

  const webAppSchema = generateWebAppSchema(
    'Text Editor - Free Online Text Manipulation Tool',
    'Free online text editor with powerful manipulation tools. Convert case, find and replace, remove duplicates, sort lines, and more. Fast and private text processing.',
    'https://economictimes.indiatimes.com/us/tools/apps/text-editor',
    'DeveloperApplication'
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
    const lines = text.split('\n').length;

    return { chars, charsNoSpaces, words, sentences, paragraphs, lines };
  }, [text]);

  const saveToHistory = (newText: string) => {
    const newHistory = [...history.slice(0, historyIndex + 1), text];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setText(newText);
  };

  const undo = () => {
    if (historyIndex >= 0) {
      setText(history[historyIndex]);
      setHistoryIndex(historyIndex - 1);
    }
  };

  // Case transformations
  const toUpperCase = () => saveToHistory(text.toUpperCase());
  const toLowerCase = () => saveToHistory(text.toLowerCase());

  const toTitleCase = () => {
    const result = text.replace(/\b\w+/g, word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    saveToHistory(result);
  };

  const toSentenceCase = () => {
    const result = text.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g,
      (match, p1, p2) => p1 + p2.toUpperCase()
    );
    saveToHistory(result);
  };

  const toAlternatingCase = () => {
    let upper = true;
    const result = text.split('').map(char => {
      if (/[a-zA-Z]/.test(char)) {
        const converted = upper ? char.toUpperCase() : char.toLowerCase();
        upper = !upper;
        return converted;
      }
      return char;
    }).join('');
    saveToHistory(result);
  };

  const toInverseCase = () => {
    const result = text.split('').map(char => {
      if (char === char.toUpperCase()) return char.toLowerCase();
      return char.toUpperCase();
    }).join('');
    saveToHistory(result);
  };

  // Find and replace
  const handleFindReplace = (all: boolean = false) => {
    if (!findText) return;

    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), all ? flags : (caseSensitive ? '' : 'i'));

    const result = all ? text.replace(regex, replaceText) : text.replace(regex, replaceText);
    saveToHistory(result);
  };

  const countOccurrences = (): number => {
    if (!findText) return 0;
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    return (text.match(regex) || []).length;
  };

  // Line operations
  const sortLines = (ascending: boolean = true) => {
    const lines = text.split('\n');
    lines.sort((a, b) => ascending ? a.localeCompare(b) : b.localeCompare(a));
    saveToHistory(lines.join('\n'));
  };

  const removeDuplicateLines = () => {
    const lines = text.split('\n');
    const unique = [...new Set(lines)];
    saveToHistory(unique.join('\n'));
  };

  const reverseLines = () => {
    const lines = text.split('\n');
    saveToHistory(lines.reverse().join('\n'));
  };

  const shuffleLines = () => {
    const lines = text.split('\n');
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    saveToHistory(lines.join('\n'));
  };

  const numberLines = () => {
    const lines = text.split('\n');
    const numbered = lines.map((line, i) => `${i + 1}. ${line}`);
    saveToHistory(numbered.join('\n'));
  };

  const removeEmptyLines = () => {
    const lines = text.split('\n').filter(line => line.trim());
    saveToHistory(lines.join('\n'));
  };

  // Text cleaning
  const trimLines = () => {
    const lines = text.split('\n').map(line => line.trim());
    saveToHistory(lines.join('\n'));
  };

  const removeExtraSpaces = () => {
    const result = text.replace(/  +/g, ' ');
    saveToHistory(result);
  };

  const removeAllSpaces = () => {
    const result = text.replace(/\s/g, '');
    saveToHistory(result);
  };

  const removeLineBreaks = () => {
    const result = text.replace(/\n/g, ' ').replace(/  +/g, ' ');
    saveToHistory(result);
  };

  // Clipboard operations
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (text && confirm('Are you sure you want to clear all text?')) {
      saveToHistory('');
    }
  };

  const handleExport = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-document.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      saveToHistory(content);
    };
    reader.readAsText(file);
  };

  const relatedTools = [
    { name: 'Note Taking', href: '/us/tools/apps/note-taking', icon: '📝' },
    { name: 'Markdown Editor', href: '/us/tools/apps/markdown-editor', icon: '📄' },
    { name: 'Word Counter', href: '/us/tools/apps/word-counter', icon: '🔢' },
    { name: 'JSON Formatter', href: '/us/tools/apps/json-formatter', icon: '{ }' }
  ];

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-cyan-100 px-5 py-2.5 rounded-full mb-3">
          <span className="text-2xl">✏️</span>
          <span className="text-blue-600 font-semibold">Text Editor</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">
          {getH1('Text Editor & Formatter')}
        </h1>

        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Powerful text manipulation tools. Transform, clean, sort, and format your text with ease.')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Mobile Stats Bar */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4 lg:hidden">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-2 text-center text-white shadow-lg">
              <div className="text-[10px] font-medium opacity-90 uppercase">Chars</div>
              <div className="text-sm font-bold">{stats.chars}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-2 text-center text-white shadow-lg">
              <div className="text-[10px] font-medium opacity-90 uppercase">Words</div>
              <div className="text-sm font-bold">{stats.words}</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-2 text-center text-white shadow-lg">
              <div className="text-[10px] font-medium opacity-90 uppercase">Lines</div>
              <div className="text-sm font-bold">{stats.lines}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl p-2 text-center text-white shadow-lg">
              <div className="text-[10px] font-medium opacity-90 uppercase">Sent</div>
              <div className="text-sm font-bold">{stats.sentences}</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl p-2 text-center text-white shadow-lg">
              <div className="text-[10px] font-medium opacity-90 uppercase">No Spc</div>
              <div className="text-sm font-bold">{stats.charsNoSpaces}</div>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl p-2 text-center text-white shadow-lg">
              <div className="text-[10px] font-medium opacity-90 uppercase">Para</div>
              <div className="text-sm font-bold">{stats.paragraphs}</div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 rounded-2xl shadow-xl p-4 mb-4 border-2 border-blue-100">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              {/* File operations */}
              <div className="flex flex-wrap gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".txt,.md"
                    onChange={handleImport}
                    className="hidden"
                  />
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs font-medium inline-block">
                    Import
                  </span>
                </label>
                <button
                  onClick={handleExport}
                  className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs font-medium"
                >
                  Export
                </button>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs font-medium"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
                <button
                  onClick={undo}
                  disabled={historyIndex < 0}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium disabled:opacity-50"
                >
                  Undo
                </button>
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs font-medium"
                >
                  Clear
                </button>
              </div>

              {/* Find & Replace Toggle */}
              <button
                onClick={() => setShowFindReplace(!showFindReplace)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors text-xs ${
                  showFindReplace
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🔍 Find & Replace
              </button>
            </div>

            {/* Find & Replace Panel */}
            {showFindReplace && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-wrap gap-2 items-center">
                  <input
                    type="text"
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                    placeholder="Find..."
                    className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="text"
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                    placeholder="Replace..."
                    className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <label className="flex items-center gap-1 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={caseSensitive}
                      onChange={(e) => setCaseSensitive(e.target.checked)}
                      className="rounded"
                    />
                    Case
                  </label>
                  <button
                    onClick={() => handleFindReplace(false)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                  >
                    Replace
                  </button>
                  <button
                    onClick={() => handleFindReplace(true)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                  >
                    All
                  </button>
                  {findText && (
                    <span className="text-xs text-gray-600">{countOccurrences()} found</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Text Area */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 mb-6 overflow-hidden">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-[350px] p-4 font-mono text-sm resize-none focus:outline-none"
              placeholder="Type or paste your text here..."
            />
          </div>

          {/* Tool Buttons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Case Conversion */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-100 shadow-lg">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-lg">Aa</span>
                Case Conversion
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={toUpperCase} className="px-2 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium shadow-sm">UPPER</button>
                <button onClick={toLowerCase} className="px-2 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium shadow-sm">lower</button>
                <button onClick={toTitleCase} className="px-2 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium shadow-sm">Title</button>
                <button onClick={toSentenceCase} className="px-2 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium shadow-sm">Sentence</button>
                <button onClick={toAlternatingCase} className="px-2 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium shadow-sm">aLtErN</button>
                <button onClick={toInverseCase} className="px-2 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium shadow-sm">iNVERSE</button>
              </div>
            </div>

            {/* Line Operations */}
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-4 border-2 border-green-100 shadow-lg">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-lg">📋</span>
                Line Operations
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => sortLines(true)} className="px-2 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium shadow-sm">Sort A-Z</button>
                <button onClick={() => sortLines(false)} className="px-2 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium shadow-sm">Sort Z-A</button>
                <button onClick={removeDuplicateLines} className="px-2 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium shadow-sm">Dedup</button>
                <button onClick={reverseLines} className="px-2 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium shadow-sm">Reverse</button>
                <button onClick={shuffleLines} className="px-2 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium shadow-sm">Shuffle</button>
                <button onClick={numberLines} className="px-2 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium shadow-sm">Number</button>
              </div>
            </div>

            {/* Text Cleaning */}
            <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl p-4 border-2 border-orange-100 shadow-lg md:col-span-2">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-lg">🧹</span>
                Text Cleaning
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <button onClick={trimLines} className="px-2 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium shadow-sm">Trim Lines</button>
                <button onClick={removeExtraSpaces} className="px-2 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium shadow-sm">Extra Spaces</button>
                <button onClick={removeAllSpaces} className="px-2 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium shadow-sm">All Spaces</button>
                <button onClick={removeLineBreaks} className="px-2 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium shadow-sm">Line Breaks</button>
                <button onClick={removeEmptyLines} className="px-2 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium shadow-sm">Empty Lines</button>
              </div>
            </div>
          </div>
        </div>
{/* Right Sidebar - 320px */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Desktop Stats - Hidden on mobile */}
          <div className="hidden lg:block bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">📊</span>
              Statistics
            </h3>
            <div className="space-y-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-3 text-white">
                <div className="text-xs font-medium opacity-90 uppercase tracking-wide">Characters</div>
                <div className="text-lg font-bold">{stats.chars}</div>
              </div>
              <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl p-3 text-white">
                <div className="text-xs font-medium opacity-90 uppercase tracking-wide">No Spaces</div>
                <div className="text-lg font-bold">{stats.charsNoSpaces}</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-3 text-white">
                <div className="text-xs font-medium opacity-90 uppercase tracking-wide">Words</div>
                <div className="text-lg font-bold">{stats.words}</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 text-white">
                <div className="text-xs font-medium opacity-90 uppercase tracking-wide">Sentences</div>
                <div className="text-lg font-bold">{stats.sentences}</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-3 text-white">
                <div className="text-xs font-medium opacity-90 uppercase tracking-wide">Paragraphs</div>
                <div className="text-lg font-bold">{stats.paragraphs}</div>
              </div>
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl p-3 text-white">
                <div className="text-xs font-medium opacity-90 uppercase tracking-wide">Lines</div>
                <div className="text-lg font-bold">{stats.lines}</div>
              </div>
            </div>
          </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

          {/* Ad Banner */}
          <AdBanner />
{/* Related Tools */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">🔗</span>
              Related Tools
            </h3>
            <div className="space-y-2">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">{tool.icon}</span>
                  <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{tool.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-4 border border-cyan-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">💡</span>
              Quick Tips
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
                <span className="text-blue-500">•</span>
                <span>Use Find & Replace for bulk edits</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
                <span className="text-blue-500">•</span>
                <span>Sort lines alphabetically</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
                <span className="text-blue-500">•</span>
                <span>Remove duplicate lines easily</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
                <span className="text-blue-500">•</span>
                <span>Export to save your work</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Mobile MREC2 - Before FAQs */}


      

      <GameAppMobileMrec2 />



      

      {/* FAQs Section */}
      <div className="mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
        </div>
        <FirebaseFAQs pageId="text-editor" fallbackFaqs={fallbackFaqs} />
      </div>
    </>
  );
}
