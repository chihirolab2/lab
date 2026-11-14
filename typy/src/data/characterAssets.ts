import type { BaseCode, TypeCode } from './model';

/**
 * キャラクター個別画像のレジストリ。
 * src/assets/characters/ に置いた画像を自動検出します（詳細は同フォルダの README.md）。
 *   INFP.webp     … ベース（A/T・C/S 共通）
 *   INFP-TS.webp  … 64タイプ個別の上書き（任意）
 * 画像が無いタイプは SVG の仮イラストで表示されます。
 */
const files = import.meta.glob('../assets/characters/*.{webp,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const byName = new Map<string, string>();
for (const [path, url] of Object.entries(files)) {
  const name = path.split('/').pop()!.replace(/\.(webp|png)$/, '');
  byName.set(name.toUpperCase(), url);
}

export function characterImageUrl(code: TypeCode): string | null {
  const base = code.split('-')[0] as BaseCode;
  return byName.get(code.toUpperCase()) ?? byName.get(base) ?? null;
}

/** 画像が用意できているベースタイプ */
export function availableCharacterImages(): string[] {
  return [...byName.keys()];
}
