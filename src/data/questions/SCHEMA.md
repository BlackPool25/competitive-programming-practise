# Question Bank Schema (FROZEN — do not change)

One file per week: `src/data/questions/week01.json` … `week10.json`.

```jsonc
{
  "week": 1,
  "title": "Simulation, Invariants, Search & Number Theory", // must match topic heading of WeekNN.md
  "questions": [
    // MCQ — exactly one correct option
    {
      "id": "w01-q001",
      "week": 1,
      "topic": "Reversort / Simulation",
      "type": "MCQ",
      "difficulty": "easy",
      "prompt": "Question text. May contain LaTeX between $...$ or $$...$$.",
      "options": ["option A", "option B", "option C", "option D"],
      "answerIndex": 2,
      "explanation": "Why the answer is correct and why distractors are wrong.",
      "source": "Week01.md §2; Lec02"
    },
    // MSQ — one OR MORE correct options
    {
      "id": "w01-q002",
      "week": 1,
      "topic": "Invariants",
      "type": "MSQ",
      "difficulty": "medium",
      "prompt": "Which of the following statements are TRUE?",
      "options": ["A", "B", "C", "D"],
      "answerIndices": [1, 3],
      "explanation": "Per-option justification.",
      "source": "Week01.md §4"
    },
    // NAT — numerical answer typed into a box
    {
      "id": "w01-q003",
      "week": 1,
      "topic": "GCD / Number Theory",
      "type": "NAT",
      "difficulty": "hard",
      "prompt": "Compute the value of X. Enter an integer.",
      "numericAnswer": 17,
      "numericTolerance": 0,
      "explanation": "Hand computation shown step by step.",
      "source": "Week01.md §6"
    }
  ]
}
```

## Hard rules
- `type` ∈ {`MCQ`,`MSQ`,`NAT`}; `difficulty` ∈ {`easy`,`medium`,`hard`}.
- MCQ: `options` (2–6) + integer `answerIndex` **only**. No `answerIndices`/`numericAnswer`.
- MSQ: `options` (3–6) + `answerIndices` non-empty, unique, in range **only**.
- NAT: `numericAnswer` (number) **only**; must NOT include `options`. Use `numericTolerance` (default 0) only if the answer is a rounded real.
- `id` unique within the file, format `wNN-qNNN`.
- `explanation` and `source` always required and non-trivial.
- LaTeX allowed in `prompt`, `options`, `explanation`.
- No code blocks with runnable programs as options; keep it to text/LaTeX/pseudo-code short snippets.

## Target mix per week
- 20–30 questions total.
- ≈ 55% MCQ, ≈ 25% MSQ, ≈ 20% NAT.
- Difficulty ≈ 40% easy, 40% medium, 20% hard, mirroring a real NPTEL proctored paper (conceptual + hand-tracing, no IDE).

Validate with: `node scripts/validate-bank.mjs`
