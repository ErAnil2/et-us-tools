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
    question: 'How are Scrabble points calculated?',
    answer: 'Each letter has a point value: common letters like E, A, I are worth 1 point, while rare letters like Q and Z are worth 10 points. The total word score is the sum of all letter values, multiplied by any board bonuses.',
    order: 1
  },
  {
    id: '2',
    question: 'What does the blank tile (?) represent?',
    answer: 'The question mark (?) represents a blank tile in Scrabble. Blank tiles can be any letter but are worth 0 points. Use ? in your letters to find words using blanks.',
    order: 2
  },
  {
    id: '3',
    question: 'How do I find words with specific letters?',
    answer: 'Enter your available letters in the input field. You can also specify letters that must be in the word, pattern matching (like _A_E), and filter by word length.',
    order: 3
  },
  {
    id: '4',
    question: 'Are all suggested words valid in Scrabble?',
    answer: 'This tool uses a curated dictionary of common English words. While most words are Scrabble-valid, always verify against your game\'s official dictionary for tournament play.',
    order: 4
  },
  {
    id: '5',
    question: 'What\'s the difference between Scrabble and Words With Friends scoring?',
    answer: 'Words With Friends uses different point values for some letters. This tool supports both scoring systems - select your game type to see accurate point calculations.',
    order: 5
  },
  {
    id: '6',
    question: 'Can I use this for crossword puzzles too?',
    answer: 'Yes! The pattern matching feature (using underscores for unknown letters) makes this tool excellent for solving crossword puzzles and other word games.',
    order: 6
  }
];

// Scrabble letter values
const SCRABBLE_VALUES: Record<string, number> = {
  a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8, k: 5, l: 1, m: 3,
  n: 1, o: 1, p: 3, q: 10, r: 1, s: 1, t: 1, u: 1, v: 4, w: 4, x: 8, y: 4, z: 10
};

// Words With Friends letter values
const WWF_VALUES: Record<string, number> = {
  a: 1, b: 4, c: 4, d: 2, e: 1, f: 4, g: 3, h: 3, i: 1, j: 10, k: 5, l: 2, m: 4,
  n: 2, o: 1, p: 4, q: 10, r: 1, s: 1, t: 1, u: 2, v: 5, w: 4, x: 8, y: 3, z: 10
};

// Common word list (shortened for brevity)
const WORD_LIST = [
  'aa','ab','ad','ae','ag','ah','ai','al','am','an','ar','as','at','aw','ax','ay','ba','be','bi','bo','by',
  'ace','act','add','ado','ads','age','ago','aid','aim','air','ale','all','and','ant','any','ape','apt','arc','are','ark','arm','art','ash','ask','ate','awe','axe','aye',
  'bad','bag','ban','bar','bat','bay','bed','bee','beg','bet','bid','big','bin','bit','bog','bow','box','boy','bud','bug','bum','bun','bus','but','buy',
  'cab','cam','can','cap','car','cat','cob','cod','cog','cop','cot','cow','cry','cub','cud','cup','cur','cut',
  'dab','dad','dam','day','den','dew','did','die','dig','dim','dip','doe','dog','don','dot','dry','dub','dud','due','dug','dun','duo','dye',
  'ear','eat','eel','egg','ego','elf','elk','elm','emu','end','era','eve','ewe','eye',
  'fad','fan','far','fat','fax','fed','fee','fen','few','fig','fin','fir','fit','fix','fly','fob','foe','fog','fop','for','fox','fry','fun','fur',
  'gab','gag','gal','gap','gas','gay','gel','gem','get','gig','gin','gnu','gob','god','got','gum','gun','gut','guy','gym',
  'had','hag','ham','has','hat','hay','hem','hen','her','hew','hex','hid','him','hip','his','hit','hob','hod','hog','hop','hot','how','hub','hue','hug','hum','hut',
  'ice','icy','ill','imp','ink','inn','ion','ire','irk','its','ivy',
  'jab','jag','jam','jar','jaw','jay','jet','jig','job','jog','jot','joy','jug','jut',
  'keg','ken','key','kid','kin','kit',
  'lab','lac','lad','lag','lap','law','lax','lay','lea','led','leg','let','lid','lie','lip','lit','log','lop','lot','low','lug',
  'mad','man','map','mar','mat','maw','may','men','met','mid','mix','mob','mom','mop','mow','mud','mug','mum',
  'nab','nag','nap','nay','net','new','nib','nil','nip','nit','nob','nod','nor','not','now','nub','nun','nut',
  'oak','oar','oat','odd','ode','off','oft','ohm','oil','old','one','opt','orb','ore','our','out','ova','owe','owl','own',
  'pad','pal','pan','pap','par','pat','paw','pay','pea','peg','pen','pep','per','pet','pew','pie','pig','pin','pit','ply','pod','pop','pot','pow','pro','pry','pub','pug','pun','pup','pus','put',
  'qi',
  'rag','ram','ran','rap','rat','raw','ray','red','ref','rib','rid','rig','rim','rip','rob','rod','roe','rot','row','rub','rue','rug','rum','run','rut','rye',
  'sac','sad','sag','sap','sat','saw','say','sea','set','sew','she','shy','sin','sip','sir','sis','sit','six','ski','sky','sly','sob','sod','son','sop','sot','sow','soy','spa','spy','sty','sub','sue','sum','sun','sup',
  'tab','tad','tag','tan','tap','tar','tat','tax','tea','ten','the','thy','tic','tie','tin','tip','tit','toe','tog','tom','ton','too','top','tot','tow','toy','try','tub','tug','tun','two',
  'ugh','ump','ups','urn','use','van','vat','vet','via','vie','vim','vow','wad','wag','war','was','wax','way','web','wed','wee','wet','who','why','wig','win','wit','woe','wok','won','woo','wow',
  'yak','yam','yap','yaw','yea','yes','yet','yew','yin','yip','you','yow','za','zap','zed','zee','zen','zig','zip','zoo',
  'able','ache','acid','aged','aide','also','area','army','away','baby','back','bake','ball','band','bank','bare','barn','base','bath','bead','beam','bean','bear','beat','been','beer','bell','belt','bend','bent','best','bird','bite','blow','blue','boat','body','boil','bold','bolt','bomb','bond','bone','book','boom','boot','born','boss','both','bowl','burn','busy',
  'cafe','cage','cake','call','calm','came','camp','cane','cape','card','care','cart','case','cash','cast','cave','cell','chat','chef','chin','chip','chop','city','clam','clan','clap','claw','clay','clip','club','clue','coal','coat','code','coin','cold','colt','come','cook','cool','cope','copy','cord','core','cork','corn','cost','cozy','crab','crew','crop','crow','cube','cult','cure','curl','cute',
  'damp','dare','dark','dash','data','date','dawn','days','dead','deal','dear','debt','deck','deed','deem','deep','deer','demo','dent','deny','desk','dial','dice','dime','dirt','disc','dish','disk','dock','does','dome','done','door','dose','dots','down','drag','draw','drew','drip','drop','drug','drum','dual','duck','dude','duel','duet','duke','dull','dump','dune','dunk','dust','duty',
  'each','earn','ease','east','easy','echo','edge','edit','else','emit','envy','epic','euro','even','ever','exam','exec','exit',
  'face','fact','fade','fail','fair','fake','fall','fame','fare','farm','fast','fate','fear','feat','feed','feel','feet','fell','felt','fern','file','fill','film','find','fine','fire','firm','fish','fist','five','flag','flap','flat','flaw','fled','flew','flip','flow','foam','fold','folk','fond','font','food','fool','foot','ford','fork','form','fort','foul','four','fowl','free','frog','from','fuel','full','fund','fuse','fuss',
  'gain','game','gang','gate','gave','gaze','gear','gene','gift','girl','give','glad','glen','glow','glue','goal','goat','goes','gold','golf','gone','good','grab','gray','grew','grey','grid','grim','grin','grip','grit','grow','gulf','guru','gust','guts',
  'hack','hail','hair','half','hall','halt','hand','hang','hard','harm','hate','haul','have','hawk','haze','head','heal','heap','hear','heat','heel','heir','held','hell','helm','help','hemp','herb','herd','here','hero','hide','high','hike','hill','hint','hire','hold','hole','holy','home','hood','hook','hope','horn','hose','host','hour','huge','hull','hung','hunt','hurt','hymn',
  'icon','idea','idle','inch','info','into','iron','item',
  'jack','jade','jail','jazz','jean','jerk','jest','jobs','john','join','joke','jolt','jump','june','junk','jury','just',
  'keen','keep','kept','kick','kill','kind','king','kiss','kite','knee','knew','knit','knob','knot','know',
  'lace','lack','lady','laid','lake','lamb','lamp','land','lane','last','late','lawn','lead','leaf','lean','leap','left','lend','lens','lent','less','lick','lies','life','lift','like','limb','lime','limp','line','link','lion','lips','list','live','load','loaf','loan','lock','loft','logo','lone','long','look','loop','lord','lose','loss','lost','lots','loud','love','luck','lump','lung','lure','lurk','lush',
  'made','maid','mail','main','make','male','mall','mama','many','maps','mark','mars','mask','mass','mast','mate','math','maze','meal','mean','meat','meek','meet','melt','memo','menu','mere','mesh','mess','mice','mild','mile','milk','mill','mind','mine','mint','miss','mist','mode','mold','monk','mood','moon','more','moss','most','moth','move','much','mule','must','myth',
  'nail','name','navy','near','neat','neck','need','nest','news','next','nice','nick','nine','node','none','noon','norm','nose','note','noun','nude',
  'odds','okay','once','only','onto','open','oral','oven','over',
  'pace','pack','pact','page','paid','pail','pain','pair','pale','palm','pane','park','part','pass','past','path','pave','peak','pear','peas','peel','peer','perk','pest','pick','pier','pike','pile','pill','pine','pink','pipe','plan','play','plea','plot','plow','ploy','plug','plum','plus','poem','poet','pole','poll','polo','pond','pony','pool','poor','pope','pork','port','pose','post','pour','pray','prep','prey','prod','prop','pull','pump','punk','pure','push','quit','quiz',
  'race','rack','rage','raid','rail','rain','rake','ramp','rang','rank','rare','rash','rate','rave','read','real','reap','rear','reed','reef','reel','rely','rent','rest','rice','rich','ride','riff','rift','ring','riot','ripe','rise','risk','road','roam','roar','robe','rock','rode','role','roll','roof','room','root','rope','rose','ruby','rude','ruin','rule','rush','rust',
  'sack','safe','sage','said','sail','sake','sale','salt','same','sand','sane','sang','sank','save','scan','seal','seam','seat','sect','seed','seek','seem','seen','self','sell','send','sent','shed','ship','shop','shot','show','shut','sick','side','sigh','sign','silk','sink','site','size','skim','skin','skip','slab','slam','slap','sled','slew','slid','slim','slip','slit','slot','slow','slug','snap','snow','soak','soap','soar','sock','soda','sofa','soft','soil','sold','sole','solo','some','song','soon','sore','sort','soul','soup','sour','span','sped','spin','spit','spot','stab','stag','star','stay','stem','step','stew','stir','stop','stud','such','suck','suit','sung','sunk','sure','surf','swan','swap','swat','sway','swim',
  'tack','tail','take','tale','talk','tall','tame','tank','tape','taps','task','team','tear','tech','teen','tell','tend','tent','term','test','text','than','that','them','then','they','thin','this','thus','tick','tide','tidy','tied','tier','ties','tile','till','tilt','time','tint','tiny','tire','toad','toes','toil','told','toll','tomb','tone','took','tool','tops','tore','torn','toss','tour','town','trap','tray','tree','trek','trim','trio','trip','trod','trot','true','tube','tuck','tune','turf','turn','twig','twin','type',
  'ugly','undo','unit','upon','urge','used','user',
  'vain','vale','vane','vary','vase','vast','veal','veil','vein','vent','verb','very','vest','vice','view','vine','visa','void','volt','vote',
  'wade','wage','wait','wake','walk','wall','wand','want','ward','warm','warn','warp','wary','wash','wasp','wave','wavy','waxy','weak','wear','weed','week','weld','well','went','were','west','what','when','whim','whip','whom','wick','wide','wife','wild','will','wilt','wimp','wind','wine','wing','wink','wipe','wire','wise','wish','with','woke','wolf','womb','wood','wool','word','wore','work','worm','worn','wrap','wren',
  'yard','yarn','yawn','year','yell','zero','zest','zinc','zone','zoom',
  'about','above','abuse','actor','adapt','added','admit','adopt','adult','after','again','agent','agree','ahead','alarm','album','alert','alien','align','alike','alive','alley','allow','alone','along','alpha','alter','among','angel','anger','angle','angry','ankle','apart','apple','apply','arena','argue','arise','armor','array','arrow','asset','atlas','avoid','awake','award','aware','awful',
  'bacon','badge','badly','baker','basic','basin','basis','batch','beach','beast','began','begin','being','belly','below','bench','berry','birth','black','blade','blame','blank','blast','blaze','bleed','blend','bless','blind','blink','block','blood','bloom','blown','blues','blunt','board','boast','bonus','boost','booth','bound','brain','brake','brand','brass','brave','bread','break','breed','brick','bride','brief','bring','brink','broad','broke','brook','brown','brush','buddy','build','built','bunch','burst','buyer',
  'cabin','cable','camel','canal','candy','cargo','carry','carve','catch','cause','cease','chain','chair','chalk','champ','chaos','charm','chart','chase','cheap','cheat','check','cheek','cheer','chess','chest','chief','child','chill','china','chose','chunk','civil','claim','clamp','clash','class','clean','clear','clerk','click','cliff','climb','cling','clock','clone','close','cloth','cloud','coach','coast','color','couch','could','count','court','cover','crack','craft','crane','crash','crawl','crazy','cream','crest','crime','crisp','cross','crowd','crown','crude','cruel','crush','curve','cycle',
  'daily','dairy','dance','dated','dealt','death','debut','decay','delay','delta','demon','depot','depth','derby','devil','diary','digit','dirty','disco','ditch','diver','dizzy','dodge','doing','doubt','dough','dozen','draft','drain','drama','drank','drawn','dread','dream','dress','dried','drift','drill','drink','drive','drown','drunk',
  'eager','early','earth','eaten','eight','elbow','elder','elect','elite','empty','enemy','enjoy','enter','entry','equal','erase','erect','error','essay','event','every','exact','exist','extra',
  'faint','fairy','faith','false','fancy','fatal','fatty','fault','favor','feast','fence','ferry','fever','fewer','fiber','field','fiery','fifth','fifty','fight','final','first','fixed','flame','flash','flask','flesh','float','flock','flood','floor','flour','fluid','flush','focal','focus','force','forge','forth','forum','forty','found','frame','frank','fraud','fresh','front','frost','fruit','fully','funny',
  'gamma','gauge','genre','ghost','giant','given','glass','gleam','glide','globe','glory','gloss','glove','going','grace','grade','grain','grand','grant','grape','graph','grasp','grass','grave','gravy','great','greed','green','greet','grief','grill','grind','groan','groom','gross','group','grove','growl','grown','guard','guess','guest','guide','guilt',
  'habit','happy','hardy','haste','hasty','hatch','haunt','haven','heart','heavy','hedge','hefty','heist','hello','hence','hobby','hoist','honey','honor','hoped','horse','hotel','hound','house','hover','human','humid','humor','hurry',
  'ideal','idiot','image','imply','inbox','index','indie','infer','inner','input','intro','irony','issue',
  'jazzy','jelly','jewel','joint','joker','jolly','judge','juice','juicy','jumbo','jumpy',
  'kayak','kebab','knife','knock','known',
  'label','labor','laden','lance','large','laser','lasso','latch','later','latex','latin','laugh','layer','leach','leafy','learn','lease','leash','least','leave','ledge','legal','lemon','level','lever','libel','light','limit','lined','linen','liner','lingo','links','lists','liter','lived','liver','lives','llama','lobby','local','lodge','lofty','logic','login','loose','lorry','loser','lousy','loved','lover','lower','lowly','loyal','lucid','lucky','lumpy','lunar','lunch','lungs','lying',
  'macho','macro','magic','major','maker','mango','manor','maple','march','marry','marsh','masks','match','mayor','meals','means','meant','meaty','medal','media','medic','melee','melon','mercy','merge','merit','merry','messy','metal','meter','metro','micro','midst','might','mimic','mince','miner','minor','minus','mirth','misty','mixed','mixer','model','modem','moist','money','month','moody','moose','moral','motor','motto','mould','mound','mount','mourn','mouse','mouth','moved','mover','movie','muddy','munch','mural','murky','music','musty',
  'naive','naked','named','nanny','nasal','nasty','natal','naval','needs','nerve','never','newly','nexus','niche','niece','night','ninth','noble','noise','noisy','north','notch','noted','notes','novel','nudge','nurse','nutty',
  'occur','ocean','oddly','offer','often','olive','omega','onset','opera','optic','orbit','order','organ','other','otter','ought','ounce','outer','owned','owner','oxide','ozone',
  'paddy','pager','paint','pairs','panda','panel','panic','pansy','pants','paper','party','pasta','paste','pasty','patch','patio','pause','peace','peach','pearl','pedal','penny','perch','perky','petal','petty','phase','phone','photo','piano','picky','piece','piggy','pilot','pinch','pitch','pivot','pixel','pizza','place','plaid','plain','plane','plank','plans','plant','plate','plaza','plead','plumb','plume','plump','plunk','plush','poach','point','poise','poker','polar','poles','polka','polls','ponds','pools','popup','porch','ports','posed','poser','posse','pouch','pound','power','prank','press','price','pride','prime','print','prior','prism','privy','prize','probe','proof','prose','proud','prove','prowl','proxy','prude','prune','pulse','punch','pupil','puppy','purge','purse','pushy',
  'quack','qualm','queen','query','quest','queue','quick','quiet','quill','quilt','quirk','quota','quote',
  'radar','radio','rainy','raise','rally','ramen','ranch','range','rapid','ratio','ratty','raven','razor','reach','react','ready','realm','rebel','recap','refer','regal','reign','relax','relay','relic','remix','renew','repay','reply','rerun','reset','resin','retry','revel','rider','ridge','rifle','right','rigid','rigor','rinse','ripen','risen','risky','rival','river','roach','roads','roast','robot','rocky','rodeo','rogue','rolls','roman','roomy','roost','roots','roses','rouge','rough','round','rouse','route','rowdy','royal','ruddy','rugby','ruins','ruler','rules','rumor','rural','rusty',
  'sadly','safer','saint','salad','sales','salon','salsa','salty','sandy','sassy','satin','sauce','saucy','sauna','saved','savvy','scale','scalp','scaly','scare','scarf','scary','scene','scent','scold','scoop','scope','score','scorn','scout','scram','scrap','screw','scrub','sedan','seeds','seedy','seems','seize','sends','sense','serif','serum','serve','setup','seven','sever','shade','shady','shaft','shake','shaky','shall','shame','shank','shape','shard','share','shark','sharp','shave','sheep','sheer','sheet','shelf','shell','shift','shine','shiny','shire','shirk','shirt','shock','shoes','shone','shook','shoot','shore','shorn','short','shout','shown','shows','showy','shrub','shrug','shuck','shunt','siege','sight','sigma','signs','silly','since','sinew','siren','sissy','sites','sixth','sixty','sized','sizes','skate','skies','skill','skimp','skirt','skull','skunk','slack','slain','slang','slant','slash','slate','slave','sleek','sleep','sleet','slept','slice','slick','slide','slime','slimy','sling','slink','slope','slots','slump','slurp','slush','small','smart','smash','smear','smell','smelt','smile','smirk','smoke','smoky','snack','snail','snake','snare','snarl','sneak','sneer','sniff','snipe','snore','snort','snout','snowy','snuck','snuff','soapy','sober','soggy','solar','solid','solve','sonar','songs','sonic','sooth','sorry','sorts','souls','sound','south','space','spade','spank','spare','spark','spasm','spawn','speak','spear','specs','speed','spell','spend','spent','spice','spicy','spiel','spike','spill','spine','spite','split','spoil','spoke','spoof','spook','spool','spoon','sport','spots','spray','spree','squad','squat','squid','stack','staff','stage','stain','stair','stake','stale','stalk','stall','stamp','stand','stank','stare','stark','stars','start','stash','state','stays','steak','steal','steam','steed','steel','steep','steer','stems','steps','stern','stick','stiff','still','sting','stink','stint','stock','stoic','stomp','stone','stony','stood','stool','stoop','stops','store','stork','storm','story','stout','stove','strap','straw','stray','strip','strut','stuck','study','stuff','stump','stung','stunk','stunt','style','suave','sugar','suite','suits','sulky','sunny','super','surge','surly','sushi','swamp','swans','swarm','swear','sweat','sweep','sweet','swell','swept','swift','swine','swing','swipe','swirl','sword','swore','sworn','swung',
  'table','tacit','tacky','tails','taint','taken','taker','tales','talks','tally','talon','tango','tangy','tanks','taper','tardy','taste','tasty','taunt','teach','teams','tears','teary','tease','teens','teeth','tempo','tends','tenor','tense','tenth','tepid','terms','terra','tests','texts','thank','theft','their','theme','there','these','thick','thief','thigh','thing','think','third','thorn','those','three','threw','throb','throw','thumb','thump','tidal','tides','tiger','tight','tiles','timer','times','timid','tipsy','titan','title','toast','today','token','toner','tones','tonic','tools','tooth','topic','torch','torso','total','touch','tough','tours','towel','tower','towns','toxic','trace','track','tract','trade','trail','train','trait','tramp','trash','trawl','tread','treat','trees','trend','trial','tribe','trick','tried','tries','trike','trims','trips','trite','troll','troop','trout','truce','truck','truly','trump','trunk','trust','truth','tuner','tunes','tunic','turbo','turns','tutor','twang','tweak','tweed','tweet','twice','twigs','twine','twirl','twist','tying',
  'udder','ulcer','ultra','umbra','uncle','uncut','under','undid','undue','unfit','unify','union','unite','unity','unlit','unmet','until','unwed','upper','upset','urban','urged','usage','usher','using','usual','utter',
  'vague','valid','valor','value','valve','vapor','vault','vegan','veins','venom','venue','verbs','verge','verse','video','views','vigor','villa','vinyl','viola','viper','viral','virus','visit','visor','vista','vital','vivid','vixen','vocal','vodka','vogue','voice','volts','voted','voter','votes','vouch','vowel',
  'wacky','waded','wader','wafer','wager','wages','wagon','waist','waits','waken','wakes','walks','walls','waltz','wants','wards','wares','warps','warts','washy','waste','watch','water','waved','waver','waves','weary','weave','wedge','weeds','weedy','weeks','weigh','weird','wells','welsh','whale','wharf','wheat','wheel','where','which','whiff','while','whine','whiny','whips','whirl','whisk','white','whole','whose','widen','wider','widow','width','wield','winds','windy','wines','wings','wiped','wiper','wipes','wired','wires','wiser','witch','witty','wives','woken','woman','women','woods','woody','woozy','words','wordy','works','world','worms','wormy','worry','worse','worst','worth','would','wound','woven','wraps','wrath','wreak','wreck','wrest','wring','wrist','write','wrong','wrote',
  'yacht','yards','yarns','yawns','yearn','years','yeast','yield','young','yours','youth','yucky','yummy',
  'zebra','zesty','zippy','zonal','zones'
];

type GameType = 'scrabble' | 'wwf';

interface WordResult {
  word: string;
  score: number;
  length: number;
}

export default function ScrabbleHelperClient() {
  const [letters, setLetters] = useState('');
  const [mustContain, setMustContain] = useState('');
  const [pattern, setPattern] = useState('');
  const [minLength, setMinLength] = useState(2);
  const [maxLength, setMaxLength] = useState(15);
  const [gameType, setGameType] = useState<GameType>('scrabble');
  const [sortBy, setSortBy] = useState<'score' | 'length' | 'alpha'>('score');
  const [results, setResults] = useState<WordResult[]>([]);

  const { getH1, getSubHeading, faqSchema } = usePageSEO('scrabble-helper');

  const webAppSchema = generateWebAppSchema(
    'Scrabble Helper - Word Finder & Score Calculator',
    'Free Scrabble word finder and helper. Find high-scoring words, calculate points, and improve your game.',
    'https://economictimes.indiatimes.com/us/tools/apps/scrabble-helper',
    'Game'
  );

  const calculateScore = (word: string, type: GameType): number => {
    const values = type === 'scrabble' ? SCRABBLE_VALUES : WWF_VALUES;
    return word.toLowerCase().split('').reduce((sum, letter) => sum + (values[letter] || 0), 0);
  };

  const canMakeWord = (word: string, availableLetters: string): boolean => {
    const letterPool = availableLetters.toLowerCase().split('');
    const blanks = letterPool.filter(l => l === '?').length;
    const realLetters = letterPool.filter(l => l !== '?');
    let blanksUsed = 0;

    for (const char of word.toLowerCase()) {
      const idx = realLetters.indexOf(char);
      if (idx >= 0) {
        realLetters.splice(idx, 1);
      } else if (blanksUsed < blanks) {
        blanksUsed++;
      } else {
        return false;
      }
    }
    return true;
  };

  const matchesPattern = (word: string, pat: string): boolean => {
    if (!pat) return true;
    if (pat.length !== word.length) return false;
    for (let i = 0; i < pat.length; i++) {
      if (pat[i] !== '_' && pat[i].toLowerCase() !== word[i]) return false;
    }
    return true;
  };

  const findWords = () => {
    if (!letters.trim()) return;

    const availableLetters = letters.toLowerCase();
    let filtered = WORD_LIST.filter(word => {
      if (word.length < minLength || word.length > maxLength) return false;
      if (!canMakeWord(word, availableLetters)) return false;
      if (mustContain) {
        for (const char of mustContain.toLowerCase()) {
          if (!word.includes(char)) return false;
        }
      }
      if (pattern && !matchesPattern(word, pattern)) return false;
      return true;
    });

    const wordResults: WordResult[] = filtered.map(word => ({
      word,
      score: calculateScore(word, gameType),
      length: word.length
    }));

    if (sortBy === 'score') wordResults.sort((a, b) => b.score - a.score);
    else if (sortBy === 'length') wordResults.sort((a, b) => b.length - a.length || b.score - a.score);
    else wordResults.sort((a, b) => a.word.localeCompare(b.word));

    setResults(wordResults);
  };

  const clearAll = () => {
    setLetters('');
    setMustContain('');
    setPattern('');
    setResults([]);
  };

  const letterPoints = useMemo(() => {
    const values = gameType === 'scrabble' ? SCRABBLE_VALUES : WWF_VALUES;
    const grouped: Record<number, string[]> = {};
    Object.entries(values).forEach(([letter, points]) => {
      if (!grouped[points]) grouped[points] = [];
      grouped[points].push(letter.toUpperCase());
    });
    return grouped;
  }, [gameType]);

  const topScore = results.length > 0 ? Math.max(...results.map(r => r.score)) : 0;
  const longestWord = results.length > 0 ? Math.max(...results.map(r => r.length)) : 0;

  const relatedTools = [
    { name: 'Wordle Solver', path: '/us/tools/apps/wordle-solver', color: 'bg-green-500' },
    { name: 'Anagram Solver', path: '/us/tools/apps/anagram-solver', color: 'bg-emerald-500' },
    { name: 'Jumble Solver', path: '/us/tools/apps/jumble-solver', color: 'bg-orange-500' },
    { name: 'Word Combiner', path: '/us/tools/apps/word-combiner', color: 'bg-purple-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-100 to-green-100 px-6 py-3 rounded-full mb-4">
          <span className="text-2xl">🎲</span>
          <span className="text-emerald-600 font-semibold">Scrabble Helper</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
          {getH1('Scrabble Word Finder & Helper')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Find high-scoring words from your letters. Supports Scrabble and Words With Friends.')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Mobile Stats Bar */}
      <div className="grid grid-cols-4 gap-2 mb-4 lg:hidden">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-2 text-center text-white">
          <div className="text-lg font-bold">{results.length}</div>
          <div className="text-xs opacity-80">Words</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-2 text-center text-white">
          <div className="text-lg font-bold">{topScore}</div>
          <div className="text-xs opacity-80">Top Score</div>
        </div>
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-2 text-center text-white">
          <div className="text-lg font-bold">{longestWord}</div>
          <div className="text-xs opacity-80">Longest</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg p-2 text-center text-white">
          <div className="text-lg font-bold">{letters.length}</div>
          <div className="text-xs opacity-80">Letters</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Find Words</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Letters (use ? for blank)</label>
                <input
                  type="text"
                  value={letters}
                  onChange={(e) => setLetters(e.target.value.replace(/[^a-zA-Z?]/g, ''))}
                  placeholder="e.g., AEIOU??"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-lg uppercase tracking-widest"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Must Contain</label>
                  <input
                    type="text"
                    value={mustContain}
                    onChange={(e) => setMustContain(e.target.value.replace(/[^a-zA-Z]/g, ''))}
                    placeholder="e.g., QU"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pattern (_ = unknown)</label>
                  <input
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value.replace(/[^a-zA-Z_]/g, ''))}
                    placeholder="e.g., _A_E"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 uppercase"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Game Type</label>
                  <div className="flex gap-2">
                    <button onClick={() => setGameType('scrabble')} className={`px-4 py-2 rounded-lg font-medium ${gameType === 'scrabble' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700'}`}>Scrabble</button>
                    <button onClick={() => setGameType('wwf')} className={`px-4 py-2 rounded-lg font-medium ${gameType === 'wwf' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700'}`}>WWF</button>
                  </div>
                </div>
                <button onClick={findWords} disabled={!letters.trim()} className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-green-600 disabled:opacity-50">Find Words</button>
                <button onClick={clearAll} className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">Clear</button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Results {results.length > 0 && `(${results.length})`}</h2>
              <div className="flex gap-2">
                {['score', 'length', 'alpha'].map(s => (
                  <button key={s} onClick={() => { setSortBy(s as typeof sortBy); if (results.length > 0) findWords(); }} className={`px-3 py-1 rounded-lg text-sm font-medium ${sortBy === s ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {s === 'score' ? 'Score' : s === 'length' ? 'Length' : 'A-Z'}
                  </button>
                ))}
              </div>
            </div>
            {results.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-5xl mb-4">🔤</div>
                <p>Enter your letters and click "Find Words"</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[500px] overflow-y-auto">
                {results.map((result, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-3 hover:shadow-md">
                    <div className="font-bold text-emerald-700 uppercase">{result.word}</div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{result.length} letters</span>
                      <span className="font-bold text-emerald-600">{result.score} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEO Content */}
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Scrabble: The Classic Word Game</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Scrabble was invented by American architect Alfred Mosher Butts during the Great Depression and has become
              one of the world&apos;s most beloved word games. With over 150 million sets sold in 121 countries and 29
              languages, Scrabble challenges players to create words from random letter tiles while strategically using
              bonus squares to maximize their scores.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <h3 className="font-semibold text-amber-800 mb-2">🔤 Word Finding</h3>
                <p className="text-sm text-gray-600">Discover valid words from your available letter tiles instantly.</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <h3 className="font-semibold text-green-800 mb-2">📊 Score Calculation</h3>
                <p className="text-sm text-gray-600">See point values for each word based on official Scrabble letter scores.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-2">📚 Vocabulary Building</h3>
                <p className="text-sm text-gray-600">Learn new words and their meanings while playing or practicing.</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <h3 className="font-semibold text-purple-800 mb-2">🎯 Strategy Tips</h3>
                <p className="text-sm text-gray-600">Find high-scoring words using valuable letters like Q, Z, X, and J.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-100 to-green-100 rounded-xl p-5 mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Letter Values in Scrabble</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Scrabble letter values were determined by frequency analysis of English text. Common letters like E, A,
                I, O, N, R, T, L, S, and U are worth 1 point each, while rare letters like Q and Z are worth 10 points.
                Strategic players learn to save high-value letters for triple-letter and triple-word bonus squares.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-800 mb-3">Pro Tips</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Learn two-letter words - they&apos;re essential for parallel plays</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span>Save S tiles for pluralizing to create two words at once</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Memorize Q-without-U words like QI, QOPH, and QADI</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  <span>Use blank tiles strategically for high-value plays</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile MREC2 - Before FAQs */}


          <GameAppMobileMrec2 />



          {/* FAQs */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            <FirebaseFAQs pageId="scrabble-helper" fallbackFaqs={fallbackFaqs} />
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
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                <span className="text-gray-600">Words Found</span>
                <span className="font-bold text-emerald-600">{results.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                <span className="text-gray-600">Top Score</span>
                <span className="font-bold text-green-600">{topScore} pts</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl">
                <span className="text-gray-600">Longest Word</span>
                <span className="font-bold text-teal-600">{longestWord} letters</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl">
                <span className="text-gray-600">Your Letters</span>
                <span className="font-bold text-cyan-600">{letters.length}</span>
              </div>
            </div>
          </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

          {/* Letter Values */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Letter Values</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(letterPoints).sort((a, b) => parseInt(a[0]) - parseInt(b[0])).map(([points, ltrs]) => (
                <div key={points} className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-emerald-500 text-white rounded flex items-center justify-center text-xs font-bold">{points}</span>
                  <span className="font-mono text-gray-600 text-xs">{ltrs.join(' ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ad Banner */}
          <div className="hidden lg:block"><AdBanner className="w-full" /></div>
{/* Related Tools */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Related Tools</h3>
            <div className="space-y-2">
              {relatedTools.map((tool) => (
                <Link key={tool.path} href={tool.path} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`w-3 h-3 rounded-full ${tool.color}`}></div>
                  <span className="text-gray-700 hover:text-emerald-600">{tool.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="hidden lg:block bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg p-4 text-white">
            <h3 className="text-lg font-bold mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li className="flex items-start gap-2"><span>•</span><span>Learn two-letter words like QI, ZA, XI, XU</span></li>
              <li className="flex items-start gap-2"><span>•</span><span>Use ? for blank tiles</span></li>
              <li className="flex items-start gap-2"><span>•</span><span>Place high-value letters on bonus squares</span></li>
              <li className="flex items-start gap-2"><span>•</span><span>Add S to existing words for easy plays</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
