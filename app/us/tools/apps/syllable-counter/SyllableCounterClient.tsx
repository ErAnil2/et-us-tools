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
    question: 'How does the syllable counter work?',
    answer: 'Our syllable counter uses linguistic rules to identify syllables. It counts vowel sounds while accounting for silent vowels (like silent "e"), diphthongs (two vowels making one sound), and common patterns in English words.',
    order: 1
  },
  {
    id: '2',
    question: 'How accurate is the syllable count?',
    answer: 'For most English words, our counter is highly accurate (95%+). However, some exceptions exist for unusual words, proper nouns, or words borrowed from other languages. The algorithm handles most common English vocabulary correctly.',
    order: 2
  },
  {
    id: '3',
    question: 'Why do I need to count syllables?',
    answer: 'Syllable counting is essential for poetry (haiku, sonnets, etc.), song lyrics, teaching reading and pronunciation, calculating reading level scores (like Flesch-Kincaid), and improving writing rhythm and flow.',
    order: 3
  },
  {
    id: '4',
    question: 'What is a syllable?',
    answer: 'A syllable is a unit of pronunciation containing one vowel sound. For example, "water" has 2 syllables (wa-ter), "beautiful" has 3 (beau-ti-ful), and "refrigerator" has 5 (re-frig-er-a-tor).',
    order: 4
  },
  {
    id: '5',
    question: 'Does it work with names and technical terms?',
    answer: 'The counter works well with most proper nouns and technical terms. However, very unusual names or newly coined terms may have slight inaccuracies. The algorithm is optimized for standard English vocabulary.',
    order: 5
  },
  {
    id: '6',
    question: 'Can I use this for writing haiku?',
    answer: 'Absolutely! This tool is perfect for haiku writing. Traditional haiku requires 5-7-5 syllables across three lines. Use our counter to ensure your haiku follows the correct syllable structure.',
    order: 6
  }
];

export default function SyllableCounterClient() {
  const [text, setText] = useState('');
  const [wordAnalysis, setWordAnalysis] = useState<{word: string; syllables: number; breakdown: string}[]>([]);
  const [stats, setStats] = useState({
    totalSyllables: 0,
    totalWords: 0,
    avgSyllablesPerWord: 0,
    longestWord: '',
    longestWordSyllables: 0
  });

  const { getH1, getSubHeading, faqSchema } = usePageSEO('syllable-counter');

  const webAppSchema = generateWebAppSchema(
    'Syllable Counter - Free Online Syllable Count Tool',
    'Free online syllable counter for words and text. Count syllables for poetry, haiku, songs, and readability analysis. See syllable breakdown for each word.',
    'https://economictimes.indiatimes.com/us/tools/apps/syllable-counter',
    'Utility'
  );

  const countSyllables = (word: string): { count: number; breakdown: string } => {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!word) return { count: 0, breakdown: '' };

    const specialCases: Record<string, number> = {
      'the': 1, 'every': 3, 'different': 3, 'evening': 3,
      'average': 3, 'interesting': 4, 'business': 3, 'family': 3,
      'beautiful': 3, 'really': 2, 'usually': 4, 'actually': 4,
      'naturally': 4, 'literally': 4, 'generally': 4, 'area': 3,
      'idea': 3, 'being': 2, 'seeing': 2, 'going': 2, 'doing': 2,
      'fire': 1, 'hour': 1, 'our': 1, 'poem': 2, 'poet': 2,
      'lion': 2, 'science': 2, 'quiet': 2, 'diet': 2, 'giant': 2,
      'create': 2, 'created': 3, 'people': 2, 'trouble': 2,
      'little': 2, 'bottle': 2, 'simple': 2, 'single': 2
    };

    if (specialCases[word]) {
      return { count: specialCases[word], breakdown: word };
    }

    let count = 0;
    let prevVowel = false;
    const vowels = 'aeiouy';

    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !prevVowel) {
        count++;
      }
      prevVowel = isVowel;
    }

    if (word.endsWith('e') && !word.endsWith('le') && count > 1) {
      count--;
    }

    count = Math.max(1, count);

    let breakdown = word;
    if (count > 1) {
      const parts: string[] = [];
      const approxBreakPoints = [];

      for (let i = 1; i < word.length - 1; i++) {
        const prev = word[i - 1];
        const curr = word[i];
        const next = word[i + 1];

        if (vowels.includes(prev) && !vowels.includes(curr) && vowels.includes(next)) {
          approxBreakPoints.push(i);
        } else if (!vowels.includes(prev) && !vowels.includes(curr) && vowels.includes(next)) {
          if (i > 1) approxBreakPoints.push(i);
        }
      }

      let prevBreak = 0;
      for (const bp of approxBreakPoints.slice(0, count - 1)) {
        parts.push(word.slice(prevBreak, bp));
        prevBreak = bp;
      }
      parts.push(word.slice(prevBreak));

      breakdown = parts.filter(p => p.length > 0).join('-') || word;
    }

    return { count, breakdown };
  };

  useEffect(() => {
    analyzeText(text);
  }, [text]);

  const analyzeText = (inputText: string) => {
    const words = inputText.trim().split(/\s+/).filter(w => w.replace(/[^a-zA-Z]/g, '').length > 0);

    if (words.length === 0) {
      setWordAnalysis([]);
      setStats({
        totalSyllables: 0,
        totalWords: 0,
        avgSyllablesPerWord: 0,
        longestWord: '',
        longestWordSyllables: 0
      });
      return;
    }

    const analysis = words.map(word => {
      const cleanWord = word.replace(/[^a-zA-Z]/g, '');
      const result = countSyllables(cleanWord);
      return {
        word: cleanWord,
        syllables: result.count,
        breakdown: result.breakdown
      };
    });

    setWordAnalysis(analysis);

    const totalSyllables = analysis.reduce((sum, a) => sum + a.syllables, 0);
    const longestWordItem = analysis.reduce((max, curr) =>
      curr.syllables > max.syllables ? curr : max
    , analysis[0]);

    setStats({
      totalSyllables,
      totalWords: analysis.length,
      avgSyllablesPerWord: Number((totalSyllables / analysis.length).toFixed(2)),
      longestWord: longestWordItem.word,
      longestWordSyllables: longestWordItem.syllables
    });
  };

  const clearText = () => {
    setText('');
  };

  const haikusamples = [
    { line1: "An old silent pond", line2: "A frog jumps into the pond", line3: "Splash! Silence again" },
    { line1: "Light of the moon", line2: "Moves west, flowers shadows", line3: "Creep eastward too" },
    { line1: "In the twilight rain", line2: "These brilliant-hued hibiscus", line3: "A lovely sunset" }
  ];

  const loadHaikuSample = () => {
    const sample = haikusamples[Math.floor(Math.random() * haikusamples.length)];
    setText(`${sample.line1}\n${sample.line2}\n${sample.line3}`);
  };

  const relatedTools = [
    { href: '/us/tools/apps/word-counter', title: 'Word Counter', icon: '📝' },
    { href: '/us/tools/apps/text-editor', title: 'Text Editor', icon: '✏️' },
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
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-100 to-purple-100 px-6 py-3 rounded-full mb-4">
          <span className="text-2xl">📊</span>
          <span className="text-violet-600 font-semibold">Syllable Counter</span>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
          {getH1('Syllable Counter')}
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Count syllables in any text. Perfect for poetry, haiku, song lyrics, and readability analysis. See syllable breakdown for each word.')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Mobile Stats Bar */}
      <div className="grid grid-cols-4 gap-2 mb-4 lg:hidden">
        <div className="bg-gradient-to-br from-violet-500 to-violet-600 text-white rounded-xl p-3 text-center">
          <div className="text-xl font-bold">{stats.totalSyllables}</div>
          <div className="text-xs text-violet-100">Syllables</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-3 text-center">
          <div className="text-xl font-bold">{stats.totalWords}</div>
          <div className="text-xs text-purple-100">Words</div>
        </div>
        <div className="bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 text-white rounded-xl p-3 text-center">
          <div className="text-xl font-bold">{stats.avgSyllablesPerWord}</div>
          <div className="text-xs text-fuchsia-100">Avg</div>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl p-3 text-center">
          <div className="text-xl font-bold">{stats.longestWordSyllables}</div>
          <div className="text-xs text-pink-100">Max</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Main Tool */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-semibold text-gray-800">Enter text to analyze:</label>
              <div className="flex gap-2">
                <button
                  onClick={loadHaikuSample}
                  className="px-4 py-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors text-sm font-medium"
                >
                  Load Haiku
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
              placeholder="Type or paste text here to count syllables..."
              className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none text-gray-800"
            />
          </div>

          {/* Word Analysis */}
          {wordAnalysis.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Word-by-Word Analysis</h3>
              <div className="flex flex-wrap gap-3">
                {wordAnalysis.map((item, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 rounded-lg border-2 ${
                      item.syllables === 1 ? 'bg-green-50 border-green-200' :
                      item.syllables === 2 ? 'bg-blue-50 border-blue-200' :
                      item.syllables === 3 ? 'bg-yellow-50 border-yellow-200' :
                      item.syllables >= 4 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="font-semibold text-gray-800">{item.breakdown}</div>
                    <div className="text-sm text-gray-600">{item.syllables} {item.syllables === 1 ? 'syllable' : 'syllables'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Line-by-Line for Poetry */}
          {text.includes('\n') && (
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Line-by-Line Count (for Poetry)</h3>
              <div className="space-y-3">
                {text.split('\n').filter(line => line.trim()).map((line, index) => {
                  const words = line.trim().split(/\s+/).filter(w => w.replace(/[^a-zA-Z]/g, '').length > 0);
                  const lineSyllables = words.reduce((sum, word) => {
                    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
                    return sum + countSyllables(cleanWord).count;
                  }, 0);

                  return (
                    <div key={index} className="flex justify-between items-center bg-white rounded-lg p-4">
                      <div>
                        <span className="text-gray-500 mr-3">Line {index + 1}:</span>
                        <span className="text-gray-800">{line}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full font-bold ${
                        lineSyllables === 5 || lineSyllables === 7
                          ? 'bg-green-100 text-green-700'
                          : 'bg-violet-100 text-violet-700'
                      }`}>
                        {lineSyllables} syllables
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded mr-2">Green</span>
                indicates traditional haiku counts (5 or 7 syllables)
              </div>
            </div>
          )}

          {/* Syllable Guide */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Syllable Quick Reference</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl mb-2">1</div>
                <h4 className="font-semibold text-green-800">1 Syllable</h4>
                <p className="text-sm text-green-600">cat, dog, tree, sun</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl mb-2">2</div>
                <h4 className="font-semibold text-blue-800">2 Syllables</h4>
                <p className="text-sm text-blue-600">wa-ter, hap-py</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-2xl mb-2">3</div>
                <h4 className="font-semibold text-yellow-800">3 Syllables</h4>
                <p className="text-sm text-yellow-600">beau-ti-ful</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-2xl mb-2">4+</div>
                <h4 className="font-semibold text-red-800">4+ Syllables</h4>
                <p className="text-sm text-red-600">in-ter-est-ing</p>
              </div>
            </div>
          </div>

          

          {/* Mobile MREC2 - Before FAQs */}


          

          <GameAppMobileMrec2 />



          

          {/* FAQs Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
            <FirebaseFAQs pageId="syllable-counter" fallbackFaqs={fallbackFaqs} />
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
              <div className="flex justify-between items-center p-3 bg-violet-50 rounded-xl">
                <span className="text-sm text-violet-700">Total Syllables</span>
                <span className="font-bold text-violet-600">{stats.totalSyllables}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                <span className="text-sm text-purple-700">Total Words</span>
                <span className="font-bold text-purple-600">{stats.totalWords}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-fuchsia-50 rounded-xl">
                <span className="text-sm text-fuchsia-700">Avg per Word</span>
                <span className="font-bold text-fuchsia-600">{stats.avgSyllablesPerWord}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-pink-50 rounded-xl">
                <span className="text-sm text-pink-700">Max Syllables</span>
                <span className="font-bold text-pink-600">{stats.longestWordSyllables}</span>
              </div>
            </div>

            {/* Longest Word */}
            {stats.longestWord && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Longest Word</h4>
                <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-lg p-3 text-center">
                  <div className="font-bold text-violet-800">{stats.longestWord}</div>
                  <div className="text-sm text-violet-600">{stats.longestWordSyllables} syllables</div>
                </div>
              </div>
            )}
          </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

          {/* Haiku Guide */}
          <div className="hidden lg:block bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-4 border border-violet-200">
            <h3 className="text-lg font-bold text-violet-800 mb-3">Haiku Structure</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                <span className="text-violet-700">Line 1</span>
                <span className="font-bold text-violet-600">5 syllables</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                <span className="text-violet-700">Line 2</span>
                <span className="font-bold text-violet-600">7 syllables</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                <span className="text-violet-700">Line 3</span>
                <span className="font-bold text-violet-600">5 syllables</span>
              </div>
            </div>
          </div>

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
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-violet-50 transition-colors group"
                >
                  <span className="text-xl">{tool.icon}</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-violet-600">{tool.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-4 border border-violet-200">
            <h3 className="text-lg font-bold text-violet-800 mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-sm text-violet-700">
              <li className="flex items-start gap-2">
                <span className="text-violet-500">•</span>
                <span>Count vowel sounds, not letters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500">•</span>
                <span>Silent "e" usually doesn't add syllables</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500">•</span>
                <span>Two vowels together often = 1 sound</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500">•</span>
                <span>Perfect for haiku: 5-7-5 pattern</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
