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
    question: 'What is a word jumble?',
    answer: 'A word jumble is a puzzle where letters are scrambled and you need to rearrange them to form a valid English word. Our solver instantly finds all possible words from your scrambled letters.',
    order: 1
  },
  {
    id: '2',
    question: 'How is this different from an anagram solver?',
    answer: 'While similar, our jumble solver is optimized for newspaper-style jumble puzzles. It focuses on finding complete words that use all the letters, perfect for Daily Jumble and similar puzzles.',
    order: 2
  },
  {
    id: '3',
    question: 'Can I solve multiple jumbles at once?',
    answer: 'Yes! You can enter multiple jumbled words separated by spaces or newlines. The solver will find solutions for each one, making it perfect for multi-word jumble puzzles.',
    order: 3
  },
  {
    id: '4',
    question: 'What if no words are found?',
    answer: 'If no exact matches are found, check your spelling. You can also try our partial match feature to find words using some of the letters, which might give you hints.',
    order: 4
  },
  {
    id: '5',
    question: 'Does it work with the Daily Jumble?',
    answer: 'Yes! Our solver works perfectly with the Daily Jumble, Tribune puzzles, and all similar word scramble games. Just enter the jumbled letters and get instant solutions.',
    order: 5
  },
  {
    id: '6',
    question: 'Is there a letter limit?',
    answer: 'You can enter up to 15 letters per jumble. Most newspaper jumbles use 5-7 letters, which our solver handles instantly.',
    order: 6
  }
];

// Word list for jumble solving
const WORD_LIST = [
  // 4-letter words
  'able', 'ache', 'aged', 'also', 'area', 'army', 'away', 'baby', 'back', 'ball', 'band', 'bank', 'base', 'bath', 'bear', 'beat', 'been', 'beer', 'bell', 'belt', 'bend', 'best', 'bike', 'bill', 'bird', 'blow', 'blue', 'boat', 'body', 'boil', 'bold', 'bone', 'book', 'boom', 'born', 'boss', 'both', 'bowl', 'burn', 'bush', 'busy', 'cake', 'call', 'calm', 'came', 'camp', 'card', 'care', 'case', 'cash', 'cast', 'cell', 'chef', 'chip', 'city', 'club', 'coal', 'coat', 'code', 'coin', 'cold', 'come', 'cook', 'cool', 'cope', 'copy', 'core', 'cost', 'crew', 'crop', 'dark', 'data', 'date', 'dawn', 'days', 'dead', 'deal', 'dean', 'dear', 'debt', 'deck', 'deed', 'deep', 'desk', 'dial', 'diet', 'dirt', 'dish', 'disk', 'dock', 'does', 'done', 'door', 'dose', 'down', 'draw', 'drew', 'drop', 'drug', 'drum', 'dual', 'duke', 'dust', 'duty', 'each', 'earn', 'ease', 'east', 'easy', 'edge', 'else', 'even', 'ever', 'exam', 'exit', 'face', 'fact', 'fail', 'fair', 'fall', 'fame', 'farm', 'fast', 'fate', 'fear', 'feed', 'feel', 'feet', 'fell', 'felt', 'file', 'fill', 'film', 'find', 'fine', 'fire', 'firm', 'fish', 'five', 'flag', 'flat', 'fled', 'flew', 'flip', 'flow', 'fold', 'folk', 'food', 'foot', 'ford', 'form', 'fort', 'four', 'free', 'from', 'fuel', 'full', 'fund', 'gain', 'game', 'gang', 'gate', 'gave', 'gear', 'gene', 'gift', 'girl', 'give', 'glad', 'goal', 'goes', 'gold', 'golf', 'gone', 'good', 'grab', 'gray', 'grew', 'grow', 'gulf', 'hair', 'half', 'hall', 'hand', 'hang', 'hard', 'harm', 'hate', 'have', 'head', 'hear', 'heat', 'held', 'hell', 'help', 'here', 'hero', 'hide', 'high', 'hill', 'hint', 'hire', 'hold', 'hole', 'holy', 'home', 'hope', 'host', 'hour', 'huge', 'hung', 'hunt', 'hurt', 'idea', 'inch', 'into', 'iron', 'item', 'jack', 'jail', 'jane', 'jean', 'jobs', 'john', 'join', 'joke', 'judy', 'july', 'jump', 'june', 'jury', 'just', 'keen', 'keep', 'kent', 'kept', 'kick', 'kill', 'kind', 'king', 'knew', 'know', 'lack', 'lady', 'laid', 'lake', 'land', 'lane', 'last', 'late', 'lead', 'left', 'lend', 'less', 'life', 'lift', 'like', 'line', 'link', 'list', 'live', 'load', 'loan', 'lock', 'logo', 'long', 'look', 'lord', 'lose', 'loss', 'lost', 'love', 'luck', 'made', 'mail', 'main', 'make', 'male', 'many', 'mark', 'mars', 'mass', 'mate', 'meal', 'mean', 'meat', 'meet', 'menu', 'mere', 'mike', 'mild', 'mile', 'milk', 'mill', 'mind', 'mine', 'miss', 'mode', 'mood', 'moon', 'more', 'most', 'move', 'much', 'must', 'name', 'navy', 'near', 'neck', 'need', 'network', 'news', 'next', 'nice', 'nine', 'none', 'noon', 'nose', 'note', 'okay', 'once', 'only', 'onto', 'open', 'oral', 'over', 'pace', 'pack', 'page', 'paid', 'pain', 'pair', 'palm', 'park', 'part', 'pass', 'past', 'path', 'peak', 'pick', 'pink', 'pipe', 'plan', 'play', 'plot', 'plus', 'poem', 'poet', 'poll', 'pond', 'pool', 'poor', 'port', 'pose', 'post', 'pour', 'pray', 'pull', 'pure', 'push', 'quit', 'race', 'rail', 'rain', 'rank', 'rare', 'rate', 'read', 'real', 'rear', 'rely', 'rent', 'rest', 'rice', 'rich', 'ride', 'ring', 'rise', 'risk', 'road', 'rock', 'role', 'roll', 'roof', 'room', 'root', 'rose', 'rule', 'rush', 'ruth', 'safe', 'said', 'sake', 'sale', 'salt', 'same', 'sand', 'save', 'seat', 'seek', 'seem', 'seen', 'self', 'sell', 'send', 'sent', 'ship', 'shop', 'shot', 'show', 'shut', 'sick', 'side', 'sign', 'site', 'size', 'skin', 'slip', 'slow', 'snow', 'soft', 'soil', 'sold', 'sole', 'some', 'song', 'soon', 'sort', 'soul', 'spot', 'star', 'stay', 'stem', 'step', 'stop', 'such', 'suit', 'sure', 'swim', 'take', 'tale', 'talk', 'tall', 'tank', 'tape', 'task', 'team', 'tear', 'tech', 'tell', 'tend', 'term', 'test', 'text', 'than', 'that', 'them', 'then', 'they', 'thin', 'this', 'thus', 'tied', 'till', 'time', 'tiny', 'told', 'tone', 'tony', 'took', 'tool', 'tops', 'tour', 'town', 'tree', 'trip', 'true', 'tube', 'turn', 'twin', 'type', 'unit', 'upon', 'used', 'user', 'vary', 'vast', 'very', 'view', 'vote', 'wage', 'wait', 'wake', 'walk', 'wall', 'want', 'warm', 'wash', 'wave', 'ways', 'weak', 'wear', 'week', 'well', 'went', 'were', 'west', 'what', 'when', 'whom', 'wide', 'wife', 'wild', 'will', 'wind', 'wine', 'wing', 'wire', 'wise', 'wish', 'with', 'wood', 'word', 'wore', 'work', 'wrap', 'yard', 'yeah', 'year', 'your', 'zero', 'zone',
  // 5-letter words
  'about', 'above', 'abuse', 'actor', 'acute', 'admit', 'adopt', 'adult', 'after', 'again', 'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alien', 'align', 'alike', 'alive', 'allow', 'alone', 'along', 'alter', 'among', 'angel', 'anger', 'angle', 'angry', 'apart', 'apple', 'apply', 'arena', 'argue', 'arise', 'armor', 'array', 'arrow', 'aside', 'asset', 'avoid', 'award', 'aware', 'awful', 'basic', 'basis', 'beach', 'began', 'begin', 'being', 'below', 'bench', 'bible', 'birth', 'black', 'blade', 'blame', 'blank', 'blast', 'blend', 'bless', 'blind', 'block', 'blood', 'board', 'boost', 'booth', 'bound', 'brain', 'brand', 'brave', 'bread', 'break', 'breed', 'brick', 'bride', 'brief', 'bring', 'broad', 'broke', 'brown', 'brush', 'build', 'built', 'bunch', 'burst', 'buyer', 'cable', 'candy', 'carry', 'catch', 'cause', 'chain', 'chair', 'chaos', 'charm', 'chart', 'chase', 'cheap', 'check', 'chest', 'chief', 'child', 'china', 'chose', 'chunk', 'civil', 'claim', 'class', 'clean', 'clear', 'clerk', 'click', 'climb', 'clock', 'close', 'cloth', 'cloud', 'coach', 'coast', 'color', 'couch', 'could', 'count', 'court', 'cover', 'crack', 'craft', 'crash', 'crazy', 'cream', 'crime', 'cross', 'crowd', 'crown', 'cruel', 'curve', 'cycle', 'daily', 'dance', 'dated', 'dealt', 'death', 'debut', 'delay', 'depth', 'devil', 'diary', 'dirty', 'doubt', 'dozen', 'draft', 'drain', 'drama', 'drank', 'drawn', 'dream', 'dress', 'dried', 'drink', 'drive', 'drove', 'dying', 'eager', 'early', 'earth', 'eight', 'elect', 'elite', 'empty', 'enemy', 'enjoy', 'enter', 'entry', 'equal', 'error', 'essay', 'event', 'every', 'exact', 'exist', 'extra', 'faith', 'false', 'fancy', 'fatal', 'fault', 'favor', 'feast', 'fiber', 'field', 'fifth', 'fifty', 'fight', 'final', 'first', 'fixed', 'flame', 'flash', 'flesh', 'float', 'flood', 'floor', 'flour', 'fluid', 'focus', 'force', 'forth', 'forum', 'found', 'frame', 'frank', 'fraud', 'fresh', 'front', 'frost', 'fruit', 'funny', 'ghost', 'giant', 'given', 'glass', 'globe', 'glory', 'grace', 'grade', 'grain', 'grand', 'grant', 'grape', 'graph', 'grasp', 'grass', 'grave', 'great', 'green', 'greet', 'grief', 'gross', 'group', 'grove', 'grown', 'guard', 'guess', 'guest', 'guide', 'guilt', 'habit', 'happy', 'harsh', 'haven', 'heart', 'heavy', 'hello', 'hence', 'hobby', 'honey', 'honor', 'horse', 'hotel', 'house', 'human', 'humor', 'ideal', 'image', 'imply', 'index', 'inner', 'input', 'iraqi', 'irish', 'issue', 'joint', 'judge', 'juice', 'knife', 'knock', 'known', 'label', 'labor', 'large', 'laser', 'later', 'laugh', 'layer', 'learn', 'lease', 'least', 'leave', 'legal', 'lemon', 'level', 'light', 'limit', 'linen', 'liver', 'local', 'loose', 'lover', 'lower', 'loyal', 'lucky', 'lunch', 'lying', 'magic', 'major', 'maker', 'march', 'marry', 'match', 'mayor', 'meant', 'medal', 'media', 'mercy', 'merge', 'merit', 'metal', 'meter', 'midst', 'might', 'minor', 'minus', 'mixed', 'model', 'money', 'month', 'moral', 'motor', 'mount', 'mouse', 'mouth', 'movie', 'music', 'naked', 'naval', 'nerve', 'never', 'newly', 'night', 'noble', 'noise', 'north', 'noted', 'novel', 'nurse', 'occur', 'ocean', 'offer', 'often', 'olive', 'onion', 'opera', 'orbit', 'order', 'organ', 'other', 'ought', 'outer', 'owned', 'owner', 'oxide', 'paint', 'panel', 'panic', 'paper', 'party', 'pasta', 'patch', 'pause', 'peace', 'penny', 'phase', 'phone', 'photo', 'piano', 'piece', 'pilot', 'pitch', 'pizza', 'place', 'plain', 'plane', 'plant', 'plate', 'plaza', 'plead', 'point', 'polar', 'pound', 'power', 'press', 'price', 'pride', 'prime', 'print', 'prior', 'prize', 'probe', 'proof', 'proud', 'prove', 'queen', 'quest', 'quick', 'quiet', 'quite', 'quote', 'radar', 'radio', 'raise', 'rally', 'ranch', 'range', 'rapid', 'ratio', 'reach', 'react', 'ready', 'realm', 'rebel', 'refer', 'reign', 'relax', 'reply', 'rider', 'ridge', 'rifle', 'right', 'rigid', 'rival', 'river', 'robot', 'rocky', 'roman', 'rough', 'round', 'route', 'royal', 'rural', 'sadly', 'saint', 'salad', 'sales', 'sauce', 'scale', 'scene', 'scope', 'score', 'scout', 'sense', 'serve', 'seven', 'shade', 'shake', 'shall', 'shame', 'shape', 'share', 'sharp', 'sheep', 'sheer', 'sheet', 'shelf', 'shell', 'shift', 'shine', 'shirt', 'shock', 'shoot', 'shore', 'short', 'sight', 'since', 'sixth', 'sixty', 'skill', 'slave', 'sleep', 'slice', 'slide', 'slope', 'small', 'smart', 'smell', 'smile', 'smoke', 'snake', 'solid', 'solve', 'sorry', 'sound', 'south', 'space', 'spare', 'speak', 'speed', 'spend', 'spent', 'spill', 'spine', 'spite', 'split', 'spoke', 'sport', 'spray', 'staff', 'stage', 'stake', 'stamp', 'stand', 'stare', 'start', 'state', 'steam', 'steel', 'steep', 'steer', 'stern', 'stick', 'still', 'stock', 'stone', 'stood', 'store', 'storm', 'story', 'stove', 'strip', 'stuck', 'study', 'stuff', 'style', 'sugar', 'suite', 'sunny', 'super', 'swear', 'sweep', 'sweet', 'swing', 'sword', 'table', 'taken', 'taste', 'teach', 'teeth', 'tempo', 'tends', 'tenor', 'tenth', 'thank', 'theft', 'their', 'theme', 'there', 'these', 'thick', 'thief', 'thing', 'think', 'third', 'those', 'three', 'threw', 'throw', 'thumb', 'tiger', 'tight', 'tired', 'title', 'today', 'token', 'topic', 'total', 'touch', 'tough', 'tower', 'trace', 'track', 'trade', 'trail', 'train', 'trash', 'treat', 'trend', 'trial', 'tribe', 'trick', 'tried', 'truck', 'truly', 'trunk', 'trust', 'truth', 'twice', 'uncle', 'under', 'union', 'unite', 'unity', 'until', 'upper', 'upset', 'urban', 'usage', 'usual', 'valid', 'value', 'video', 'virus', 'visit', 'vital', 'vocal', 'voice', 'voter', 'wagon', 'waste', 'watch', 'water', 'weigh', 'weird', 'whale', 'wheat', 'wheel', 'where', 'which', 'while', 'white', 'whole', 'whose', 'widen', 'widow', 'width', 'woman', 'women', 'world', 'worry', 'worse', 'worst', 'worth', 'would', 'wound', 'write', 'wrong', 'wrote', 'yield', 'young', 'yours', 'youth',
  // 6-letter words
  'abroad', 'absent', 'absorb', 'accept', 'access', 'accord', 'accuse', 'across', 'action', 'active', 'actual', 'adjust', 'admire', 'affirm', 'afford', 'afraid', 'agency', 'agenda', 'almost', 'always', 'amount', 'animal', 'annual', 'answer', 'anyone', 'appear', 'around', 'arrest', 'arrive', 'artist', 'aspect', 'assert', 'assess', 'assign', 'assist', 'assume', 'assure', 'attach', 'attack', 'attend', 'august', 'author', 'autumn', 'avenue', 'backed', 'backup', 'ballet', 'banana', 'banker', 'barely', 'barrel', 'basket', 'battle', 'beauty', 'became', 'become', 'before', 'behalf', 'behind', 'belief', 'belong', 'beside', 'beyond', 'bishop', 'bitter', 'blanket', 'bloody', 'bomber', 'border', 'bother', 'bottle', 'bottom', 'bounce', 'branch', 'breath', 'bridge', 'bright', 'brings', 'broken', 'bronze', 'broker', 'browse', 'budget', 'buffer', 'burden', 'bureau', 'buried', 'button', 'bought', 'cabinet', 'caller', 'camera', 'campus', 'cancer', 'candle', 'cannot', 'canvas', 'carbon', 'career', 'carpet', 'castle', 'casual', 'cattle', 'caught', 'center', 'centre', 'chance', 'change', 'chapel', 'charge', 'cheese', 'cherry', 'choice', 'choose', 'chosen', 'church', 'circle', 'cities', 'clinic', 'closed', 'closer', 'clothe', 'coffee', 'collar', 'combat', 'coming', 'commit', 'common', 'comply', 'copper', 'corner', 'costly', 'cotton', 'county', 'couple', 'course', 'cousin', 'covers', 'create', 'credit', 'crisis', 'custom', 'damage', 'dancer', 'danger', 'dealer', 'debate', 'decade', 'decent', 'decide', 'defeat', 'defend', 'define', 'degree', 'demand', 'depend', 'deputy', 'derive', 'desert', 'design', 'desire', 'detail', 'detect', 'device', 'devote', 'dialog', 'differ', 'dinner', 'direct', 'divide', 'doctor', 'dollar', 'domain', 'donate', 'double', 'drawer', 'driven', 'driver', 'during', 'easily', 'eating', 'effect', 'effort', 'eighth', 'eighty', 'either', 'emerge', 'empire', 'employ', 'enable', 'ending', 'energy', 'engage', 'engine', 'enough', 'ensure', 'entire', 'entity', 'equity', 'escape', 'estate', 'ethnic', 'exceed', 'except', 'excuse', 'expand', 'expect', 'expert', 'export', 'expose', 'extend', 'extent', 'fabric', 'facing', 'factor', 'failed', 'fairly', 'fallen', 'family', 'famous', 'farmer', 'father', 'fellow', 'female', 'figure', 'filing', 'finger', 'finish', 'fiscal', 'flavor', 'flight', 'flower', 'folder', 'follow', 'forest', 'forget', 'formal', 'format', 'former', 'foster', 'fought', 'fourth', 'freeze', 'french', 'friend', 'frozen', 'future', 'galaxy', 'garden', 'gather', 'gender', 'genius', 'gentle', 'german', 'global', 'golden', 'govern', 'grants', 'gravel', 'grease', 'ground', 'growth', 'guitar', 'handle', 'happen', 'hardly', 'hawaii', 'health', 'heaven', 'height', 'helped', 'helper', 'hereby', 'heroes', 'hidden', 'holder', 'honest', 'horror', 'hunter', 'impact', 'import', 'impose', 'income', 'indeed', 'infant', 'inform', 'injury', 'inside', 'insist', 'insure', 'intact', 'intend', 'intent', 'invest', 'island', 'itself', 'jersey', 'jordan', 'junior', 'justin', 'keeper', 'kernel', 'kidney', 'killer', 'knight', 'ladder', 'ladies', 'landed', 'laptop', 'larger', 'latest', 'latter', 'launch', 'lawyer', 'layout', 'leader', 'league', 'leaves', 'legacy', 'legend', 'length', 'lesson', 'letter', 'liable', 'lights', 'likely', 'linear', 'liquid', 'listen', 'little', 'living', 'locate', 'locked', 'london', 'lonely', 'longer', 'looked', 'losing', 'lovely', 'lowest', 'luxury', 'mainly', 'making', 'manage', 'manner', 'manual', 'marble', 'margin', 'marine', 'market', 'martin', 'master', 'matter', 'mature', 'medium', 'member', 'memory', 'mental', 'mentor', 'merely', 'merger', 'method', 'middle', 'miller', 'minute', 'mirror', 'mobile', 'modern', 'modest', 'modify', 'moment', 'monkey', 'mother', 'motion', 'moving', 'murder', 'muscle', 'museum', 'myself', 'narrow', 'nation', 'native', 'nature', 'nearby', 'nearly', 'nelson', 'neural', 'nights', 'ninety', 'nobody', 'normal', 'notice', 'notify', 'notion', 'number', 'object', 'obtain', 'occupy', 'office', 'offset', 'online', 'opened', 'openly', 'oppose', 'option', 'orange', 'origin', 'output', 'oxford', 'oxygen', 'packed', 'packet', 'palace', 'parent', 'partly', 'passed', 'patent', 'patrol', 'patron', 'paying', 'peanut', 'people', 'pepper', 'period', 'permit', 'person', 'phrase', 'picked', 'picnic', 'pillow', 'plasma', 'player', 'please', 'pledge', 'plenty', 'pocket', 'poetry', 'police', 'policy', 'polish', 'polite', 'poorly', 'portal', 'poster', 'potato', 'potent', 'powder', 'praise', 'prayer', 'prefer', 'pretty', 'prince', 'prison', 'profit', 'proper', 'proven', 'public', 'purple', 'pursue', 'puzzle', 'rabbit', 'racial', 'racing', 'random', 'ranger', 'rarely', 'rating', 'rather', 'reader', 'really', 'reason', 'recall', 'recent', 'recipe', 'record', 'reduce', 'reform', 'refuse', 'regard', 'region', 'reject', 'relate', 'relief', 'remain', 'remark', 'remedy', 'remind', 'remote', 'remove', 'rental', 'repeat', 'report', 'rescue', 'resist', 'resort', 'result', 'retail', 'retain', 'retire', 'return', 'reveal', 'review', 'reward', 'rhythm', 'riding', 'rising', 'robust', 'rocket', 'roller', 'rubber', 'ruling', 'runner', 'sacred', 'safely', 'safety', 'salary', 'salmon', 'sample', 'saving', 'saying', 'scared', 'scheme', 'school', 'screen', 'script', 'search', 'season', 'second', 'secret', 'sector', 'secure', 'seeing', 'seller', 'senate', 'senior', 'sensor', 'serial', 'series', 'server', 'settle', 'severe', 'shadow', 'sheets', 'shower', 'signed', 'silent', 'silver', 'simple', 'simply', 'singer', 'single', 'sister', 'sketch', 'sleepy', 'slight', 'smooth', 'soccer', 'social', 'sodium', 'soften', 'solely', 'solver', 'sorted', 'sought', 'source', 'speech', 'sphere', 'spider', 'spirit', 'splash', 'spoken', 'spread', 'spring', 'square', 'stable', 'status', 'steady', 'stereo', 'sticky', 'stolen', 'stormy', 'strain', 'strand', 'stream', 'street', 'stress', 'strict', 'strike', 'string', 'stroke', 'strong', 'studio', 'stupid', 'submit', 'subtle', 'suburb', 'sudden', 'suffer', 'summit', 'summer', 'sunday', 'sunset', 'supply', 'surely', 'survey', 'switch', 'symbol', 'syntax', 'system', 'tablet', 'tackle', 'taking', 'talent', 'target', 'taught', 'taylor', 'temple', 'tenant', 'tender', 'tennis', 'terror', 'thanks', 'theory', 'things', 'thirty', 'thomas', 'though', 'thread', 'threat', 'thrill', 'throne', 'thrown', 'ticket', 'timing', 'tissue', 'tongue', 'toilet', 'toward', 'trader', 'travel', 'treaty', 'tribal', 'tricky', 'triple', 'troops', 'trophy', 'trying', 'tunnel', 'turkey', 'twelve', 'twenty', 'unable', 'unique', 'united', 'unless', 'unlike', 'unlock', 'unsafe', 'update', 'uphold', 'upload', 'valley', 'valued', 'vendor', 'verbal', 'verify', 'versus', 'victim', 'viewer', 'village', 'violin', 'virgin', 'virtue', 'vision', 'visual', 'volume', 'walker', 'wealth', 'weapon', 'weekly', 'weight', 'wholly', 'wicked', 'widely', 'wilson', 'window', 'winner', 'winter', 'wisdom', 'wishes', 'within', 'wizard', 'wonder', 'wooden', 'worker', 'worthy', 'wright', 'writer', 'yellow', 'zombie',
  // 7-letter words
  'abandon', 'ability', 'absence', 'academy', 'account', 'achieve', 'acquire', 'address', 'advance', 'adverse', 'adviser', 'against', 'airline', 'alcohol', 'amazing', 'ancient', 'another', 'anxiety', 'anybody', 'anymore', 'applied', 'arrange', 'arrival', 'article', 'assault', 'attempt', 'attract', 'auction', 'average', 'balance', 'banking', 'barrier', 'battery', 'beating', 'because', 'bedroom', 'believe', 'beneath', 'benefit', 'besides', 'between', 'billion', 'blanket', 'blessed', 'blocked', 'borough', 'brother', 'browser', 'builder', 'burning', 'cabinet', 'calcium', 'calling', 'capable', 'capital', 'captain', 'capture', 'careful', 'carrier', 'casting', 'catalog', 'central', 'century', 'certain', 'chamber', 'channel', 'chapter', 'charged', 'charity', 'cheaper', 'checked', 'chicken', 'chronic', 'circuit', 'citizen', 'claimed', 'classic', 'cleaned', 'cleaner', 'clearly', 'climate', 'closely', 'clothes', 'coastal', 'coating', 'college', 'comfort', 'command', 'comment', 'company', 'compare', 'compete', 'complex', 'concept', 'concern', 'conduct', 'confirm', 'connect', 'consent', 'consist', 'contact', 'contain', 'content', 'context', 'control', 'convert', 'cooking', 'correct', 'council', 'counter', 'country', 'crucial', 'culture', 'current', 'cutting', 'dancing', 'dealing', 'decided', 'decline', 'default', 'defence', 'defense', 'deficit', 'deliver', 'density', 'deposit', 'desktop', 'despite', 'destroy', 'details', 'develop', 'devoted', 'diamond', 'digital', 'disable', 'discuss', 'disease', 'display', 'dispute', 'distant', 'diverse', 'divided', 'dollars', 'drawing', 'dressed', 'driving', 'dropped', 'dynamic', 'earning', 'eastern', 'edition', 'editing', 'elderly', 'elected', 'element', 'embrace', 'emotion', 'emperor', 'enhance', 'enjoyed', 'enquiry', 'entered', 'entropy', 'episode', 'equally', 'essence', 'evening', 'evident', 'examine', 'example', 'excited', 'exclude', 'execute', 'exhibit', 'existed', 'expense', 'explain', 'exploit', 'explore', 'exposed', 'express', 'extreme', 'factory', 'failing', 'failure', 'fashion', 'fastest', 'feature', 'federal', 'feeding', 'feeling', 'fighter', 'finally', 'finance', 'finding', 'fishing', 'fitness', 'florida', 'flowers', 'focused', 'folding', 'foreign', 'forever', 'formula', 'fortune', 'forward', 'founded', 'founder', 'fragile', 'freedom', 'freight', 'funding', 'funeral', 'further', 'gallery', 'general', 'genuine', 'getting', 'glasses', 'goddess', 'goodbye', 'grabbed', 'graphic', 'greater', 'greatly', 'grocery', 'growing', 'habitat', 'halfway', 'handful', 'hanging', 'harbour', 'heading', 'healing', 'healthy', 'hearing', 'heating', 'heavily', 'helping', 'herself', 'highway', 'himself', 'history', 'holiday', 'honored', 'hosting', 'housing', 'however', 'hunting', 'illness', 'imagine', 'imaging', 'implied', 'imports', 'imposed', 'improve', 'include', 'indexed', 'induced', 'initial', 'insured', 'integer', 'interim', 'involve', 'italian', 'jewelry', 'joining', 'journal', 'journey', 'justice', 'justify', 'keeping', 'keyword', 'killing', 'kingdom', 'kitchen', 'knowing', 'lacking', 'landing', 'largely', 'lasting', 'leading', 'learned', 'leaving', 'leather', 'leisure', 'lending', 'lengthy', 'leonard', 'letting', 'liberal', 'liberty', 'library', 'license', 'limited', 'Lincoln', 'linking', 'listing', 'located', 'looking', 'lottery', 'machine', 'madison', 'magical', 'mailing', 'managed', 'manager', 'mankind', 'mansion', 'married', 'massive', 'meaning', 'measure', 'medical', 'meeting', 'mention', 'mercury', 'message', 'mineral', 'minimum', 'missing', 'mission', 'mistake', 'mixture', 'monitor', 'monster', 'monthly', 'morning', 'mounted', 'mystery', 'nations', 'natural', 'nearest', 'neither', 'nervous', 'network', 'neutral', 'notable', 'nothing', 'noticed', 'nuclear', 'numeric', 'nursing', 'obesity', 'obliged', 'obscure', 'observe', 'obvious', 'offense', 'offered', 'officer', 'ongoing', 'opening', 'operate', 'opinion', 'optical', 'optimal', 'organic', 'origins', 'outcome', 'outdoor', 'outlook', 'outside', 'overall', 'package', 'painted', 'painter', 'parking', 'partial', 'partner', 'passage', 'passing', 'passive', 'patient', 'pattern', 'payment', 'pending', 'pension', 'percent', 'perfect', 'perform', 'perhaps', 'phoenix', 'physics', 'pioneer', 'pitched', 'placing', 'planned', 'planner', 'plastic', 'plateau', 'playing', 'pleased', 'pointer', 'pointed', 'popular', 'portion', 'poverty', 'powered', 'precise', 'predict', 'premier', 'premium', 'prepare', 'present', 'prevent', 'primary', 'printed', 'printer', 'privacy', 'private', 'problem', 'proceed', 'process', 'produce', 'product', 'profile', 'program', 'project', 'promise', 'promote', 'propose', 'protect', 'protein', 'protest', 'provide', 'publish', 'pulling', 'purpose', 'pursuit', 'putting', 'qualify', 'quality', 'quarter', 'quantum', 'quickly', 'radical', 'railway', 'rainbow', 'raising', 'ranking', 'rapidly', 'reached', 'reading', 'reality', 'realize', 'receive', 'recover', 'reduced', 'reflect', 'refresh', 'refused', 'regular', 'related', 'release', 'remains', 'removed', 'renewal', 'replace', 'replied', 'require', 'reserve', 'resolve', 'respect', 'respond', 'restore', 'results', 'retired', 'returns', 'reunion', 'revenue', 'reverse', 'revised', 'richard', 'rolling', 'romance', 'routine', 'running', 'satisfy', 'savings', 'scandal', 'scenery', 'scholar', 'science', 'scoring', 'scratch', 'scratch', 'section', 'seeking', 'segment', 'senator', 'sending', 'serious', 'servant', 'service', 'serving', 'session', 'setting', 'seventh', 'several', 'shaping', 'sharing', 'shelter', 'shipped', 'shocked', 'shorter', 'shortly', 'showing', 'silicon', 'similar', 'singing', 'sitting', 'slavery', 'smaller', 'smoking', 'society', 'soldier', 'somehow', 'someday', 'someone', 'sorting', 'sounded', 'spanish', 'speaker', 'special', 'specify', 'sponsor', 'stadium', 'stanley', 'started', 'starter', 'station', 'staying', 'stephen', 'storage', 'strange', 'student', 'studied', 'studios', 'subject', 'succeed', 'success', 'suggest', 'suicide', 'summary', 'sunrise', 'support', 'suppose', 'supreme', 'surface', 'surplus', 'surgery', 'survive', 'suspect', 'suspend', 'sustain', 'teacher', 'telling', 'tension', 'terminal', 'terrain', 'testing', 'texture', 'theatre', 'therapy', 'thereby', 'thereof', 'thermal', 'thicker', 'through', 'thunder', 'tonight', 'toolbar', 'touches', 'totally', 'touched', 'touring', 'tourism', 'tourist', 'tracker', 'trading', 'traffic', 'trailer', 'trained', 'trainer', 'transit', 'treated', 'triples', 'trouble', 'turning', 'typical', 'ukraine', 'uniform', 'unknown', 'unlawful', 'upgrade', 'upwards', 'utility', 'variety', 'various', 'vehicle', 'venture', 'version', 'vessels', 'veteran', 'village', 'violent', 'virtual', 'visible', 'visited', 'visitor', 'vitamin', 'voltage', 'waiting', 'walking', 'wanting', 'warming', 'warning', 'warrant', 'washing', 'watched', 'wealthy', 'wearing', 'weather', 'website', 'wedding', 'weekend', 'welcome', 'welfare', 'western', 'whereas', 'whether', 'whoever', 'widened', 'william', 'willing', 'windsor', 'winning', 'wiretap', 'without', 'witness', 'working', 'workout', 'worried', 'worship', 'wrapper', 'writing', 'written', 'younger', 'zealand',
];

export default function JumbleSolverClient() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{jumble: string; solutions: string[]}[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { getH1, getSubHeading, faqSchema } = usePageSEO('jumble-solver');

  const webAppSchema = generateWebAppSchema(
    'Jumble Solver - Free Word Unscrambler',
    'Solve word jumbles instantly. Free online jumble solver for Daily Jumble, newspaper puzzles, and word scrambles. Fast and accurate solutions.',
    'https://economictimes.indiatimes.com/us/tools/apps/jumble-solver',
    'GameApplication'
  );

  const sortLetters = (word: string): string => {
    return word.toLowerCase().split('').sort().join('');
  };

  const solveJumble = (jumbledWord: string): string[] => {
    const sorted = sortLetters(jumbledWord);
    return WORD_LIST.filter(word => {
      if (word.length !== jumbledWord.length) return false;
      return sortLetters(word) === sorted;
    });
  };

  const handleSolve = () => {
    if (!input.trim()) return;

    setIsSearching(true);

    setTimeout(() => {
      const jumbles = input
        .toUpperCase()
        .split(/[\s,\n]+/)
        .map(j => j.replace(/[^A-Z]/g, ''))
        .filter(j => j.length >= 2);

      const newResults = jumbles.map(jumble => ({
        jumble,
        solutions: solveJumble(jumble) }));

      setResults(newResults);
      setIsSearching(false);
    }, 100);
  };

  const handleClear = () => {
    setInput('');
    setResults([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSolve();
    }
  };

  const totalSolutions = results.reduce((sum, r) => sum + r.solutions.length, 0);
  const jumblesSolved = results.filter(r => r.solutions.length > 0).length;

  const relatedTools = [
    { name: 'Anagram Solver', href: '/us/tools/apps/anagram-solver', description: 'Find all anagrams' },
    { name: 'Wordle Solver', href: '/us/tools/apps/wordle-solver', description: 'Get Wordle hints' },
    { name: 'Scrabble Helper', href: '/us/tools/apps/scrabble-helper', description: 'Score more points' },
    { name: 'Word Combiner', href: '/us/tools/apps/word-combiner', description: 'Create portmanteaus' },
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
          <span className="text-2xl">🔀</span>
          <span className="text-violet-600 font-semibold">Jumble Solver</span>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
          {getH1('Jumble Solver')}
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Unscramble jumbled words instantly. Perfect for Daily Jumble puzzles and word games.')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Mobile Stats Bar */}
      <div className="grid grid-cols-4 gap-2 mb-4 lg:hidden">
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-violet-600">{input.split(/[\s,\n]+/).filter(w => w.trim()).length}</div>
          <div className="text-xs text-gray-500">Jumbles</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-green-600">{jumblesSolved}</div>
          <div className="text-xs text-gray-500">Solved</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-blue-600">{totalSolutions}</div>
          <div className="text-xs text-gray-500">Words</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-amber-600">{WORD_LIST.length.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Dictionary</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Main Tool */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter jumbled letters (one per line or space-separated)
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., ELTISN or ELTISN RATHE LOCDW"
                className="w-full h-32 px-4 py-3 text-lg font-mono tracking-widest border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSolve}
                disabled={!input.trim() || isSearching}
                className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                {isSearching ? 'Solving...' : 'Solve Jumble'}
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Solutions Found
                </h3>
                <span className="text-sm text-violet-600 font-medium">
                  {totalSolutions} word{totalSolutions !== 1 ? 's' : ''} found
                </span>
              </div>

              <div className="space-y-6">
                {results.map((result, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl font-mono font-bold text-violet-600">
                        {result.jumble}
                      </span>
                      <span className="text-gray-400">-&gt;</span>
                      <span className="text-sm text-gray-500">
                        {result.solutions.length} solution{result.solutions.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {result.solutions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {result.solutions.map((solution, sIndex) => (
                          <div
                            key={sIndex}
                            className="px-4 py-2 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg"
                          >
                            <span className="font-mono font-semibold text-violet-800 uppercase">
                              {solution}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg inline-block">
                        No solutions found. Check the letters and try again.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          

          {/* Mobile MREC2 - Before FAQs */}


          

          <GameAppMobileMrec2 />



          

          {/* FAQs Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
            <FirebaseFAQs pageId="jumble-solver" fallbackFaqs={fallbackFaqs} />
          </div>
        </div>
{/* Right Sidebar */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Desktop Stats Panel */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Solver Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl">
                <span className="text-gray-600">Jumbles Entered</span>
                <span className="font-bold text-violet-600">{input.split(/[\s,\n]+/).filter(w => w.trim()).length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <span className="text-gray-600">Solved</span>
                <span className="font-bold text-green-600">{jumblesSolved}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <span className="text-gray-600">Words Found</span>
                <span className="font-bold text-blue-600">{totalSolutions}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                <span className="text-gray-600">Dictionary Size</span>
                <span className="font-bold text-amber-600">{WORD_LIST.length.toLocaleString()}</span>
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
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-violet-50 rounded-xl transition-colors group"
                >
                  <div>
                    <div className="font-medium text-gray-800 group-hover:text-violet-600">{tool.name}</div>
                    <div className="text-xs text-gray-500">{tool.description}</div>
                  </div>
                  <span className="text-gray-400 group-hover:text-violet-500">-&gt;</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="hidden lg:block bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-violet-500 mt-1">*</span>
                <span>Enter multiple jumbles separated by spaces or on new lines</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500 mt-1">*</span>
                <span>Perfect for Daily Jumble and newspaper puzzles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500 mt-1">*</span>
                <span>Some scrambled letters may have multiple solutions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500 mt-1">*</span>
                <span>Press Enter to solve quickly</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
