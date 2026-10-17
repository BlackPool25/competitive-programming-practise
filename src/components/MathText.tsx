import katex from "katex";
import { useMemo } from "react";

interface Part {
  math: boolean;
  text: string;
}

/** Split on `$...$` segments; everything else is literal text. */
function splitMath(text: string): Part[] {
  const parts: Part[] = [];
  const re = /\$([^$]+)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ math: false, text: text.slice(last, m.index) });
    parts.push({ math: true, text: m[1] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ math: false, text: text.slice(last) });
  return parts;
}

function renderMath(tex: string): string {
  try {
    return katex.renderToString(tex, { throwOnError: false, output: "html" });
  } catch {
    return tex;
  }
}

/** Renders text with inline `$KaTeX$` math segments. */
export function MathText({ text }: { text: string }) {
  const parts = useMemo(() => splitMath(text), [text]);
  return (
    <>
      {parts.map((p, i) =>
        p.math ? (
          // eslint-disable-next-line react/no-danger
          <span key={i} dangerouslySetInnerHTML={{ __html: renderMath(p.text) }} />
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}
