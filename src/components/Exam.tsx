import { useEffect, useMemo, useState } from "react";
import type { AnswerRecord, Question } from "../types";
import { questionsForWeeks, shuffled, WEEKS } from "../data/questions";
import { scoreAttempt } from "../lib/marking";
import { QuestionView } from "./QuestionView";

type Phase = "setup" | "running" | "done";

function fmt(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function Exam({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [weeks, setWeeks] = useState<number[]>(WEEKS.map((w) => w.week));
  const [count, setCount] = useState(20);
  const [minutes, setMinutes] = useState(30);
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [i, setI] = useState(0);
  const [records, setRecords] = useState<Record<string, AnswerRecord>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);

  const pool = useMemo(() => questionsForWeeks(weeks), [weeks]);
  const summary = useMemo(
    () => scoreAttempt(questions, records, negativeMarking),
    [questions, records, negativeMarking],
  );

  useEffect(() => {
    if (phase !== "running") return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  const phaseNow: Phase = phase === "running" && secondsLeft === 0 ? "done" : phase;

  const toggleWeek = (w: number) =>
    setWeeks((prev) => (prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w].sort((a, b) => a - b)));

  const start = () => {
    const n = Math.max(1, Math.min(count, pool.length));
    setQuestions(shuffled(pool).slice(0, n));
    setRecords({});
    setI(0);
    setSecondsLeft(minutes * 60);
    setPhase("running");
  };

  const onAnswer = (r: AnswerRecord) => setRecords((prev) => ({ ...prev, [r.questionId]: r }));

  if (phaseNow === "setup") {
    return (
      <div className="mode">
        <div className="toolbar">
          <button className="ghost" onClick={onExit}>
            ← Home
          </button>
          <h2>Exam simulation</h2>
        </div>

        <div className="setup">
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
          </div>

          <label className="field">
            Questions: <strong>{Math.min(count, pool.length)}</strong> of {pool.length} available
            <input
              type="range"
              min={5}
              max={Math.max(5, pool.length)}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </label>

          <label className="field">
            Time limit: <strong>{minutes} min</strong>
            <input
              type="range"
              min={5}
              max={180}
              step={5}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
            />
          </label>

          <label className="field">
            <span>
              <input
                type="checkbox"
                checked={negativeMarking}
                onChange={(e) => setNegativeMarking(e.target.checked)}
              />{" "}
              Negative marking (+2 correct, −1 wrong)
            </span>
          </label>

          <p className="note">
            Most NPTEL exams have no negative marking; some courses use +2/−1. This course publishes no per-question
            marks, so it defaults to none. MSQ is all-or-nothing.
          </p>

          <button className="primary big" disabled={pool.length === 0} onClick={start}>
            Start exam
          </button>
        </div>
      </div>
    );
  }

  if (phaseNow === "running") {
    const q = questions[i];
    const answeredCount = questions.filter((x) => {
      const r = records[x.id];
      return r && ((r.selected?.length ?? 0) > 0 || r.numeric != null);
    }).length;
    const danger = secondsLeft <= 60;
    return (
      <div className="mode">
        <div className="toolbar">
          <h2>Exam</h2>
          <span className="spacer" />
          <span className="answered">
            answered {answeredCount}/{questions.length}
          </span>
          <span className={`timer ${danger ? "danger" : ""}`}>{fmt(secondsLeft)}</span>
        </div>

        <div className="palette">
          {questions.map((x, idx) => {
            const r = records[x.id];
            const done = r && ((r.selected?.length ?? 0) > 0 || r.numeric != null);
            return (
              <button
                key={x.id}
                className={`pdot ${idx === i ? "cur" : ""} ${done ? "done" : ""}`}
                onClick={() => setI(idx)}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <QuestionView q={q} record={records[q.id]} onAnswer={onAnswer} revealed={false} index={i} total={questions.length} />

        <div className="nav">
          <button disabled={i === 0} onClick={() => setI((v) => v - 1)}>
            ← Prev
          </button>
          <button className="danger-btn" onClick={() => setPhase("done")}>
            Submit exam
          </button>
          <button disabled={i >= questions.length - 1} onClick={() => setI((v) => v + 1)}>
            Next →
          </button>
        </div>
      </div>
    );
  }

  // done / review
  return (
    <div className="mode">
      <div className="toolbar">
        <button className="ghost" onClick={onExit}>
          ← Home
        </button>
        <h2>Result</h2>
      </div>

      <div className="results">
        <div className="big-score">
          {summary.total ? Math.round((summary.correct / summary.total) * 100) : 0}
          <span>%</span>
        </div>
        <div className="breakdown">
          <span>✓ {summary.correct} correct</span>
          <span>✗ {summary.wrong} wrong</span>
          <span>– {summary.unattempted} unattempted</span>
          <span>of {summary.total}</span>
        </div>
        <p className="note">
          {summary.negativeMarking
            ? `Marking +2/−1: ${summary.points} / ${summary.maxPoints} points.`
            : `No negative marking: ${summary.correct} / ${summary.total} correct.`}
        </p>
        <button className="primary" onClick={() => setPhase("setup")}>
          New exam
        </button>
      </div>

      <h3 className="review-title">Review</h3>
      {questions.map((q, idx) => (
        <QuestionView key={q.id} q={q} record={records[q.id]} onAnswer={onAnswer} revealed index={idx} total={questions.length} />
      ))}
    </div>
  );
}
