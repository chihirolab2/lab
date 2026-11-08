/**
 * TYPY ドメインモデル
 *
 * 16タイプ（4指標） × A/T × C/S = 64タイプ。
 * ここで定義する型は UI・診断ロジック・永続化層すべての共通言語。
 * 本番DBやAPIに接続する際も、この型に合わせてマッピングすれば画面側は変更不要。
 */

export type BaseCode =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export type AT = 'A' | 'T';
export type CS = 'C' | 'S';

/** 64タイプのコード。例: "INFP-AS" */
export type TypeCode = `${BaseCode}-${AT}${CS}`;

export type GroupId = 'analyst' | 'empath' | 'guardian' | 'explorer';

/** 診断の6軸。各軸は -1(左極) 〜 +1(右極) のスコアで表す */
export type Axis = 'EI' | 'SN' | 'TF' | 'JP' | 'AT' | 'CS';

export interface Group {
  id: GroupId;
  name: string;
  short: string;
  description: string;
  color: string;
  soft: string;
  tint: string;
}

/* ---------- キャラクター外見 ---------- */

export type BackHair =
  | 'none' | 'short' | 'medium' | 'long-straight' | 'long-wavy'
  | 'bob' | 'ponytail' | 'twin' | 'side-braid' | 'half-up';
export type Fringe = 'swept-l' | 'swept-r' | 'center' | 'wispy' | 'messy' | 'up' | 'neat';
export type SideLocks = 'none' | 'short' | 'long' | 'wavy';
export type Outfit =
  | 'turtle-jacket' | 'cardigan' | 'blazer-blouse' | 'hoodie'
  | 'ribbon-blouse' | 'frill-blouse' | 'vest-shirt' | 'knit'
  | 'suit-tie' | 'sailor-cardigan' | 'suit-open' | 'collar-blouse'
  | 'jacket-tee' | 'off-shoulder' | 'bomber' | 'camisole-jacket';
export type Accessory =
  | 'glasses' | 'flower' | 'hairpin' | 'beret' | 'headband'
  | 'ribbon' | 'earring' | 'flower-crown' | 'scrunchie' | 'bow' | 'none';

export interface CharacterSpec {
  name: string;
  /** 'f' | 'm' は顔立ち・首まわりの描き分けに使用 */
  build: 'f' | 'm';
  hair: string;
  hairShade: string;
  hairLight: string;
  eye: string;
  eyeDeep: string;
  back: BackHair;
  fringe: Fringe;
  sides: SideLocks;
  outfit: Outfit;
  outfitMain: string;
  outfitSub: string;
  accessories: Accessory[];
  accent: string;
  /** 吊り目(+)/たれ目(-) の傾き */
  eyeTilt: number;
}

/* ---------- タイプコンテンツ ---------- */

export interface BaseType {
  code: BaseCode;
  group: GroupId;
  name: string;
  catch: string;
  tags: string[];
  personality: string;
  thinking: string;
  behavior: string;
  love: string;
  loveTags: string[];
  work: string;
  jobs: string[];
  strengths: string[];
  weaknesses: string[];
  stress: string;
  recharge: string;
  aruaru: string[];
  character: CharacterSpec;
}

export interface VariantAxisInfo<K extends string> {
  key: K;
  label: string;
  reading: string;
  short: string;
  description: string;
  personality: string;
  love: string;
  work: string;
  stress: string;
}

export interface TypeProfile {
  code: TypeCode;
  base: BaseType;
  at: AT;
  cs: CS;
  group: Group;
  /** 64タイプとしての呼び名 例: "やわらかな夢想家" */
  title: string;
  atInfo: VariantAxisInfo<AT>;
  csInfo: VariantAxisInfo<CS>;
}

/* ---------- 診断 ---------- */

export interface QuestionOption {
  id: string;
  label: string;
  /** 対象軸に対する寄与。-2(左極) 〜 +2(右極) */
  value: number;
}

export type SceneId = 'cafe' | 'desk' | 'night' | 'letter' | 'travel' | 'chat';

export interface Question {
  id: string;
  axis: Axis;
  text: string;
  scene: SceneId;
  options: QuestionOption[];
}

export interface Answer {
  questionId: string;
  optionId: string;
  axis: Axis;
  value: number;
}

export type AxisScores = Record<Axis, number>;

export interface DiagnosisResult {
  id: string;
  code: TypeCode;
  /** -100(左極) 〜 +100(右極) */
  scores: AxisScores;
  answeredCount: number;
  createdAt: string;
}

/* ---------- ユーザーデータ ---------- */

export interface Friend {
  id: string;
  name: string;
  code: TypeCode;
  favorite: boolean;
  memo?: string;
  addedAt: string;
}

export interface UserProfile {
  nickname: string;
  myCode: TypeCode | null;
  results: DiagnosisResult[];
  discovered: TypeCode[];
  favorites: TypeCode[];
  friends: Friend[];
}
