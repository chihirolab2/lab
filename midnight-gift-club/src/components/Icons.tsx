import type { ReactNode } from 'react';
import type { ThemeKey } from '../types';

interface IconProps {
  size?: number;
  className?: string;
}

function Svg({ size = 24, className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export const HomeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 11 12 4l8.5 7" />
    <path d="M5.5 9.8V20h13V9.8" />
    <path d="M10 20v-5.5h4V20" />
  </Svg>
);

export const TicketIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h15A1.5 1.5 0 0 1 21 8.5V10a2 2 0 0 0 0 4v1.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 15.5V14a2 2 0 0 0 0-4Z" />
    <path d="M14.5 7v2M14.5 11v2M14.5 15v2" />
  </Svg>
);

export const SendIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20.5 3.5 10 14" />
    <path d="M20.5 3.5 14 20.5l-4-6.5-6.5-4Z" />
  </Svg>
);

export const CrownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m4 8 3.5 3.5L12 5l4.5 6.5L20 8l-1.5 10h-13Z" />
    <path d="M6 20.5h12" />
  </Svg>
);

export const BellIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2H4.5Z" />
    <path d="M10 20.5a2 2 0 0 0 4 0" />
  </Svg>
);

export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const BackIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m14.5 5-7 7 7 7" />
  </Svg>
);

export const ChevronIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9.5 5 7 7-7 7" />
  </Svg>
);

export const PlusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);

export const CalendarIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
    <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
  </Svg>
);

export const InfoIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5M12 8v.01" />
  </Svg>
);

export const GiftIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="9.5" width="16" height="10.5" rx="1.5" />
    <path d="M3 9.5h18V7H3zM12 7v13" />
    <path d="M12 7c-1-3.5-5-3.5-5-1.2 0 1.2 2.2 1.2 5 1.2Zm0 0c1-3.5 5-3.5 5-1.2 0 1.2-2.2 1.2-5 1.2Z" />
  </Svg>
);

export const HeartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20Z" />
  </Svg>
);

export const HistoryIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12a8 8 0 1 0 2.5-5.8L4 8.5" />
    <path d="M4 4.5v4h4M12 8v4.5l3 1.8" />
  </Svg>
);

export const UserIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8.5" r="3.8" />
    <path d="M4.5 20c.8-4 3.8-6 7.5-6s6.7 2 7.5 6" />
  </Svg>
);

export const EditIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m4 20 1-4.2L16.5 4.3a1.8 1.8 0 0 1 2.5 0l.7.7a1.8 1.8 0 0 1 0 2.5L8.2 19Z" />
    <path d="m14.5 6.5 3 3" />
  </Svg>
);

/* ---- カテゴリ別のチケット絵柄 ---- */
const CupIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 10h11v4.5a4.5 4.5 0 0 1-4.5 4.5h-2A4.5 4.5 0 0 1 5 14.5Z" />
    <path d="M16 11.5h1.8a2.2 2.2 0 0 1 0 4.4H15.5" />
    <path d="M8.5 3.5c-.8 1 .8 1.8 0 3M12 3.5c-.8 1 .8 1.8 0 3" />
    <path d="M4 21h13" />
  </Svg>
);

export const PlaneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M21 4.2c.4-.8-.6-1.8-1.4-1.4L15 5.5 6 3.8 4.8 5l6.2 3.7-3.3 3.3-3.2-.5L3.3 12.8l3.4 1.5 1.5 3.4 1.3-1.2-.5-3.2 3.3-3.3L16 20.2l1.2-1.2L15.5 10l4.5-4.6Z" />
  </Svg>
);

const FilmIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="8" width="17" height="12" rx="1.5" />
    <path d="m3.8 8 15.5-4 .6 2.7L4.4 10.7ZM8.5 5.2l1.2 3M13.5 4l1.2 3" />
    <path d="M3.5 13h17" />
  </Svg>
);

export const ForkIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 3v7a2 2 0 0 0 2 2v9M11 3v7a2 2 0 0 1-2 2M5 3v5" />
    <path d="M17 21V3c-2.2 1.2-3.5 3.8-3.5 7 0 1.7.9 2.6 2 2.8" />
  </Svg>
);

const LeafIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 19C4 11 9 5 20 4c0 9-4.5 15-12 14.5" />
    <path d="M5 19c3-5 6-7.5 10-9.5" />
  </Svg>
);

const LockIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5M12 14.5v2" />
  </Svg>
);

export function ThemeIcon({ theme, size = 36, className }: { theme: ThemeKey; size?: number; className?: string }) {
  const p = { size, className };
  switch (theme) {
    case 'CAFE':
      return <CupIcon {...p} />;
    case 'TRAVEL':
      return <PlaneIcon {...p} />;
    case 'MOVIE':
      return <FilmIcon {...p} />;
    case 'DINNER':
      return <ForkIcon {...p} />;
    case 'RELAX':
      return <LeafIcon {...p} />;
    case 'SECRET':
      return <LockIcon {...p} />;
    case 'PREMIUM':
      return <CrownIcon {...p} />;
  }
}

export const StarIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 3.8 2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8Z" />
  </Svg>
);

/** スタンプ用の塗りのクラウン（先端に玉つき） */
export function CrownFill({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <circle cx="12" cy="4.6" r="1.5" />
      <circle cx="3.6" cy="8.2" r="1.3" />
      <circle cx="20.4" cy="8.2" r="1.3" />
      <path d="M4.2 9.2 8 12.3 12 6l4 6.3 3.8-3.1-1.6 8H5.8Z" />
      <rect x="5.6" y="18.6" width="12.8" height="2" rx="1" />
    </svg>
  );
}
