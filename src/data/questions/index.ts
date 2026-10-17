import type { Question, WeekBank } from "../../types";
import week01 from "./week01.json";
import week02 from "./week02.json";
import week03 from "./week03.json";
import week04 from "./week04.json";
import week05 from "./week05.json";
import week06 from "./week06.json";
import week07 from "./week07.json";
import week08 from "./week08.json";
import week09 from "./week09.json";
import week10 from "./week10.json";

/** All ten week banks, ordered by week. JSON shape is validated by scripts/validate-bank.mjs. */
export const WEEKS = [
  week01,
  week02,
  week03,
  week04,
  week05,
  week06,
  week07,
  week08,
  week09,
  week10,
] as unknown as WeekBank[];

export const ALL_QUESTIONS: Question[] = WEEKS.flatMap((w) => w.questions);

export function bankForWeek(week: number): WeekBank | undefined {
  return WEEKS.find((w) => w.week === week);
}

export function questionsForWeeks(weeks: number[]): Question[] {
  const set = new Set(weeks);
  return ALL_QUESTIONS.filter((q) => set.has(q.week));
}

/** Fisher–Yates shuffle; returns a new array. */
export function shuffled<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
