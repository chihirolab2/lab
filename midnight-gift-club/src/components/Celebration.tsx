import { useNavigate } from 'react-router-dom';
import { bowPink, catArt, premiumBox, ribbonSwirl } from '../assets/art';
import { Medal, Stars } from './GiftBox';
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
        <Medal />
        <p className="celebrate__lead">スタンプを獲得しました！</p>
        <p className="celebrate__count">
          <b>{c.count}</b> / {state.stampCard.target}
        </p>
        <div className="celebrate__cat">
          <div className="bubble">
            あと{remaining}個で
            <small>プレミアムチケット♡</small>
          </div>
          <img src={catArt} alt="" draggable={false} />
        </div>
        <button className="btn btn--glass celebrate__ok" onClick={actions.dismissCelebration}>
          OK
        </button>
        <img className="celebrate__ribbon celebrate__ribbon--l" src={bowPink} alt="" draggable={false} />
        <img className="celebrate__ribbon celebrate__ribbon--r" src={ribbonSwirl} alt="" draggable={false} />
      </div>
    );
  }

  const premium = state.tickets.find((t) => t.id === c.ticketId);
  return (
    <div className="celebrate celebrate--premium" role="dialog" aria-modal="true" aria-label="プレミアムチケット獲得">
      <Stars />
      <p className="celebrate__eyebrow">スタンプ 10 / 10 達成！</p>
      <p className="celebrate__lead">プレミアムチケットを獲得！</p>
      <img className="celebrate__premium" src={premiumBox} alt="PREMIUM TICKET" draggable={false} />
      {premium && <p className="celebrate__sub celebrate__premium-title">{premium.title}</p>}
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
