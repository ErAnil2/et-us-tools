'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import AdBanner from '@/components/AdBanner';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'What is Quordle?',
    answer: 'Quordle is a word puzzle game where you solve four Wordle-style puzzles simultaneously. You have 9 guesses to find all four 5-letter words, and each guess applies to all four puzzles at once.',
    order: 1
  },
  {
    id: '2',
    question: 'How does this Quordle solver work?',
    answer: 'Enter your guesses and mark each letter as green (correct position), yellow (wrong position), or gray (not in word) for each of the four puzzles. The solver filters possible words based on your clues.',
    order: 2
  },
  {
    id: '3',
    question: 'What\'s a good starting word for Quordle?',
    answer: 'Words with common letters like SLATE, CRANE, AUDIO, or ROATE are excellent starters. They cover common vowels and consonants to maximize information from your first guess.',
    order: 3
  },
  {
    id: '4',
    question: 'Why are some words not in the suggestions?',
    answer: 'This solver uses a curated list of common 5-letter English words. Very obscure words might not be included. The goal is to suggest likely Quordle answers.',
    order: 4
  },
  {
    id: '5',
    question: 'How is Quordle different from Wordle?',
    answer: 'In Wordle, you solve one word in 6 guesses. In Quordle, you solve four words with 9 guesses, and each guess counts toward all four puzzles simultaneously.',
    order: 5
  },
  {
    id: '6',
    question: 'Can I use this for daily Quordle?',
    answer: 'Yes! This solver helps with both daily Quordle and practice games. Enter your guesses and results to get suggestions for possible answers.',
    order: 6
  }
];

// Common 5-letter words for Quordle (shortened for brevity)
const WORD_LIST = [
  'about','above','abuse','actor','acute','admit','adopt','adult','after','again','agent','agree','ahead','alarm','album',
  'alert','alike','alive','allow','alone','along','alter','among','anger','angle','angry','apart','apple','apply','arena',
  'argue','arise','armor','array','arrow','aside','asset','avoid','award','aware','awful','bacon','badge','badly','baker',
  'basic','basin','basis','batch','beach','beast','began','begin','begun','being','belly','below','bench','berry','birth',
  'black','blade','blame','blank','blast','blaze','bleed','blend','bless','blind','block','blood','blown','blues','blunt',
  'board','boast','bonus','boost','booth','bound','brain','brand','brass','brave','bread','break','breed','brick','bride',
  'brief','bring','broad','broke','brook','brown','brush','buddy','build','built','bunch','burst','buyer','cable','camel',
  'canal','candy','cargo','carry','carve','catch','cause','cease','chain','chair','chalk','champ','chaos','charm','chart',
  'chase','cheap','check','cheek','chess','chest','chief','child','chill','china','chose','chunk','civic','civil','claim',
  'clamp','clash','class','clean','clear','clerk','click','cliff','climb','cling','clock','clone','close','cloth','cloud',
  'coach','coast','color','couch','could','count','court','cover','crack','craft','crane','crash','crawl','crazy','cream',
  'crest','crime','crisp','cross','crowd','crown','crude','cruel','crush','curve','cycle','daily','dairy','dance','dated',
  'dealt','death','debut','decay','delay','dense','depot','depth','devil','diary','digit','dirty','doubt','dough','dozen',
  'draft','drain','drama','drank','drawn','dread','dream','dress','dried','drift','drill','drink','drive','drown','drunk',
  'dying','eager','early','earth','eight','elbow','elder','elect','elite','empty','enemy','enjoy','enter','entry','equal',
  'error','essay','event','every','exact','exist','extra','faint','fairy','faith','false','fancy','fatal','fault','favor',
  'feast','fence','fever','fewer','fiber','field','fiery','fifth','fifty','fight','final','first','fixed','flame','flash',
  'flesh','float','flock','flood','floor','flour','fluid','focus','foggy','force','forge','forth','forum','forty','found',
  'frame','frank','fraud','fresh','front','frost','fruit','fully','funny','ghost','giant','given','glass','globe','glory',
  'going','grace','grade','grain','grand','grant','grape','graph','grasp','grass','grave','great','green','grief','grill',
  'grind','gross','group','grove','grown','guard','guess','guest','guide','guilt','habit','happy','harsh','haven','heart',
  'heavy','hello','hence','hobby','honey','honor','hoped','horse','hotel','house','human','humor','hurry','ideal','image',
  'imply','index','inner','input','issue','items','joint','judge','juice','knife','knock','known','label','labor','large',
  'laser','later','laugh','layer','leads','learn','lease','least','leave','legal','lemon','level','lever','light','limit',
  'lived','liver','local','lodge','logic','loose','loved','lover','lower','loyal','lucky','lunch','lying','magic','major',
  'maker','march','marry','match','mayor','meant','medal','media','mercy','merge','merit','metal','meter','midst','might',
  'minor','minus','mixed','model','money','month','moral','motor','mount','mouse','mouth','moved','movie','music','naked',
  'named','naval','needs','nerve','never','newly','night','noble','noise','north','noted','novel','nurse','occur','ocean',
  'offer','often','olive','onion','opens','opera','orbit','order','organ','other','ought','outer','owned','owner','oxide',
  'paint','panel','panic','paper','party','pasta','patch','pause','peace','peach','pearl','penny','phase','phone','photo',
  'piano','piece','pilot','pitch','pizza','place','plain','plane','plant','plate','plaza','point','polar','pound','power',
  'press','price','pride','prime','print','prior','prize','probe','proof','proud','prove','proxy','queen','quest','quick',
  'quiet','quite','quota','quote','radar','radio','raise','rally','ranch','range','rapid','ratio','reach','react','ready',
  'realm','rebel','refer','reign','relax','reply','rider','ridge','rifle','right','rigid','river','robot','rocky','roman',
  'rough','round','route','royal','ruler','rural','sadly','saint','salad','sales','sauce','saved','scale','scene','scope',
  'score','scout','sense','serve','setup','seven','shade','shake','shall','shame','shape','share','shark','sharp','sheep',
  'sheer','sheet','shelf','shell','shift','shine','shirt','shock','shoot','shore','short','shown','sight','since','sixth',
  'sixty','sized','skill','slate','slave','sleep','slice','slide','slope','small','smart','smell','smile','smoke','snake',
  'solid','solve','sorry','sound','south','space','spare','spark','speak','speed','spend','spent','spill','spine','spite',
  'split','spoke','sport','spray','staff','stage','stake','stamp','stand','start','state','steak','steal','steam','steel',
  'steep','steer','stick','still','stock','stone','stood','store','storm','story','stove','strip','stuck','study','stuff',
  'style','sugar','suite','super','surge','swear','sweep','sweet','swift','swing','sword','table','taken','taste','taxes',
  'teach','tempo','tense','tenth','terms','thank','theft','theme','there','these','thick','thief','thing','think','third',
  'those','three','threw','throw','thumb','tiger','tight','timer','tired','title','toast','today','token','topic','total',
  'touch','tough','tower','trace','track','trade','trail','train','trash','treat','trend','trial','tribe','trick','tried',
  'tries','troop','truck','truly','trunk','trust','truth','tumor','turns','twice','twist','ultra','uncle','under','union',
  'unite','unity','until','upper','upset','urban','usage','usual','vague','valid','value','valve','venue','verse','video',
  'views','villa','virus','visit','vital','vocal','voice','voter','wages','waste','watch','water','waves','weigh','weird',
  'whale','wheat','wheel','where','which','while','white','whole','whose','width','woman','women','woods','words','world',
  'worry','worse','worst','worth','would','wound','write','wrong','wrote','yards','years','yield','young','yours','youth',
  'zones'
];

type LetterStatus = 'unknown' | 'correct' | 'present' | 'absent';

interface LetterResult {
  letter: string;
  status: LetterStatus;
}

interface GuessResult {
  word: string;
  results: [LetterResult[], LetterResult[], LetterResult[], LetterResult[]];
}

export default function QuordleSolverClient() {
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [selectedPuzzle, setSelectedPuzzle] = useState<number>(0);

  const { getH1, getSubHeading, faqSchema } = usePageSEO('quordle-solver');

  const webAppSchema = generateWebAppSchema(
    'Quordle Solver - Free Quordle Helper Tool',
    'Free Quordle solver and helper. Get word suggestions based on your guesses. Solve all four Quordle puzzles with smart filtering.',
    'https://economictimes.indiatimes.com/us/tools/apps/quordle-solver',
    'Game'
  );

  const addGuess = () => {
    if (currentGuess.length !== 5) return;

    const newGuess: GuessResult = {
      word: currentGuess.toUpperCase(),
      results: [
        currentGuess.split('').map(l => ({ letter: l.toUpperCase(), status: 'unknown' as LetterStatus })),
        currentGuess.split('').map(l => ({ letter: l.toUpperCase(), status: 'unknown' as LetterStatus })),
        currentGuess.split('').map(l => ({ letter: l.toUpperCase(), status: 'unknown' as LetterStatus })),
        currentGuess.split('').map(l => ({ letter: l.toUpperCase(), status: 'unknown' as LetterStatus })),
      ]
    };

    setGuesses([...guesses, newGuess]);
    setCurrentGuess('');
  };

  const cycleStatus = (guessIndex: number, puzzleIndex: number, letterIndex: number) => {
    const newGuesses = [...guesses];
    const currentStatus = newGuesses[guessIndex].results[puzzleIndex][letterIndex].status;
    const statusOrder: LetterStatus[] = ['unknown', 'correct', 'present', 'absent'];
    const nextIndex = (statusOrder.indexOf(currentStatus) + 1) % statusOrder.length;
    newGuesses[guessIndex].results[puzzleIndex][letterIndex].status = statusOrder[nextIndex];
    setGuesses(newGuesses);
  };

  const getStatusColor = (status: LetterStatus) => {
    switch (status) {
      case 'correct': return 'bg-green-500 text-white';
      case 'present': return 'bg-yellow-500 text-white';
      case 'absent': return 'bg-gray-500 text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const filterWords = (puzzleIndex: number): string[] => {
    let filtered = [...WORD_LIST];

    guesses.forEach(guess => {
      const puzzleResults = guess.results[puzzleIndex];

      puzzleResults.forEach((result, idx) => {
        const letter = result.letter.toLowerCase();

        if (result.status === 'correct') {
          filtered = filtered.filter(word => word[idx] === letter);
        } else if (result.status === 'present') {
          filtered = filtered.filter(word =>
            word.includes(letter) && word[idx] !== letter
          );
        } else if (result.status === 'absent') {
          const hasElsewhere = puzzleResults.some((r, i) =>
            i !== idx && r.letter === result.letter && (r.status === 'correct' || r.status === 'present')
          );
          if (!hasElsewhere) {
            filtered = filtered.filter(word => !word.includes(letter));
          } else {
            filtered = filtered.filter(word => word[idx] !== letter);
          }
        }
      });
    });

    return filtered;
  };

  const suggestions = useMemo(() => {
    return [0, 1, 2, 3].map(idx => filterWords(idx));
  }, [guesses]);

  const solvedCount = suggestions.filter(s => s.length === 1).length;

  const clearAll = () => {
    setGuesses([]);
    setCurrentGuess('');
  };

  const removeLastGuess = () => {
    setGuesses(guesses.slice(0, -1));
  };

  const relatedTools = [
    { name: 'Wordle Solver', path: '/us/tools/apps/wordle-solver', color: 'bg-green-500' },
    { name: 'Anagram Solver', path: '/us/tools/apps/anagram-solver', color: 'bg-emerald-500' },
    { name: 'Scrabble Helper', path: '/us/tools/apps/scrabble-helper', color: 'bg-blue-500' },
    { name: 'Jumble Solver', path: '/us/tools/apps/jumble-solver', color: 'bg-orange-500' },
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
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-100 to-purple-100 px-6 py-3 rounded-full mb-4">
          <span className="text-2xl">🎯</span>
          <span className="text-violet-600 font-semibold">Quordle Solver</span>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
          {getH1('Quordle Solver & Helper')}
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Get smart word suggestions for all four Quordle puzzles. Enter your guesses and mark the results.')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Mobile Stats Bar */}
      <div className="grid grid-cols-4 gap-2 mb-4 lg:hidden">
        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg p-2 text-center text-white">
          <div className="text-lg font-bold">{guesses.length}</div>
          <div className="text-xs opacity-80">Guesses</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-2 text-center text-white">
          <div className="text-lg font-bold">{9 - guesses.length}</div>
          <div className="text-xs opacity-80">Left</div>
        </div>
        <div className="bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 rounded-lg p-2 text-center text-white">
          <div className="text-lg font-bold">{solvedCount}/4</div>
          <div className="text-xs opacity-80">Solved</div>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-2 text-center text-white">
          <div className="text-lg font-bold">4</div>
          <div className="text-xs opacity-80">Puzzles</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-wrap gap-4 items-end justify-center mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter Your Guess</label>
                <input
                  type="text"
                  value={currentGuess}
                  onChange={(e) => setCurrentGuess(e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 5))}
                  placeholder="5-letter word"
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-lg uppercase tracking-widest w-40 text-center"
                  onKeyDown={(e) => e.key === 'Enter' && addGuess()}
                />
              </div>
              <button
                onClick={addGuess}
                disabled={currentGuess.length !== 5}
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-semibold hover:from-violet-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Guess
              </button>
              <button
                onClick={removeLastGuess}
                disabled={guesses.length === 0}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Undo
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-3 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors"
              >
                Clear
              </button>
            </div>

            <div className="text-center text-sm text-gray-500">
              Guesses: {guesses.length}/9 | Click letters to cycle colors
            </div>
          </div>

          {/* Four Puzzle Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[0, 1, 2, 3].map(puzzleIdx => (
              <div
                key={puzzleIdx}
                className={`bg-white rounded-2xl shadow-lg p-4 ${
                  selectedPuzzle === puzzleIdx ? 'ring-2 ring-violet-500' : ''
                }`}
                onClick={() => setSelectedPuzzle(puzzleIdx)}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
                  Puzzle {puzzleIdx + 1}
                  {suggestions[puzzleIdx].length === 1 && (
                    <span className="ml-2 text-green-600">Solved!</span>
                  )}
                </h3>

                {/* Guess Grid */}
                <div className="space-y-1 mb-3">
                  {guesses.slice(0, 5).map((guess, guessIdx) => (
                    <div key={guessIdx} className="flex justify-center gap-1">
                      {guess.results[puzzleIdx].map((result, letterIdx) => (
                        <button
                          key={letterIdx}
                          onClick={(e) => {
                            e.stopPropagation();
                            cycleStatus(guessIdx, puzzleIdx, letterIdx);
                          }}
                          className={`w-9 h-9 flex items-center justify-center font-bold text-sm rounded transition-all ${getStatusColor(result.status)}`}
                        >
                          {result.letter}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Suggestions */}
                <div className="bg-violet-50 rounded-xl p-2">
                  <div className="text-xs font-medium text-violet-700 mb-1">
                    {suggestions[puzzleIdx].length} match{suggestions[puzzleIdx].length !== 1 ? 'es' : ''}
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                    {suggestions[puzzleIdx].slice(0, 15).map(word => (
                      <span key={word} className="px-1.5 py-0.5 bg-white rounded text-xs font-mono uppercase">
                        {word}
                      </span>
                    ))}
                    {suggestions[puzzleIdx].length > 15 && (
                      <span className="text-xs text-gray-500">+{suggestions[puzzleIdx].length - 15}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">How to Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-violet-700 mb-2">Enter Guesses</h3>
                <p className="text-sm text-gray-600">Type your 5-letter guess and click Add Guess.</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-violet-700 mb-2">Mark Results</h3>
                <p className="text-sm text-gray-600">Click each letter to set its color for each puzzle.</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-violet-700 mb-2">Color Guide</h3>
                <p className="text-sm text-gray-600">
                  <span className="inline-block w-4 h-4 bg-green-500 rounded mr-1 align-middle"></span> Correct
                  <span className="inline-block w-4 h-4 bg-yellow-500 rounded mx-1 align-middle"></span> Present
                  <span className="inline-block w-4 h-4 bg-gray-500 rounded mx-1 align-middle"></span> Absent
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-violet-700 mb-2">Get Suggestions</h3>
                <p className="text-sm text-gray-600">Possible words update for each puzzle automatically.</p>
              </div>
            </div>
          </div>

          

          {/* Mobile MREC2 - Before FAQs */}


          

          <GameAppMobileMrec2 />



          

          {/* FAQs Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            <FirebaseFAQs pageId="quordle-solver" fallbackFaqs={fallbackFaqs} />
          </div>
        </div>
{/* Right Sidebar */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Desktop Stats */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Game Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-violet-50 to-violet-100 rounded-xl">
                <span className="text-gray-600">Guesses Made</span>
                <span className="font-bold text-violet-600">{guesses.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                <span className="text-gray-600">Guesses Left</span>
                <span className="font-bold text-purple-600">{9 - guesses.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-fuchsia-50 to-fuchsia-100 rounded-xl">
                <span className="text-gray-600">Puzzles Solved</span>
                <span className="font-bold text-fuchsia-600">{solvedCount}/4</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl">
                <span className="text-gray-600">Total Puzzles</span>
                <span className="font-bold text-pink-600">4</span>
              </div>
            </div>
          </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

          {/* Starting Words */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Starting Words</h3>
            <div className="flex flex-wrap gap-2">
              {['SLATE', 'CRANE', 'AUDIO', 'ROATE'].map(word => (
                <button
                  key={word}
                  onClick={() => setCurrentGuess(word.toLowerCase())}
                  className="px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg text-sm font-mono font-bold hover:bg-violet-200 transition-colors"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

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
                  key={tool.path}
                  href={tool.path}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-3 h-3 rounded-full ${tool.color}`}></div>
                  <span className="text-gray-700 hover:text-violet-600">{tool.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="hidden lg:block bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg p-4 text-white">
            <h3 className="text-lg font-bold mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Use starting words with common vowels</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Mark colors for all 4 puzzles after each guess</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Focus on puzzles with fewer remaining options</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>You have 9 guesses to solve all 4 words</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
