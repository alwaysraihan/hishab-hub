/**
 * Client-side tool search that matches Bangla and English keywords.
 * Pure function; works with any list shaped like the tool registry.
 */
import { toEnglishDigits } from "./digits";

export interface Searchable {
  title: string;
  shortTitle: string;
  description: string;
  keywords: readonly string[];
  slug: string;
}

/** Lower-cases, converts Bangla digits, collapses whitespace and strips punctuation. */
export function normaliseQuery(text: string): string {
  return toEnglishDigits(text)
    .toLowerCase()
    .replace(/[/()\-_,.।?!]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Returns items whose title/keywords/description contain every word of the query,
 * ranked so that title and keyword matches come first. Empty query returns [].
 */
export function searchTools<T extends Searchable>(items: readonly T[], query: string): T[] {
  const q = normaliseQuery(query);
  if (!q) return [];
  const words = q.split(" ");

  const scored = items
    .map((item) => {
      const title = normaliseQuery(`${item.title} ${item.shortTitle}`);
      const keywords = item.keywords.map(normaliseQuery);
      const keywordText = keywords.join(" ");
      const desc = normaliseQuery(item.description);
      const slug = item.slug.replace(/-/g, " ");
      const haystack = `${title} ${keywordText} ${desc} ${slug}`;

      if (!words.every((w) => haystack.includes(w))) return null;

      let score = 0;
      for (const w of words) {
        if (title.includes(w)) score += 5;
        if (keywords.some((k) => k === w)) score += 4;
        else if (keywords.some((k) => k.startsWith(w))) score += 3;
        else if (keywordText.includes(w)) score += 2;
        if (desc.includes(w)) score += 1;
      }
      return { item, score };
    })
    .filter((x): x is { item: T; score: number } => x !== null);

  return scored.sort((a, b) => b.score - a.score).map((x) => x.item);
}
