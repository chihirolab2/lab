import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Screen, Sheet } from '../components/Layout';
import { ThemeIcon } from '../components/Icons';
import { SELECTABLE_THEMES, THEMES, themeForRequest } from '../data/themes';
import { useApp, type NewTicketInput } from '../store';
import type { ThemeKey } from '../types';

export function TicketForm() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const editing = id ? state.tickets.find((t) => t.id === id) : undefined;
  const fromRequest = useMemo(
    () => state.requests.find((r) => r.id === params.get('from')),
    [state.requests, params],
  );

  const initial: NewTicketInput = editing
    ? { title: editing.title, category: editing.category, theme: editing.theme, description: editing.description, terms: editing.terms, expiryDate: editing.expiryDate }
    : {
        title: fromRequest?.title ? `${fromRequest.title}券` : '',
        category: fromRequest ? themeForRequest(fromRequest.category) : 'CAFE',
        theme: fromRequest ? themeForRequest(fromRequest.category) : 'CAFE',
        description: fromRequest?.message ?? '',
        terms: '',
        expiryDate: null,
      };

  const [title, setTitle] = useState(initial.title);
  const [theme, setTheme] = useState<ThemeKey>(initial.theme);
  const [description, setDescription] = useState(initial.description);
  const [terms, setTerms] = useState(initial.terms);
  const [expiry, setExpiry] = useState(initial.expiryDate ?? '');

  if (state.role !== 'giver') {
    return (
      <Screen tone="day" title="チケット" back="/tickets">
        <p className="empty">チケットの作成・編集は贈り主の画面で行えます。MY PAGE で切り替えてください。</p>
      </Screen>
    );
  }
  if (id && (!editing || editing.status === 'used')) {
    return (
      <Screen tone="day" title="チケット" back="/tickets">
        <p className="empty">このチケットは編集できません。</p>
      </Screen>
    );
  }

  const isPremiumEdit = !!editing?.isPremium;
  const valid = title.trim().length > 0;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const input: NewTicketInput = {
      title: title.trim(),
      category: isPremiumEdit ? 'PREMIUM' : theme,
      theme: isPremiumEdit ? 'PREMIUM' : theme,
      description: description.trim(),
      terms: terms.trim(),
      expiryDate: expiry || null,
    };
    if (editing) {
      actions.updateTicket(editing.id, input);
      navigate(`/tickets/${editing.id}`, { replace: true });
    } else {
      const newId = actions.createTicket(input, fromRequest?.id);
      navigate(`/tickets/${newId}`, { replace: true });
    }
  };

  return (
    <Screen tone="day" title={editing ? 'チケットを編集' : fromRequest ? 'リクエストをチケットに' : 'チケットを作成'} back={-1} hideTabs>
      <form className="form" onSubmit={submit}>
        {fromRequest && (
          <div className="card quote">
            <small>受け取った リクエスト</small>
            <strong>{fromRequest.title}</strong>
            {fromRequest.message && <p>{fromRequest.message}</p>}
            {fromRequest.preferredPlace && <p>希望の場所：{fromRequest.preferredPlace}</p>}
          </div>
        )}

        {!isPremiumEdit && (
          <fieldset>
            <legend>デザイン</legend>
            <div className="chips">
              {SELECTABLE_THEMES.map((k) => (
                <button type="button" key={k} className={`chip th-${k}${theme === k ? ' is-active' : ''}`} aria-pressed={theme === k} onClick={() => setTheme(k)}>
                  <ThemeIcon theme={k} size={22} />
                  <span>{THEMES[k].jp}</span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <label className="field">
          <span>チケットの名前 <em>必須</em></span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例：一緒にカフェに行く券" maxLength={30} required />
        </label>
        <label className="field">
          <span>ひとこと説明</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="例：おいしいカフェで、ゆっくりしよう。" rows={3} maxLength={120} />
        </label>
        <label className="field">
          <span>利用条件</span>
          <input value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="例：一緒に行くこと。好きなカフェでOK。" maxLength={60} />
        </label>
        <label className="field">
          <span>有効期限（空欄で期限なし）</span>
          <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
        </label>

        <button className="btn btn--primary" type="submit" disabled={!valid}>
          {editing ? '保存する' : fromRequest ? 'チケットにして返信する' : 'チケットを作成'}
        </button>

        {editing && !editing.isPremium && (
          <button className="btn btn--danger" type="button" onClick={() => setConfirmDelete(true)}>
            このチケットを削除
          </button>
        )}
      </form>

      {confirmDelete && editing && (
        <Sheet label="削除の確認" onClose={() => setConfirmDelete(false)}>
          <h2 className="sheet__title">削除しますか？</h2>
          <p className="sheet__text">「{editing.title}」を削除します。元に戻せません。</p>
          <button
            className="btn btn--danger"
            onClick={() => {
              actions.deleteTicket(editing.id);
              navigate('/tickets', { replace: true });
            }}
          >
            削除する
          </button>
          <button className="btn btn--text" onClick={() => setConfirmDelete(false)}>
            やめる
          </button>
        </Sheet>
      )}
    </Screen>
  );
}
