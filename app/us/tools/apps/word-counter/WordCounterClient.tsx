'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'How accurate is this word counter?',
    answer: 'Our word counter is highly accurate. It counts words separated by spaces, handles multiple spaces correctly, and excludes empty strings. It also accurately counts characters with and without spaces.',
    order: 1
  },
  {
    id: '2',
    question: 'Does it count characters with or without spaces?',
    answer: 'Both! We show character count with spaces (total characters) and without spaces (only letters, numbers, and punctuation). This is useful for different requirements like Twitter/X limits or essay requirements.',
    order: 2
  },
  {
    id: '3',
    question: 'How does it count sentences and paragraphs?',
    answer: 'Sentences are counted by identifying periods, exclamation marks, and question marks followed by spaces or end of text. Paragraphs are counted by detecting line breaks between blocks of text.',
    order: 3
  },
  {
    id: '4',
    question: 'What is reading time based on?',
    answer: 'Reading time is calculated assuming an average reading speed of 200 words per minute for normal text. Speaking time assumes 150 words per minute, which is a typical presentation pace.',
    order: 4
  },
  {
    id: '5',
    question: 'Can I see the most used words?',
    answer: 'Yes! The tool shows your top 10 most frequently used words, excluding common words like "the", "a", "is", etc. This helps identify keyword density for SEO or repetitive word usage.',
    order: 5
  },
  {
    id: '6',
    question: 'Is my text saved or stored anywhere?',
    answer: 'No. All text processing happens entirely in your browser. Your text is never sent to any server or stored anywhere. Your privacy is completely protected.',
    order: 6
  }
];

export default function WordCounterClient() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: '0 min',
    speakingTime: '0 min',
    avgWordLength: 0
  });
  const [topWords, setTopWords] = useState<{word: string; count: number}[]>([]);

  const { getH1, getSubHeading, faqSchema } = usePageSEO('word-counter');

  const webAppSchema = generateWebAppSchema(
    'Word Counter - Free Online Word & Character Count Tool',
    'Free online word counter tool. Count words, characters, sentences, paragraphs, and reading time instantly. Perfect for essays, articles, and social media posts.',
    'https://economictimes.indiatimes.com/us/tools/apps/word-counter',
    'Utility'
  );

  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
    'used', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he',
    'she', 'we', 'they', 'what', 'which', 'who', 'whom', 'whose', 'where',
    'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
    'same', 'so', 'than', 'too', 'very', 'just', 'also'
  ]);

  useEffect(() => {
    analyzeText(text);
  }, [text]);

  const analyzeText = (inputText: string) => {
    const words = inputText.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = inputText.trim() === '' ? 0 : words.length;
    const characters = inputText.length;
    const charactersNoSpaces = inputText.replace(/\s/g, '').length;
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = inputText.split(/\n\n+/).filter(p => p.trim().length > 0).length;
    const readingMinutes = Math.ceil(wordCount / 200);
    const readingTime = readingMinutes < 1 ? 'Less than 1 min' : `${readingMinutes} min`;
    const speakingMinutes = Math.ceil(wordCount / 150);
    const speakingTime = speakingMinutes < 1 ? 'Less than 1 min' : `${speakingMinutes} min`;
    const avgWordLength = wordCount > 0
      ? (words.reduce((acc, word) => acc + word.replace(/[^a-zA-Z]/g, '').length, 0) / wordCount).toFixed(1)
      : 0;

    setStats({
      words: wordCount,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs: paragraphs || (inputText.trim() ? 1 : 0),
      readingTime,
      speakingTime,
      avgWordLength: Number(avgWordLength)
    });

    if (wordCount > 0) {
      const wordFrequency: Record<string, number> = {};
      words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^a-zA-Z]/g, '');
        if (cleanWord.length > 2 && !commonWords.has(cleanWord)) {
          wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
        }
      });

      const sortedWords = Object.entries(wordFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }));

      setTopWords(sortedWords);
    } else {
      setTopWords([]);
    }
  };

  const clearText = () => {
    setText('');
  };

  const copyStats = () => {
    const statsText = `Words: ${stats.words}
Characters: ${stats.characters}
Characters (no spaces): ${stats.charactersNoSpaces}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Reading Time: ${stats.readingTime}
Speaking Time: ${stats.speakingTime}`;

    navigator.clipboard.writeText(statsText);
    alert('Statistics copied to clipboard!');
  };

  const relatedTools = [
    { href: '/us/tools/apps/syllable-counter', title: 'Syllable Counter', icon: '📊' },
    { href: '/us/tools/apps/text-editor', title: 'Text Editor', icon: '📝' },
    { href: '/us/tools/apps/markdown-editor', title: 'Markdown Editor', icon: '✍️' },
    { href: '/us/tools/apps/note-taking', title: 'Note Taking', icon: '📋' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
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

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-cyan-100 px-6 py-3 rounded-full mb-4">
          <span className="text-2xl">📝</span>
          <span className="text-blue-600 font-semibold">Word Counter</span>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
          {getH1('Word Counter')}
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Count words, characters, sentences, and paragraphs instantly. Get reading time estimates and word frequency analysis.')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Mobile Stats Bar */}
      <div className="grid grid-cols-4 gap-2 mb-4 lg:hidden">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-3 text-center">
          <div className="text-xl font-bold">{stats.words.toLocaleString()}</div>
          <div className="text-xs text-blue-100">Words</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-3 text-center">
          <div className="text-xl font-bold">{stats.characters.toLocaleString()}</div>
          <div className="text-xs text-purple-100">Chars</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-3 text-center">
          <div className="text-xl font-bold">{stats.sentences}</div>
          <div className="text-xs text-green-100">Sentences</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-3 text-center">
          <div className="text-xl font-bold">{stats.paragraphs}</div>
          <div className="text-xs text-orange-100">Paragraphs</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Main Tool */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-semibold text-gray-800">Enter or paste your text:</label>
              <div className="flex gap-2">
                <button
                  onClick={copyStats}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  📋 Copy Stats
                </button>
                <button
                  onClick={clearText}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  Clear
                </button>
              </div>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or paste your text here..."
              className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-800"
            />
          </div>

          {/* Top Words */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Top Words</h3>
            {topWords.length > 0 ? (
              <div className="space-y-2">
                {topWords.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center px-3"
                        style={{ width: `${Math.max(20, (item.count / topWords[0].count) * 100)}%` }}
                      >
                        <span className="text-white text-sm font-medium truncate">{item.word}</span>
                      </div>
                    </div>
                    <span className="text-gray-600 text-sm w-8 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                Start typing to see your most used words
              </div>
            )}
          </div>

          {/* Social Media Limits */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Social Media Character Limits</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">𝕏</span>
                  <span className="font-semibold text-gray-800">Twitter/X</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{stats.characters}/280</div>
                <div className={`text-sm ${stats.characters > 280 ? 'text-red-600' : 'text-green-600'}`}>
                  {stats.characters > 280 ? `${stats.characters - 280} over` : `${280 - stats.characters} left`}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">💼</span>
                  <span className="font-semibold text-gray-800">LinkedIn</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{stats.characters}/3,000</div>
                <div className={`text-sm ${stats.characters > 3000 ? 'text-red-600' : 'text-green-600'}`}>
                  {stats.characters > 3000 ? `${stats.characters - 3000} over` : `${3000 - stats.characters} left`}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📷</span>
                  <span className="font-semibold text-gray-800">Instagram</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{stats.characters}/2,200</div>
                <div className={`text-sm ${stats.characters > 2200 ? 'text-red-600' : 'text-green-600'}`}>
                  {stats.characters > 2200 ? `${stats.characters - 2200} over` : `${2200 - stats.characters} left`}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📘</span>
                  <span className="font-semibold text-gray-800">Facebook</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{stats.characters}/63,206</div>
                <div className="text-sm text-green-600">{(63206 - stats.characters).toLocaleString()} left</div>
              </div>
            </div>
          </div>

          

          {/* Mobile MREC2 - Before FAQs */}


          

          <GameAppMobileMrec2 />



          

          {/* FAQs Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
            <FirebaseFAQs pageId="word-counter" fallbackFaqs={fallbackFaqs} />
          </div>
        </div>
{/* Right Sidebar - 320px */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Desktop Stats */}
          <div className="hidden lg:block bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                <span className="text-sm text-blue-700">Words</span>
                <span className="font-bold text-blue-600">{stats.words.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                <span className="text-sm text-purple-700">Characters</span>
                <span className="font-bold text-purple-600">{stats.characters.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                <span className="text-sm text-green-700">No Spaces</span>
                <span className="font-bold text-green-600">{stats.charactersNoSpaces.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                <span className="text-sm text-orange-700">Sentences</span>
                <span className="font-bold text-orange-600">{stats.sentences}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-pink-50 rounded-xl">
                <span className="text-sm text-pink-700">Paragraphs</span>
                <span className="font-bold text-pink-600">{stats.paragraphs}</span>
              </div>
            </div>

            {/* Time Estimates */}
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm">Time Estimates</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                  <span className="text-blue-700">Reading Time</span>
                  <span className="font-bold text-blue-600">{stats.readingTime}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                  <span className="text-green-700">Speaking Time</span>
                  <span className="font-bold text-green-600">{stats.speakingTime}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                  <span className="text-purple-700">Avg Word Length</span>
                  <span className="font-bold text-purple-600">{stats.avgWordLength} chars</span>
                </div>
              </div>
            </div>
          </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

          {/* Ad Banner */}
          <AdBanner />
{/* Related Tools */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Related Tools</h3>
            <div className="space-y-2">
              {relatedTools.map((tool, index) => (
                <Link
                  key={index}
                  href={tool.href}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group"
                >
                  <span className="text-xl">{tool.icon}</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{tool.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-800 mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>200 WPM is average reading speed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>150 WPM is comfortable speaking pace</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Twitter/X allows 280 characters max</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>All processing happens in your browser</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
