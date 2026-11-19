import type { RequestCategory, ThemeKey } from '../types';

export interface ThemeInfo {
  key: ThemeKey;
  label: string; // 英字ラベル（チケット上部）
  jp: string;
}

export const THEMES: Record<ThemeKey, ThemeInfo> = {
  CAFE: { key: 'CAFE', label: 'CAFE TICKET', jp: 'カフェ' },
  TRAVEL: { key: 'TRAVEL', label: 'TRAVEL TICKET', jp: '旅行' },
  MOVIE: { key: 'MOVIE', label: 'MOVIE TICKET', jp: '映画' },
  DINNER: { key: 'DINNER', label: 'DINNER TICKET', jp: 'ディナー' },
  RELAX: { key: 'RELAX', label: 'RELAX TICKET', jp: 'おやすみ' },
  SECRET: { key: 'SECRET', label: 'SECRET TICKET', jp: 'ひみつ' },
  PREMIUM: { key: 'PREMIUM', label: 'PREMIUM TICKET', jp: 'プレミアム' },
};

/** 贈り主が選べるテーマ（PREMIUM は自動発行専用） */
export const SELECTABLE_THEMES: ThemeKey[] = ['CAFE', 'TRAVEL', 'MOVIE', 'DINNER', 'RELAX', 'SECRET'];

export const REQUEST_CATEGORIES: { key: RequestCategory; jp: string }[] = [
  { key: 'CAFE', jp: 'カフェ' },
  { key: 'TRAVEL', jp: 'お出かけ' },
  { key: 'MOVIE', jp: '映画' },
  { key: 'DINNER', jp: 'グルメ' },
  { key: 'RELAX', jp: 'おうち' },
  { key: 'OTHER', jp: 'その他' },
];

export function requestCategoryLabel(c: RequestCategory): string {
  return REQUEST_CATEGORIES.find((x) => x.key === c)?.jp ?? c;
}

/** リクエストのカテゴリから、採用時のチケットテーマの初期値を決める */
export function themeForRequest(c: RequestCategory): ThemeKey {
  return c === 'OTHER' ? 'SECRET' : c;
}

export const STAMP_TARGET = 10;
