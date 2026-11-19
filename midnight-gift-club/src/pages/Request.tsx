import { useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronIcon, CheckIcon } from '../components/Icons';
import { Screen, Sheet } from '../components/Layout';
import { REQUEST_CATEGORIES, requestCategoryLabel } from '../data/themes';
import { useApp } from '../store';
import type { RequestCategory, RequestStatus } from '../types';

export const STATUS_LABEL: Record<RequestStatus, string> = {
  PENDING: '受付中',
  ACCEPTED: '採用',
  ON_HOLD: '保留',
  DECLINED: '見送り',
  COMPLETED: '使用済み',
};

export function StatusChip({ status }: { status: RequestStatus }) {
  return <span className={`status status--${status}`}>{STATUS_LABEL[status]}</span>;
}

export function dateLabel(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function Request() {
  const navigate = useNavigate();
  const { state, actions, pendingRequestCount } = useApp();
  const isGiver = state.role === 'giver';
  const [tab, setTab] = useState<'send' | 'list'>(isGiver ? 'list' : 'send');

  const [category, setCategory] = useState<RequestCategory>('CAFE');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [place, setPlace] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    actions.sendRequest({ category, title: title.trim(), message: message.trim(), preferredPlace: place.trim() });
    setTitle('');
    setMessage('');
    setPlace('');
    setSent(true);
  };

  return (
    <Screen tone={tab === 'send' ? 'night' : 'day'} title="リクエスト" actions>
      <div className="segmented" role="tablist">
        <button role="tab" aria-selected={tab === 'send'} className={tab === 'send' ? 'is-active' : ''} onClick={() => setTab('send')}>
          送る
        </button>
        <button role="tab" aria-selected={tab === 'list'} className={tab === 'list' ? 'is-active' : ''} onClick={() => setTab('list')}>
          {isGiver ? '受信箱' : '送ったリクエスト'}
          {isGiver && pendingRequestCount > 0 && <span className="count-pill">{pendingRequestCount}</span>}
        </button>
      </div>

      {tab === 'send' ? (
        <form className="form" onSubmit={submit}>
          <p className="muted center">一緒にやりたいことを教えてください♡</p>
          <fieldset>
            <legend>カテゴリを選択</legend>
            <div className="chips chips--request">
              {REQUEST_CATEGORIES.map((c) => (
                <button type="button" key={c.key} className={`chip${category === c.key ? ' is-active' : ''}`} aria-pressed={category === c.key} onClick={() => setCategory(c.key)}>
                  {c.jp}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="field">
            <span>リクエスト内容 <em>必須</em></span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例：一緒に旅行に行きたい！" maxLength={40} required />
          </label>
          <label className="field">
            <span>補足（任意）</span>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="場所や希望など…" rows={3} maxLength={200} />
          </label>
          <label className="field">
            <span>行きたい場所（任意）</span>
            <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="例：京都" maxLength={40} />
          </label>
          <button className="btn btn--primary" type="submit" disabled={!title.trim()}>
            送信する
          </button>
        </form>
      ) : (
        <div className="stack">
          {state.requests.length === 0 && <p className="empty">リクエストはまだありません。</p>}
          {state.requests.map((r) => (
            <button key={r.id} className="card row" onClick={() => navigate(`/request/${r.id}`)}>
              <span className="row__main">
                <span className="row__meta">
                  {requestCategoryLabel(r.category)} ・ {dateLabel(r.createdAt)}
                </span>
                <strong>{r.title}</strong>
              </span>
              <StatusChip status={r.status} />
              <ChevronIcon size={18} />
            </button>
          ))}
        </div>
      )}

      {sent && (
        <Sheet label="送信完了" onClose={() => setSent(false)}>
          <div className="sheet__check">
            <CheckIcon size={30} />
          </div>
          <h2 className="sheet__title">リクエストを送りました</h2>
          <p className="sheet__text">返事が届くのを待っていてね。採用されるとチケットになります。</p>
          <button
            className="btn btn--primary"
            onClick={() => {
              setSent(false);
              setTab('list');
            }}
          >
            送ったリクエストを見る
          </button>
        </Sheet>
      )}
    </Screen>
  );
}

export function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const [confirmDecline, setConfirmDecline] = useState(false);
  const req = state.requests.find((r) => r.id === id);

  if (!req) {
    return (
      <Screen tone="day" title="リクエスト" back="/request">
        <p className="empty">リクエストが見つかりませんでした。</p>
      </Screen>
    );
  }

  const isGiver = state.role === 'giver';
  const open = req.status === 'PENDING' || req.status === 'ON_HOLD';

  const receiverMessage: Record<RequestStatus, string> = {
    PENDING: '送信しました。返事を待っていてね。',
    ON_HOLD: 'もう少し考えさせてね。決まったらお知らせします。',
    ACCEPTED: 'リクエストが採用されました！チケットに追加されています。',
    COMPLETED: 'このチケットはもう使いました。思い出に残るといいな。',
    DECLINED: '今回は見送りになりました。また、やりたいことを教えてね。',
  };

  return (
    <Screen tone="day" title="リクエスト" back="/request" hideTabs>
      <div className="detail">
        <div className="card info">
          <div className="row__meta">
            {requestCategoryLabel(req.category)} ・ {dateLabel(req.createdAt)}
          </div>
          <h2 className="detail__title">{req.title}</h2>
          <StatusChip status={req.status} />
          {req.message && <p className="detail__body">{req.message}</p>}
          {req.preferredPlace && <p className="detail__body">希望の場所：{req.preferredPlace}</p>}
        </div>

        {isGiver ? (
          <>
            {open && (
              <>
                <button className="btn btn--primary" onClick={() => navigate(`/tickets/new?from=${req.id}`)}>
                  採用してチケットにする
                </button>
                {req.status === 'PENDING' && (
                  <button className="btn btn--ghost" onClick={() => actions.holdOrDecline(req.id, 'ON_HOLD')}>
                    保留にする
                  </button>
                )}
                <button className="btn btn--text" onClick={() => setConfirmDecline(true)}>
                  見送る
                </button>
              </>
            )}
            {!open && req.resultingTicketId && (
              <button className="btn btn--ghost" onClick={() => navigate(`/tickets/${req.resultingTicketId}`)}>
                作成したチケットを見る
              </button>
            )}
          </>
        ) : (
          <>
            <p className="notice">{receiverMessage[req.status]}</p>
            {req.resultingTicketId && (
              <button className="btn btn--ghost" onClick={() => navigate(`/tickets/${req.resultingTicketId}`)}>
                チケットを見る
              </button>
            )}
          </>
        )}
      </div>

      {confirmDecline && (
        <Sheet label="見送りの確認" onClose={() => setConfirmDecline(false)}>
          <h2 className="sheet__title">見送りにしますか？</h2>
          <p className="sheet__text">相手には「今回は見送りになりました。また教えてね」とやさしく表示されます。</p>
          <button
            className="btn btn--primary"
            onClick={() => {
              actions.holdOrDecline(req.id, 'DECLINED');
              setConfirmDecline(false);
            }}
          >
            見送りにする
          </button>
          <button className="btn btn--text" onClick={() => setConfirmDecline(false)}>
            やめる
          </button>
        </Sheet>
      )}
    </Screen>
  );
}
