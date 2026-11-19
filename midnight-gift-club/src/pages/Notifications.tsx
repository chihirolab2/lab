import { useNavigate } from 'react-router-dom';
import { BellIcon } from '../components/Icons';
import { Screen } from '../components/Layout';
import { dateLabel } from './Request';
import { useApp } from '../store';
import type { AppNotification } from '../types';

export function Notifications() {
  const navigate = useNavigate();
  const { myNotifications, state, actions } = useApp();

  const open = (n: AppNotification) => {
    actions.readNotification(n.id);
    if (!n.relatedId) return;
    if (n.type.startsWith('REQUEST')) {
      if (state.requests.some((r) => r.id === n.relatedId)) navigate(`/request/${n.relatedId}`);
    } else if (state.tickets.some((t) => t.id === n.relatedId)) {
      navigate(`/tickets/${n.relatedId}`);
    }
  };

  return (
    <Screen tone="blush" title="お知らせ" back={-1} hideTabs>
      {myNotifications.length > 0 && (
        <button className="link-btn right" onClick={() => actions.readAllNotifications()}>
          すべて既読にする
        </button>
      )}
      <div className="stack">
        {myNotifications.length === 0 && <p className="empty">新しいお知らせはありません。</p>}
        {myNotifications.map((n) => (
          <button key={n.id} className={`card row notif${n.readAt ? '' : ' is-unread'}`} onClick={() => open(n)}>
            <span className="notif__icon">
              <BellIcon size={20} />
            </span>
            <span className="row__main">
              <strong>{n.title}</strong>
              <span className="row__meta">{n.body}</span>
            </span>
            <small>{dateLabel(n.createdAt)}</small>
          </button>
        ))}
      </div>
      <p className="muted small center">※ 現在はアプリ内通知のみです。スマホへのプッシュ通知は後続対応です。</p>
    </Screen>
  );
}
