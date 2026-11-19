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
  { key: 'OUT', jp: 'お出かけ' },
  { key: 'FOOD', jp: 'グルメ' },
  { key: 'HOME', jp: 'おうち' },
  { key: 'OTHER', jp: 'その他' },
];

export function requestCategoryLabel(c: RequestCategory): string {
  return REQUEST_CATEGORIES.find((x) => x.key === c)?.jp ?? c;
}

/** リクエストの内容から、採用時のチケットデザインの初期値を決める（贈り主があとで変更できる） */
export function themeForRequest(c: RequestCategory, title = ''): ThemeKey {
  if (/カフェ|コーヒー|喫茶|パンケーキ|スイーツ/.test(title)) return 'CAFE';
  if (/映画|シネマ/.test(title)) return 'MOVIE';
  if (/旅行|旅|温泉|ドライブ/.test(title)) return 'TRAVEL';
  switch (c) {
    case 'OUT':
      return 'TRAVEL';
    case 'FOOD':
      return 'DINNER';
    case 'HOME':
      return 'RELAX';
    case 'OTHER':
      return 'SECRET';
  }
}

export const STAMP_TARGET = 10;
