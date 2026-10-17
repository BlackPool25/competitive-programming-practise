import { ALL_QUESTIONS, WEEKS } from "../data/questions";
import { SYLLABUS } from "../data/syllabus";

export type Mode = "practice" | "exam" | "notes";

export function Home({ onPick }: { onPick: (m: Mode) => void }) {
  const mix = ALL_QUESTIONS.reduce(
    (acc, q) => ((acc[q.type] = (acc[q.type] ?? 0) + 1), acc),
    {} as Record<string, number>,
  );

  return (
    <div className="home">
      <header className="hero-head">
        <h1>NPTEL Competitive Programming — Exam Trainer</h1>
        <p className="sub">
          Getting Started with Competitive Programming · {ALL_QUESTIONS.length} questions across {WEEKS.length} weeks
          · MCQ / MSQ / NAT in the real CBT format.
        </p>
        <div className="mixline">
          <span className="badge type-MCQ">MCQ {mix.MCQ ?? 0}</span>
          <span className="badge type-MSQ">MSQ {mix.MSQ ?? 0}</span>
          <span className="badge type-NAT">NAT {mix.NAT ?? 0}</span>
        </div>
      </header>

      <div className="actions">
        <button className="primary big" onClick={() => onPick("practice")}>
          Practice by week
          <small>instant feedback + explanations</small>
        </button>
        <button className="primary big alt" onClick={() => onPick("exam")}>
          Exam simulation
          <small>timer · negative-marking toggle · full review</small>
        </button>
        <button className="primary big alt" onClick={() => onPick("notes")}>
          Revision notes
          <small>all 10 weeks · formulas, bounds & derivations</small>
        </button>
      </div>

      <h2 className="syl-title">Syllabus</h2>
      <ol className="syllabus">
        {SYLLABUS.map((s) => (
          <li key={s.week}>
            <span className="weekno">W{s.week}</span>
            <div>
              <div className="week-title">{s.title}</div>
              <div className="week-topics">{s.topics.join(" · ")}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
