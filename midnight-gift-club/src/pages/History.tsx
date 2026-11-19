import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Layout';
import { TicketCard, formatDate } from '../components/TicketCard';
import { requestCategoryLabel } from '../data/themes';
import { StatusChip } from './Request';
import { useApp } from '../store';

export function History() {
  const navigate = useNavigate();
  const { state } = useApp();
  const used = state.tickets.filter((t) => t.status === 'used').sort((a, b) => (b.usedAt ?? '').localeCompare(a.usedAt ?? ''));
  const requests = state.requests.filter((r) => r.status !== 'PENDING');

  return (
    <Screen tone="blush" title="履歴" back="/menu" hideTabs>
      <section className="stack">
        <h2 className="section-title">使用済みチケット</h2>
        {used.length === 0 && <p className="empty">まだ使ったチケットはありません。</p>}
        {used.map((t) => (
          <div key={t.id} className="hist">
            <TicketCard ticket={t} onClick={() => navigate(`/tickets/${t.id}`)} />
            <small>使用日：{formatDate(t.usedAt)}</small>
          </div>
        ))}

        <h2 className="section-title">過去のリクエスト</h2>
        {requests.length === 0 && <p className="empty">対応済みのリクエストはまだありません。</p>}
        {requests.map((r) => (
          <button key={r.id} className="card row" onClick={() => navigate(`/request/${r.id}`)}>
            <span className="row__main">
              <span className="row__meta">{requestCategoryLabel(r.category)}</span>
              <strong>{r.title}</strong>
            </span>
            <StatusChip status={r.status} />
          </button>
        ))}
      </section>
    </Screen>
  );
}
