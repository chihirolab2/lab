import { useNavigate } from 'react-router-dom';
import { GiftBox, Stars } from '../components/GiftBox';
import { ChevronIcon, CrownIcon } from '../components/Icons';
import { Screen } from '../components/Layout';
import { TicketCard } from '../components/TicketCard';
import { isExpired, useApp } from '../store';

export function MiniStamps({ count, target }: { count: number; target: number }) {
  return (
    <div className="mini-stamps" aria-hidden="true">
      {Array.from({ length: target }).map((_, i) => (
        <span key={i} className={`mini-stamps__dot${i < count ? ' is-on' : ''}`}>
          <CrownIcon size={14} />
        </span>
      ))}
    </div>
  );
}

export function Home() {
  const navigate = useNavigate();
  const { state, pendingRequestCount, unreadCount } = useApp();
  const { stampCard, tickets, role } = state;
  const remaining = stampCard.target - stampCard.count;
  const recent = [...tickets].filter((t) => t.status === 'unused' && !isExpired(t)).sort((a, b) => b.serialNo - a.serialNo)[0];
  const unusedCount = tickets.filter((t) => t.status === 'unused' && !isExpired(t)).length;

  return (
    <Screen tone="night" actions>
      <div className="home">
        <Stars />
        <div className="home__skyline" aria-hidden="true" />
        <div className="home__hero">
          <p className="script">Welcome</p>
          <p className="home__lead">
            {role === 'giver' ? 'ふたりのチケットブックへ。' : 'いつもありがとう。'}
            <br />
            {role === 'giver' ? '今日は、どんなチケットを贈ろう？' : 'これからも、ずっと一緒に。'}
          </p>
        </div>

        <GiftBox />

        {role === 'giver' && pendingRequestCount > 0 && (
          <button className="card card--accent home__notice" onClick={() => navigate('/request')}>
            <span className="home__notice-dot" />
            <span>
              <strong>新着リクエスト {pendingRequestCount}件</strong>
              <small>内容を確認して、チケットにしてあげましょう</small>
            </span>
            <ChevronIcon size={18} />
          </button>
        )}
        {role === 'receiver' && unreadCount > 0 && (
          <button className="card card--accent home__notice" onClick={() => navigate('/notifications')}>
            <span className="home__notice-dot" />
            <span>
              <strong>お知らせ {unreadCount}件</strong>
              <small>新しいチケットや返信が届いています</small>
            </span>
            <ChevronIcon size={18} />
          </button>
        )}

        <section className="card card--glass home__stamp" aria-label="スタンプ進捗">
          <div className="home__stamp-head">
            <span className="eyebrow">STAMP</span>
            <span className="home__count">
              <b>{stampCard.count}</b> / {stampCard.target}
            </span>
          </div>
          <MiniStamps count={stampCard.count} target={stampCard.target} />
          <button className="pill" onClick={() => navigate('/stamp')}>
            次の特典まで あと{remaining}個
          </button>
        </section>

        <section className="home__recent" aria-label="最近のチケット">
          <div className="section-head">
            <h2>最近のチケット</h2>
            <button className="link-btn" onClick={() => navigate('/tickets')}>
              すべて見る（{unusedCount}枚）
            </button>
          </div>
          {recent ? (
            <TicketCard ticket={recent} onClick={() => navigate(`/tickets/${recent.id}`)} />
          ) : (
            <p className="muted">使えるチケットはありません。</p>
          )}
        </section>
      </div>
    </Screen>
  );
}
