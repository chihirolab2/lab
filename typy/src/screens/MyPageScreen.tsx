import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CodeLabel, TypeAvatar } from '../components/character/TypeVisuals';
import { Icon, type IconName } from '../components/ui/Icon';
import { Button, Card, ScreenHeader, SectionTitle, Sheet } from '../components/ui/primitives';
import { getProfile } from '../data/catalog';
import { AT_INFO, CS_INFO } from '../data/groups';
import { collectionStats } from '../logic/collection';
import { useStore } from '../store/AppStore';
import { ScoreBars } from './TypeDetailScreen';

export function MyPageScreen() {
  const nav = useNavigate();
  const { profile, setNickname, resetData } = useStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.nickname);
  const [sheet, setSheet] = useState<null | 'history' | 'favorites' | 'about' | 'reset'>(null);
  const stats = collectionStats(profile.discovered);
  const mine = profile.myCode ? getProfile(profile.myCode) : null;
  const latest = profile.results[0];

  const menu: { icon: IconName; label: string; onClick: () => void; sub?: string }[] = [
    { icon: 'history', label: '診断履歴', sub: `${profile.results.length}回`, onClick: () => setSheet('history') },
    { icon: 'heart', label: 'お気に入りタイプ', sub: `${profile.favorites.length}件`, onClick: () => setSheet('favorites') },
    { icon: 'users', label: 'ともだち・タイプ分布', sub: `${profile.friends.length}人`, onClick: () => nav('/friends') },
    { icon: 'crown', label: 'コンプリートまでの道のり', sub: `あと${stats.remaining}`, onClick: () => nav('/complete') },
    { icon: 'info', label: 'TYPYの64タイプについて', onClick: () => setSheet('about') },
    { icon: 'refresh', label: 'データのリセット', onClick: () => setSheet('reset') },
  ];

  return (
    <div className="screen mypage">
      <ScreenHeader title="マイページ" />

      <Card className="profile-card">
        <div className="profile-card__avatar">
          {mine ? <TypeAvatar code={mine.code} size={92} /> : <span className="profile-card__empty"><Icon name="user" size={40} /></span>}
        </div>
        <div className="profile-card__info">
          {editing ? (
            <form
              className="profile-card__edit"
              onSubmit={(e) => {
                e.preventDefault();
                setNickname(name.trim() || 'あなた');
                setEditing(false);
              }}
            >
              <input className="field__input" value={name} maxLength={16} autoFocus onChange={(e) => setName(e.target.value)} aria-label="ニックネーム" />
              <Button size="sm" type="submit">保存</Button>
            </form>
          ) : (
            <button className="profile-card__name" onClick={() => setEditing(true)}>
              {profile.nickname} <Icon name="edit" size={14} />
            </button>
          )}
          {mine ? (
            <button className="profile-card__type" onClick={() => nav(`/type/${mine.code}`)}>
              <CodeLabel code={mine.code} />
              <span>{mine.title}</span>
            </button>
          ) : (
            <p className="profile-card__none">まだ診断していません</p>
          )}
        </div>
      </Card>

      <div className="stat-row">
        <Card className="stat">
          <b>{stats.found}</b>
          <span>発見タイプ</span>
        </Card>
        <Card className="stat">
          <b>{profile.friends.length}</b>
          <span>ともだち</span>
        </Card>
        <Card className="stat">
          <b>{profile.results.length}</b>
          <span>診断回数</span>
        </Card>
      </div>

      {latest ? (
        <Card className="score-card">
          <SectionTitle icon="chart" color="#a9b8ef">
            あなたの傾向バランス
          </SectionTitle>
          <ScoreBars scores={latest.scores} />
          <p className="muted-text small">
            {new Date(latest.createdAt).toLocaleDateString('ja-JP')}・{latest.answeredCount}問回答
          </p>
        </Card>
      ) : (
        <Card className="cta-card">
          <p>診断すると、あなたの傾向バランスがここに表示されます。</p>
          <Button arrow block onClick={() => nav('/diagnosis')}>
            診断する
          </Button>
        </Card>
      )}

      <Card className="menu">
        {menu.map((m) => (
          <button key={m.label} className="menu__item" onClick={m.onClick}>
            <span className="menu__icon">
              <Icon name={m.icon} size={19} />
            </span>
            <span className="menu__label">{m.label}</span>
            {m.sub && <span className="menu__sub">{m.sub}</span>}
            <Icon name="chevron-right" size={16} className="muted" />
          </button>
        ))}
      </Card>

      <p className="disclaimer">
        TYPYは自己理解を楽しむためのオリジナル診断です。公式のMBTI®や16Personalitiesとは関係ありません。
      </p>

      <Sheet open={sheet === 'history'} onClose={() => setSheet(null)} title="診断履歴">
        {profile.results.length === 0 ? (
          <p className="empty">まだ診断履歴はありません。</p>
        ) : (
          <div className="rank-list">
            {profile.results.map((r) => (
              <Card key={r.id} className="rank-item" onClick={() => nav(`/type/${r.code}`)}>
                <TypeAvatar code={r.code} size={44} />
                <span className="rank-item__text">
                  <CodeLabel code={r.code} />
                  <small>{new Date(r.createdAt).toLocaleString('ja-JP', { dateStyle: 'medium', timeStyle: 'short' })}</small>
                </span>
                <Icon name="chevron-right" size={16} className="muted" />
              </Card>
            ))}
          </div>
        )}
      </Sheet>

      <Sheet open={sheet === 'favorites'} onClose={() => setSheet(null)} title="お気に入りタイプ">
        {profile.favorites.length === 0 ? (
          <p className="empty">タイプ詳細のハートから追加できます。</p>
        ) : (
          <div className="people-grid">
            {profile.favorites.map((c) => (
              <button key={c} className="person" onClick={() => nav(`/type/${c}`)}>
                <TypeAvatar code={c} size={64} />
                <b>{c.split('-')[0]}</b>
                <small>{getProfile(c).title}</small>
              </button>
            ))}
          </div>
        )}
      </Sheet>

      <Sheet open={sheet === 'about'} onClose={() => setSheet(null)} title="TYPYの64タイプ">
        <div className="stack">
          <p className="body-text">
            TYPYは「エネルギーの向き(E/I)」「ものの見方(S/N)」「判断のしかた(T/F)」「外界への接し方(J/P)」の16タイプに、独自の2指標を掛け合わせた64タイプで構成されています。
          </p>
          {[AT_INFO.A, AT_INFO.T, CS_INFO.C, CS_INFO.S].map((i) => (
            <Card key={i.key} className="axis-def">
              <span className="axis-def__key">{i.key}</span>
              <div>
                <p className="axis-def__name">
                  {i.label}
                  <small>
                    {i.reading}・{i.short}
                  </small>
                </p>
                <p className="axis-def__desc">{i.description}</p>
              </div>
            </Card>
          ))}
          <p className="disclaimer">診断結果は自己理解のヒントです。人の性格はひとつのタイプに収まるものではありません。</p>
        </div>
      </Sheet>

      <Sheet open={sheet === 'reset'} onClose={() => setSheet(null)} title="データのリセット">
        <div className="stack">
          <p className="body-text">データはこの端末のブラウザに保存されています。</p>
          <Button
            variant="soft"
            block
            onClick={() => {
              resetData('sample');
              setSheet(null);
            }}
          >
            サンプルデータに戻す
          </Button>
          <Button
            variant="ghost"
            block
            onClick={() => {
              if (window.confirm('すべてのデータを削除しますか？')) {
                resetData('empty');
                setSheet(null);
              }
            }}
          >
            すべて削除して空にする
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
