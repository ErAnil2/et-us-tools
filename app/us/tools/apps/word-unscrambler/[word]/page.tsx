import { Metadata } from 'next';
import Link from 'next/link';
import WordUnscramblerClient from './WordUnscramblerClient';

interface PageProps {
  params: Promise<{ word: string }>;
}

interface WordData {
  word: string;
  phonetic?: string;
  phonetics?: Array<{ audio?: string; text?: string }>;
  origin?: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
    synonyms?: string[];
    antonyms?: string[];
  }>;
}

async function getWordData(word: string): Promise<WordData | null> {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    if (response.ok) {
      const data = await response.json();
      return data[0];
    }
  } catch (error) {
    console.error('Failed to fetch word data:', error);
  }
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { word } = await params;
  const wordUpper = word?.toUpperCase() || '';
  const wordData = await getWordData(word);

  const description = wordData?.meanings?.[0]?.definitions?.[0]?.definition ||
    `Explore the word ${wordUpper} with detailed definitions, meanings, pronunciations, and usage examples.`;

  return {
    title: `${wordUpper} - Definition, Meaning & Word Details | Word Unscrambler`,
    description,
    openGraph: {
      title: `${wordUpper} - Definition, Meaning & Word Details | Word Unscrambler`,
      description,
      url: `https://economictimes.indiatimes.com/us/tools/apps/word-unscrambler/${word}`,
      type: 'website',
    },
  };
}

export default async function WordUnscramblerPage({ params }: PageProps) {
  const { word } = await params;
  const wordUpper = word?.toUpperCase() || '';
  const wordData = await getWordData(word);

  return (
    <>
      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-200 py-3 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link href="/us/tools" className="text-blue-600 hover:text-blue-800">Tools</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/us/tools/apps" className="text-blue-600 hover:text-blue-800">Apps</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-700 font-medium">{wordUpper}</li>
          </ol>
        </div>
      </nav>

      {/* Word Details Section */}
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/us/tools/apps"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Apps
          </Link>
        </div>

        {/* Word Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{wordUpper}</h1>

          {wordData?.phonetic && (
            <div className="mb-4">
              <span className="text-lg text-gray-600 font-mono">{wordData.phonetic}</span>
              {wordData.phonetics?.find(p => p.audio) && (
                <WordUnscramblerClient
                  audioUrl={wordData.phonetics.find(p => p.audio)?.audio || ''}
                  word={wordUpper}
                />
              )}
            </div>
          )}

          {/* Word Stats - Client Component will populate these */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Length:</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-800">{wordUpper.length} letters</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Scrabble Points:</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-bold" id="scrabbleScore">
                {calculateScrabbleScore(wordUpper)} pts
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Vowels:</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                {countVowels(wordUpper)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Consonants:</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                {countConsonants(wordUpper)}
              </span>
            </div>
          </div>
        </div>

        {wordData ? (
          /* Definitions Section */
          <div className="space-y-6">
            {wordData.meanings.map((meaning, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize mb-3">
                    {meaning.partOfSpeech}
                  </span>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {index === 0 ? 'Definition' : `Definition ${index + 1}`}
                  </h2>
                </div>

                <div className="space-y-4">
                  {meaning.definitions.map((def, defIndex) => (
                    <div key={defIndex} className="pl-4 border-l-4 border-blue-500">
                      <p className="text-lg text-gray-800 mb-2">{def.definition}</p>

                      {def.example && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Example:</span> <em>&quot;{def.example}&quot;</em>
                          </p>
                        </div>
                      )}

                      {def.synonyms && def.synonyms.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm font-semibold text-gray-700">Synonyms: </span>
                          <span className="text-sm text-gray-600">{def.synonyms.join(', ')}</span>
                        </div>
                      )}

                      {def.antonyms && def.antonyms.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm font-semibold text-gray-700">Antonyms: </span>
                          <span className="text-sm text-gray-600">{def.antonyms.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {meaning.synonyms && meaning.synonyms.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Words (Synonyms)</h3>
                    <div className="flex flex-wrap gap-2">
                      {meaning.synonyms.slice(0, 10).map((synonym, synIndex) => (
                        <Link
                          key={synIndex}
                          href={`/us/tools/apps/word-unscrambler/${synonym.toLowerCase()}`}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm transition-colors"
                        >
                          {synonym}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {wordData.origin && (
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Etymology (Origin)</h2>
                <p className="text-gray-700 leading-relaxed">{wordData.origin}</p>
              </div>
            )}
          </div>
        ) : (
          /* No Definition Found */
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center">
            <div className="text-6xl mb-4">📖</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Definition Not Available</h2>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t find a definition for &quot;{wordUpper}&quot; in our dictionary.
            </p>
            <Link
              href="/us/tools/apps"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Back to Apps
            </Link>
          </div>
        )}

        {/* Letter Analysis */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Letter Analysis</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {getLetterBreakdown(wordUpper).map(({ letter, count, points }) => (
              <div key={letter} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl font-bold text-gray-900">{letter}</span>
                <span className="text-sm text-gray-600">{count}x ({points} pt{points !== 1 ? 's' : ''})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// Helper functions
const scrabbleValues: Record<string, number> = {
  A: 1, E: 1, I: 1, O: 1, U: 1, L: 1, N: 1, R: 1, S: 1, T: 1,
  D: 2, G: 2,
  B: 3, C: 3, M: 3, P: 3,
  F: 4, H: 4, V: 4, W: 4, Y: 4,
  K: 5,
  J: 8, X: 8,
  Q: 10, Z: 10
};

function calculateScrabbleScore(word: string): number {
  return word.split('').reduce((score, letter) => score + (scrabbleValues[letter] || 0), 0);
}

function countVowels(word: string): number {
  return word.split('').filter(letter => 'AEIOU'.includes(letter)).length;
}

function countConsonants(word: string): number {
  return word.split('').filter(letter => letter.match(/[A-Z]/) && !'AEIOU'.includes(letter)).length;
}

function getLetterBreakdown(word: string): Array<{ letter: string; count: number; points: number }> {
  const letterCounts: Record<string, number> = {};
  word.split('').forEach(letter => {
    letterCounts[letter] = (letterCounts[letter] || 0) + 1;
  });

  return Object.entries(letterCounts)
    .sort(([,a], [,b]) => b - a)
    .map(([letter, count]) => ({
      letter,
      count,
      points: scrabbleValues[letter] || 0
    }));
}
