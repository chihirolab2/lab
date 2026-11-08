import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { DiagnosisResult, Friend, TypeCode, UserProfile } from '../data/model';
import { repository } from '../services/repository';

interface AppStore {
  profile: UserProfile;
  isDiscovered: (code: TypeCode) => boolean;
  isFavorite: (code: TypeCode) => boolean;
  saveResult: (result: DiagnosisResult) => void;
  discover: (code: TypeCode) => void;
  toggleFavorite: (code: TypeCode) => void;
  setNickname: (name: string) => void;
  addFriend: (name: string, code: TypeCode) => Friend;
  updateFriend: (id: string, patch: Partial<Omit<Friend, 'id'>>) => void;
  removeFriend: (id: string) => void;
  resetData: (mode: 'sample' | 'empty') => void;
}

const Ctx = createContext<AppStore | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => repository.load());

  useEffect(() => {
    void repository.save(profile);
  }, [profile]);

  const update = useCallback((fn: (p: UserProfile) => UserProfile) => setProfile((p) => fn(p)), []);

  const discoverIn = (p: UserProfile, code: TypeCode): UserProfile =>
    p.discovered.includes(code) ? p : { ...p, discovered: [...p.discovered, code] };

  const store = useMemo<AppStore>(
    () => ({
      profile,
      isDiscovered: (code) => profile.discovered.includes(code),
      isFavorite: (code) => profile.favorites.includes(code),
      saveResult: (result) =>
        update((p) => ({ ...p, myCode: result.code, results: [result, ...p.results].slice(0, 20) })),
      discover: (code) => update((p) => discoverIn(p, code)),
      toggleFavorite: (code) =>
        update((p) => ({
          ...p,
          favorites: p.favorites.includes(code) ? p.favorites.filter((c) => c !== code) : [...p.favorites, code],
        })),
      setNickname: (nickname) => update((p) => ({ ...p, nickname })),
      addFriend: (name, code) => {
        const friend: Friend = {
          id: `f_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
          name,
          code,
          favorite: false,
          addedAt: new Date().toISOString(),
        };
        update((p) => discoverIn({ ...p, friends: [friend, ...p.friends] }, code));
        return friend;
      },
      updateFriend: (id, patch) =>
        update((p) => {
          const next = { ...p, friends: p.friends.map((f) => (f.id === id ? { ...f, ...patch } : f)) };
          return patch.code ? discoverIn(next, patch.code) : next;
        }),
      removeFriend: (id) => update((p) => ({ ...p, friends: p.friends.filter((f) => f.id !== id) })),
      resetData: (mode) => setProfile(repository.reset(mode)),
    }),
    [profile, update],
  );

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore must be used inside AppStoreProvider');
  return v;
}
