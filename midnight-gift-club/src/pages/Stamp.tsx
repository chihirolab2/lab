import { useNavigate } from 'react-router-dom';
import { CrownIcon, GiftIcon } from '../components/Icons';
import { Screen } from '../components/Layout';
import { dateLabel } from './Request';
import { useApp } from '../store';

export function Stamp() {
  const navigate = useNavigate();
  const { state } = useApp();
  const { stampCard, stampEvents, tickets } = state;
  const remaining = stampCard.target - stampCard.count;
  const events = stampEvents.slice(0, 8);

  return (
    <Screen tone="day" title="スタンプカード" actions>
      <div className="stamp">
        <div className="stamp__count" aria-label={`${stampCard.count}個 / ${stampCard.target}個`}>
          <b>{stampCard.count}</b>
          <span>/ {stampCard.target}</span>
        </div>
        <p className="muted center">あと{remaining}個でプレミアムチケット！</p>

        <div className="stamp__grid" role="img" aria-label={`スタンプ ${stampCard.count}個`}>
          {Array.from({ length: stampCard.target }).map((_, i) => (
            <span key={i} className={`stamp__slot${i < stampCard.count ? ' is-on' : ''}`}>
              <CrownIcon size={26} />
            </span>
          ))}
        </div>

        <div className="card reward">
          <GiftIcon size={34} />
          <div>
            <small>NEXT REWARD</small>
            <strong>プレミアムチケット</strong>
            <p>{stampCard.target}個で特別なチケットをプレゼント♡</p>
          </div>
        </div>

        {stampCard.cardNo > 1 && <p className="muted small center">これまでに {stampCard.cardNo - 1} 枚のカードを達成しました。</p>}

        <div className="section-head">
          <h2>最近のスタンプ</h2>
          <button className="link-btn" onClick={() => navigate('/history')}>
            履歴へ
          </button>
        </div>
        {events.length === 0 ? (
          <p className="empty">チケットを1回使うと、スタンプが1個たまります。</p>
        ) : (
          <ul className="list">
            {events.map((e) => (
              <li key={e.id}>
                <CrownIcon size={18} />
                <span>{tickets.find((t) => t.id === e.ticketId)?.title ?? 'チケット'}</span>
                <small>{dateLabel(e.earnedAt)}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Screen>
  );
}
