// Week revision notes, bundled at build time from ./weeks/*.md via Vite's `?raw`.
// Source of truth is ../../weeks — re-copy here when the week notes change.
import Week01 from "./weeks/Week01.md?raw";
import Week02 from "./weeks/Week02.md?raw";
import Week03 from "./weeks/Week03.md?raw";
import Week04 from "./weeks/Week04.md?raw";
import Week05 from "./weeks/Week05.md?raw";
import Week06 from "./weeks/Week06.md?raw";
import Week07 from "./weeks/Week07.md?raw";
import Week08 from "./weeks/Week08.md?raw";
import Week09 from "./weeks/Week09.md?raw";
import Week10 from "./weeks/Week10.md?raw";

export interface Note {
  week: number;
  title: string;
  body: string;
}

const RAW: ReadonlyArray<readonly [number, string]> = [
  [1, Week01],
  [2, Week02],
  [3, Week03],
  [4, Week04],
  [5, Week05],
  [6, Week06],
  [7, Week07],
  [8, Week08],
  [9, Week09],
  [10, Week10],
];

/** Drop the leading `# Week NN — Title` heading, mermaid diagrams (not
 *  renderable here) and normalise GitHub `[!NOTE]`-style alerts to bold. */
function clean(raw: string): { title: string; body: string } {
  let s = raw;
  const h1 = s.match(/^#\s+(.+)\r?\n/);
  const title = h1 ? h1[1].replace(/^Week\s*\d+\s*[—-]\s*/, "").trim() : "";
  if (h1) s = s.slice(h1[0].length);

  s = s.replace(/```mermaid[\s\S]*?```\s*/g, "");
  s = s.replace(/^>\s*\[!(NOTE|IMPORTANT|TIP|WARNING|CAUTION)\]\s*$/gm, "> **$1**");
  return { title, body: s.trim() };
}

export const NOTES: Note[] = RAW.map(([week, raw]) => {
  const { title, body } = clean(raw);
  return { week, title, body };
});
