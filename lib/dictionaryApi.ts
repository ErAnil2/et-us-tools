/**
 * Free Dictionary API utility
 * API: https://dictionaryapi.dev/
 *
 * Note: This fetches words on-demand without storing them
 * to minimize memory usage and token consumption.
 */

export interface DictionaryDefinition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: DictionaryDefinition[];
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryPhonetic {
  text?: string;
  audio?: string;
}

export interface DictionaryEntry {
  word: string;
  phonetics: DictionaryPhonetic[];
  meanings: DictionaryMeaning[];
  sourceUrls?: string[];
}

export interface WordValidationResult {
  isValid: boolean;
  word: string;
  definition?: string;
  partOfSpeech?: string;
  phonetic?: string;
}

const API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';

/**
 * Validates if a word exists in the dictionary
 * Returns minimal data to save tokens
 */
export async function validateWord(word: string): Promise<WordValidationResult> {
  if (!word || word.length === 0) {
    return { isValid: false, word };
  }

  try {
    const response = await fetch(`${API_BASE}/${encodeURIComponent(word.toLowerCase())}`);

    if (!response.ok) {
      return { isValid: false, word };
    }

    const data: DictionaryEntry[] = await response.json();

    if (data && data.length > 0) {
      const entry = data[0];
      const firstMeaning = entry.meanings?.[0];
      const firstDefinition = firstMeaning?.definitions?.[0];

      return {
        isValid: true,
        word: entry.word,
        definition: firstDefinition?.definition,
        partOfSpeech: firstMeaning?.partOfSpeech,
        phonetic: entry.phonetics?.find(p => p.text)?.text
      };
    }

    return { isValid: false, word };
  } catch {
    return { isValid: false, word };
  }
}

/**
 * Gets full dictionary entry for a word
 * Use sparingly to avoid excessive API calls
 */
export async function getWordDetails(word: string): Promise<DictionaryEntry | null> {
  if (!word || word.length === 0) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE}/${encodeURIComponent(word.toLowerCase())}`);

    if (!response.ok) {
      return null;
    }

    const data: DictionaryEntry[] = await response.json();
    return data?.[0] || null;
  } catch {
    return null;
  }
}

/**
 * Batch validate multiple words
 * Validates sequentially with small delay to be respectful to the API
 */
export async function validateWords(words: string[]): Promise<Map<string, boolean>> {
  const results = new Map<string, boolean>();

  for (const word of words) {
    const result = await validateWord(word);
    results.set(word.toLowerCase(), result.isValid);
    // Small delay between requests to be API-friendly
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * Check if a word is valid (simple boolean check)
 * Lightweight alternative to validateWord
 */
export async function isValidWord(word: string): Promise<boolean> {
  if (!word || word.length === 0) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/${encodeURIComponent(word.toLowerCase())}`);
    return response.ok;
  } catch {
    return false;
  }
}
