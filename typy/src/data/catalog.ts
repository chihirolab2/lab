import { BASE_ORDER, BASE_TYPES } from './baseTypes';
import { AT_INFO, CS_INFO, GROUPS, VARIANT_ADJECTIVE } from './groups';
import type { AT, BaseCode, CS, GroupId, TypeCode, TypeProfile } from './model';

export const AT_KEYS: AT[] = ['A', 'T'];
export const CS_KEYS: CS[] = ['C', 'S'];

export function makeCode(base: BaseCode, at: AT, cs: CS): TypeCode {
  return `${base}-${at}${cs}`;
}

export function parseCode(code: string): { base: BaseCode; at: AT; cs: CS } | null {
  const m = /^([EI][NS][TF][JP])-([AT])([CS])$/.exec(code);
  if (!m || !(m[1] in BASE_TYPES)) return null;
  return { base: m[1] as BaseCode, at: m[2] as AT, cs: m[3] as CS };
}

export function isTypeCode(code: string): code is TypeCode {
  return parseCode(code) !== null;
}

const cache = new Map<TypeCode, TypeProfile>();

export function getProfile(code: TypeCode): TypeProfile {
  const hit = cache.get(code);
  if (hit) return hit;
  const parsed = parseCode(code);
  if (!parsed) throw new Error(`Unknown type code: ${code}`);
  const base = BASE_TYPES[parsed.base];
  const profile: TypeProfile = {
    code,
    base,
    at: parsed.at,
    cs: parsed.cs,
    group: GROUPS[base.group],
    title: `${VARIANT_ADJECTIVE[`${parsed.at}${parsed.cs}`]}${base.name}`,
    atInfo: AT_INFO[parsed.at],
    csInfo: CS_INFO[parsed.cs],
  };
  cache.set(code, profile);
  return profile;
}

/** 図鑑の並び順（グループ → ベース → AC, AS, TC, TS） */
export const ALL_CODES: TypeCode[] = BASE_ORDER.flatMap((b) =>
  AT_KEYS.flatMap((at) => CS_KEYS.map((cs) => makeCode(b, at, cs))),
);

export function codesInGroup(group: GroupId): TypeCode[] {
  return ALL_CODES.filter((c) => getProfile(c).group.id === group);
}

export function splitCode(code: TypeCode) {
  const [base, variant] = code.split('-') as [BaseCode, `${AT}${CS}`];
  return { base, variant };
}
