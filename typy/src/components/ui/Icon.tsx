import type { ReactElement, SVGProps } from 'react';

export type IconName =
  | 'home' | 'book' | 'star' | 'quiz' | 'user' | 'users' | 'chevron-right' | 'chevron-left'
  | 'arrow-right' | 'close' | 'heart' | 'heart-fill' | 'lock' | 'plus' | 'refresh' | 'check-circle'
  | 'sparkle' | 'crown' | 'edit' | 'trash' | 'share' | 'info' | 'chart' | 'history' | 'gift' | 'search';

const P: Record<IconName, ReactElement> = {
  home: <path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.5H9v5.5H5.5A1.5 1.5 0 0 1 4 19z" />,
  book: (
    <>
      <path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5z" />
      <path d="M12 6.5v13" />
    </>
  ),
  star: <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" />,
  quiz: (
    <>
      <rect x="4.5" y="3.5" width="15" height="17" rx="3" />
      <path d="m8.5 12 2.2 2.2L15.5 9.5M8.5 7h7" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20c.8-3.8 3.9-6 7.5-6s6.7 2.2 7.5 6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="9" r="3.2" />
      <path d="M3 19c.6-3.2 3-5 6-5s5.4 1.8 6 5" />
      <path d="M15.5 6.2a3 3 0 0 1 0 5.6M17.5 14.3c1.8.6 3 2.2 3.5 4.7" />
    </>
  ),
  'chevron-right': <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />,
  'chevron-left': <path d="M14.5 5.5 8 12l6.5 6.5" />,
  'arrow-right': <path d="M4.5 12h14M13.5 6.5 19 12l-5.5 5.5" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z" />,
  'heart-fill': <path fill="currentColor" d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z" />,
  lock: (
    <>
      <rect x="5.5" y="10.5" width="13" height="9.5" rx="2.5" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  refresh: (
    <>
      <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
      <path d="M19.5 4.5v4h-4" />
    </>
  ),
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.3 12.2 2.6 2.6 5-5" />
    </>
  ),
  sparkle: <path fill="currentColor" stroke="none" d="M12 2.5c.6 4.6 2.9 6.9 7.5 7.5-4.6.6-6.9 2.9-7.5 7.5-.6-4.6-2.9-6.9-7.5-7.5 4.6-.6 6.9-2.9 7.5-7.5z" />,
  crown: <path d="M4 8.5 8 12l4-6 4 6 4-3.5-1.5 9.5h-13z" />,
  edit: <path d="M5 19h3.5L18.8 8.7a2.1 2.1 0 0 0-3-3L5.5 16zM14 7.5l2.5 2.5" />,
  trash: <path d="M5 7h14M10 4h4M7 7l1 12.5h8L17 7M10.5 10.5v6M13.5 10.5v6" />,
  share: (
    <>
      <path d="M12 15V4M8 7.5 12 4l4 3.5" />
      <path d="M6 11v7.5A1.5 1.5 0 0 0 7.5 20h9a1.5 1.5 0 0 0 1.5-1.5V11" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.8v.2" />
    </>
  ),
  chart: <path d="M5 19.5V11M10 19.5V6M15 19.5v-6M20 19.5V9" />,
  history: (
    <>
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9" />
      <path d="M4.5 4.5V9H9M12 8v4.5l3 2" />
    </>
  ),
  gift: (
    <>
      <rect x="4" y="9" width="16" height="11" rx="2" />
      <path d="M3.5 9h17M12 9v11M12 9c-1.5-3-5-4-5.5-2S9 9 12 9zm0 0c1.5-3 5-4 5.5-2S15 9 12 9z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
};

interface Props extends Omit<SVGProps<SVGSVGElement>, 'stroke'> {
  name: IconName;
  size?: number;
  stroke?: number;
}

export function Icon({ name, size = 22, stroke = 1.7, ...rest }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {P[name]}
    </svg>
  );
}
