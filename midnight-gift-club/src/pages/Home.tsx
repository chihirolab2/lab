import { useNavigate } from 'react-router-dom';
import { heroGift } from '../assets/art';
import { Stars, StampSlot } from '../components/GiftBox';
import { ChevronIcon } from '../components/Icons';
import { Screen } from '../components/Layout';
import { TicketCard } from '../components/TicketCard';
import { isExpired, useApp } from '../store';

export function MiniStamps({ count, target }: { count: number; target: number }) {
  return (
    <div className="mini-stamps" aria-hidden="true">
      {Array.from({ length: target }).map((_, i) => (
        <StampSlot key={i} on={i < count} size={14} />
      ))}
    </div>
  );
}

export function Home() {
  const navigate = useNavigate();
  const { state, pendingRequestCount, unreadCount } = useApp();
  const { stampCard, tickets, role } = state;
  const remaining = stampCard.target - stampCard.count;
  const usable = tickets.filter((t) => t.status === 'unused' && !isExpired(t));
  const recent = [...usable].sort((a, b) => b.serialNo - a.serialNo)[0];

  return (
    <Screen tone="night" actions>
      <div className="home">
        <div className="home__hero">
          <img className="home__hero-img" src={heroGift} alt="" draggable={false} />
          <Stars count={7} />
          <div className="home__hero-text">
            <p className="script">Welcome</p>
            <p className="home__lead">
              {role === 'giver' ? 'ふたりのチケットブックへ。' : 'いつもありがとう。'}
              <br />
              {role === 'giver' ? '今日は、どんなチケットを贈ろう？' : 'これからも、ずっと一緒に。'}
            </p>
          </div>
        </div>

        <div className="home__cards">
          {role === 'giver' && pendingRequestCount > 0 && (
            <button className="glass-card home__notice" onClick={() => navigate('/request')}>
              <span className="home__notice-dot" />
              <span>
                <strong>新着リクエスト {pendingRequestCount}件</strong>
                <small>内容を確認して、チケットにしてあげましょう</small>
              </span>
              <ChevronIcon size={18} />
            </button>
          )}
          {role === 'receiver' && unreadCount > 0 && (
            <button className="glass-card home__notice" onClick={() => navigate('/notifications')}>
              <span className="home__notice-dot" />
              <span>
                <strong>お知らせ {unreadCount}件</strong>
                <small>新しいチケットや返信が届いています</small>
              </span>
              <ChevronIcon size={18} />
            </button>
          )}

          <section className="frost home__stamp" aria-label="スタンプ進捗">
            <p className="home__stamp-title">スタンプ</p>
            <p className="home__count">
              <b>{stampCard.count}</b>
              <span> / {stampCard.target}</span>
            </p>
            <MiniStamps count={stampCard.count} target={stampCard.target} />
            <button className="pill" onClick={() => navigate('/stamp')}>
              次の特典まで あと{remaining}個 ♡
            </button>
          </section>

          <section className="frost home__recent" aria-label="最近のチケット">
            <button className="home__recent-head" onClick={() => navigate('/tickets')}>
              <span>最近のチケット</span>
              <ChevronIcon size={16} />
            </button>
            {recent ? (
              <TicketCard ticket={recent} onClick={() => navigate(`/tickets/${recent.id}`)} />
            ) : (
              <p className="muted">使えるチケットはありません。</p>
            )}
          </section>
        </div>
      </div>
    </Screen>
  );
}
