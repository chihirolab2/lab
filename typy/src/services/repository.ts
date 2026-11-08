import type { UserProfile } from '../data/model';
import { createSampleProfile } from './sampleData';

/**
 * 永続化レイヤーの抽象。
 * 現在は localStorage 実装だが、同じインターフェースで REST API / Firebase / Supabase 等に差し替え可能。
 */
export interface TypyRepository {
  load(): UserProfile;
  save(profile: UserProfile): void | Promise<void>;
  reset(mode: 'sample' | 'empty'): UserProfile;
}

const KEY = 'typy:profile:v1';

export function emptyProfile(): UserProfile {
  return { nickname: 'あなた', myCode: null, results: [], discovered: [], favorites: [], friends: [] };
}

export class LocalStorageRepository implements TypyRepository {
  load(): UserProfile {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return { ...emptyProfile(), ...(JSON.parse(raw) as UserProfile) };
    } catch {
      /* 破損・プライベートモードなどはサンプルで起動 */
    }
    return createSampleProfile();
  }

  save(profile: UserProfile) {
    try {
      localStorage.setItem(KEY, JSON.stringify(profile));
    } catch {
      /* 保存できない環境ではメモリ上のみで動作 */
    }
  }

  reset(mode: 'sample' | 'empty') {
    const p = mode === 'sample' ? createSampleProfile() : emptyProfile();
    this.save(p);
    return p;
  }
}

export const repository: TypyRepository = new LocalStorageRepository();
