import type { Friend, TypeCode, UserProfile } from '../data/model';

/** 初回起動時に一通り操作できるよう用意したサンプルデータ */
const SAMPLE_FRIENDS: [string, TypeCode, boolean][] = [
  ['ミサキ', 'INTJ-AS', false],
  ['ユイ', 'INFP-TS', true],
  ['タクミ', 'ENFP-AC', false],
  ['ケンタ', 'ISTJ-AS', false],
  ['ナナ', 'ESFJ-TC', false],
  ['ショウ', 'ENTP-AC', false],
];

export function createSampleProfile(): UserProfile {
  const now = Date.now();
  const friends: Friend[] = SAMPLE_FRIENDS.map(([name, code, favorite], i) => ({
    id: `f_sample_${i}`,
    name,
    code,
    favorite,
    addedAt: new Date(now - (i + 1) * 86400000).toISOString(),
  }));
  return {
    nickname: 'あなた',
    myCode: null,
    results: [],
    discovered: [...friends.map((f) => f.code), 'ISFP-TS'],
    favorites: ['INFP-TS'],
    friends,
  };
}
