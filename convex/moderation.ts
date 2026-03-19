/**
 * Content moderation for user-submitted text (theme names, summaries, agent names).
 * Blocks explicit, sexual, profane, racist, and hateful content.
 *
 * Uses a blocklist approach with word-boundary matching to avoid false positives
 * on legitimate words that contain blocked substrings.
 */

// Blocked terms — kept as patterns to catch common evasion (l33t speak, spacing tricks)
// This list covers slurs, profanity, explicit/sexual terms, and hate speech.
// Each entry is matched as a whole word (word-boundary aware) and case-insensitive.
const BLOCKED_TERMS = [
  // Profanity
  "fuck", "f\\*ck", "fuk", "fuq", "fck",
  "shit", "sh\\*t", "sh1t",
  "ass", "a\\*\\*", "azz",
  "asshole", "assh0le",
  "bitch", "b\\*tch", "b1tch",
  "damn", "dammit",
  "bastard",
  "crap",
  "dick", "d\\*ck", "d1ck",
  "cock", "c0ck",
  "pussy", "pu\\*\\*y",
  "cunt", "c\\*nt",
  "piss",
  "whore", "wh0re",
  "slut", "sl\\*t",
  "douche",
  "twat",
  "bollocks",
  "wanker",
  "prick",

  // Sexual / explicit
  "porn", "p0rn",
  "hentai",
  "xxx",
  "nsfw",
  "nude", "nudes",
  "naked",
  "sex",
  "orgasm",
  "blowjob",
  "handjob",
  "dildo",
  "fetish",
  "erotic",
  "milf",
  "boobs", "boob",
  "titties", "tits", "tit",
  "penis",
  "vagina",
  "anal",
  "cum",
  "jizz",
  "fap",
  "masturbat",
  "boner",

  // Racial slurs and hate speech
  "nigger", "n\\*gger", "nigg\\*r", "n1gger", "nigga", "nigg\\*",
  "chink",
  "spic", "sp\\*c",
  "kike", "k\\*ke",
  "wetback",
  "beaner",
  "gook",
  "jap",
  "cracker",
  "honky",
  "gringo",
  "raghead",
  "towelhead",
  "camel jockey",
  "paki",
  "coon",
  "darkie",
  "redskin",
  "injun",
  "squaw",
  "chinaman",

  // Homophobic / transphobic
  "faggot", "f\\*ggot", "fag",
  "dyke",
  "tranny", "tr\\*nny",
  "shemale",
  "homo",

  // Violence / hate
  "nazi",
  "hitler",
  "kkk",
  "white power",
  "white supremac",
  "heil",
  "genocide",
  "lynch",
  "kill yourself",
  "kys",
  "suicide",
  "school shoot",
  "bomb threat",
  "terrorist",
  "jihad",

  // Misc offensive
  "retard", "r\\*tard", "retrd",
  "mongoloid",
  "spaz",
  "lame",
];

// Build a single regex for efficient matching
// Word boundaries (\b) prevent matching inside legitimate words
const BLOCKED_REGEX = new RegExp(
  "\\b(" + BLOCKED_TERMS.join("|") + ")\\b",
  "i"
);

// Also check for patterns that try to evade filters with separators
// e.g. "f.u.c.k", "f u c k", "f-u-c-k"
function normalizeText(text: string): string {
  return text
    .replace(/[.\-_*!@#$%^&(){}[\]|\\/<>~`+=,;:'"]/g, "") // strip punctuation
    .replace(/\s+/g, " ") // collapse whitespace
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/8/g, "b")
    .replace(/\$/g, "s")
    .replace(/@/g, "a");
}

/**
 * Check if text contains blocked content.
 * Returns { clean: true } or { clean: false, reason: string }.
 */
export function moderateText(text: string): { clean: boolean; reason?: string } {
  // Check original text
  if (BLOCKED_REGEX.test(text)) {
    return { clean: false, reason: "Content contains inappropriate language" };
  }

  // Check normalized text (catches l33t speak, punctuation evasion)
  const normalized = normalizeText(text);
  if (BLOCKED_REGEX.test(normalized)) {
    return { clean: false, reason: "Content contains inappropriate language" };
  }

  return { clean: true };
}
