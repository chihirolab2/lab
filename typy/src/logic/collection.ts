import { ALL_CODES, getProfile } from '../data/catalog';
import { GROUP_ORDER } from '../data/groups';
import type { GroupId, TypeCode } from '../data/model';

export const TOTAL_TYPES = ALL_CODES.length;

export function collectionStats(discovered: TypeCode[]) {
  const set = new Set(discovered);
  const byGroup = Object.fromEntries(
    GROUP_ORDER.map((g) => [g, { found: 0, total: 0 }]),
  ) as Record<GroupId, { found: number; total: number }>;
  for (const c of ALL_CODES) {
    const g = getProfile(c).group.id;
    byGroup[g].total += 1;
    if (set.has(c)) byGroup[g].found += 1;
  }
  const found = ALL_CODES.filter((c) => set.has(c)).length;
  return { found, total: TOTAL_TYPES, remaining: TOTAL_TYPES - found, byGroup };
}

/** 日付ベースの「今日のピックアップ」 */
export function todaysPickup(date = new Date()): TypeCode {
  const key = date.getFullYear() * 400 + date.getMonth() * 32 + date.getDate();
  return ALL_CODES[(key * 7919) % ALL_CODES.length];
}

/** 次に見つけたい未発見タイプ（グループ順で最初の未発見） */
export function nextUndiscovered(discovered: TypeCode[]): TypeCode | null {
  const set = new Set(discovered);
  return ALL_CODES.find((c) => !set.has(c)) ?? null;
}
