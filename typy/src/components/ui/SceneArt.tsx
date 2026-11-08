import type { ReactElement } from 'react';
import type { SceneId } from '../../data/model';

/** 質問画面の情景イラスト（やわらかいフラットイラスト） */
export function SceneArt({ scene }: { scene: SceneId }) {
  return (
    <svg viewBox="0 0 320 180" className="scene-art" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="sc-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbf8ff" />
          <stop offset="1" stopColor="#ece6fb" />
        </linearGradient>
        <linearGradient id="sc-win" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e5eefb" />
        </linearGradient>
        <radialGradient id="sc-glow" cx="0.75" cy="0.15" r="0.7">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill="url(#sc-bg)" />
      {SCENES[scene]}
      <rect width="320" height="180" fill="url(#sc-glow)" />
    </svg>
  );
}

const Window = ({ night = false }: { night?: boolean }) => (
  <g>
    <rect x="176" y="14" width="120" height="104" rx="6" fill={night ? '#a9a6e3' : 'url(#sc-win)'} />
    {night && (
      <g>
        <circle cx="262" cy="44" r="14" fill="#fff6d6" />
        <circle cx="268" cy="40" r="13" fill="#a9a6e3" />
        <circle cx="206" cy="34" r="1.6" fill="#fff" />
        <circle cx="226" cy="58" r="1.2" fill="#fff" />
        <circle cx="284" cy="86" r="1.4" fill="#fff" />
        <circle cx="198" cy="92" r="1.1" fill="#fff" />
      </g>
    )}
    <path d="M236,14 V118 M176,66 H296" stroke="#f6f2ff" strokeWidth="5" />
    <rect x="176" y="14" width="120" height="104" rx="6" fill="none" stroke="#efe9fb" strokeWidth="6" />
    <rect x="168" y="116" width="136" height="7" rx="3.5" fill="#efe6dc" />
  </g>
);

const Table = () => <rect x="0" y="150" width="320" height="30" fill="#f1e8de" />;

const SCENES: Record<SceneId, ReactElement> = {
  cafe: (
    <g>
      <Window />
      <Table />
      {/* 花瓶とドライフラワー */}
      <path d="M58,150 C50,128 54,112 62,104 L74,104 C82,112 86,128 78,150 Z" fill="#eef1f8" stroke="#dfe3ef" />
      <g stroke="#c9b48a" strokeWidth="1.4" fill="none">
        <path d="M66,104 C60,80 48,62 40,48" />
        <path d="M68,104 C70,78 74,56 84,40" />
        <path d="M70,104 C80,86 92,76 104,66" />
      </g>
      {[[40, 48], [46, 58], [52, 66], [84, 40], [80, 52], [78, 62], [104, 66], [96, 72], [90, 80]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="4" ry="2.6" fill="#f3dfa2" transform={`rotate(-30 ${x} ${y})`} />
      ))}
      {/* 本 */}
      <rect x="196" y="122" width="96" height="12" rx="2" fill="#f4e1e6" />
      <rect x="202" y="110" width="84" height="12" rx="2" fill="#dfe6f6" />
      <rect x="192" y="134" width="104" height="16" rx="2" fill="#ece6f8" />
      <path d="M196,128 H290 M202,116 H284 M192,142 H294" stroke="#fff" strokeWidth="1.2" opacity="0.8" />
      {/* カップ */}
      <ellipse cx="140" cy="154" rx="40" ry="8" fill="#e9dfd6" />
      <path d="M108,118 H170 C170,142 158,154 139,154 C120,154 108,142 108,118 Z" fill="#ffffff" stroke="#ece6f2" />
      <path d="M170,124 C184,122 186,142 166,142" fill="none" stroke="#fff" strokeWidth="6" />
      <ellipse cx="139" cy="118" rx="31" ry="7" fill="#d9b08b" />
      <path d="M139,113 C133,110 129,116 134,119 L139,123 L144,119 C149,116 145,110 139,113 Z" fill="#fff4e8" />
      <path d="M128,104 q-4,-8 2,-14 M140,100 q-4,-8 2,-14 M152,104 q-4,-8 2,-14" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
    </g>
  ),
  desk: (
    <g>
      <Window />
      <Table />
      <rect x="70" y="84" width="112" height="70" rx="6" fill="#e9e5f8" />
      <rect x="76" y="90" width="100" height="58" rx="3" fill="#cfd9f4" />
      <path d="M84,104 H140 M84,114 H160 M84,124 H130" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <path d="M56,154 H196 L186,160 H66 Z" fill="#dcd6f0" />
      <rect x="212" y="132" width="62" height="20" rx="3" fill="#fbe7ee" transform="rotate(-6 243 142)" />
      <path d="M222,130 l46,-6" stroke="#f3c6d4" strokeWidth="2" />
      <rect x="276" y="118" width="6" height="34" rx="3" fill="#b9a6ec" transform="rotate(18 279 135)" />
      <path d="M34,154 C30,138 36,128 44,126 L52,126 C60,128 64,138 60,154 Z" fill="#fde6d4" />
      <path d="M48,126 C40,110 30,104 22,104 C30,114 36,118 48,126 M48,126 C52,104 62,96 72,96 C64,108 58,116 48,126 M48,126 C46,106 50,92 54,84" stroke="#9fd0ae" strokeWidth="5" fill="none" strokeLinecap="round" />
    </g>
  ),
  night: (
    <g>
      <rect width="320" height="180" fill="#efeafd" />
      <Window night />
      <path d="M160,0 C168,40 160,100 172,150 L150,150 C142,100 150,40 140,0 Z" fill="#dcd2f6" />
      <Table />
      <path d="M60,154 L70,96 H110 L120,154 Z" fill="#fff4dc" opacity="0.7" />
      <path d="M70,96 H110 L102,72 H78 Z" fill="#f6d9a6" />
      <rect x="88" y="96" width="4" height="58" fill="#d8c3a3" />
      <ellipse cx="90" cy="154" rx="20" ry="4" fill="#d8c3a3" />
      <rect x="200" y="132" width="80" height="18" rx="3" fill="#d9e3f7" />
      <path d="M210,138 H270" stroke="#fff" strokeWidth="2" />
    </g>
  ),
  letter: (
    <g>
      <Window />
      <Table />
      <g transform="rotate(-6 150 120)">
        <rect x="92" y="88" width="120" height="76" rx="6" fill="#fff" stroke="#efe7f6" />
        <path d="M92,92 L152,132 L212,92" fill="none" stroke="#e9def5" strokeWidth="3" />
        <path d="M152,124 C146,116 136,122 142,130 L152,138 L162,130 C168,122 158,116 152,124 Z" fill="#f2a9be" />
      </g>
      <g transform="translate(250 128)">
        {[0, 72, 144, 216, 288].map((d) => (
          <ellipse key={d} cx="0" cy="-9" rx="7" ry="10" fill="#fbd9e4" transform={`rotate(${d})`} />
        ))}
        <circle r="5" fill="#f6d582" />
      </g>
      <g transform="translate(46 132) scale(0.8)">
        {[0, 72, 144, 216, 288].map((d) => (
          <ellipse key={d} cx="0" cy="-9" rx="7" ry="10" fill="#e3dcfb" transform={`rotate(${d})`} />
        ))}
        <circle r="5" fill="#f6d582" />
      </g>
    </g>
  ),
  travel: (
    <g>
      <rect width="320" height="180" fill="#e9f2fc" />
      <ellipse cx="80" cy="44" rx="38" ry="12" fill="#fff" />
      <ellipse cx="250" cy="30" rx="30" ry="10" fill="#fff" />
      <path d="M30,80 C90,40 170,90 250,52" stroke="#c9bdf2" strokeWidth="2" strokeDasharray="5 6" fill="none" />
      <path d="M250,52 l14,-8 4,2 -8,10 6,6 -3,2 -8,-4 -6,6 -3,-1 3,-8 z" fill="#a99be8" />
      <rect x="0" y="150" width="320" height="30" fill="#e7e0f6" />
      <rect x="110" y="84" width="76" height="70" rx="12" fill="#f5c9d6" />
      <rect x="132" y="70" width="32" height="16" rx="6" fill="none" stroke="#e4a6b9" strokeWidth="5" />
      <path d="M128,84 V154 M168,84 V154" stroke="#eab2c4" strokeWidth="5" />
      <circle cx="124" cy="156" r="5" fill="#c7bfe0" />
      <circle cx="172" cy="156" r="5" fill="#c7bfe0" />
      <path d="M232,96 C232,82 252,82 252,96 C252,108 242,118 242,118 C242,118 232,108 232,96 Z" fill="#9fd0e6" />
      <circle cx="242" cy="96" r="4" fill="#fff" />
      <rect x="208" y="122" width="70" height="28" rx="4" fill="#fff" stroke="#dde6f5" />
      <path d="M216,130 l10,10 12,-8 14,12 18,-14" stroke="#b5e3cf" strokeWidth="3" fill="none" />
    </g>
  ),
  chat: (
    <g>
      <rect width="320" height="180" fill="#f1edfd" />
      <rect x="40" y="36" width="140" height="58" rx="22" fill="#fff" />
      <path d="M70,92 l-8,18 22,-16 z" fill="#fff" />
      <circle cx="84" cy="65" r="6" fill="#c9bdf2" />
      <circle cx="110" cy="65" r="6" fill="#b6c9f1" />
      <circle cx="136" cy="65" r="6" fill="#b5e3cf" />
      <rect x="146" y="88" width="132" height="54" rx="22" fill="#d9d0f8" />
      <path d="M250,140 l10,18 -24,-16 z" fill="#d9d0f8" />
      <path d="M212,108 C206,100 194,106 200,116 L212,126 L224,116 C230,106 218,100 212,108 Z" fill="#fff" />
      <path d="M40,150 h240" stroke="#e6dff8" strokeWidth="2" />
      <g fill="#fff" opacity="0.9">
        <path d="M260,40 l2,6 6,2 -6,2 -2,6 -2,-6 -6,-2 6,-2z" />
        <path d="M30,120 l1.5,4 4,1.5 -4,1.5 -1.5,4 -1.5,-4 -4,-1.5 4,-1.5z" />
      </g>
    </g>
  ),
};
