import { useId } from 'react';
import type { AT, CharacterSpec, CS } from '../../data/model';
import { Outfit, shadeColor } from './Outfit';
import {
  BACK_HAIR, EYE_WHITE, FRINGE_STRANDS, FRINGES, HAIR_SHINE, HEAD_F, HEAD_M, LASH_FLICK, LID_LINE,
  LOWER_LASH, MIRROR, NECK, NECK_SHADOW, SIDE_LOCKS, UPPER_LASH, VIEW_H, VIEW_W,
} from './paths';

const SKIN = '#fdeae0';
const SKIN_SHADE = '#f4cfc2';
const SKIN_LINE = '#d99f8f';
const LASH = '#3a2c4c';

export interface CharacterArtProps {
  spec: CharacterSpec;
  at?: AT;
  cs?: CS;
  /** 未発見タイプ用のシルエット表示 */
  silhouette?: boolean;
  silhouetteColor?: string;
  /** 'bust' = 肩まで / 'face' = 顔アップ（アバター用） */
  crop?: 'bust' | 'face' | 'hero';
  className?: string;
  title?: string;
}

const VIEWBOX = {
  bust: `0 0 ${VIEW_W} ${VIEW_H}`,
  hero: `-10 6 ${VIEW_W + 20} ${VIEW_H - 6}`,
  face: '52 30 136 136',
};

/**
 * TYPY キャラクター描画。
 * 16人のベース（髪型・顔立ち・服装）に対し、
 *   A/T → 表情（眉・口・頬の赤み・瞳のうるみ）
 *   C/S → 小物（C: スターブローチ＋ピアス / S: ニットストール）
 * の差分を重ねて64タイプを表現する。
 */
export function CharacterArt({ spec, at = 'A', cs = 'S', silhouette = false, silhouetteColor = '#cbc4e9', crop = 'bust', className, title }: CharacterArtProps) {
  const uid = useId().replace(/:/g, '');
  const id = (k: string) => `${k}-${uid}`;
  const head = spec.build === 'm' ? HEAD_M : HEAD_F;
  const showEars = spec.sides === 'none' || spec.sides === 'short';
  const fringe = FRINGES[spec.fringe];
  const side = SIDE_LOCKS[spec.sides];
  const hairFill = `url(#${id('hair')})`;
  const tilt = spec.eyeTilt;

  const eye = (
    <g transform={`rotate(${tilt} 100 122)`}>
      <path d={EYE_WHITE} fill="#ffffff" />
      <g clipPath={`url(#${id('eyeclip')})`}>
        <ellipse cx={100.5} cy={123.5} rx={9.6} ry={12} fill={`url(#${id('iris')})`} />
        <ellipse cx={100.5} cy={124.5} rx={4.6} ry={6} fill={spec.eyeDeep} />
        <ellipse cx={100.5} cy={131} rx={6.5} ry={3} fill="#ffffff" opacity={0.32} />
        <path d="M88,113 Q100,108 114,112 L114,118 Q100,113 88,119 Z" fill={spec.eyeDeep} opacity={0.35} />
      </g>
      <circle cx={96.4} cy={117.5} r={3.5} fill="#fff" />
      <circle cx={105.2} cy={128.6} r={1.7} fill="#fff" opacity={0.95} />
      {at === 'T' && <circle cx={93.6} cy={126} r={1.1} fill="#fff" opacity={0.9} />}
      <path d={UPPER_LASH} fill={LASH} />
      <path d={LASH_FLICK} fill={LASH} />
      <path d={LOWER_LASH} stroke={LASH} strokeWidth={1} strokeLinecap="round" fill="none" opacity={0.55} />
      <path d={LID_LINE} stroke={SKIN_LINE} strokeWidth={1} strokeLinecap="round" fill="none" opacity={0.55} />
    </g>
  );

  const brow =
    at === 'A' ? 'M88,99 Q99,93.5 112,97.5' : 'M88,99.5 Q100,96.5 112,94.2';

  const mouth =
    at === 'A' ? (
      <g>
        <path d="M111,152.5 Q120,160.5 129,152.5 Q120,156 111,152.5 Z" fill="#e48a92" />
        <path d="M110.5,152 Q120,160.5 129.5,152" stroke="#c46a74" strokeWidth={1.5} strokeLinecap="round" fill="none" />
      </g>
    ) : (
      <path d="M114.5,154 Q120,158 125.5,154" stroke="#c46a74" strokeWidth={1.5} strokeLinecap="round" fill="none" />
    );

  return (
    <svg
      viewBox={VIEWBOX[crop]}
      className={className}
      role="img"
      aria-label={title ?? spec.name}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id={id('hair')} gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="270">
          <stop offset="0" stopColor={spec.hairLight} />
          <stop offset="0.16" stopColor={spec.hair} />
          <stop offset="0.5" stopColor={spec.hair} />
          <stop offset="1" stopColor={spec.hairShade} />
        </linearGradient>
        <linearGradient id={id('iris')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={spec.eyeDeep} />
          <stop offset="0.55" stopColor={spec.eye} />
          <stop offset="1" stopColor={lighten(spec.eye)} />
        </linearGradient>
        <radialGradient id="cloth-shade" cx="0.5" cy="0" r="1">
          <stop offset="0.35" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#6b5f99" stopOpacity={0.35} />
        </radialGradient>
        <clipPath id={id('eyeclip')}>
          <path d={EYE_WHITE} />
        </clipPath>
        <clipPath id={id('faceclip')}>
          <path d={head} />
        </clipPath>
        <filter id={id('sil')}>
          <feFlood floodColor={silhouetteColor} />
          <feComposite in2="SourceAlpha" operator="in" />
        </filter>
      </defs>

      <g filter={silhouette ? `url(#${id('sil')})` : undefined}>
        {/* 後ろ髪 */}
        {BACK_HAIR[spec.back].map((d, i) => (
          <path key={i} d={d} fill={hairFill} />
        ))}
        {BACK_HAIR[spec.back].length > 0 && (
          <path d={BACK_HAIR[spec.back][BACK_HAIR[spec.back].length - 1]} fill={spec.hairShade} opacity={0.25} />
        )}

        {/* 体・首 */}
        <Outfit spec={spec} skin={SKIN} skinShade={SKIN_SHADE} />
        <path d={NECK} fill={SKIN} />
        <path d={NECK_SHADOW} fill={SKIN_SHADE} />

        {/* S：ニットスヌード */}
        {cs === 'S' && (
          <g>
            <path d="M92,196 Q120,214 148,196 Q158,204 154,216 Q120,238 86,216 Q82,204 92,196 Z" fill={softTone(spec.accent)} />
            <path d="M92,196 Q120,214 148,196 Q150,201 149,204 Q120,222 91,204 Q90,200 92,196 Z" fill="#fff" opacity={0.35} />
            {[-24, -14, -4, 6, 16, 26].map((dx) => (
              <path key={dx} d={`M${120 + dx},${210 + Math.abs(dx) * -0.25} q${dx * 0.06},8 ${dx * 0.12},14`} stroke={shadeColor(softTone(spec.accent), 0.12)} strokeWidth={1.3} strokeLinecap="round" fill="none" opacity={0.6} />
            ))}
          </g>
        )}
        {/* C：スターブローチ */}
        {cs === 'C' && (
          <g transform="translate(152 240)">
            <path d={starPath(0, 0, 8, 3.6)} fill="#f6cf6e" stroke="#e7ad3e" strokeWidth={0.8} />
            <circle cx={0} cy={0} r={1.6} fill="#fff6d8" />
            <path d="M11,-12 l1.4,3 3,1.4 -3,1.4 -1.4,3 -1.4,-3 -3,-1.4 3,-1.4z" fill="#fff" opacity={0.9} />
          </g>
        )}

        {/* 耳 */}
        {showEars && (
          <g>
            <ellipse cx={77} cy={124} rx={6.5} ry={10} fill={SKIN} />
            <ellipse cx={163} cy={124} rx={6.5} ry={10} fill={SKIN} />
            <path d="M76,118 q-3,6 1,12" stroke={SKIN_SHADE} strokeWidth={1.6} fill="none" />
            <path d="M164,118 q3,6 -1,12" stroke={SKIN_SHADE} strokeWidth={1.6} fill="none" />
          </g>
        )}
        {(spec.accessories.includes('earring') || cs === 'C') && (
          <g>
            <circle cx={77} cy={137} r={2.2} fill={cs === 'C' ? '#f3c766' : spec.accent} />
            <circle cx={163} cy={137} r={2.2} fill={cs === 'C' ? '#f3c766' : spec.accent} />
            {spec.build === 'f' && (
              <>
                <path d="M77,139 L77,146" stroke="#e8c27a" strokeWidth={0.9} />
                <circle cx={77} cy={148} r={2.6} fill={spec.accent} opacity={0.9} />
                <path d="M163,139 L163,146" stroke="#e8c27a" strokeWidth={0.9} />
                <circle cx={163} cy={148} r={2.6} fill={spec.accent} opacity={0.9} />
              </>
            )}
          </g>
        )}

        {/* 顔 */}
        <path d={head} fill={SKIN} />
        {/* 前髪の落ち影 */}
        <g clipPath={`url(#${id('faceclip')})`}>
          <path d={fringe} fill={SKIN_SHADE} transform="translate(0 6)" opacity={0.9} />
          {side && <path d={side} fill={SKIN_SHADE} transform="translate(5 2)" opacity={0.8} />}
          {side && <path d={side} fill={SKIN_SHADE} transform={`${MIRROR} translate(5 2)`} opacity={0.8} />}
        </g>

        {/* 頬 */}
        <ellipse cx={92} cy={142} rx={9.5} ry={4.6} fill="#f7a3b3" opacity={at === 'T' ? 0.5 : 0.34} />
        <ellipse cx={148} cy={142} rx={9.5} ry={4.6} fill="#f7a3b3" opacity={at === 'T' ? 0.5 : 0.34} />
        {at === 'T' && (
          <g stroke="#ec8ea2" strokeWidth={0.9} strokeLinecap="round" opacity={0.6}>
            <path d="M88,141 l-2,3 M92,141 l-2,3 M96,141 l-2,3" />
            <path d="M146,141 l-2,3 M150,141 l-2,3 M154,141 l-2,3" />
          </g>
        )}

        {/* 目 */}
        {eye}
        <g transform={MIRROR}>{eye}</g>

        {/* 鼻・口 */}
        <path d="M120.5,139 q-1.6,4 1.4,5" stroke={SKIN_LINE} strokeWidth={1.1} strokeLinecap="round" fill="none" opacity={0.7} />
        {mouth}

        {/* メガネ（前髪の下） */}
        {spec.accessories.includes('glasses') && (
          <g fill="rgba(255,255,255,0.14)" stroke="#6d5b8f" strokeWidth={1.7}>
            <rect x={83} y={109} width={35} height={29} rx={11} />
            <rect x={122} y={109} width={35} height={29} rx={11} />
            <path d="M118,119 Q120,116.5 122,119" fill="none" />
            <path d="M83,118 L76,115 M157,118 L164,115" fill="none" />
            <path d="M88,114 l8,-2" stroke="#fff" strokeWidth={1.4} opacity={0.7} />
            <path d="M127,114 l8,-2" stroke="#fff" strokeWidth={1.4} opacity={0.7} />
          </g>
        )}

        {/* サイドの髪・三つ編み */}
        {side && <path d={side} fill={hairFill} />}
        {side && <path d={side} fill={hairFill} transform={MIRROR} />}
        {spec.back === 'side-braid' && (
          <g fill={hairFill} stroke={spec.hairShade} strokeWidth={0.8}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <ellipse key={i} cx={82 - i * 2.4} cy={150 + i * 17} rx={10.5 - i * 0.6} ry={11} transform={`rotate(${i % 2 ? 18 : -18} ${82 - i * 2.4} ${150 + i * 17})`} />
            ))}
          </g>
        )}
        {spec.back === 'side-braid' && <circle cx={69} cy={252} r={5} fill={spec.accent} />}

        {/* 前髪 */}
        <path d={fringe} fill={hairFill} />
        <path d={fringe} fill="none" stroke={spec.hairShade} strokeWidth={0.8} opacity={0.5} />
        <path d={FRINGE_STRANDS[spec.fringe]} stroke={spec.hairShade} strokeWidth={1} strokeLinecap="round" fill="none" opacity={0.22} />
        {HAIR_SHINE.map((d) => (
          <path key={d} d={d} stroke={spec.hairLight} strokeWidth={3.6} strokeLinecap="round" fill="none" opacity={0.55} />
        ))}
        <path d="M92,56 Q104,50 112,49" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.55} />

        {/* 眉（前髪越しに透ける） */}
        <path d={brow} stroke={spec.hairShade} strokeWidth={2.3} strokeLinecap="round" fill="none" opacity={0.75} />
        <path d={brow} transform={MIRROR} stroke={spec.hairShade} strokeWidth={2.3} strokeLinecap="round" fill="none" opacity={0.75} />

        <Accessories spec={spec} />
      </g>
    </svg>
  );
}

function Accessories({ spec }: { spec: CharacterSpec }) {
  const a = spec.accessories;
  return (
    <g>
      {a.includes('flower') && (
        <g>
          <Flower x={154} y={70} r={10} color="#fffaf2" center="#f3d27a" />
          <Flower x={140} y={56} r={6.5} color="#fff4f6" center="#f3d27a" />
          <path d="M162,80 q8,4 10,12 q-8,-2 -10,-12z" fill="#9fcfae" />
        </g>
      )}
      {a.includes('flower-crown') &&
        [
          [82, 62, 6, '#fff3f6'],
          [96, 46, 7, '#fde7c8'],
          [116, 39, 7.5, '#fff7fb'],
          [138, 42, 7, '#f9d7e3'],
          [156, 54, 6.5, '#fff1d9'],
        ].map(([x, y, r, c], i) => (
          <Flower key={i} x={x as number} y={y as number} r={r as number} color={c as string} center="#f2c873" />
        ))}
      {a.includes('hairpin') && (
        <g stroke={spec.accent} strokeWidth={3} strokeLinecap="round">
          <path d="M146,80 L162,72" />
          <path d="M148,88 L164,80" />
        </g>
      )}
      {a.includes('beret') && (
        <g>
          <path d="M66,62 C70,28 124,10 164,26 C186,36 186,56 172,64 Q120,72 66,62 Z" fill={spec.accent} />
          <path d="M70,60 Q120,70 172,62" stroke={shadeColor(spec.accent, 0.2)} strokeWidth={3} fill="none" />
          <path d="M120,16 l2,-7" stroke={shadeColor(spec.accent, 0.2)} strokeWidth={3} strokeLinecap="round" />
          <path d="M92,34 Q120,20 150,28" stroke="#fff" strokeWidth={3} opacity={0.3} fill="none" strokeLinecap="round" />
        </g>
      )}
      {a.includes('headband') && (
        <path d="M72,86 C78,44 162,44 168,86" stroke={spec.accent} strokeWidth={7} strokeLinecap="round" fill="none" />
      )}
      {a.includes('ribbon') && <Bow x={160} y={66} color={spec.accent} size={1} />}
      {a.includes('bow') && (
        <>
          <Bow x={74} y={84} color={spec.accent} size={0.75} />
          <Bow x={166} y={84} color={spec.accent} size={0.75} />
        </>
      )}
      {a.includes('scrunchie') && (
        <g>
          <ellipse cx={158} cy={62} rx={8} ry={10} fill={spec.accent} transform="rotate(-30 158 62)" />
          <ellipse cx={158} cy={62} rx={3.5} ry={5} fill={shadeColor(spec.accent, 0.2)} transform="rotate(-30 158 62)" />
        </g>
      )}
    </g>
  );
}

function Flower({ x, y, r, color, center }: { x: number; y: number; r: number; color: string; center: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx={0} cy={-r * 0.55} rx={r * 0.42} ry={r * 0.6} fill={color} stroke="rgba(214,190,170,0.6)" strokeWidth={0.6} transform={`rotate(${deg})`} />
      ))}
      <circle r={r * 0.28} fill={center} />
    </g>
  );
}

function Bow({ x, y, color, size }: { x: number; y: number; color: string; size: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <path d="M0,0 C-10,-14 -24,-8 -20,4 C-17,12 -6,6 0,0 Z" fill={color} />
      <path d="M0,0 C10,-14 24,-8 20,4 C17,12 6,6 0,0 Z" fill={color} />
      <path d="M-2,2 L-8,18 L-2,15 L0,4 L2,15 L8,18 L2,2 Z" fill={shadeColor(color, 0.1)} />
      <circle r={3.6} fill={shadeColor(color, 0.12)} />
    </g>
  );
}

export function starPath(cx: number, cy: number, outer: number, inner: number) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const ang = (Math.PI / 5) * i - Math.PI / 2;
    d += `${i === 0 ? 'M' : 'L'}${(cx + r * Math.cos(ang)).toFixed(2)},${(cy + r * Math.sin(ang)).toFixed(2)} `;
  }
  return d + 'Z';
}

function lighten(hex: string, amt = 0.45) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.round(v + (255 - v) * amt);
  return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
}

function softTone(hex: string) {
  const c = lighten(hex, 0.5).match(/\d+/g)!.map(Number);
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
