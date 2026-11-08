import { useEffect, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, type IconName } from './Icon';

/* ---------- Buttons ---------- */

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  arrow?: boolean;
  variant?: 'primary' | 'lavender' | 'ghost' | 'soft';
  size?: 'lg' | 'md' | 'sm';
  block?: boolean;
}

export function Button({ children, arrow = false, variant = 'primary', size = 'lg', block, className = '', ...rest }: BtnProps) {
  return (
    <button className={`btn btn--${variant} btn--${size} ${block ? 'btn--block' : ''} ${className}`} {...rest}>
      <span className="btn__label">{children}</span>
      {arrow && (
        <span className="btn__arrow">
          <Icon name="chevron-right" size={size === 'sm' ? 14 : 18} stroke={2} />
        </span>
      )}
    </button>
  );
}

export function TextLink({ children, onClick, icon = 'arrow-right' }: { children: ReactNode; onClick: () => void; icon?: IconName }) {
  return (
    <button className="text-link" onClick={onClick}>
      {children}
      <Icon name={icon} size={15} stroke={1.8} />
    </button>
  );
}

export function IconButton({ icon, label, onClick, className = '', active }: { icon: IconName; label: string; onClick: () => void; className?: string; active?: boolean }) {
  return (
    <button className={`icon-btn ${active ? 'is-active' : ''} ${className}`} aria-label={label} aria-pressed={active} onClick={onClick}>
      <Icon name={icon} size={22} />
    </button>
  );
}

/* ---------- Card ---------- */

export function Card({ children, className = '', onClick, as = 'div' }: { children: ReactNode; className?: string; onClick?: () => void; as?: 'div' | 'button' | 'section' }) {
  const Tag = onClick ? 'button' : as;
  return (
    <Tag className={`card ${onClick ? 'card--tap' : ''} ${className}`} onClick={onClick}>
      {children}
    </Tag>
  );
}

/* ---------- Segment tabs / chips ---------- */

export interface SegmentItem<T extends string> {
  value: T;
  label: string;
  color?: string;
}

export function Segment<T extends string>({
  items,
  value,
  onChange,
  variant = 'chips',
  ariaLabel,
}: {
  items: SegmentItem<T>[];
  value: T;
  onChange: (v: T) => void;
  variant?: 'chips' | 'tabs';
  ariaLabel?: string;
}) {
  return (
    <div className={`segment segment--${variant}`} role="tablist" aria-label={ariaLabel}>
      {items.map((it) => (
        <button
          key={it.value}
          role="tab"
          aria-selected={it.value === value}
          className={`segment__item ${it.value === value ? 'is-active' : ''}`}
          onClick={() => onChange(it.value)}
          style={it.color && it.value === value ? ({ '--chip': it.color } as CSSProperties) : undefined}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- Progress ---------- */

export function ProgressBar({ value, max, thin }: { value: number; max: number; thin?: boolean }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`progress ${thin ? 'progress--thin' : ''}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div className="progress__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ---------- Header ---------- */

export function ScreenHeader({
  title,
  back,
  right,
  sub,
}: {
  title?: ReactNode;
  back?: boolean | (() => void);
  right?: ReactNode;
  sub?: ReactNode;
}) {
  const nav = useNavigate();
  const goBack = () => {
    if (typeof back === 'function') return back();
    if (window.history.length > 1) nav(-1);
    else nav('/');
  };
  return (
    <header className="screen-header">
      <div className="screen-header__side">
        {back && <IconButton icon="chevron-left" label="戻る" onClick={goBack} />}
      </div>
      <div className="screen-header__title">
        {title && <h1>{title}</h1>}
        {sub && <div className="screen-header__sub">{sub}</div>}
      </div>
      <div className="screen-header__side screen-header__side--right">{right}</div>
    </header>
  );
}

/* ---------- Section title ---------- */

export function SectionTitle({ children, icon = 'heart-fill', color = 'var(--lavender-400)', right }: { children: ReactNode; icon?: IconName; color?: string; right?: ReactNode }) {
  return (
    <div className="section-title">
      <span className="section-title__icon" style={{ color }}>
        <Icon name={icon} size={18} />
      </span>
      <h2>{children}</h2>
      {right && <div className="section-title__right">{right}</div>}
    </div>
  );
}

export function Tag({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span className="tag" style={color ? ({ '--tag': color } as CSSProperties) : undefined}>
      {children}
    </span>
  );
}

/* ---------- Bottom sheet ---------- */

export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label={title}>
      <div className="sheet__backdrop" onClick={onClose} />
      <div className="sheet__panel">
        <div className="sheet__grip" />
        <div className="sheet__head">
          {title && <h3>{title}</h3>}
          <IconButton icon="close" label="閉じる" onClick={onClose} />
        </div>
        <div className="sheet__body">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Decorative sparkles ---------- */

export function Sparkles({ count = 7, seed = 1, className = '' }: { count?: number; seed?: number; className?: string }) {
  const items = Array.from({ length: count }, (_, i) => {
    const r = (n: number) => {
      const x = Math.sin((i + 1) * 9301 * seed + n * 49297) * 233280;
      return x - Math.floor(x);
    };
    return { left: r(1) * 100, top: r(2) * 100, size: 6 + r(3) * 10, delay: r(4) * 3 };
  });
  return (
    <div className={`sparkles ${className}`} aria-hidden="true">
      {items.map((s, i) => (
        <span key={i} style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}>
          <Icon name="sparkle" size={s.size} />
        </span>
      ))}
    </div>
  );
}
