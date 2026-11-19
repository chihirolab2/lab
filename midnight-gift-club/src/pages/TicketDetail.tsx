import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CalendarIcon, EditIcon, InfoIcon } from '../components/Icons';
import { Screen, Sheet } from '../components/Layout';
import { TicketCard, formatDate } from '../components/TicketCard';
import { isExpired, useApp } from '../store';

export function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const [confirm, setConfirm] = useState(false);
  const ticket = state.tickets.find((t) => t.id === id);

  if (!ticket) {
    return (
      <Screen tone="day" title="チケット" back="/tickets">
        <p className="empty">チケットが見つかりませんでした。</p>
      </Screen>
    );
  }

  const used = ticket.status === 'used';
  const expired = isExpired(ticket);
  const isReceiver = state.role === 'receiver';

  return (
    <Screen tone="day" title="チケット" back="/tickets" hideTabs>
      <div className="detail">
        <TicketCard ticket={ticket} hero />
        <p className="detail__desc">{ticket.description}</p>

        <dl className="info card">
          <div>
            <dt>
              <CalendarIcon size={18} /> 有効期限
            </dt>
            <dd>{ticket.expiryDate ? `${formatDate(ticket.expiryDate)}まで` : 'なし'}</dd>
          </div>
          <div>
            <dt>
              <InfoIcon size={18} /> 利用条件
            </dt>
            <dd>{ticket.terms || '特になし！'}</dd>
          </div>
          {used && ticket.usedAt && (
            <div>
              <dt>
                <CalendarIcon size={18} /> 使用日
              </dt>
              <dd>{formatDate(ticket.usedAt)}</dd>
            </div>
          )}
        </dl>

        {isReceiver ? (
          used ? (
            <p className="notice">このチケットは使用済みです。</p>
          ) : expired ? (
            <p className="notice notice--warn">有効期限が過ぎています。贈り主に相談してみてね。</p>
          ) : (
            <>
              <button className="btn btn--primary" onClick={() => setConfirm(true)}>
                このチケットを使う
              </button>
              <button className="link-btn center" onClick={() => navigate('/tickets')}>
                あとで使う
              </button>
            </>
          )
        ) : (
          !used && (
            <>
              <button className="btn btn--primary" onClick={() => navigate(`/tickets/${ticket.id}/edit`)}>
                <EditIcon size={18} /> このチケットを編集する
              </button>
              <p className="muted small center">チケットを使うのは受け取り側の画面です（MY PAGE で切り替えできます）。</p>
            </>
          )
        )}
      </div>

      {confirm && (
        <Sheet label="チケットを使う確認" onClose={() => setConfirm(false)}>
          <h2 className="sheet__title">このチケットを使いますか？</h2>
          <p className="sheet__text">
            「{ticket.title}」を使うと、使用済みになり元に戻せません。
            {!ticket.isPremium && <><br />使うとスタンプが1個たまります。</>}
          </p>
          <button
            className="btn btn--primary"
            onClick={() => {
              actions.useTicket(ticket.id);
              setConfirm(false);
              navigate('/tickets');
            }}
          >
            使う
          </button>
          <button className="btn btn--text" onClick={() => setConfirm(false)}>
            やめる
          </button>
        </Sheet>
      )}
    </Screen>
  );
}
