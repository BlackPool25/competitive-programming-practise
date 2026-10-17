import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { NOTES } from "../data/notes";

export function Notes({ onExit }: { onExit: () => void }) {
  const [week, setWeek] = useState(1);
  const [hideCode, setHideCode] = useState(false);
  const note = useMemo(() => NOTES.find((n) => n.week === week) ?? NOTES[0], [week]);

  return (
    <div className="notes mode">
      <div className="toolbar">
        <h2>Revision notes</h2>
        <span className="spacer" />
        <label className="inline">
          <input
            type="checkbox"
            checked={hideCode}
            onChange={(e) => setHideCode(e.target.checked)}
          />
          Hide code
        </label>
        <button className="ghost" onClick={onExit}>
          Home
        </button>
      </div>

      <div className="weekpicker">
        {NOTES.map((n) => (
          <button
            key={n.week}
            className={"chip" + (n.week === week ? " on" : "")}
            onClick={() => setWeek(n.week)}
          >
            W{n.week}
          </button>
        ))}
      </div>

      <header className="note-head">
        <span className="note-week">Week {note.week}</span>
        <h1 className="note-title">{note.title}</h1>
      </header>

      <article className={"notes-body" + (hideCode ? " hide-code" : "")}>
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
          {note.body}
        </ReactMarkdown>
      </article>

      <div className="nav">
        <button disabled={week === 1} onClick={() => setWeek((w) => Math.max(1, w - 1))}>
          ← Week {Math.max(1, week - 1)}
        </button>
        <button
          disabled={week === NOTES.length}
          onClick={() => setWeek((w) => Math.min(NOTES.length, w + 1))}
        >
          Week {Math.min(NOTES.length, week + 1)} →
        </button>
      </div>
    </div>
  );
}
