import type { CSSProperties } from 'react';
import { getProfile, splitCode } from '../../data/catalog';
import type { TypeCode } from '../../data/model';
import { Icon } from '../ui/Icon';
import { CharacterArt } from './CharacterArt';

/** タイプコードからキャラクターを描画 */
export function Portrait({ code, crop = 'bust', silhouette, silhouetteColor, className }: { code: TypeCode; crop?: 'bust' | 'face' | 'hero'; silhouette?: boolean; silhouetteColor?: string; className?: string }) {
  const p = getProfile(code);
  return (
    <CharacterArt
      spec={p.base.character}
      at={p.at}
      cs={p.cs}
      crop={crop}
      silhouette={silhouette}
      silhouetteColor={silhouetteColor ?? mix(p.group.color, '#d9d4f0', 0.32)}
      className={className}
      title={silhouette ? '未発見のタイプ' : `${p.code} ${p.title}`}
    />
  );
}

/** 丸型アバター（グループ色の淡い背景） */
export function TypeAvatar({
  code,
  size = 64,
  locked,
  ring = true,
}: {
  code: TypeCode;
  size?: number;
  locked?: boolean;
  ring?: boolean;
}) {
  const p = getProfile(code);
  return (
    <span
      className={`avatar ${ring ? 'avatar--ring' : ''}`}
      style={{ width: size, height: size, '--g': p.group.color, '--g-soft': p.group.soft, '--g-tint': p.group.tint } as CSSProperties}
    >
      <Portrait code={code} crop="face" silhouette={locked} className="avatar__art" />
    </span>
  );
}

/** 図鑑カード */
export function TypeCard({ code, locked, onClick, showVariant = true }: { code: TypeCode; locked: boolean; onClick: () => void; showVariant?: boolean }) {
  const p = getProfile(code);
  const { base, variant } = splitCode(code);
  return (
    <button
      className={`type-card ${locked ? 'is-locked' : ''}`}
      onClick={onClick}
      style={{ '--g': p.group.color, '--g-soft': p.group.soft, '--g-tint': p.group.tint } as CSSProperties}
      aria-label={locked ? `${base} ${variant} 未発見` : `${code} ${p.title}`}
    >
      <span className="type-card__art">
        <Portrait code={code} crop="bust" silhouette={locked} />
      </span>
      {locked && (
        <span className="type-card__lock">
          <Icon name="lock" size={11} stroke={2} />
        </span>
      )}
      <span className="type-card__label">
        <b>{base}</b>
        {showVariant && <small>{variant.split('').join('·')}</small>}
      </span>
    </button>
  );
}

export function CodeLabel({ code, size = 'md' }: { code: TypeCode; size?: 'md' | 'lg' | 'xl' }) {
  const { base, variant } = splitCode(code);
  return (
    <span className={`code-label code-label--${size}`}>
      {base}
      <small>-{variant}</small>
    </span>
  );
}

/** 2色を混ぜる（#rrggbb） */
function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (n: number, s: number) => (n >> s) & 255;
  const c = [16, 8, 0].map((s) => Math.round(ch(pa, s) * t + ch(pb, s) * (1 - t)));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
