import { useState, type CSSProperties } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TypeCard } from '../components/character/TypeVisuals';
import { Icon } from '../components/ui/Icon';
import { Card, ProgressBar, ScreenHeader, Segment } from '../components/ui/primitives';
import { BASE_ORDER, BASE_TYPES } from '../data/baseTypes';
import { makeCode } from '../data/catalog';
import { GROUP_ORDER, GROUPS } from '../data/groups';
import type { AT, CS, GroupId } from '../data/model';
import { collectionStats } from '../logic/collection';
import { useStore } from '../store/AppStore';

type GroupFilter = 'all' | GroupId;
type VariantFilter = 'all' | `${AT}${CS}`;

const VARIANTS: `${AT}${CS}`[] = ['AC', 'AS', 'TC', 'TS'];

export function ZukanScreen() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const { profile, isDiscovered } = useStore();
  const group = (params.get('g') as GroupFilter) || 'all';
  const [variant, setVariant] = useState<VariantFilter>('all');
  const [onlyFound, setOnlyFound] = useState(false);
  const stats = collectionStats(profile.discovered);

  const bases = BASE_ORDER.filter((b) => group === 'all' || BASE_TYPES[b].group === group);
  const variants = variant === 'all' ? VARIANTS : [variant];

  return (
    <div className="screen zukan">
      <ScreenHeader
        title="図鑑"
        sub={
          <span>
            <b>{stats.found}</b> / {stats.total} タイプ発見
          </span>
        }
      />
      <div className="zukan__progress">
        <ProgressBar value={stats.found} max={stats.total} thin />
      </div>

      <Segment
        ariaLabel="グループで絞り込み"
        value={group}
        onChange={(g) => setParams(g === 'all' ? {} : { g }, { replace: true })}
        items={[{ value: 'all', label: 'すべて' }, ...GROUP_ORDER.map((g) => ({ value: g, label: GROUPS[g].name, color: GROUPS[g].color }))]}
      />

      <div className="zukan__sub-filter">
        <Segment
          variant="tabs"
          ariaLabel="A/T・C/S で絞り込み"
          value={variant}
          onChange={setVariant}
          items={[{ value: 'all', label: '64' }, ...VARIANTS.map((v) => ({ value: v, label: v.split('').join('·') }))]}
        />
        <button className={`toggle-chip ${onlyFound ? 'is-on' : ''}`} onClick={() => setOnlyFound((v) => !v)} aria-pressed={onlyFound}>
          <Icon name="check-circle" size={15} />
          発見済み
        </button>
      </div>

      {group !== 'all' && (
        <p className="zukan__group-desc" style={{ '--g': GROUPS[group].color } as CSSProperties}>
          {GROUPS[group].description}
        </p>
      )}

      <div className="zukan__grid">
        {bases.flatMap((b) =>
          variants.map((v) => {
            const code = makeCode(b, v[0] as AT, v[1] as CS);
            const found = isDiscovered(code);
            if (onlyFound && !found) return null;
            return <TypeCard key={code} code={code} locked={!found} onClick={() => nav(`/type/${code}`)} />;
          }),
        )}
      </div>

      {onlyFound && profile.discovered.length === 0 && <p className="empty">まだ発見したタイプはありません。</p>}

      <Card className="zukan__hint" onClick={() => nav('/complete')}>
        <Icon name="crown" size={20} className="milestone-banner__icon" />
        <span>
          診断やともだち追加で、図鑑がうまっていきます。
          <br />
          <b>コンプリートまで あと{stats.remaining}タイプ</b>
        </span>
        <Icon name="chevron-right" size={18} />
      </Card>
    </div>
  );
}
