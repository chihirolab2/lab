import type { AT, CS, Group, GroupId, VariantAxisInfo } from './model';

export const GROUPS: Record<GroupId, Group> = {
  analyst: {
    id: 'analyst',
    name: '分析派',
    short: '分析',
    description: '論理と好奇心で、物事の本質を見抜くタイプたち。',
    color: '#9a86dc',
    soft: '#f1edfd',
    tint: '#ded5fa',
  },
  empath: {
    id: 'empath',
    name: '共感派',
    short: '共感',
    description: '人の心に寄り添い、理想や意味を大切にするタイプたち。',
    color: '#66b894',
    soft: '#ebf7f1',
    tint: '#cfeedd',
  },
  guardian: {
    id: 'guardian',
    name: '守護派',
    short: '守護',
    description: '誠実さと責任感で、みんなの日常を支えるタイプたち。',
    color: '#679fdc',
    soft: '#e9f2fc',
    tint: '#d2e4f8',
  },
  explorer: {
    id: 'explorer',
    name: '探求派',
    short: '探求',
    description: '今この瞬間を味わい、感覚と行動力で道をひらくタイプたち。',
    color: '#e3a54d',
    soft: '#fdf4e4',
    tint: '#f8e2b9',
  },
};

export const GROUP_ORDER: GroupId[] = ['analyst', 'empath', 'guardian', 'explorer'];

/**
 * TYPY独自の追加指標。
 * A/T … 自分への確信と感情の揺らぎ方（自己評価のスタイル）
 * C/S … 変化への向き合い方（エネルギーが高まる環境）
 */
export const AT_INFO: Record<AT, VariantAxisInfo<AT>> = {
  A: {
    key: 'A',
    label: 'アシュアード',
    reading: 'Assured',
    short: '自信型',
    description:
      '自分の判断や価値観に確信を持ちやすく、気持ちの切り替えが早いスタイル。周りの評価に振り回されにくく、落ち着いて物事に向き合えます。',
    personality: 'さらに、自分の感覚を信じて迷いなく進める芯の強さがあります。',
    love: '気持ちを素直に伝えられ、関係が安定しやすいのが魅力です。',
    work: '決断が早く、プレッシャーのかかる場面でも実力を出しやすいタイプです。',
    stress: 'ただし「大丈夫」と抱え込んで、疲れに気づくのが遅れることも。',
  },
  T: {
    key: 'T',
    label: 'テンダー',
    reading: 'Tender',
    short: '繊細型',
    description:
      '感受性が豊かで、自分を見つめ直す力が強いスタイル。小さな変化にも気づき、理想に近づくために努力を重ねられます。',
    personality: 'さらに、繊細な感受性ゆえに、人の気持ちや場の空気を深く感じ取ることができます。',
    love: '相手の反応に一喜一憂しやすい分、思いやりの深さはピカイチです。',
    work: '細部まで丁寧に仕上げ、改善を重ねることで信頼を積み上げていきます。',
    stress: '自分に厳しくなりすぎたときは、できたことを数えてみるのがおすすめ。',
  },
};

export const CS_INFO: Record<CS, VariantAxisInfo<CS>> = {
  C: {
    key: 'C',
    label: 'チャレンジャー',
    reading: 'Challenger',
    short: '挑戦型',
    description:
      '新しい環境や変化から刺激を受け、未知の体験でエネルギーが高まるスタイル。「やってみたい」という気持ちが行動の原動力です。',
    personality: '変化を楽しみ、新しい自分に出会うことにワクワクできる人です。',
    love: '一緒に新しいことを体験できる関係にときめきを感じます。',
    work: '新規プロジェクトや立ち上げなど、変化の多い環境でこそ輝きます。',
    stress: '刺激が少ない日々が続くと、気持ちが沈みがちに。',
  },
  S: {
    key: 'S',
    label: 'ステディ',
    reading: 'Steady',
    short: '安定型',
    description:
      '慣れた環境と積み重ねを大切にし、継続によって力を発揮するスタイル。安心できる土台があるほど、自分らしさが育ちます。',
    personality: '自分のペースを守りながら、着実に積み上げていける人です。',
    love: '穏やかで長く続く、安心感のある関係を育むのが得意です。',
    work: '継続的な改善や専門性を深める仕事で、確かな成果を出します。',
    stress: '急な変更や予定外の出来事が重なると、疲れを感じやすくなります。',
  },
};

/** 64タイプの呼び名に付ける形容 */
export const VARIANT_ADJECTIVE: Record<`${AT}${CS}`, string> = {
  AC: 'きらめく',
  AS: '凛とした',
  TC: 'ときめく',
  TS: 'やわらかな',
};
