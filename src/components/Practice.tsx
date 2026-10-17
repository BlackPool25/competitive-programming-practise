import { useMemo, useState } from "react";
import type { AnswerRecord } from "../types";
import { questionsForWeeks, shuffled, WEEKS } from "../data/questions";
import { scoreAttempt } from "../lib/marking";
import { QuestionView } from "./QuestionView";

export function Practice({ onExit }: { onExit: () => void }) {
  const [weeks, setWeeks] = useState<number[]>(WEEKS.map((w) => w.week));
  const [doShuffle, setDoShuffle] = useState(true);
  const [seed, setSeed] = useState(0);
  const [i, setI] = useState(0);
  const [records, setRecords] = useState<Record<string, AnswerRecord>>({});
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const questions = useMemo(() => {
    const qs = questionsForWeeks(weeks);
    return doShuffle ? shuffled(qs) : qs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeks, doShuffle, seed]);

  const q = questions[i];
  const summary = useMemo(() => {
    const answeredQs = questions.filter((x) => checked.has(x.id));
    return scoreAttempt(answeredQs, records);
  }, [questions, checked, records]);

  const toggleWeek = (w: number) => {
    setWeeks((prev) => (prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w].sort((a, b) => a - b)));
    setI(0);
    setChecked(new Set());
  };

  const restart = () => {
    setSeed((s) => s + 1);
    setI(0);
    setRecords({});
    setChecked(new Set());
  };

  const onAnswer = (r: AnswerRecord) => {
    setRecords((prev) => ({ ...prev, [r.questionId]: r }));
  };

  const check = () => {
    if (!q) return;
    setChecked((prev) => new Set(prev).add(q.id));
  };

  return (
    <div className="mode">
      <div className="toolbar">
        <button className="ghost" onClick={onExit}>
          ← Home
        </button>
        <h2>Practice mode</h2>
        <span className="spacer" />
        <label className="inline">
          <input type="checkbox" checked={doShuffle} onChange={(e) => setDoShuffle(e.target.checked)} /> shuffle
        </label>
        <button className="ghost" onClick={restart}>
          restart
        </button>
      </div>

      <div className="weekpicker">
        {WEEKS.map((w) => (
          <button
            key={w.week}
            className={`chip ${weeks.includes(w.week) ? "on" : ""}`}
            onClick={() => toggleWeek(w.week)}
            title={w.title}
          >
            W{w.week}
          </button>
        ))}
        <button className="chip link" onClick={() => setWeeks(WEEKS.map((w) => w.week))}>
          all
        </button>
        <button className="chip link" onClick={() => setWeeks([])}>
          none
        </button>
      </div>

      {!q ? (
        <p className="empty">Select at least one week above.</p>
      ) : (
        <>
          <div className="progress">
            <div className="bar">
              <div style={{ width: `${((i + 1) / questions.length) * 100}%` }} />
            </div>
            <span>
              {i + 1} / {questions.length}
            </span>
          </div>

          <QuestionView
            q={q}
            record={records[q.id]}
            onAnswer={onAnswer}
            revealed={checked.has(q.id)}
            index={i}
            total={questions.length}
          />

          <div className="nav">
            <button disabled={i === 0} onClick={() => setI((v) => Math.max(0, v - 1))}>
              ← Prev
            </button>
            {!checked.has(q.id) ? (
              <button className="primary" onClick={check}>
                Check answer
              </button>
            ) : (
              <button className="primary" disabled={i >= questions.length - 1} onClick={() => setI((v) => v + 1)}>
                Next →
              </button>
            )}
          </div>

          <div className="scorebar">
            checked {checked.size} · correct {summary.correct} · wrong {summary.wrong}
          </div>
        </>
      )}
    </div>
  );
}
