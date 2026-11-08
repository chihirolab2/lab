import { BASE_ORDER } from '../data/baseTypes';
import { makeCode, parseCode } from '../data/catalog';
import type { BaseCode, TypeCode } from '../data/model';

/**
 * 相性ロジック（サンプル実装）。
 * 4指標の「共通点による安心感」と「違いによる補い合い」を点数化し、
 * A/T・C/S のバランスで微調整する。
 */

/** 補い合いが特に強いとされる組み合わせ（TYPY独自の目安） */
const GOLDEN: [BaseCode, BaseCode][] = [
  ['INFP', 'ENFJ'], ['INFP', 'ENTJ'], ['INFJ', 'ENFP'], ['INFJ', 'ENTP'],
  ['INTJ', 'ENFP'], ['INTJ', 'ENTP'], ['INTP', 'ENTJ'], ['INTP', 'ESTJ'],
  ['ISFJ', 'ESFP'], ['ISFJ', 'ESTP'], ['ISTJ', 'ESFP'], ['ISTJ', 'ESTP'],
  ['ISFP', 'ESFJ'], ['ISFP', 'ENFJ'], ['ISTP', 'ESTJ'], ['ISTP', 'ESFJ'],
];

function isGolden(a: BaseCode, b: BaseCode) {
  return GOLDEN.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

export interface CompatResult {
  score: number;
  headline: string;
  summary: string;
  points: string[];
  advice: string;
  caution: string;
}

export function compatibility(aCode: TypeCode, bCode: TypeCode): CompatResult {
  const a = parseCode(aCode)!;
  const b = parseCode(bCode)!;
  const [ae, as_, at, aj] = a.base.split('');
  const [be, bs, bt, bj] = b.base.split('');
  let score = 58;
  const points: string[] = [];

  if (as_ === bs) {
    score += 14;
    points.push(as_ === 'N' ? '理想や将来の話で盛り上がれる' : '現実的な価値観が近く、安心できる');
  } else {
    score += 2;
    points.push('お互いにない視点を補い合える');
  }

  if (ae !== be) {
    score += 8;
    points.push('にぎやかさと落ち着きのバランスがいい');
  } else {
    score += 4;
    points.push(ae === 'I' ? 'お互いのペースを大切にできる' : '一緒にいるとどんどん楽しくなる');
  }

  if (at !== bt) {
    score += 5;
    points.push('論理と気持ちの両面から支え合える');
  } else {
    score += 5;
    points.push(at === 'F' ? '一緒にいると安心できる' : '知的な会話で惹かれ合う');
  }

  if (aj !== bj) {
    score += 6;
    points.push('計画と柔軟さで、いいチームになれる');
  } else {
    score += 3;
    points.push(aj === 'J' ? '予定やルールの感覚が近い' : '自由な時間を一緒に楽しめる');
  }

  if (a.at !== b.at) {
    score += 4;
    points.push('一方が支え、一方が気づかう好バランス');
  } else {
    score += a.at === 'A' ? 3 : 1;
    if (a.at === 'T') points.push('繊細な気持ちを分かり合える');
  }

  if (a.cs === b.cs) {
    score += 4;
    points.push(a.cs === 'C' ? '新しい体験を一緒に楽しめる' : '穏やかな日常を一緒に積み重ねられる');
  } else {
    score += 1;
  }

  if (isGolden(a.base, b.base)) score += 8;
  if (a.base === b.base) score -= 2;

  score = Math.max(42, Math.min(99, score));

  // ポイントは相性の高い要素を優先して3つ
  const top = points.slice(0, 3);

  const tier =
    score >= 90
      ? {
          headline: '運命級の相性',
          summary: 'お互いの価値観を尊重し合い、深い絆でつながれる相性です。',
        }
      : score >= 80
        ? { headline: 'とても良い相性', summary: '自然体でいられて、一緒に成長していける心地よい関係です。' }
        : score >= 70
          ? { headline: '良い相性', summary: '違いを楽しめば、お互いの世界がぐっと広がる関係です。' }
          : { headline: '刺激し合う相性', summary: '考え方は違っても、学び合える発見の多い関係です。' };

  const advice =
    at !== bt
      ? '気持ちを伝えるときは「結論」と「想い」の両方を言葉にすると、すれ違いがぐっと減ります。'
      : as_ !== bs
        ? '相手の「具体的な話」や「アイデアの話」をおもしろがって聞くと、会話がもっと弾みます。'
        : '似ているからこそ、ときどき新しい体験を一緒にすると、関係に新鮮さが生まれます。';
  const caution =
    aj !== bj
      ? '予定の立て方の違いでモヤモヤしたら、「ここだけは決める」ラインを話し合ってみて。'
      : a.at === 'T' && b.at === 'T'
        ? '二人とも気にしすぎてしまうことも。「大丈夫だよ」の一言を惜しまずに。'
        : '慣れてくると言葉が減りがち。感謝はこまめに伝えましょう。';

  return { score, headline: tier.headline, summary: tier.summary, points: top, advice, caution };
}

/** あるタイプと相性の良いベースタイプ上位n件（同じA/T・C/Sで比較） */
export function bestMatches(code: TypeCode, n = 3): TypeCode[] {
  const me = parseCode(code)!;
  return BASE_ORDER.filter((b) => b !== me.base)
    .map((b) => makeCode(b, me.at === 'A' ? 'T' : 'A', me.cs))
    .map((c) => ({ c, s: compatibility(code, c).score }))
    .sort((x, y) => y.s - x.s)
    .slice(0, n)
    .map((x) => x.c);
}
