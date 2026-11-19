import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '../components/Icons';
import { Screen } from '../components/Layout';
import { TicketCard } from '../components/TicketCard';
import { isExpired, useApp } from '../store';

type Filter = 'all' | 'unused' | 'used' | 'premium';
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'unused', label: '未使用' },
  { key: 'used', label: '使用済み' },
  { key: 'premium', label: 'プレミアム' },
];

export function Tickets() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [filter, setFilter] = useState<Filter>('all');

  const list = state.tickets
    .filter((t) => {
      if (filter === 'unused') return t.status === 'unused';
      if (filter === 'used') return t.status === 'used';
      if (filter === 'premium') return t.isPremium;
      return true;
    })
    // 未使用 → 使用済みの順、同じ中では新しい番号が上
    .sort((a, b) => Number(a.status === 'used') - Number(b.status === 'used') || b.serialNo - a.serialNo);

  return (
    <Screen tone="dusk" title="チケット一覧" actions>
      <div className="segmented" role="tablist" aria-label="絞り込み">
        {FILTERS.map((f) => (
          <button key={f.key} role="tab" aria-selected={filter === f.key} className={filter === f.key ? 'is-active' : ''} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="stack">
        {list.map((t) => (
          <TicketCard key={t.id} ticket={t} onClick={() => navigate(`/tickets/${t.id}`)} />
        ))}
        {list.length === 0 && <p className="empty">ここにはまだチケットがありません。</p>}
        {state.role === 'giver' && (
          <button className="btn btn--glass" onClick={() => navigate('/tickets/new')}>
            <PlusIcon size={18} /> チケットを追加する
          </button>
        )}
      </div>
      {filter === 'unused' && list.some(isExpired) && <p className="muted small">期限切れのチケットは使えません。贈り主が期限を編集できます。</p>}
    </Screen>
  );
}
