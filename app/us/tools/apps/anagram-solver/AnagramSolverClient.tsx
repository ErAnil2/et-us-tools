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
    question: 'What is an anagram?',
    answer: 'An anagram is a word or phrase formed by rearranging the letters of another word or phrase. For example, "listen" and "silent" are anagrams of each other because they contain the exact same letters.',
    order: 1
  },
  {
    id: '2',
    question: 'How does this anagram solver work?',
    answer: 'Enter any word or set of letters, and our solver instantly finds all possible English words that can be formed using those exact letters. It uses an extensive dictionary to find valid words.',
    order: 2
  },
  {
    id: '3',
    question: 'Can I use wildcards or blank tiles?',
    answer: 'Yes! Use a question mark (?) to represent a blank tile or unknown letter. The solver will try all 26 letters in that position to find matching words.',
    order: 3
  },
  {
    id: '4',
    question: 'Does it find partial anagrams too?',
    answer: 'Yes, you can choose to find both full anagrams (using all letters) and partial anagrams (using some letters). This is helpful for word games like Scrabble or Words with Friends.',
    order: 4
  },
  {
    id: '5',
    question: 'What word games can I use this for?',
    answer: 'This tool is perfect for Scrabble, Words with Friends, crossword puzzles, Wordle, word jumbles, and any word game where you need to unscramble letters.',
    order: 5
  },
  {
    id: '6',
    question: 'Is there a limit to how many letters I can enter?',
    answer: 'You can enter up to 15 letters. For best performance with longer inputs, we recommend keeping it under 12 letters as the number of possible combinations grows exponentially.',
    order: 6
  }
];

// Common English words dictionary (subset for client-side)
const COMMON_WORDS = [
  'a', 'i', 'am', 'an', 'as', 'at', 'be', 'by', 'do', 'go', 'he', 'if', 'in', 'is', 'it', 'me', 'my', 'no', 'of', 'on', 'or', 'so', 'to', 'up', 'us', 'we',
  'ace', 'act', 'add', 'age', 'ago', 'aid', 'aim', 'air', 'all', 'and', 'ant', 'any', 'ape', 'apt', 'arc', 'are', 'ark', 'arm', 'art', 'ash', 'ask', 'ate', 'awe', 'axe',
  'bad', 'bag', 'ban', 'bar', 'bat', 'bay', 'bed', 'bee', 'bet', 'bid', 'big', 'bin', 'bit', 'bow', 'box', 'boy', 'bud', 'bug', 'bus', 'but', 'buy',
  'cab', 'can', 'cap', 'car', 'cat', 'cop', 'cow', 'cry', 'cub', 'cup', 'cut',
  'dad', 'dam', 'day', 'den', 'dew', 'did', 'die', 'dig', 'dim', 'dip', 'dog', 'dot', 'dry', 'dub', 'due', 'dug', 'dye',
  'ear', 'eat', 'egg', 'ego', 'elm', 'emu', 'end', 'era', 'eve', 'eye',
  'fab', 'fad', 'fan', 'far', 'fat', 'fax', 'fed', 'fee', 'few', 'fig', 'fin', 'fir', 'fit', 'fix', 'flu', 'fly', 'foe', 'fog', 'for', 'fox', 'fry', 'fun', 'fur',
  'gab', 'gag', 'gap', 'gas', 'gay', 'gel', 'gem', 'get', 'gig', 'gin', 'gnu', 'god', 'got', 'gum', 'gun', 'gut', 'guy', 'gym',
  'had', 'ham', 'has', 'hat', 'hay', 'hem', 'hen', 'her', 'hid', 'him', 'hip', 'his', 'hit', 'hob', 'hoe', 'hog', 'hop', 'hot', 'how', 'hub', 'hue', 'hug', 'hum', 'hut',
  'ice', 'icy', 'ill', 'imp', 'ink', 'inn', 'ion', 'ire', 'irk', 'its', 'ivy',
  'jab', 'jag', 'jam', 'jar', 'jaw', 'jay', 'jet', 'jig', 'job', 'jog', 'jot', 'joy', 'jug', 'jut',
  'keg', 'ken', 'key', 'kid', 'kin', 'kit',
  'lab', 'lad', 'lag', 'lap', 'law', 'lax', 'lay', 'lea', 'led', 'leg', 'let', 'lid', 'lie', 'lip', 'lit', 'log', 'lop', 'lot', 'low', 'lug',
  'mad', 'man', 'map', 'mar', 'mat', 'maw', 'may', 'men', 'met', 'mid', 'mix', 'mob', 'mod', 'mom', 'mop', 'mow', 'mud', 'mug', 'mum',
  'nab', 'nag', 'nap', 'nay', 'net', 'new', 'nib', 'nil', 'nit', 'nod', 'nor', 'not', 'now', 'nub', 'nun', 'nut',
  'oak', 'oar', 'oat', 'odd', 'ode', 'off', 'oft', 'oil', 'old', 'one', 'opt', 'orb', 'ore', 'our', 'out', 'owe', 'owl', 'own',
  'pad', 'pal', 'pan', 'pap', 'par', 'pat', 'paw', 'pay', 'pea', 'peg', 'pen', 'pep', 'per', 'pet', 'pew', 'pie', 'pig', 'pin', 'pit', 'ply', 'pod', 'pop', 'pot', 'pow', 'pry', 'pub', 'pug', 'pun', 'pup', 'pus', 'put',
  'rad', 'rag', 'ram', 'ran', 'rap', 'rat', 'raw', 'ray', 'red', 'ref', 'rep', 'rib', 'rid', 'rig', 'rim', 'rip', 'rob', 'rod', 'roe', 'rot', 'row', 'rub', 'rug', 'rum', 'run', 'rut', 'rye',
  'sac', 'sad', 'sag', 'sap', 'sat', 'saw', 'say', 'sea', 'set', 'sew', 'she', 'shy', 'sin', 'sip', 'sir', 'sis', 'sit', 'six', 'ski', 'sky', 'sly', 'sob', 'sod', 'son', 'sop', 'sot', 'sow', 'soy', 'spa', 'spy', 'sty', 'sub', 'sue', 'sum', 'sun', 'sup',
  'tab', 'tad', 'tag', 'tan', 'tap', 'tar', 'tat', 'tax', 'tea', 'ten', 'the', 'thy', 'tic', 'tie', 'tin', 'tip', 'tit', 'toe', 'tog', 'tom', 'ton', 'too', 'top', 'tot', 'tow', 'toy', 'try', 'tub', 'tug', 'two',
  'ugh', 'ump', 'urn', 'use',
  'van', 'vat', 'vet', 'via', 'vie', 'vim', 'vow',
  'wad', 'wag', 'war', 'was', 'wax', 'way', 'web', 'wed', 'wee', 'wet', 'who', 'why', 'wig', 'win', 'wit', 'woe', 'wok', 'won', 'woo', 'wow',
  'yam', 'yap', 'yaw', 'yea', 'yes', 'yet', 'yew', 'yin', 'yip', 'you', 'yow',
  'zap', 'zed', 'zee', 'zen', 'zig', 'zip', 'zit', 'zoo',
  'able', 'ache', 'acre', 'aged', 'aide', 'also', 'amid', 'anti', 'apex', 'arch', 'area', 'army', 'arts',
  'babe', 'baby', 'back', 'bade', 'bait', 'bake', 'bald', 'bale', 'ball', 'balm', 'band', 'bane', 'bank', 'bare', 'bark', 'barn', 'base', 'bash', 'bass', 'bath', 'bead', 'beak', 'beam', 'bean', 'bear', 'beat', 'beer', 'bell', 'belt', 'bend', 'bent', 'best', 'bias', 'bike', 'bile', 'bill', 'bind', 'bird', 'bite', 'blah', 'bled', 'blew', 'blob', 'bloc', 'blog', 'blot', 'blow', 'blue', 'blur', 'boar', 'boat', 'body', 'boil', 'bold', 'bolt', 'bomb', 'bond', 'bone', 'book', 'boom', 'boon', 'boot', 'bore', 'born', 'boss', 'both', 'bout', 'bowl', 'brag', 'bran', 'brat', 'bred', 'brew', 'brim', 'buck', 'bulb', 'bulk', 'bull', 'bump', 'bunk', 'burn', 'bury', 'bush', 'bust', 'busy', 'buzz',
  'cafe', 'cage', 'cake', 'calf', 'call', 'calm', 'came', 'camp', 'cane', 'cape', 'card', 'care', 'carp', 'cart', 'case', 'cash', 'cast', 'cave', 'cell', 'cent', 'chap', 'char', 'chat', 'chef', 'chew', 'chin', 'chip', 'chop', 'cite', 'city', 'clad', 'clam', 'clan', 'clap', 'claw', 'clay', 'clip', 'club', 'clue', 'coal', 'coat', 'coca', 'code', 'coil', 'coin', 'cola', 'cold', 'colt', 'coma', 'comb', 'come', 'cone', 'cook', 'cool', 'cope', 'copy', 'cord', 'core', 'cork', 'corn', 'cost', 'coup', 'cove', 'crab', 'crew', 'crib', 'crop', 'crow', 'cube', 'cult', 'curb', 'cure', 'curl', 'cute',
  'dale', 'dame', 'damp', 'dare', 'dark', 'darn', 'dart', 'dash', 'data', 'date', 'dawn', 'days', 'dead', 'deaf', 'deal', 'dean', 'dear', 'debt', 'deck', 'deed', 'deem', 'deep', 'deer', 'demo', 'dent', 'deny', 'desk', 'dial', 'dice', 'died', 'diet', 'dime', 'dine', 'dire', 'dirt', 'disc', 'dish', 'disk', 'dive', 'dock', 'does', 'doll', 'dome', 'done', 'doom', 'door', 'dose', 'dove', 'down', 'doze', 'drag', 'dram', 'draw', 'drew', 'drip', 'drop', 'drug', 'drum', 'dual', 'duck', 'duct', 'dude', 'duel', 'duet', 'duke', 'dull', 'dumb', 'dump', 'dune', 'dung', 'dunk', 'dusk', 'dust', 'duty',
  'each', 'earl', 'earn', 'ease', 'east', 'easy', 'eats', 'echo', 'edge', 'edit', 'else', 'emit', 'ends', 'epic', 'euro', 'even', 'ever', 'evil', 'exam', 'exec', 'exit', 'expo', 'eyes',
  'face', 'fact', 'fade', 'fail', 'fair', 'fake', 'fall', 'fame', 'fare', 'farm', 'fast', 'fate', 'fawn', 'fear', 'feat', 'feed', 'feel', 'feet', 'fell', 'felt', 'fend', 'fern', 'fest', 'feud', 'file', 'fill', 'film', 'find', 'fine', 'fire', 'firm', 'fish', 'fist', 'five', 'flag', 'flap', 'flat', 'flaw', 'flax', 'flea', 'fled', 'flee', 'flew', 'flex', 'flip', 'flit', 'flog', 'flop', 'flow', 'flux', 'foam', 'foci', 'fold', 'folk', 'fond', 'font', 'food', 'fool', 'foot', 'ford', 'fore', 'fork', 'form', 'fort', 'foul', 'four', 'fowl', 'fray', 'free', 'frog', 'from', 'fuel', 'full', 'fume', 'fund', 'funk', 'fury', 'fuse', 'fuss', 'fuzz',
  'gain', 'gala', 'gale', 'game', 'gang', 'gape', 'garb', 'Gary', 'gash', 'gasp', 'gate', 'gave', 'gawk', 'gaze', 'gear', 'gene', 'germ', 'gift', 'gill', 'gilt', 'girl', 'gist', 'give', 'glad', 'glen', 'glib', 'glob', 'glom', 'glop', 'glow', 'glue', 'glum', 'glut', 'gnat', 'gnaw', 'goat', 'goes', 'gold', 'golf', 'gone', 'gong', 'good', 'goof', 'gore', 'gory', 'gosh', 'gown', 'grab', 'grad', 'gram', 'gray', 'grew', 'grey', 'grid', 'grim', 'grin', 'grip', 'grit', 'grog', 'grow', 'grub', 'gulf', 'gulp', 'guru', 'gush', 'gust', 'guts',
  'hack', 'hail', 'hair', 'half', 'hall', 'halo', 'halt', 'hand', 'hang', 'hank', 'hard', 'hare', 'hark', 'harm', 'harp', 'hash', 'hasp', 'haste', 'hate', 'hath', 'haul', 'have', 'hawk', 'haze', 'hazy', 'head', 'heal', 'heap', 'hear', 'heat', 'heck', 'heed', 'heel', 'heir', 'held', 'hell', 'helm', 'help', 'hemp', 'hens', 'herb', 'herd', 'here', 'hero', 'hers', 'hide', 'high', 'hike', 'hill', 'hilt', 'hind', 'hint', 'hips', 'hire', 'hiss', 'hits', 'hive', 'hoax', 'hock', 'hoed', 'hogs', 'hold', 'hole', 'holy', 'home', 'hone', 'honk', 'hood', 'hoof', 'hook', 'hoop', 'hoot', 'hope', 'hops', 'horn', 'hose', 'host', 'hour', 'howl', 'hubs', 'hued', 'huff', 'huge', 'hugs', 'hulk', 'hull', 'hump', 'hums', 'hung', 'hunk', 'hunt', 'hurl', 'hurt', 'hush', 'husk', 'hymn', 'hype',
  'each', 'earl', 'earn', 'ease', 'east', 'easy', 'echo', 'edge', 'else', 'emit', 'ends', 'envy', 'epic', 'ever', 'evil', 'exam', 'exit', 'eyes',
  'idea', 'idle', 'idol', 'inch', 'info', 'into', 'iron', 'isle', 'item',
  'jack', 'jade', 'jail', 'jake', 'jamb', 'jams', 'jane', 'jars', 'java', 'jaws', 'jays', 'jazz', 'jean', 'jeer', 'jelly', 'jerk', 'jest', 'jets', 'jibe', 'jigs', 'jilt', 'jinx', 'jobs', 'jock', 'jogs', 'john', 'join', 'joke', 'jolt', 'josh', 'jots', 'jowl', 'joys', 'judo', 'jugs', 'jump', 'june', 'junk', 'jury', 'just', 'juts',
  'kale', 'keen', 'keep', 'kegs', 'kelp', 'kept', 'keys', 'kick', 'kids', 'kill', 'kilt', 'kind', 'king', 'kink', 'kiss', 'kite', 'kits', 'knee', 'knew', 'knit', 'knob', 'knot', 'know',
  'lace', 'lack', 'lacy', 'lady', 'laid', 'lain', 'lair', 'lake', 'lamb', 'lame', 'lamp', 'land', 'lane', 'lank', 'laps', 'lard', 'lark', 'lash', 'lass', 'last', 'late', 'laud', 'lawn', 'laws', 'lays', 'lazy', 'lead', 'leaf', 'leak', 'lean', 'leap', 'left', 'legs', 'lend', 'lens', 'lent', 'less', 'lest', 'levy', 'liar', 'lice', 'lick', 'lids', 'lied', 'lien', 'lies', 'lieu', 'life', 'lift', 'like', 'lily', 'limb', 'lime', 'limp', 'line', 'link', 'lint', 'lion', 'lips', 'lisp', 'list', 'live', 'load', 'loaf', 'loam', 'loan', 'lobe', 'lobs', 'lock', 'loft', 'logs', 'lone', 'long', 'look', 'loom', 'loon', 'loop', 'loot', 'lope', 'lord', 'lore', 'lose', 'loss', 'lost', 'lots', 'loud', 'louse', 'love', 'lows', 'luck', 'lull', 'lump', 'lung', 'lure', 'lurk', 'lush', 'lust', 'lynx', 'lyre',
  'mace', 'made', 'maid', 'mail', 'maim', 'main', 'make', 'male', 'mall', 'malt', 'mama', 'mane', 'many', 'maps', 'mare', 'mark', 'mars', 'mash', 'mask', 'mass', 'mast', 'mate', 'math', 'mats', 'maze', 'mead', 'meal', 'mean', 'meat', 'meek', 'meet', 'meld', 'melt', 'memo', 'mend', 'menu', 'mere', 'mesh', 'mess', 'mice', 'mild', 'mile', 'milk', 'mill', 'mime', 'mind', 'mine', 'mini', 'mink', 'mint', 'mire', 'miss', 'mist', 'mite', 'mitt', 'moan', 'moat', 'mock', 'mode', 'mold', 'mole', 'molt', 'monk', 'mood', 'moon', 'moor', 'moot', 'mope', 'more', 'morn', 'moss', 'most', 'moth', 'move', 'much', 'muck', 'muff', 'mugs', 'mule', 'mull', 'mumps', 'mums', 'murk', 'muse', 'mush', 'musk', 'must', 'mute', 'mutt', 'myth',
  'nags', 'nail', 'name', 'nape', 'naps', 'navy', 'near', 'neat', 'neck', 'need', 'neon', 'nerd', 'nest', 'nets', 'news', 'newt', 'next', 'nibs', 'nice', 'nick', 'nine', 'nits', 'node', 'nods', 'noel', 'none', 'nook', 'noon', 'nope', 'norm', 'nose', 'nosy', 'note', 'noun', 'nova', 'nubs', 'nude', 'null', 'numb', 'nuns', 'nuts',
  'oafs', 'oaks', 'oars', 'oast', 'oath', 'oats', 'obey', 'oboe', 'odds', 'odes', 'odor', 'offs', 'ogre', 'oils', 'oily', 'okay', 'okra', 'olds', 'omen', 'omit', 'once', 'ones', 'only', 'onto', 'onus', 'ooze', 'opal', 'open', 'opts', 'opus', 'oral', 'orbs', 'orca', 'ores', 'ours', 'oust', 'outs', 'ouzo', 'oven', 'over', 'owed', 'owes', 'owls', 'owns', 'oxen',
  'pace', 'pack', 'pact', 'pads', 'page', 'paid', 'pail', 'pain', 'pair', 'pale', 'palm', 'pals', 'pane', 'pang', 'pans', 'pant', 'papa', 'pare', 'park', 'part', 'pass', 'past', 'path', 'pats', 'pave', 'pawn', 'paws', 'pays', 'peak', 'peal', 'pear', 'peas', 'peat', 'peck', 'peek', 'peel', 'peep', 'peer', 'pegs', 'pelt', 'pend', 'pens', 'pent', 'peon', 'perk', 'perm', 'pest', 'pets', 'pick', 'pier', 'pies', 'pigs', 'pike', 'pile', 'pill', 'pine', 'ping', 'pink', 'pins', 'pint', 'pipe', 'pips', 'pita', 'pits', 'pity', 'plan', 'play', 'plea', 'pled', 'plod', 'plop', 'plot', 'plow', 'ploy', 'plug', 'plum', 'plus', 'pock', 'pods', 'poem', 'poet', 'poke', 'pole', 'poll', 'polo', 'pomp', 'pond', 'pony', 'pooh', 'pool', 'poop', 'poor', 'pope', 'pops', 'pore', 'pork', 'port', 'pose', 'posh', 'post', 'pots', 'pour', 'pout', 'pram', 'pray', 'prep', 'prey', 'prim', 'prod', 'prom', 'prop', 'prow', 'pubs', 'puck', 'puds', 'puff', 'pugs', 'puke', 'pull', 'pulp', 'pump', 'puns', 'pups', 'pure', 'purr', 'push', 'puts', 'putt', 'putz',
  'quay', 'quid', 'quit', 'quiz',
  'race', 'rack', 'raft', 'rage', 'rags', 'raid', 'rail', 'rain', 'rake', 'ramp', 'rams', 'rang', 'rank', 'rant', 'raps', 'rapt', 'rare', 'rash', 'rasp', 'rate', 'rats', 'rave', 'rays', 'raze', 'razz', 'read', 'real', 'ream', 'reap', 'rear', 'redo', 'reds', 'reed', 'reef', 'reek', 'reel', 'refs', 'rein', 'rely', 'rend', 'rent', 'repo', 'reps', 'rest', 'ribs', 'rice', 'rich', 'ride', 'rids', 'rife', 'rift', 'rigs', 'rile', 'rill', 'rims', 'rind', 'ring', 'rink', 'riot', 'ripe', 'rips', 'rise', 'risk', 'rite', 'road', 'roam', 'roar', 'robe', 'robs', 'rock', 'rode', 'rods', 'role', 'roll', 'romp', 'roof', 'room', 'root', 'rope', 'ropy', 'rose', 'rosy', 'rote', 'rots', 'rout', 'rove', 'rows', 'rube', 'rubs', 'ruby', 'ruck', 'rude', 'rued', 'rues', 'ruff', 'rugs', 'ruin', 'rule', 'rump', 'rums', 'rune', 'rung', 'runs', 'runt', 'ruse', 'rush', 'rust', 'ruts',
  'sack', 'safe', 'saga', 'sage', 'sags', 'said', 'sail', 'sake', 'sale', 'salt', 'same', 'sand', 'sane', 'sang', 'sank', 'saps', 'sash', 'sass', 'sate', 'save', 'sawn', 'saws', 'says', 'scab', 'scam', 'scan', 'scar', 'scat', 'seal', 'seam', 'sear', 'seas', 'seat', 'sect', 'seed', 'seek', 'seem', 'seen', 'seep', 'seer', 'sees', 'self', 'sell', 'semi', 'send', 'sent', 'sept', 'sets', 'sewn', 'sews', 'sexy', 'shag', 'shah', 'sham', 'shed', 'shim', 'shin', 'ship', 'shiv', 'shmo', 'shod', 'shoe', 'shoo', 'shop', 'shot', 'show', 'shun', 'shut', 'sick', 'side', 'sift', 'sigh', 'sign', 'silk', 'sill', 'silo', 'silt', 'sine', 'sing', 'sink', 'sins', 'sips', 'sire', 'sirs', 'site', 'sits', 'size', 'skid', 'skim', 'skin', 'skip', 'skit', 'slab', 'slag', 'slam', 'slap', 'slat', 'slaw', 'slay', 'sled', 'slew', 'slid', 'slim', 'slit', 'slob', 'slop', 'slot', 'slow', 'slue', 'slug', 'slum', 'slur', 'smog', 'snag', 'snap', 'snip', 'snit', 'snob', 'snow', 'snub', 'snug', 'soak', 'soap', 'soar', 'sobs', 'sock', 'soda', 'sods', 'sofa', 'soft', 'soil', 'sold', 'sole', 'solo', 'some', 'song', 'sons', 'soon', 'soot', 'sops', 'sore', 'sort', 'sots', 'soul', 'soup', 'sour', 'sown', 'sows', 'soya', 'span', 'spar', 'spas', 'spat', 'spay', 'spec', 'sped', 'spew', 'spin', 'spit', 'spot', 'spry', 'spud', 'spun', 'spur', 'stab', 'stag', 'star', 'stay', 'stem', 'step', 'stew', 'stir', 'stop', 'stub', 'stud', 'stun', 'subs', 'such', 'suck', 'suds', 'sued', 'sues', 'suit', 'sulk', 'sumo', 'sump', 'sums', 'sung', 'sunk', 'suns', 'sure', 'surf', 'swab', 'swam', 'swan', 'swap', 'swat', 'sway', 'swim', 'sync',
  'tabs', 'tack', 'taco', 'tact', 'tads', 'tags', 'tail', 'take', 'tale', 'talk', 'tall', 'tame', 'tamp', 'tans', 'tape', 'taps', 'tart', 'task', 'taut', 'taxi', 'teak', 'teal', 'team', 'tear', 'teas', 'teed', 'teem', 'teen', 'tell', 'temp', 'tend', 'tens', 'tent', 'term', 'tern', 'test', 'text', 'than', 'that', 'thaw', 'them', 'then', 'thud', 'thus', 'tick', 'tide', 'tidy', 'tied', 'tier', 'ties', 'tile', 'till', 'tilt', 'time', 'tine', 'tint', 'tiny', 'tips', 'tire', 'toad', 'tock', 'toes', 'togs', 'toil', 'told', 'toll', 'tomb', 'tome', 'tone', 'tons', 'took', 'tool', 'toot', 'tops', 'tore', 'torn', 'tort', 'toss', 'tote', 'tots', 'tour', 'tout', 'town', 'tows', 'toys', 'tram', 'trap', 'tray', 'tree', 'trek', 'trim', 'trio', 'trip', 'trod', 'trot', 'true', 'tube', 'tubs', 'tuck', 'tuft', 'tugs', 'tuna', 'tune', 'turf', 'turn', 'tusk', 'tutu', 'twig', 'twin', 'twit', 'twos', 'type', 'typo',
  'ugly', 'undo', 'unit', 'unto', 'upon', 'urge', 'urns', 'used', 'user', 'uses',
  'vain', 'vale', 'vane', 'vary', 'vase', 'vast', 'vats', 'veal', 'veer', 'vein', 'vent', 'verb', 'very', 'vest', 'veto', 'vets', 'vial', 'vice', 'vied', 'vies', 'view', 'vile', 'vine', 'visa', 'vise', 'void', 'volt', 'vote', 'vows',
  'wade', 'wads', 'waft', 'wage', 'wags', 'waif', 'wail', 'wait', 'wake', 'walk', 'wall', 'wand', 'wane', 'want', 'ward', 'warm', 'warn', 'warp', 'wars', 'wart', 'wary', 'wash', 'wasp', 'watt', 'wave', 'wavy', 'waxy', 'ways', 'weak', 'wean', 'wear', 'weds', 'weed', 'week', 'weep', 'weld', 'well', 'welt', 'went', 'wept', 'were', 'west', 'wham', 'what', 'when', 'whet', 'whew', 'whey', 'whim', 'whip', 'whir', 'whit', 'whiz', 'whom', 'wick', 'wide', 'wife', 'wigs', 'wild', 'wile', 'will', 'wilt', 'wimp', 'wims', 'wind', 'wine', 'wing', 'wink', 'wins', 'wipe', 'wire', 'wiry', 'wise', 'wish', 'wisp', 'with', 'wits', 'wive', 'woes', 'woke', 'woks', 'wolf', 'womb', 'wont', 'wood', 'woof', 'wool', 'woos', 'word', 'wore', 'work', 'worm', 'worn', 'wort', 'wove', 'wows', 'wrap', 'wren', 'writ',
  'yack', 'yaks', 'yams', 'yank', 'yaps', 'yard', 'yarn', 'yawl', 'yawn', 'yawp', 'yaws', 'yeah', 'year', 'yeas', 'yell', 'yelp', 'yens', 'yeps', 'yeps', 'yews', 'yids', 'yips', 'yoke', 'yolk', 'yore', 'your', 'yowl', 'yows', 'yuan', 'yuck', 'yuks', 'yule', 'yups',
  'zany', 'zaps', 'zeal', 'zebu', 'zeds', 'zees', 'zero', 'zest', 'zigs', 'zing', 'zips', 'zits', 'zone', 'zoom', 'zoos',
  'about', 'above', 'abuse', 'acted', 'actor', 'adapt', 'added', 'admit', 'adopt', 'adult', 'after', 'again', 'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alien', 'align', 'alike', 'alive', 'allow', 'alone', 'along', 'alter', 'among', 'angel', 'anger', 'angle', 'angry', 'apart', 'apple', 'apply', 'arena', 'argue', 'arise', 'armor', 'array', 'arrow', 'aside', 'asset', 'avoid', 'award', 'aware',
  'basic', 'basis', 'beach', 'began', 'begin', 'begun', 'being', 'below', 'bench', 'bible', 'birth', 'black', 'blade', 'blame', 'blank', 'blast', 'blend', 'bless', 'blind', 'block', 'blood', 'blown', 'board', 'bonus', 'booth', 'bound', 'brain', 'brand', 'brave', 'bread', 'break', 'breed', 'brick', 'bride', 'brief', 'bring', 'broad', 'broke', 'brown', 'brush', 'build', 'built', 'bunch', 'burst', 'buyer',
  'cable', 'canal', 'candy', 'carry', 'catch', 'cause', 'chain', 'chair', 'chaos', 'charm', 'chart', 'chase', 'cheap', 'check', 'chest', 'chief', 'child', 'china', 'chose', 'chunk', 'civil', 'claim', 'class', 'clean', 'clear', 'clerk', 'click', 'climb', 'clock', 'close', 'cloth', 'cloud', 'coach', 'coast', 'color', 'couch', 'could', 'count', 'court', 'cover', 'crack', 'craft', 'crash', 'crazy', 'cream', 'crime', 'cross', 'crowd', 'crown', 'cruel', 'curve', 'cycle',
  'daily', 'dance', 'dated', 'dealt', 'death', 'debut', 'delay', 'depth', 'devil', 'diary', 'digit', 'dirty', 'doubt', 'dozen', 'draft', 'drain', 'drama', 'drank', 'drawn', 'dream', 'dress', 'dried', 'drink', 'drive', 'drove', 'drugs', 'drunk',
  'eager', 'early', 'earth', 'eaten', 'eight', 'elect', 'elite', 'empty', 'enemy', 'enjoy', 'enter', 'entry', 'equal', 'error', 'essay', 'event', 'every', 'exact', 'exist', 'extra',
  'faced', 'faith', 'false', 'fancy', 'fatal', 'fault', 'favor', 'feast', 'fiber', 'field', 'fifth', 'fifty', 'fight', 'final', 'first', 'fixed', 'flame', 'flash', 'flesh', 'float', 'flood', 'floor', 'flour', 'fluid', 'focus', 'force', 'forge', 'forth', 'forum', 'found', 'frame', 'frank', 'fraud', 'fresh', 'front', 'frost', 'fruit', 'fully', 'funny',
  'given', 'glass', 'glaze', 'globe', 'glory', 'goose', 'grace', 'grade', 'grain', 'grand', 'grant', 'grape', 'graph', 'grasp', 'grass', 'grave', 'great', 'green', 'greet', 'grief', 'grill', 'grind', 'gross', 'group', 'grove', 'grown', 'guard', 'guess', 'guest', 'guide', 'guilt', 'guitar',
  'habit', 'happy', 'harsh', 'heart', 'heavy', 'hello', 'hence', 'hired', 'hobby', 'honey', 'honor', 'hoped', 'horse', 'hotel', 'house', 'human', 'humor', 'hurry',
  'ideal', 'image', 'imply', 'index', 'inner', 'input', 'Iraqi', 'Irish', 'issue', 'items',
  'joint', 'Jones', 'judge', 'juice', 'juicy',
  'knife', 'knock', 'known', 'Korea',
  'label', 'labor', 'lacks', 'large', 'laser', 'later', 'laugh', 'layer', 'leads', 'learn', 'lease', 'least', 'leave', 'legal', 'lemon', 'level', 'lever', 'Lewis', 'light', 'limit', 'lived', 'liver', 'local', 'logic', 'loose', 'loses', 'loved', 'lover', 'lower', 'loyal', 'lucky', 'lunch',
  'magic', 'major', 'maker', 'march', 'marry', 'match', 'mayor', 'meant', 'medal', 'media', 'mercy', 'merge', 'merit', 'metal', 'meter', 'midst', 'might', 'minor', 'minus', 'mixed', 'model', 'money', 'month', 'Moore', 'moral', 'motor', 'mount', 'mouse', 'mouth', 'moved', 'movie', 'music', 'Myers',
  'naked', 'named', 'naval', 'needs', 'nerve', 'never', 'newly', 'night', 'noble', 'noise', 'north', 'noted', 'novel', 'nurse',
  'occur', 'ocean', 'offer', 'often', 'olive', 'onion', 'opens', 'opera', 'orbit', 'order', 'organ', 'other', 'ought', 'outer', 'owned', 'owner', 'oxide',
  'paint', 'panel', 'panic', 'paper', 'party', 'pasta', 'patch', 'pause', 'peace', 'penny', 'Peter', 'phase', 'phone', 'photo', 'piano', 'piece', 'pilot', 'pitch', 'pizza', 'place', 'plain', 'plane', 'plant', 'plate', 'plaza', 'point', 'poise', 'poker', 'polar', 'pound', 'power', 'press', 'price', 'pride', 'prime', 'print', 'prior', 'prize', 'probe', 'proof', 'proud', 'prove', 'proxy',
  'queen', 'quest', 'quick', 'quiet', 'quite', 'quota', 'quote',
  'radar', 'radio', 'raise', 'rally', 'ranch', 'range', 'rapid', 'ratio', 'reach', 'react', 'ready', 'realm', 'rebel', 'refer', 'reign', 'relax', 'reply', 'rider', 'ridge', 'rifle', 'right', 'rigid', 'river', 'robot', 'rocky', 'Roman', 'rough', 'round', 'route', 'royal', 'ruler', 'rural', 'Russia',
  'sadly', 'saint', 'salad', 'sales', 'sandy', 'sauce', 'saved', 'scale', 'scene', 'scope', 'score', 'Scott', 'scout', 'sense', 'serve', 'setup', 'seven', 'shade', 'shake', 'shall', 'shame', 'shape', 'share', 'shark', 'sharp', 'sheep', 'sheer', 'sheet', 'shelf', 'shell', 'shift', 'shine', 'shirt', 'shock', 'shoot', 'shore', 'short', 'shown', 'sided', 'sight', 'since', 'sixth', 'sixty', 'sized', 'skill', 'slave', 'sleep', 'slice', 'slide', 'slope', 'small', 'smart', 'smell', 'smile', 'smoke', 'snake', 'solid', 'solve', 'sorry', 'sound', 'south', 'space', 'spare', 'spark', 'speak', 'speed', 'spend', 'spent', 'spill', 'spine', 'spite', 'split', 'spoke', 'sport', 'spray', 'staff', 'stage', 'stake', 'stamp', 'stand', 'start', 'state', 'steak', 'steal', 'steam', 'steel', 'steep', 'steer', 'stick', 'still', 'stock', 'stone', 'stood', 'store', 'storm', 'story', 'stove', 'strip', 'stuck', 'study', 'stuff', 'style', 'sugar', 'suite', 'super', 'surge', 'swear', 'sweep', 'sweet', 'swift', 'swing', 'sword', 'Syria',
  'table', 'taken', 'tales', 'taste', 'taxes', 'teach', 'tempo', 'tends', 'tenor', 'tense', 'tenth', 'terms', 'Texas', 'thank', 'theft', 'theme', 'there', 'thick', 'thing', 'think', 'third', 'those', 'three', 'threw', 'throw', 'thumb', 'tight', 'timer', 'tired', 'title', 'toast', 'today', 'token', 'Tommy', 'topic', 'total', 'touch', 'tough', 'tower', 'trace', 'track', 'trade', 'trail', 'train', 'trash', 'treat', 'trend', 'trial', 'tribe', 'trick', 'tried', 'tries', 'troop', 'truck', 'truly', 'trunk', 'trust', 'truth', 'tried', 'tumor', 'tuned', 'turns', 'twice', 'twins',
  'ultra', 'uncle', 'under', 'Union', 'unite', 'unity', 'until', 'upper', 'upset', 'urban', 'usage', 'usual',
  'vague', 'valid', 'value', 'valve', 'venue', 'verse', 'video', 'views', 'villa', 'virus', 'visit', 'vital', 'vocal', 'voice', 'voter',
  'wages', 'waste', 'watch', 'water', 'waves', 'weigh', 'weird', 'whale', 'wheat', 'wheel', 'where', 'which', 'while', 'white', 'whole', 'whose', 'wider', 'widow', 'woman', 'women', 'woods', 'words', 'world', 'worry', 'worse', 'worst', 'worth', 'would', 'wound', 'write', 'wrong', 'wrote',
  'yards', 'years', 'yield', 'young', 'yours', 'youth',
  'zones',
  'listen', 'silent', 'enlist', 'tinsel', 'inlets',
  'earth', 'heart', 'hater',
  'state', 'taste', 'teats',
  'notes', 'stone', 'tones', 'onset',
  'meats', 'steam', 'mates', 'teams',
  'angel', 'angle', 'glean',
  'elbow', 'below', 'bowel',
  'master', 'stream', 'tamers',
  'danger', 'garden', 'ranged', 'gander'
];

export default function AnagramSolverClient() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{word: string; length: number}[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showPartial, setShowPartial] = useState(true);
  const [minLength, setMinLength] = useState(2);
  const [filterLength, setFilterLength] = useState<number | null>(null);

  const { getH1, getSubHeading, faqSchema } = usePageSEO('anagram-solver');

  const webAppSchema = generateWebAppSchema(
    'Anagram Solver - Free Word Finder & Unscrambler',
    'Free online anagram solver. Find all words from scrambled letters. Perfect for Scrabble, Words with Friends, crosswords, and word puzzles.',
    'https://economictimes.indiatimes.com/us/tools/apps/anagram-solver',
    'GameApplication'
  );

  // Sort letters alphabetically for comparison
  const sortLetters = (word: string): string => {
    return word.toLowerCase().split('').sort().join('');
  };

  // Check if word can be formed from available letters
  const canFormWord = (word: string, availableLetters: string): boolean => {
    const letterCount: { [key: string]: number } = {};

    for (const letter of availableLetters.toLowerCase()) {
      if (letter === '?') continue;
      letterCount[letter] = (letterCount[letter] || 0) + 1;
    }

    const wildcards = (availableLetters.match(/\?/g) || []).length;
    let wildcardUsed = 0;

    for (const letter of word.toLowerCase()) {
      if (letterCount[letter] && letterCount[letter] > 0) {
        letterCount[letter]--;
      } else if (wildcardUsed < wildcards) {
        wildcardUsed++;
      } else {
        return false;
      }
    }
    return true;
  };

  const findAnagrams = () => {
    if (!input.trim()) return;

    setIsSearching(true);

    setTimeout(() => {
      const letters = input.toLowerCase().replace(/[^a-z?]/g, '');
      const foundWords: {word: string; length: number}[] = [];
      const seen = new Set<string>();

      for (const word of COMMON_WORDS) {
        const normalizedWord = word.toLowerCase();

        if (seen.has(normalizedWord)) continue;
        if (normalizedWord.length < minLength) continue;
        if (!showPartial && normalizedWord.length !== letters.replace(/\?/g, '').length) continue;
        if (normalizedWord.length > letters.length) continue;

        if (canFormWord(normalizedWord, letters)) {
          seen.add(normalizedWord);
          foundWords.push({ word: normalizedWord, length: normalizedWord.length });
        }
      }

      foundWords.sort((a, b) => {
        if (b.length !== a.length) return b.length - a.length;
        return a.word.localeCompare(b.word);
      });

      setResults(foundWords);
      setIsSearching(false);
    }, 100);
  };

  const filteredResults = useMemo(() => {
    if (filterLength === null) return results;
    return results.filter(r => r.length === filterLength);
  }, [results, filterLength]);

  const lengthGroups = useMemo(() => {
    const groups: { [key: number]: number } = {};
    for (const result of results) {
      groups[result.length] = (groups[result.length] || 0) + 1;
    }
    return Object.entries(groups)
      .map(([len, count]) => ({ length: parseInt(len), count }))
      .sort((a, b) => b.length - a.length);
  }, [results]);

  const handleClear = () => {
    setInput('');
    setResults([]);
    setFilterLength(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      findAnagrams();
    }
  };

  const relatedTools = [
    { name: 'Wordle Solver', path: '/us/tools/apps/wordle-solver', color: 'bg-green-500' },
    { name: 'Scrabble Helper', path: '/us/tools/apps/scrabble-helper', color: 'bg-blue-500' },
    { name: 'Jumble Solver', path: '/us/tools/apps/jumble-solver', color: 'bg-purple-500' },
    { name: 'Word Combiner', path: '/us/tools/apps/word-combiner', color: 'bg-orange-500' },
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
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-100 to-teal-100 px-6 py-3 rounded-full mb-4">
          <span className="text-2xl">🔤</span>
          <span className="text-emerald-600 font-semibold">Anagram Solver</span>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
          {getH1('Anagram Solver')}
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Find all words hidden in your letters. Perfect for Scrabble, Words with Friends, and word puzzles.')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Mobile Stats Bar */}
      <div className="grid grid-cols-4 gap-2 mb-4 lg:hidden">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-2 text-center text-white">
          <div className="text-lg font-bold">{input.replace(/[^a-z?]/gi, '').length}</div>
          <div className="text-xs opacity-80">Letters</div>
        </div>
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-2 text-center text-white">
          <div className="text-lg font-bold">{results.length}</div>
          <div className="text-xs opacity-80">Words</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg p-2 text-center text-white">
          <div className="text-lg font-bold">{lengthGroups.length > 0 ? lengthGroups[0].length : 0}</div>
          <div className="text-xs opacity-80">Longest</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-2 text-center text-white">
          <div className="text-lg font-bold">{(input.match(/\?/g) || []).length}</div>
          <div className="text-xs opacity-80">Wildcards</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Main Tool */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Letters (use ? for wildcards)
                </label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., LISTEN or L?STEN"
                  className="w-full px-4 py-3 text-xl font-mono tracking-widest border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  maxLength={15}
                />
              </div>
              <div className="flex gap-2 items-end">
                <button
                  onClick={findAnagrams}
                  disabled={!input.trim() || isSearching}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50"
                >
                  {isSearching ? 'Searching...' : 'Find Words'}
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-wrap gap-6 items-center border-t border-gray-200 pt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showPartial}
                  onChange={(e) => setShowPartial(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="text-gray-700">Show partial anagrams</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-gray-700">Min length:</span>
                <select
                  value={minLength}
                  onChange={(e) => setMinLength(parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  {[2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n} letters</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-wrap justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Found {results.length} words
                </h3>

                {/* Length filter buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterLength(null)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filterLength === null
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All ({results.length})
                  </button>
                  {lengthGroups.map(({ length, count }) => (
                    <button
                      key={length}
                      onClick={() => setFilterLength(length)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        filterLength === length
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {length} letters ({count})
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {filteredResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg text-center"
                    >
                      <span className="font-mono font-semibold text-emerald-800 uppercase">
                        {result.word}
                      </span>
                      <span className="text-xs text-emerald-600 ml-1">
                        ({result.length})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No results message */}
          {results.length === 0 && input && !isSearching && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center mb-6">
              <span className="text-2xl mb-2 block">😕</span>
              <p className="text-yellow-800">No words found. Try different letters or enable partial anagrams.</p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Tips for Finding More Words</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-emerald-700 mb-2">Use Wildcards</h4>
                <p className="text-sm text-gray-600">Replace unknown letters with ? to find all possible matches.</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-emerald-700 mb-2">Enable Partial Anagrams</h4>
                <p className="text-sm text-gray-600">Find shorter words using only some of your available letters.</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-emerald-700 mb-2">Classic Anagram Examples</h4>
                <p className="text-sm text-gray-600">LISTEN = SILENT, EARTH = HEART, ANGEL = ANGLE</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-emerald-700 mb-2">Game Tips</h4>
                <p className="text-sm text-gray-600">Look for longer words first - they score more points in word games!</p>
              </div>
            </div>
          </div>

          

          {/* Mobile MREC2 - Before FAQs */}


          

          <GameAppMobileMrec2 />



          

          {/* FAQs Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            <FirebaseFAQs pageId="anagram-solver" fallbackFaqs={fallbackFaqs} />
          </div>
        </div>
{/* Right Sidebar */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Desktop Stats */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Search Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                <span className="text-gray-600">Letters</span>
                <span className="font-bold text-emerald-600">{input.replace(/[^a-z?]/gi, '').length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl">
                <span className="text-gray-600">Words Found</span>
                <span className="font-bold text-teal-600">{results.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl">
                <span className="text-gray-600">Longest Word</span>
                <span className="font-bold text-cyan-600">{lengthGroups.length > 0 ? lengthGroups[0].length : 0} letters</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                <span className="text-gray-600">Wildcards</span>
                <span className="font-bold text-green-600">{(input.match(/\?/g) || []).length}</span>
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
                  key={tool.path}
                  href={tool.path}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-3 h-3 rounded-full ${tool.color}`}></div>
                  <span className="text-gray-700 hover:text-emerald-600">{tool.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="hidden lg:block bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-4 text-white">
            <h3 className="text-lg font-bold mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Use ? for blank tiles in Scrabble</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Longer words usually score more points</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Filter by length to find specific word sizes</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Works great for crossword puzzles too</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
