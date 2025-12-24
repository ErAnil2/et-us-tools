'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import AdBanner from '@/components/AdBanner';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'What is a word combiner tool?',
    answer: 'A word combiner tool helps you merge, blend, or combine multiple words to create new words, portmanteaus, or compound words. It\'s useful for creating brand names, usernames, creative writing, and wordplay.',
    order: 1
  },
  {
    id: '2',
    question: 'What is a portmanteau?',
    answer: 'A portmanteau is a word that blends the sounds and meanings of two other words. Examples include "brunch" (breakfast + lunch), "smog" (smoke + fog), and "podcast" (iPod + broadcast).',
    order: 2
  },
  {
    id: '3',
    question: 'How do I create good word combinations?',
    answer: 'For good combinations, look for words that share common letters or sounds at their junction point. The best portmanteaus flow naturally when spoken and clearly evoke both original words.',
    order: 3
  },
  {
    id: '4',
    question: 'Can I use combined words for business names?',
    answer: 'Yes! Many successful brands use portmanteaus (Pinterest = pin + interest, Instagram = instant + telegram). However, always check trademark availability before using a combined word commercially.',
    order: 4
  },
  {
    id: '5',
    question: 'What combination methods are available?',
    answer: 'This tool offers several methods: simple concatenation, portmanteau blending (overlapping letters), prefix/suffix combinations, interleaving, and acronym generation.',
    order: 5
  },
  {
    id: '6',
    question: 'How many words can I combine at once?',
    answer: 'You can combine 2 or more words. For portmanteaus, 2 words work best. For acronyms and concatenation, you can use multiple words to create longer combinations.',
    order: 6
  }
];

type CombineMethod = 'portmanteau' | 'concatenate' | 'interleave' | 'acronym' | 'prefix-suffix' | 'all';

interface CombinedWord {
  word: string;
  method: string;
  description: string;
}

export default function WordCombinerClient() {
  const [word1, setWord1] = useState('');
  const [word2, setWord2] = useState('');
  const [additionalWords, setAdditionalWords] = useState('');
  const [method, setMethod] = useState<CombineMethod>('all');
  const [results, setResults] = useState<CombinedWord[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const { getH1, getSubHeading, faqSchema } = usePageSEO('word-combiner');

  const webAppSchema = generateWebAppSchema(
    'Word Combiner - Create Portmanteaus & Combined Words',
    'Free online word combiner tool. Create portmanteaus, blend words, generate acronyms, and combine words for brand names, usernames, and creative writing.',
    'https://economictimes.indiatimes.com/us/tools/apps/word-combiner',
    'Utility'
  );

  const findOverlap = (w1: string, w2: string): { overlap: string; index: number } => {
    for (let i = Math.min(w1.length, w2.length); i > 0; i--) {
      if (w1.slice(-i).toLowerCase() === w2.slice(0, i).toLowerCase()) {
        return { overlap: w1.slice(-i), index: i };
      }
    }
    return { overlap: '', index: 0 };
  };

  const generatePortmanteaus = (w1: string, w2: string): CombinedWord[] => {
    const results: CombinedWord[] = [];
    const w1Lower = w1.toLowerCase();
    const w2Lower = w2.toLowerCase();

    const { overlap, index } = findOverlap(w1Lower, w2Lower);
    if (overlap.length >= 1) {
      const blended = w1 + w2.slice(index);
      results.push({
        word: blended.charAt(0).toUpperCase() + blended.slice(1),
        method: 'Natural Blend',
        description: `"${w1}" + "${w2}" overlapping at "${overlap}"`
      });
    }

    const mid1 = Math.ceil(w1.length / 2);
    const mid2 = Math.floor(w2.length / 2);
    const halfBlend = w1.slice(0, mid1) + w2.slice(mid2);
    results.push({
      word: halfBlend.charAt(0).toUpperCase() + halfBlend.slice(1),
      method: 'Half Blend',
      description: `First half of "${w1}" + second half of "${w2}"`
    });

    const beginEnd = w1.slice(0, Math.ceil(w1.length * 0.6)) + w2.slice(Math.floor(w2.length * 0.4));
    if (beginEnd !== halfBlend) {
      results.push({
        word: beginEnd.charAt(0).toUpperCase() + beginEnd.slice(1),
        method: '60/40 Blend',
        description: `60% of "${w1}" + 40% of "${w2}"`
      });
    }

    const firstSyl = Math.min(3, Math.ceil(w1.length / 2));
    const sylBlend = w1.slice(0, firstSyl) + w2;
    results.push({
      word: sylBlend.charAt(0).toUpperCase() + sylBlend.slice(1),
      method: 'Prefix Blend',
      description: `Start of "${w1}" + full "${w2}"`
    });

    const lastSyl = Math.max(1, Math.floor(w2.length / 2));
    const suffixBlend = w1 + w2.slice(-lastSyl);
    results.push({
      word: suffixBlend.charAt(0).toUpperCase() + suffixBlend.slice(1),
      method: 'Suffix Blend',
      description: `Full "${w1}" + end of "${w2}"`
    });

    const { overlap: revOverlap, index: revIndex } = findOverlap(w2Lower, w1Lower);
    if (revOverlap.length >= 1) {
      const revBlend = w2 + w1.slice(revIndex);
      results.push({
        word: revBlend.charAt(0).toUpperCase() + revBlend.slice(1),
        method: 'Reverse Natural Blend',
        description: `"${w2}" + "${w1}" overlapping at "${revOverlap}"`
      });
    }

    return results;
  };

  const generateConcatenations = (words: string[]): CombinedWord[] => {
    const results: CombinedWord[] = [];

    results.push({
      word: words.join(''),
      method: 'Simple Join',
      description: 'Words joined directly'
    });

    const camelCase = words.map((w, i) =>
      i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    ).join('');
    results.push({
      word: camelCase,
      method: 'camelCase',
      description: 'First word lowercase, rest capitalized'
    });

    const pascalCase = words.map(w =>
      w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    ).join('');
    results.push({
      word: pascalCase,
      method: 'PascalCase',
      description: 'Each word capitalized'
    });

    results.push({
      word: words.join('-').toLowerCase(),
      method: 'Hyphenated',
      description: 'Words joined with hyphens'
    });

    results.push({
      word: words.join('_').toLowerCase(),
      method: 'snake_case',
      description: 'Words joined with underscores'
    });

    return results;
  };

  const generateInterleaved = (w1: string, w2: string): CombinedWord[] => {
    const results: CombinedWord[] = [];
    const maxLen = Math.max(w1.length, w2.length);

    let interleaved = '';
    for (let i = 0; i < maxLen; i++) {
      if (i < w1.length) interleaved += w1[i];
      if (i < w2.length) interleaved += w2[i];
    }
    results.push({
      word: interleaved.charAt(0).toUpperCase() + interleaved.slice(1).toLowerCase(),
      method: 'Interleaved',
      description: 'Characters alternated from each word'
    });

    let revInterleaved = '';
    for (let i = 0; i < maxLen; i++) {
      if (i < w2.length) revInterleaved += w2[i];
      if (i < w1.length) revInterleaved += w1[i];
    }
    results.push({
      word: revInterleaved.charAt(0).toUpperCase() + revInterleaved.slice(1).toLowerCase(),
      method: 'Reverse Interleaved',
      description: 'Characters alternated (reversed order)'
    });

    return results;
  };

  const generateAcronyms = (words: string[]): CombinedWord[] => {
    const results: CombinedWord[] = [];

    const acronym = words.map(w => w.charAt(0).toUpperCase()).join('');
    results.push({
      word: acronym,
      method: 'Acronym',
      description: 'First letter of each word (uppercase)'
    });

    results.push({
      word: acronym.toLowerCase(),
      method: 'Acronym (lowercase)',
      description: 'First letter of each word (lowercase)'
    });

    if (words.every(w => w.length >= 2)) {
      const twoLetter = words.map(w => w.slice(0, 2)).join('');
      results.push({
        word: twoLetter.charAt(0).toUpperCase() + twoLetter.slice(1).toLowerCase(),
        method: 'Two-Letter Acronym',
        description: 'First two letters of each word'
      });
    }

    const vowels = 'aeiou';
    let pronounceable = '';
    words.forEach(w => {
      pronounceable += w.charAt(0);
      for (let i = 1; i < w.length && pronounceable.length < words.length * 2; i++) {
        if (vowels.includes(w[i].toLowerCase())) {
          pronounceable += w[i];
          break;
        }
      }
    });
    if (pronounceable.length > acronym.length) {
      results.push({
        word: pronounceable.charAt(0).toUpperCase() + pronounceable.slice(1).toLowerCase(),
        method: 'Pronounceable',
        description: 'First consonant + first vowel of each word'
      });
    }

    return results;
  };

  const generatePrefixSuffix = (w1: string, w2: string): CombinedWord[] => {
    const results: CombinedWord[] = [];
    const commonPrefixes = ['un', 're', 'pre', 'dis', 'mis', 'non', 'anti', 'super', 'ultra', 'mega'];
    const commonSuffixes = ['ify', 'ize', 'able', 'ible', 'ful', 'less', 'ness', 'ment', 'tion', 'ly'];

    const combined = w1 + w2;
    commonPrefixes.slice(0, 4).forEach(prefix => {
      results.push({
        word: prefix + combined.charAt(0).toUpperCase() + combined.slice(1).toLowerCase(),
        method: `Prefix: ${prefix}-`,
        description: `"${prefix}" + combined words`
      });
    });

    commonSuffixes.slice(0, 4).forEach(suffix => {
      results.push({
        word: combined.charAt(0).toUpperCase() + combined.slice(1).toLowerCase() + suffix,
        method: `Suffix: -${suffix}`,
        description: `Combined words + "${suffix}"`
      });
    });

    return results;
  };

  const combineWords = () => {
    if (!word1.trim() || !word2.trim()) return;

    const w1 = word1.trim();
    const w2 = word2.trim();
    const allWords = [w1, w2, ...additionalWords.split(/[\s,]+/).filter(w => w.trim())];

    let combinedResults: CombinedWord[] = [];

    if (method === 'all' || method === 'portmanteau') {
      combinedResults = [...combinedResults, ...generatePortmanteaus(w1, w2)];
    }

    if (method === 'all' || method === 'concatenate') {
      combinedResults = [...combinedResults, ...generateConcatenations(allWords)];
    }

    if (method === 'all' || method === 'interleave') {
      combinedResults = [...combinedResults, ...generateInterleaved(w1, w2)];
    }

    if (method === 'all' || method === 'acronym') {
      combinedResults = [...combinedResults, ...generateAcronyms(allWords)];
    }

    if (method === 'all' || method === 'prefix-suffix') {
      combinedResults = [...combinedResults, ...generatePrefixSuffix(w1, w2)];
    }

    const seen = new Set<string>();
    combinedResults = combinedResults.filter(r => {
      const lower = r.word.toLowerCase();
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });

    setResults(combinedResults);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllResults = () => {
    const text = results.map(r => r.word).join('\n');
    navigator.clipboard.writeText(text);
  };

  const clearAll = () => {
    setWord1('');
    setWord2('');
    setAdditionalWords('');
    setResults([]);
  };

  const relatedTools = [
    { name: 'Anagram Solver', href: '/us/tools/apps/anagram-solver', description: 'Find word anagrams' },
    { name: 'Jumble Solver', href: '/us/tools/apps/jumble-solver', description: 'Unscramble letters' },
    { name: 'Scrabble Helper', href: '/us/tools/apps/scrabble-helper', description: 'Score more points' },
    { name: 'Wordle Solver', href: '/us/tools/apps/wordle-solver', description: 'Get Wordle hints' },
  ];

  const famousPortmanteaus = [
    { word: 'Brunch', from: 'breakfast + lunch' },
    { word: 'Smog', from: 'smoke + fog' },
    { word: 'Motel', from: 'motor + hotel' },
    { word: 'Podcast', from: 'iPod + broadcast' },
    { word: 'Pinterest', from: 'pin + interest' },
    { word: 'Instagram', from: 'instant + telegram' },
    { word: 'Emoticon', from: 'emotion + icon' },
    { word: 'Bollywood', from: 'Bombay + Hollywood' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-full mb-4">
          <span className="text-2xl">🔗</span>
          <span className="text-purple-600 font-semibold">Word Combiner</span>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          {getH1('Word Combiner & Portmanteau Generator')}
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Combine words to create portmanteaus, brand names, usernames, and creative word blends.')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Mobile Stats Bar */}
      <div className="grid grid-cols-4 gap-2 mb-4 lg:hidden">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-purple-600">{word1.length + word2.length}</div>
          <div className="text-xs text-gray-500">Letters</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-blue-600">{results.length}</div>
          <div className="text-xs text-gray-500">Results</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-green-600">{method === 'all' ? 5 : 1}</div>
          <div className="text-xs text-gray-500">Methods</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-amber-600">{additionalWords.split(/[\s,]+/).filter(w => w.trim()).length + 2}</div>
          <div className="text-xs text-gray-500">Words</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Word *</label>
                <input
                  type="text"
                  value={word1}
                  onChange={(e) => setWord1(e.target.value)}
                  placeholder="e.g., breakfast"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Second Word *</label>
                <input
                  type="text"
                  value={word2}
                  onChange={(e) => setWord2(e.target.value)}
                  placeholder="e.g., lunch"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Words (optional, for acronyms)
              </label>
              <input
                type="text"
                value={additionalWords}
                onChange={(e) => setAdditionalWords(e.target.value)}
                placeholder="e.g., word3, word4 (comma or space separated)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Combination Method</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All Methods' },
                  { value: 'portmanteau', label: 'Portmanteau' },
                  { value: 'concatenate', label: 'Concatenate' },
                  { value: 'interleave', label: 'Interleave' },
                  { value: 'acronym', label: 'Acronym' },
                  { value: 'prefix-suffix', label: 'Prefix/Suffix' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setMethod(opt.value as CombineMethod)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      method === opt.value
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={combineWords}
                disabled={!word1.trim() || !word2.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Combine Words
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Results Section */}
          {results.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Combined Words ({results.length} results)
                </h2>
                <button
                  onClick={copyAllResults}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors"
                >
                  Copy All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xl font-bold text-purple-700">{result.word}</span>
                      <button
                        onClick={() => copyToClipboard(result.word, index)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                          copiedIndex === index
                            ? 'bg-green-500 text-white'
                            : 'bg-white text-purple-600 hover:bg-purple-100'
                        }`}
                      >
                        {copiedIndex === index ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div className="text-sm text-purple-600 font-medium mb-1">{result.method}</div>
                    <div className="text-sm text-gray-600">{result.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Famous Examples */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Famous Portmanteau Examples</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {famousPortmanteaus.map(example => (
                <div key={example.word} className="bg-white rounded-xl p-4 text-center">
                  <div className="font-bold text-purple-700 text-lg">{example.word}</div>
                  <div className="text-sm text-gray-500">{example.from}</div>
                </div>
              ))}
            </div>
          </div>

          

          {/* Mobile MREC2 - Before FAQs */}


          

          <GameAppMobileMrec2 />



          

          {/* FAQs Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
            <FirebaseFAQs pageId="word-combiner" fallbackFaqs={fallbackFaqs} />
          </div>
        </div>
{/* Right Sidebar */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Desktop Stats Panel */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Combiner Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <span className="text-gray-600">Total Letters</span>
                <span className="font-bold text-purple-600">{word1.length + word2.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <span className="text-gray-600">Results</span>
                <span className="font-bold text-blue-600">{results.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <span className="text-gray-600">Active Methods</span>
                <span className="font-bold text-green-600">{method === 'all' ? 5 : 1}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                <span className="text-gray-600">Words to Combine</span>
                <span className="font-bold text-amber-600">{additionalWords.split(/[\s,]+/).filter(w => w.trim()).length + (word1 ? 1 : 0) + (word2 ? 1 : 0)}</span>
              </div>
            </div>
          </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

          {/* Ad Banner */}
          <div className="hidden lg:block">
            <AdBanner className="w-full" />
          </div>
{/* Related Tools */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Related Tools</h3>
            <div className="space-y-2">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-purple-50 rounded-xl transition-colors group"
                >
                  <div>
                    <div className="font-medium text-gray-800 group-hover:text-purple-600">{tool.name}</div>
                    <div className="text-xs text-gray-500">{tool.description}</div>
                  </div>
                  <span className="text-gray-400 group-hover:text-purple-500">-&gt;</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="hidden lg:block bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">*</span>
                <span>Look for words with overlapping sounds for natural blends</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">*</span>
                <span>Say combinations out loud to test pronunciation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">*</span>
                <span>Great for creating brand names and usernames</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">*</span>
                <span>Use All Methods for maximum creativity</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
