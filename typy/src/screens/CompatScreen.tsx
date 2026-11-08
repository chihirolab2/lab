import type { CSSProperties } from 'react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TypeAvatar } from '../components/character/TypeVisuals';
import { TypePicker } from '../components/TypePicker';
import { Icon } from '../components/ui/Icon';
import { Button, Card, ScreenHeader, Segment, Sheet } from '../components/ui/primitives';
import { getProfile, isTypeCode, splitCode } from '../data/catalog';
import type { TypeCode } from '../data/model';
import { compatibility } from '../logic/compatibility';
import { useStore } from '../store/AppStore';

type Side = 'a' | 'b';

export function CompatScreen() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const { profile } = useStore();

  const fallbackA: TypeCode = profile.myCode ?? 'INTJ-AS';
  const fallbackB: TypeCode = profile.friends[0]?.code ?? 'INFP-TS';
  const pa = params.get('a');
  const pb = params.get('b');
  const a: TypeCode = pa && isTypeCode(pa) ? pa : fallbackA;
  const b: TypeCode = pb && isTypeCode(pb) ? pb : fallbackB === a ? 'ENFP-AC' : fallbackB;

  const [picking, setPicking] = useState<Side | null>(null);
  const [expanded, setExpanded] = useState(false);
  const result = compatibility(a, b);

  const set = (side: Side, code: TypeCode) => {
    const next = { a, b, [side]: code };
    setParams(next, { replace: true });
    setExpanded(false);
  };

  const nameOf = (code: TypeCode) => {
    if (code === profile.myCode) return 'あなた';
    return profile.friends.find((f) => f.code === code)?.name;
  };

  return (
    <div className="screen compat">
      <ScreenHeader title="相性診断" back />

      <div className="compat__pair">
        <PairSide code={a} who={nameOf(a)} onClick={() => setPicking('a')} />
        <div className="compat__center">
          <Icon name="heart-fill" size={24} className="compat__heart" />
          <div className="compat__ring" style={{ '--score': result.score } as CSSProperties}>
            <div className="compat__ring-inner">
              <span className="compat__ring-label">相性</span>
              <span className="compat__score">
                {result.score}
                <small>%</small>
              </span>
            </div>
          </div>
        </div>
        <PairSide code={b} who={nameOf(b)} onClick={() => setPicking('b')} />
      </div>

      <p className="compat__headline">{result.headline}</p>
      <p className="compat__summary">{result.summary}</p>

      <Card className="compat__points">
        <span className="compat__points-label">ふたりの相性ポイント</span>
        <ul className="check-list">
          {result.points.map((pt) => (
            <li key={pt}>
              <Icon name="check-circle" size={20} />
              {pt}
            </li>
          ))}
        </ul>
      </Card>

      {expanded && (
        <div className="stack compat__more">
          <Card className="advice-card">
            <p className="advice-card__title">
              <Icon name="sparkle" size={16} /> もっと仲良くなるコツ
            </p>
            <p className="body-text">{result.advice}</p>
          </Card>
          <Card className="advice-card advice-card--caution">
            <p className="advice-card__title">
              <Icon name="info" size={16} /> すれ違いに注意
            </p>
            <p className="body-text">{result.caution}</p>
          </Card>
          <div className="compat__links">
            <Button variant="soft" size="md" onClick={() => nav(`/type/${a}`)}>
              {splitCode(a).base}の詳細
            </Button>
            <Button variant="soft" size="md" onClick={() => nav(`/type/${b}`)}>
              {splitCode(b).base}の詳細
            </Button>
          </div>
        </div>
      )}

      <div className="center compat__cta">
        <Button variant="ghost" size="md" arrow onClick={() => setExpanded((v) => !v)}>
          {expanded ? '閉じる' : 'もっと詳しく見る'}
        </Button>
      </div>

      <Sheet open={picking !== null} onClose={() => setPicking(null)} title={picking === 'a' ? 'ひとりめを選ぶ' : 'ふたりめを選ぶ'}>
        {picking && (
          <CompatPicker
            current={picking === 'a' ? a : b}
            onPick={(c) => {
              set(picking, c);
              setPicking(null);
            }}
          />
        )}
      </Sheet>
    </div>
  );
}

function PairSide({ code, who, onClick }: { code: TypeCode; who?: string; onClick: () => void }) {
  const p = getProfile(code);
  return (
    <button className="compat__side" onClick={onClick} aria-label={`${code}を変更`}>
      <TypeAvatar code={code} size={98} />
      <span className="compat__code">{splitCode(code).base}</span>
      <span className="compat__name">{p.base.name}</span>
      <span className="compat__who">
        {who ?? splitCode(code).variant.split('').join('·')}
        <Icon name="edit" size={12} />
      </span>
    </button>
  );
}

function CompatPicker({ current, onPick }: { current: TypeCode; onPick: (c: TypeCode) => void }) {
  const { profile } = useStore();
  const [mode, setMode] = useState<'friends' | 'types'>(profile.friends.length || profile.myCode ? 'friends' : 'types');
  const [draft, setDraft] = useState<TypeCode | null>(current);
  return (
    <div className="stack">
      <Segment
        value={mode}
        onChange={setMode}
        items={[
          { value: 'friends', label: 'あなた・ともだち' },
          { value: 'types', label: 'タイプから選ぶ' },
        ]}
      />
      {mode === 'friends' ? (
        <div className="people-grid">
          {profile.myCode && (
            <button className="person" onClick={() => onPick(profile.myCode!)}>
              <TypeAvatar code={profile.myCode} size={64} />
              <b>あなた</b>
              <small>{splitCode(profile.myCode).base}</small>
            </button>
          )}
          {profile.friends.map((f) => (
            <button key={f.id} className="person" onClick={() => onPick(f.code)}>
              <TypeAvatar code={f.code} size={64} />
              <b>{f.name}</b>
              <small>{splitCode(f.code).base}</small>
            </button>
          ))}
          {!profile.myCode && profile.friends.length === 0 && <p className="empty">まだ登録がありません</p>}
        </div>
      ) : (
        <>
          <TypePicker value={draft} onChange={setDraft} />
          <Button block arrow disabled={!draft} onClick={() => draft && onPick(draft)}>
            このタイプで診断
          </Button>
        </>
      )}
    </div>
  );
}
