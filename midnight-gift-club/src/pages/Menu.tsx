import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronIcon, HistoryIcon } from '../components/Icons';
import { Screen, Sheet } from '../components/Layout';
import { useApp } from '../store';

export function Menu() {
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const [giver, setGiver] = useState(state.profile.giverName);
  const [receiver, setReceiver] = useState(state.profile.receiverName);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <Screen tone="blush" title="MY PAGE" back="/">
      <div className="stack">
        <section className="card form">
          <h2 className="section-title">いまの画面</h2>
          <div className="segmented" role="tablist">
            <button role="tab" aria-selected={state.role === 'giver'} className={state.role === 'giver' ? 'is-active' : ''} onClick={() => actions.setRole('giver')}>
              贈り主
            </button>
            <button role="tab" aria-selected={state.role === 'receiver'} className={state.role === 'receiver' ? 'is-active' : ''} onClick={() => actions.setRole('receiver')}>
              受け取り側
            </button>
          </div>
          <p className="muted small">
            動作確認用の切り替えです。贈り主はチケットの作成・リクエストの採用、受け取り側はチケットの使用・リクエスト送信を行います。
            ふたりの端末で同期するには、後続でバックエンドと認証が必要です。
          </p>
        </section>

        <section className="card form">
          <h2 className="section-title">表示名</h2>
          <label className="field">
            <span>贈り主</span>
            <input value={giver} onChange={(e) => setGiver(e.target.value)} placeholder="（未設定）" maxLength={12} />
          </label>
          <label className="field">
            <span>受け取り側</span>
            <input value={receiver} onChange={(e) => setReceiver(e.target.value)} placeholder="（未設定）" maxLength={12} />
          </label>
          <button className="btn btn--ghost" onClick={() => actions.setProfile(giver, receiver)}>
            保存
          </button>
        </section>

        <button className="card row" onClick={() => navigate('/history')}>
          <HistoryIcon size={20} />
          <span className="row__main">
            <strong>履歴</strong>
            <span className="row__meta">使用済みチケット・過去のリクエスト</span>
          </span>
          <ChevronIcon size={18} />
        </button>

        <button className="btn btn--danger" onClick={() => setConfirmReset(true)}>
          データをリセット
        </button>
        <p className="muted small center">MIDNIGHT GIFT CLUB（仮称）・プロトタイプ v0.1</p>
      </div>

      {confirmReset && (
        <Sheet label="リセットの確認" onClose={() => setConfirmReset(false)}>
          <h2 className="sheet__title">データをリセットしますか？</h2>
          <p className="sheet__text">チケット・リクエスト・スタンプを初期状態に戻します（サンプルのリクエストも消えます）。</p>
          <button
            className="btn btn--danger"
            onClick={() => {
              actions.reset();
              setConfirmReset(false);
              navigate('/');
            }}
          >
            リセットする
          </button>
          <button className="btn btn--text" onClick={() => setConfirmReset(false)}>
            やめる
          </button>
        </Sheet>
      )}
    </Screen>
  );
}
