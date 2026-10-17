import type { AnswerRecord, Question } from "../types";

export const POINTS_CORRECT = 2;
export const POINTS_WRONG = -1;

/** Whether the given response is correct. `null` means unattempted. */
export function isCorrect(q: Question, ans: AnswerRecord | undefined): boolean | null {
  if (!ans) return null;
  if (q.type === "MCQ") {
    const sel = ans.selected;
    if (sel == null || sel.length === 0) return null;
    return sel[0] === q.answerIndex;
  }
  if (q.type === "MSQ") {
    const sel = ans.selected;
    if (sel == null || sel.length === 0) return null;
    const want = new Set(q.answerIndices ?? []);
    if (want.size !== sel.length) return false;
    return sel.every((i) => want.has(i));
  }
  if (ans.numeric == null || Number.isNaN(ans.numeric)) return null;
  const target = q.numericAnswer;
  if (target == null) return null;
  const tol = q.numericTolerance ?? 0;
  return Math.abs(ans.numeric - target) <= tol;
}

export interface ScoreSummary {
  total: number;
  correct: number;
  wrong: number;
  unattempted: number;
  points: number;
  maxPoints: number;
  negativeMarking: boolean;
}

/**
 * NPTEL per-question marking is course-dependent: most courses have no negative
 * marking, but some publish "+2 correct, −1 wrong". Default is no penalty.
 */
export function scoreAttempt(
  questions: Question[],
  records: Record<string, AnswerRecord>,
  negativeMarking = false,
): ScoreSummary {
  let correct = 0;
  let wrong = 0;
  let unattempted = 0;
  for (const q of questions) {
    const c = isCorrect(q, records[q.id]);
    if (c === null) unattempted++;
    else if (c) correct++;
    else wrong++;
  }
  return {
    total: questions.length,
    correct,
    wrong,
    unattempted,
    points: correct * POINTS_CORRECT + (negativeMarking ? wrong * POINTS_WRONG : 0),
    maxPoints: questions.length * POINTS_CORRECT,
    negativeMarking,
  };
}
