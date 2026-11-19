import { useNavigate } from 'react-router-dom';
import { ribbonSwirl } from '../assets/art';
import { StampSlot } from '../components/GiftBox';
import { CrownFill } from '../components/Icons';
import { Screen } from '../components/Layout';
import { dateLabel } from './Request';
import { useApp } from '../store';

function RewardGift() {
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
      <defs>
        <linearGradient id="rw" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0cf94" />
          <stop offset="1" stopColor="#b57c3d" />
        </linearGradient>
      </defs>
      <rect x="10" y="28" width="44" height="30" rx="3" fill="url(#rw)" />
      <rect x="6" y="20" width="52" height="12" rx="3" fill="#e8c48b" />
      <rect x="29" y="20" width="6" height="38" fill="#fff3dd" opacity=".75" />
      <path d="M32 20c-4-12-18-12-16-4 1 5 10 5 16 4Zm0 0c4-12 18-12 16-4-1 5-10 5-16 4Z" fill="none" stroke="#b57c3d" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

export function Stamp() {
  const navigate = useNavigate();
  const { state } = useApp();
  const { stampCard, stampEvents, tickets } = state;
  const remaining = stampCard.target - stampCard.count;
  const events = stampEvents.slice(0, 8);

  return (
    <Screen tone="blush" title="スタンプカード" actions>
      <img className="stamp__ribbon" src={ribbonSwirl} alt="" draggable={false} />
      <div className="stamp">
        <div className="stamp__count" aria-label={`${stampCard.count}個 / ${stampCard.target}個`}>
          <b>{stampCard.count}</b>
          <span>/ {stampCard.target}</span>
        </div>
        <p className="stamp__lead">
          あと{remaining}個で
          <br />
          プレミアムチケット！
        </p>

        <div className="stamp__grid" role="img" aria-label={`スタンプ ${stampCard.count}個`}>
          {Array.from({ length: stampCard.target }).map((_, i) => (
            <StampSlot key={i} on={i < stampCard.count} size={30} />
          ))}
        </div>

        <div className="reward">
          <RewardGift />
          <div className="reward__text">
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
                <CrownFill size={18} />
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
