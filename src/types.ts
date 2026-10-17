export type QuestionType = "MCQ" | "MSQ" | "NAT";
export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  week: number;
  topic: string;
  type: QuestionType;
  difficulty: Difficulty;
  prompt: string;
  /** Required for MCQ and MSQ. Omitted for NAT. */
  options?: string[];
  /** MCQ only: index of the single correct option. */
  answerIndex?: number | null;
  /** MSQ only: indexes of all correct options (>=1). */
  answerIndices?: number[] | null;
  /** NAT only: the correct numeric value. */
  numericAnswer?: number | null;
  /** NAT only: accepted absolute tolerance (default 0). */
  numericTolerance?: number | null;
  explanation: string;
  source: string;
}

export interface WeekBank {
  week: number;
  title: string;
  questions: Question[];
}

export interface AnswerRecord {
  questionId: string;
  /** Selected option index(es) for MCQ/MSQ. */
  selected?: number[] | null;
  /** Entered value for NAT. */
  numeric?: number | null;
  /** null = unattempted. */
  correct: boolean | null;
}
