import type { AnswerRecord, Question } from "../types";
import { isCorrect } from "../lib/marking";
import { MathText } from "./MathText";

interface Props {
  q: Question;
  record: AnswerRecord | undefined;
  onAnswer: (r: AnswerRecord) => void;
  /** Show correctness + explanation (practice mode after answering, or exam review). */
  revealed: boolean;
  index: number;
  total: number;
}

const TYPE_LABEL: Record<Question["type"], string> = {
  MCQ: "Single correct",
  MSQ: "Multiple correct",
  NAT: "Numerical answer",
};

function correctAnswerText(q: Question): string {
  if (q.type === "MCQ") {
    const opts = q.options ?? [];
    const i = q.answerIndex ?? 0;
    return opts[i] ?? "(missing)";
  }
  if (q.type === "MSQ") {
    const opts = q.options ?? [];
    return (q.answerIndices ?? []).map((i) => opts[i] ?? "").join("  •  ");
  }
  return String(q.numericAnswer ?? "(missing)");
}

export function QuestionView({ q, record, onAnswer, revealed, index, total }: Props) {
  const selected = record?.selected ?? [];
  const verdict = revealed ? isCorrect(q, record) : null;

  const setMcq = (i: number) => onAnswer({ questionId: q.id, selected: [i], correct: null });

  const toggleMsq = (i: number) => {
    const next = selected.includes(i) ? selected.filter((x) => x !== i) : [...selected, i];
    next.sort((a, b) => a - b);
    onAnswer({ questionId: q.id, selected: next, correct: null });
  };

  const setNat = (raw: string) => {
    const numeric = raw.trim() === "" ? null : Number(raw);
    onAnswer({
      questionId: q.id,
      numeric: numeric != null && Number.isFinite(numeric) ? numeric : null,
      correct: null,
    });
  };

  return (
    <article className="qview">
      <header className="qview-head">
        <span className="qnum">
          Q{index + 1}/{total}
        </span>
        <span className={`badge type-${q.type}`}>{q.type}</span>
        <span className="badge">{TYPE_LABEL[q.type]}</span>
        <span className={`badge diff-${q.difficulty}`}>{q.difficulty}</span>
        <span className="badge week">Week {q.week}</span>
        <span className="q-topic">{q.topic}</span>
      </header>

      <p className="qprompt">
        <MathText text={q.prompt} />
      </p>

      {q.type !== "NAT" && (
        <ul className="options">
          {(q.options ?? []).map((opt, i) => {
            const isSel = selected.includes(i);
            const cls = ["option"];
            if (isSel) cls.push("sel");
            if (revealed && q.type === "MCQ" && i === q.answerIndex) cls.push("correct");
            if (revealed && q.type === "MSQ" && (q.answerIndices ?? []).includes(i))
              cls.push("correct");
            if (revealed && isSel && verdict === false) cls.push("wrong");
            return (
              <li key={i} className={cls.join(" ")}>
                <label>
                  <input
                    type={q.type === "MCQ" ? "radio" : "checkbox"}
                    name={`q-${q.id}`}
                    checked={isSel}
                    disabled={revealed}
                    onChange={() => (q.type === "MCQ" ? setMcq(i) : toggleMsq(i))}
                  />
                  <span className="opt-idx">{"ABCDEFGH"[i] ?? i}</span>
                  <span className="opt-text">
                    <MathText text={opt} />
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {q.type === "NAT" && (
        <div className="nat">
          <label>
            Your answer:{" "}
            <input
              type="number"
              step="any"
              value={record?.numeric ?? ""}
              disabled={revealed}
              onChange={(e) => setNat(e.target.value)}
            />
          </label>
          {revealed && (
            <span className="nat-expected">
              Expected: <strong>{q.numericAnswer}</strong>
              {q.numericTolerance ? ` (±${q.numericTolerance})` : ""}
            </span>
          )}
        </div>
      )}

      {revealed && (
        <div className={`feedback ${verdict === true ? "ok" : verdict === false ? "bad" : "skip"}`}>
          <div className="verdict">
            {verdict === true ? "✓ Correct" : verdict === false ? "✗ Incorrect" : "— Unattempted"}
            {verdict !== true && (
              <span className="correct-line">
                {" "}
                Correct answer: <MathText text={correctAnswerText(q)} />
              </span>
            )}
          </div>
          <p className="explanation">
            <MathText text={q.explanation} />
          </p>
          <div className="source">Source: {q.source}</div>
        </div>
      )}
    </article>
  );
}
