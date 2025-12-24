// Lightweight text analysis utilities for the Word Counter tool
export const DEFAULT_READING_WPM = 200;
export const DEFAULT_SPEAKING_WPM = 150;

const STOPWORDS = new Set([
  'the','a','an','and','or','but','if','in','on','with','is','are','was','were','be','to','of','for','that','this','it','as','at','by','from','you','i','we','they','he','she','them','his','her','my','mine','our','ours'
]);

function tokenizeWords(text) {
  // capture words with letters/digits and apostrophes
  // uses Unicode property escapes to support multiple languages
  const matches = text.match(/[\p{L}\p{N}']+/gu);
  return matches ? matches.map(w => w) : [];
}

function countSentences(text) {
  // A simple sentence splitter by punctuation (.!?)+ optionally followed by quotes or )
  const matches = text.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (!matches) {
    // fallback: if text non-empty but no punctuation, consider 1 sentence
    return text.trim() ? 1 : 0;
  }
  return matches.length;
}

function countParagraphs(text) {
  const paras = text.split(/\n{2,}/g).filter(p => p.trim().length > 0);
  return paras.length;
}

function estimateSyllables(word) {
  // heuristic syllable counter (English oriented)
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  // remove silent e
  word = word.replace(/(?:e$)/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

export function analyzeText(text) {
  const characters = text.length;
  const wordsArray = tokenizeWords(text);
  const words = wordsArray.length;
  const sentences = countSentences(text);
  const paragraphs = countParagraphs(text);
  const readingTimeMin = words / DEFAULT_READING_WPM;
  const speakingTimeMin = words / DEFAULT_SPEAKING_WPM;

  // word frequencies for keywords
  const freqs = new Map();
  for (const raw of wordsArray) {
    const w = raw.toLowerCase();
    freqs.set(w, (freqs.get(w) || 0) + 1);
  }

  // build keyword list excluding stopwords and numbers-only tokens
  const keywords = [];
  for (const [word, count] of freqs.entries()) {
    const isNumber = /^\d+$/.test(word);
    if (STOPWORDS.has(word) || isNumber) continue;
    keywords.push({ word, count, density: (count / Math.max(1, words)) * 100 });
  }
  keywords.sort((a,b) => b.count - a.count || a.word.localeCompare(b.word));

  const topKeywords = keywords.slice(0, 12);

  // reading level - Flesch–Kincaid grade level approximation
  let totalSyllables = 0;
  for (const w of wordsArray) totalSyllables += estimateSyllables(w);
  const AS = words || 0;
  const ASL = sentences ? (words / sentences) : 0; // average sentence length
  const ASW = words ? (totalSyllables / words) : 0; // average syllables per word
  // Flesch-Kincaid grade level
  const fleschKincaid = (0.39 * ASL) + (11.8 * ASW) - 15.59;

  // flow score (0-100) - simple heuristic: lower unique/words and moderate sentence length
  const uniqueWords = freqs.size;
  const diversity = words ? (uniqueWords / words) : 0;
  // ideal diversity ~0.5? we invert to produce score
  const diversityScore = Math.max(0, Math.min(1, 1 - Math.abs(0.5 - diversity) * 2));
  const sentenceScore = sentences ? Math.max(0, Math.min(1, 1 - Math.abs(ASL - 15) / 15)) : 0;
  const flowScore = Math.round((diversityScore * 0.5 + sentenceScore * 0.5) * 100);

  return {
    text,
    characters,
    words,
    sentences,
    paragraphs,
    readingTimeMin,
    speakingTimeMin,
    topKeywords,
    keywordsCount: keywords.length,
    readingLevelGrade: Number.isFinite(fleschKincaid) ? Math.max(0, Math.round(fleschKincaid * 10) / 10) : null,
    flowScore
  };
}
