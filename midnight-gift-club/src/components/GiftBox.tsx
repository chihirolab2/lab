import { CrownFill } from './Icons';

const STARS = [
  { x: 8, y: 6, s: 2, d: 0 },
  { x: 22, y: 14, s: 3, d: 1.2 },
  { x: 40, y: 4, s: 2, d: 0.6 },
  { x: 58, y: 12, s: 2.5, d: 1.8 },
  { x: 74, y: 5, s: 3, d: 0.3 },
  { x: 90, y: 13, s: 2, d: 1.5 },
  { x: 12, y: 26, s: 2, d: 2.1 },
  { x: 84, y: 28, s: 2.5, d: 0.9 },
  { x: 50, y: 24, s: 2, d: 2.4 },
];

export function Stars({ count = STARS.length }: { count?: number }) {
  return (
    <div className="stars" aria-hidden="true">
      {STARS.slice(0, count).map((s, i) => (
        <span
          key={i}
          className="stars__dot"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }}
        />
      ))}
    </div>
  );
}

/** スタンプの丸（押し込んだようなエンボス）。on=獲得済み（銅色＋白いクラウン） */
export function StampSlot({ on, size = 28 }: { on: boolean; size?: number }) {
  return (
    <span className={`slot${on ? ' is-on' : ''}`}>
      <CrownFill size={size} />
    </span>
  );
}

/** 「+1」のメダル：波形の縁・クラウン・光の筋（素材ボードのスタンプ獲得画面） */
export function Medal({ label = '+1' }: { label?: string }) {
  const pts: string[] = [];
  for (let d = 0; d < 360; d += 2) {
    const t = (d * Math.PI) / 180;
    const r = 66 + 4.2 * Math.cos(t * 22);
    pts.push(`${i0(d)}${(Math.cos(t) * r).toFixed(2)} ${(Math.sin(t) * r).toFixed(2)}`);
  }
  return (
    <div className="medal">
      <div className="medal__rays" aria-hidden="true" />
      <svg viewBox="-80 -80 160 160" width="100%" height="100%" role="img" aria-label={`スタンプ ${label}`}>
        <defs>
          <radialGradient id="md-face" cx="0.4" cy="0.3" r="0.9">
            <stop offset="0" stopColor="#fff6ea" />
            <stop offset="1" stopColor="#f2cdb0" />
          </radialGradient>
          <linearGradient id="md-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f0cf94" />
            <stop offset="1" stopColor="#b98445" />
          </linearGradient>
        </defs>
        <path d={`${pts.join(' ')} Z`} fill="url(#md-face)" stroke="#e8b98f" strokeWidth="1.2" />
        <circle r="56" fill="none" stroke="url(#md-gold)" strokeWidth="1.6" />
        <circle r="52" fill="none" stroke="url(#md-gold)" strokeWidth="0.7" />
        <g transform="translate(0 -12)" fill="url(#md-gold)">
          <circle cx="0" cy="-27" r="3.4" />
          <circle cx="-27" cy="-17" r="3" />
          <circle cx="27" cy="-17" r="3" />
          <path d="M-31 14 -29 -14 -14 2 0 -24 14 2 29 -14 31 14Z" />
          <rect x="-33" y="17" width="66" height="6" rx="2" />
        </g>
        <text y="50" textAnchor="middle" fontSize="22" fill="#5b4430" fontFamily="'Noto Sans JP', sans-serif" fontWeight="500">
          {label}
        </text>
      </svg>
    </div>
  );
}

function i0(d: number): string {
  return d === 0 ? 'M' : 'L';
}
