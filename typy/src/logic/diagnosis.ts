import { makeCode } from '../data/catalog';
import type { Answer, Axis, AxisScores, BaseCode, DiagnosisResult, Question } from '../data/model';

/**
 * 適応型診断エンジン（純粋関数）。
 *
 * - 6軸それぞれに最低 MIN_PER_AXIS 問を出題
 * - 回答が拮抗している（傾向が弱い）軸を優先して追加出題
 * - 全軸の傾向が定まり、かつ MIN_TOTAL 問に達したら終了（最大 MAX_TOTAL 問）
 * → 平均20〜30問で、迷いの少ない人ほど早く終わる。
 *
 * 本番ロジック（IRTなど）に差し替える場合は、このモジュールと同じ
 * `nextQuestion` / `estimateTotal` / `computeResult` のシグネチャを実装すればOK。
 */

export const AXES: Axis[] = ['EI', 'SN', 'TF', 'JP', 'AT', 'CS'];
export const MIN_PER_AXIS = 3;
export const MAX_PER_AXIS = 6;
export const MIN_TOTAL = 20;
export const MAX_TOTAL = 30;
/** この強さ以上の傾向が出たら、その軸は「確定」とみなす（-1〜1） */
const SETTLE_THRESHOLD = 0.4;

interface AxisStat {
  count: number;
  /** -1〜1 に正規化した平均 */
  mean: number;
}

export function axisStats(answers: Answer[]): Record<Axis, AxisStat> {
  const out = Object.fromEntries(AXES.map((a) => [a, { count: 0, mean: 0 }])) as Record<Axis, AxisStat>;
  const sums: Record<string, number> = {};
  for (const ans of answers) {
    out[ans.axis].count += 1;
    sums[ans.axis] = (sums[ans.axis] ?? 0) + ans.value;
  }
  for (const a of AXES) {
    const s = out[a];
    s.mean = s.count ? (sums[a] ?? 0) / (2 * s.count) : 0;
  }
  return out;
}

function isSettled(s: AxisStat) {
  if (s.count >= MAX_PER_AXIS) return true;
  return s.count >= MIN_PER_AXIS && Math.abs(s.mean) >= SETTLE_THRESHOLD;
}

/** 軸の確からしさ（大きいほど確定的） */
function certainty(s: AxisStat) {
  return Math.abs(s.mean) * Math.sqrt(s.count);
}

/** セッションごとに出題順を少し変えるための簡易シード付き乱数 */
export function seededOrder<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let x = seed || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    x = (x * 1103515245 + 12345) & 0x7fffffff;
    const j = x % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function nextQuestion(bank: Question[], answers: Answer[], seed: number): Question | null {
  const total = answers.length;
  if (total >= MAX_TOTAL) return null;
  // 最初の1問は答えやすい定番の質問から
  if (total === 0) return bank.find((q) => q.id === 'EI-1') ?? bank[0] ?? null;
  const stats = axisStats(answers);
  const answered = new Set(answers.map((a) => a.questionId));
  const available = (axis: Axis) => bank.filter((q) => q.axis === axis && !answered.has(q.id));

  const allSettled = AXES.every((a) => isSettled(stats[a]));
  if (allSettled && total >= MIN_TOTAL) return null;

  // 1) 最低出題数に達していない軸を、ラウンドロビンで
  const order = seededOrder(AXES, seed);
  const lastAxis = answers[answers.length - 1]?.axis;
  const under = order
    .filter((a) => stats[a].count < MIN_PER_AXIS && available(a).length)
    .sort((a, b) => stats[a].count - stats[b].count);
  let axis: Axis | undefined = under.find((a) => a !== lastAxis) ?? under[0];

  // 2) 未確定の軸のうち、もっとも迷いのある軸
  if (!axis) {
    const candidates = AXES.filter((a) => stats[a].count < MAX_PER_AXIS && available(a).length);
    const unsettled = candidates.filter((a) => !isSettled(stats[a]));
    const pool = unsettled.length ? unsettled : candidates;
    pool.sort((a, b) => certainty(stats[a]) - certainty(stats[b]));
    axis = pool.find((a) => a !== lastAxis) ?? pool[0];
  }
  if (!axis) return null;
  const qs = seededOrder(available(axis), seed + axis.charCodeAt(0));
  return qs[0] ?? null;
}

/** 進捗バー用の想定総問題数（回答に応じて変動） */
export function estimateTotal(answers: Answer[]): number {
  const stats = axisStats(answers);
  let remaining = 0;
  for (const a of AXES) {
    const s = stats[a];
    if (s.count < MIN_PER_AXIS) remaining += MIN_PER_AXIS - s.count + (Math.abs(s.mean) < SETTLE_THRESHOLD ? 1 : 0);
    else if (!isSettled(s)) remaining += Math.min(2, MAX_PER_AXIS - s.count);
  }
  const est = answers.length + remaining;
  return Math.max(MIN_TOTAL, Math.min(MAX_TOTAL, est));
}

export function computeScores(answers: Answer[]): AxisScores {
  const stats = axisStats(answers);
  return Object.fromEntries(AXES.map((a) => [a, Math.round(stats[a].mean * 100)])) as AxisScores;
}

export function computeResult(answers: Answer[]): DiagnosisResult {
  const scores = computeScores(answers);
  const pick = (axis: Axis, left: string, right: string) => (scores[axis] <= 0 ? left : right);
  const base = `${pick('EI', 'E', 'I')}${pick('SN', 'S', 'N')}${pick('TF', 'T', 'F')}${pick('JP', 'J', 'P')}` as BaseCode;
  const code = makeCode(base, pick('AT', 'A', 'T') as 'A' | 'T', pick('CS', 'C', 'S') as 'C' | 'S');
  return {
    id: `r_${Date.now().toString(36)}`,
    code,
    scores,
    answeredCount: answers.length,
    createdAt: new Date().toISOString(),
  };
}
