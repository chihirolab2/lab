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

/** HOME の主役：夜景の中に浮かぶギフトボックス */
export function GiftBox() {
  return (
    <div className="giftbox" aria-hidden="true">
      <div className="giftbox__glow" />
      <svg viewBox="0 0 220 200" width="100%" height="100%">
        <defs>
          <linearGradient id="gb-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F4DCD8" />
            <stop offset="1" stopColor="#D9A9B6" />
          </linearGradient>
          <linearGradient id="gb-lid" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F8E6E2" />
            <stop offset="1" stopColor="#E3B8C4" />
          </linearGradient>
          <linearGradient id="gb-ribbon" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#EFC7D0" />
            <stop offset="1" stopColor="#C98CA0" />
          </linearGradient>
        </defs>
        <ellipse cx="110" cy="186" rx="82" ry="9" fill="#000" opacity=".22" />
        <rect x="42" y="94" width="136" height="88" rx="8" fill="url(#gb-body)" />
        <rect x="102" y="94" width="16" height="88" fill="url(#gb-ribbon)" />
        <rect x="34" y="68" width="152" height="34" rx="8" fill="url(#gb-lid)" />
        <rect x="102" y="68" width="16" height="34" fill="url(#gb-ribbon)" />
        <path d="M110 68C84 24 40 38 56 62c10 14 40 10 54 6Z" fill="url(#gb-ribbon)" />
        <path d="M110 68c26-44 70-30 54-6-10 14-40 10-54 6Z" fill="url(#gb-ribbon)" />
        <path d="M110 68C92 48 70 48 66 58" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="2" strokeLinecap="round" />
        <circle cx="110" cy="68" r="9" fill="#C98CA0" />
        <circle cx="106" cy="65" r="3" fill="#fff" opacity=".5" />
      </svg>
    </div>
  );
}
