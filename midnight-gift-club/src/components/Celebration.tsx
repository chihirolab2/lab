import { useNavigate } from 'react-router-dom';
import { CrownIcon } from './Icons';
import { Stars } from './GiftBox';
import { TicketCard } from './TicketCard';
import { useApp } from '../store';

export function CelebrationOverlay() {
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const c = state.celebration;
  if (!c) return null;

  if (c.kind === 'stamp') {
    const remaining = state.stampCard.target - c.count;
    return (
      <div className="celebrate" role="dialog" aria-modal="true" aria-label="スタンプ獲得">
        <Stars />
        <p className="celebrate__eyebrow">チケット使用完了！</p>
        <div className="medal">
          <CrownIcon size={64} />
          <span>+1</span>
        </div>
        <p className="celebrate__lead">スタンプを獲得しました！</p>
        <p className="celebrate__count">
          <b>{c.count}</b> / {state.stampCard.target}
        </p>
        <p className="celebrate__sub">あと{remaining}個でプレミアムチケット♡</p>
        <button className="btn btn--gold" onClick={actions.dismissCelebration}>
          OK
        </button>
      </div>
    );
  }

  const premium = state.tickets.find((t) => t.id === c.ticketId);
  return (
    <div className="celebrate celebrate--premium" role="dialog" aria-modal="true" aria-label="プレミアムチケット獲得">
      <Stars />
      <p className="celebrate__eyebrow">スタンプ 10 / 10 達成！</p>
      <p className="celebrate__lead">プレミアムチケットを獲得！</p>
      {premium && <TicketCard ticket={premium} hero />}
      <p className="celebrate__sub">新しいスタンプカードは 0 / 10 からスタートします。</p>
      <button
        className="btn btn--gold"
        onClick={() => {
          actions.dismissCelebration();
          if (premium) navigate(`/tickets/${premium.id}`);
        }}
      >
        チケットを見る
      </button>
      <button className="btn btn--text btn--onnight" onClick={actions.dismissCelebration}>
        閉じる
      </button>
    </div>
  );
}
