#!/usr/bin/env node
// Validates every src/data/questions/week*.json against the frozen schema.
// Usage: node scripts/validate-bank.mjs
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "src", "data", "questions");

const TYPES = new Set(["MCQ", "MSQ", "NAT"]);
const DIFFS = new Set(["easy", "medium", "hard"]);
let errors = 0;
let total = 0;
const byType = { MCQ: 0, MSQ: 0, NAT: 0 };
const byWeek = [];

const err = (id, msg) => {
  errors++;
  console.error(`  ✗ [${id}] ${msg}`);
};

const files = readdirSync(dir).filter((f) => /^week\d+\.json$/.test(f)).sort();
if (files.length === 0) {
  console.error("No week*.json files found in", dir);
  process.exit(1);
}

for (const f of files) {
  let bank;
  try {
    bank = JSON.parse(readFileSync(join(dir, f), "utf8"));
  } catch (e) {
    console.error(`✗ ${f}: invalid JSON — ${e.message}`);
    errors++;
    continue;
  }
  const wk = bank.week;
  if (typeof wk !== "number") err(f, "missing numeric `week`");
  if (typeof bank.title !== "string" || !bank.title) err(f, "missing string `title`");
  if (!Array.isArray(bank.questions) || bank.questions.length === 0) {
    err(f, "`questions` must be a non-empty array");
    continue;
  }
  const seen = new Set();
  let n = 0;
  for (const q of bank.questions) {
    n++;
    total++;
    const id = `${f}#${q.id ?? n}`;
    if (!q.id) err(id, "missing id");
    else if (seen.has(q.id)) err(id, "duplicate id");
    else seen.add(q.id);
    if (q.week !== wk) err(id, `week mismatch (${q.week} != ${wk})`);
    if (!TYPES.has(q.type)) err(id, `bad type "${q.type}"`);
    else byType[q.type]++;
    if (!DIFFS.has(q.difficulty)) err(id, `bad difficulty "${q.difficulty}"`);
    if (typeof q.topic !== "string" || !q.topic) err(id, "missing topic");
    if (typeof q.prompt !== "string" || q.prompt.trim().length < 5) err(id, "prompt too short");
    if (typeof q.explanation !== "string" || q.explanation.trim().length < 5)
      err(id, "missing explanation");
    if (typeof q.source !== "string" || !q.source) err(id, "missing source");

    if (q.type === "MCQ") {
      if (!Array.isArray(q.options) || q.options.length < 2) err(id, "MCQ needs >=2 options");
      else if (!Number.isInteger(q.answerIndex) || q.answerIndex < 0 || q.answerIndex >= q.options.length)
        err(id, `MCQ answerIndex out of range: ${q.answerIndex}`);
    } else if (q.type === "MSQ") {
      if (!Array.isArray(q.options) || q.options.length < 3) err(id, "MSQ needs >=3 options");
      else if (!Array.isArray(q.answerIndices) || q.answerIndices.length < 1)
        err(id, "MSQ needs answerIndices");
      else {
        const bad = q.answerIndices.filter(
          (i) => !Number.isInteger(i) || i < 0 || i >= q.options.length,
        );
        if (bad.length) err(id, `MSQ answerIndices out of range: ${bad}`);
        if (new Set(q.answerIndices).size !== q.answerIndices.length)
          err(id, "MSQ answerIndices has duplicates");
      }
    } else if (q.type === "NAT") {
      if (typeof q.numericAnswer !== "number") err(id, "NAT needs numericAnswer");
      if (q.options && q.options.length) err(id, "NAT must not have options");
    }
  }
  byWeek.push(`  week ${String(wk).padStart(2, "0")}: ${String(n).padStart(3, "0")} questions  (${f})`);
}

console.log("Question bank summary:");
console.log(byWeek.join("\n"));
console.log(
  `  type mix: MCQ=${byType.MCQ} MSQ=${byType.MSQ} NAT=${byType.NAT} | total=${total} across ${files.length} weeks`,
);
if (errors) {
  console.error(`\n✗ ${errors} schema error(s).`);
  process.exit(1);
}
console.log("\n✓ all banks valid.");
