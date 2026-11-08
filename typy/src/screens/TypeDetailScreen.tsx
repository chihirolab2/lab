import { useState, type CSSProperties } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { CodeLabel, Portrait, TypeAvatar } from '../components/character/TypeVisuals';
import { Icon } from '../components/ui/Icon';
import { Button, Card, IconButton, SectionTitle, Segment, Sparkles, Tag, TextLink } from '../components/ui/primitives';
import { getProfile, isTypeCode, makeCode, splitCode } from '../data/catalog';
import type { AT, CS, TypeCode, TypeProfile } from '../data/model';
import { AXIS_LABELS } from '../data/questions';
import { bestMatches, compatibility } from '../logic/compatibility';
import { useStore } from '../store/AppStore';

type Tab = 'basic' | 'love' | 'work' | 'sw' | 'compat';

const TABS: { value: Tab; label: string }[] = [
  { value: 'basic', label: '基本' },
  { value: 'love', label: '恋愛' },
  { value: 'work', label: '仕事' },
  { value: 'sw', label: '強み・弱み' },
  { value: 'compat', label: '相性' },
];

export function TypeDetailScreen() {
  const { code } = useParams();
  if (!code || !isTypeCode(code)) return <Navigate to="/zukan" replace />;
  return <TypeDetail code={code} key={code} />;
}

function TypeDetail({ code }: { code: TypeCode }) {
  const nav = useNavigate();
  const loc = useLocation();
  const { profile, isDiscovered, isFavorite, toggleFavorite } = useStore();
  const [tab, setTab] = useState<Tab>('basic');
  const p = getProfile(code);
  const found = isDiscovered(code);
  const mine = profile.myCode === code;
  const justRegistered = (loc.state as { mine?: boolean } | null)?.mine;
  const vars = { '--g': p.group.color, '--g-soft': p.group.soft, '--g-tint': p.group.tint } as CSSProperties;

  const goBack = () => (window.history.length > 1 ? nav(-1) : nav('/zukan'));

  if (!found) return <LockedDetail p={p} onBack={goBack} />;

  const { base } = splitCode(code);
  const switchVariant = (at: AT, cs: CS) => nav(`/type/${makeCode(base, at, cs)}`, { replace: true });

  return (
    <div className="screen detail" style={vars}>
      <div className="detail__hero">
        <div className="detail__hero-bg" />
        <Sparkles count={6} seed={11} />
        <div className="detail__hero-art">
          <Portrait code={code} crop="hero" />
        </div>
        <div className="detail__topbar">
          <IconButton icon="chevron-left" label="戻る" onClick={goBack} className="icon-btn--glass" />
          <IconButton
            icon={isFavorite(code) ? 'heart-fill' : 'heart'}
            label="お気に入り"
            active={isFavorite(code)}
            onClick={() => toggleFavorite(code)}
            className="icon-btn--glass icon-btn--heart"
          />
        </div>
        <div className="detail__namecard">
          {mine && <span className="badge-mine">あなたのタイプ</span>}
          <CodeLabel code={code} size="xl" />
          <p className="detail__title">{p.title}</p>
          <p className="detail__catch">{p.base.catch}</p>
        </div>
      </div>

      {justRegistered && (
        <div className="toast-inline">
          <Icon name="sparkle" size={16} /> 図鑑に登録しました！
        </div>
      )}

      <div className="detail__variants" aria-label="A/T・C/S の差分">
        {(['A', 'T'] as AT[]).flatMap((at) =>
          (['C', 'S'] as CS[]).map((cs) => {
            const c = makeCode(base, at, cs);
            const active = c === code;
            const known = isDiscovered(c);
            return (
              <button key={c} className={`variant-chip ${active ? 'is-active' : ''}`} onClick={() => switchVariant(at, cs)} aria-pressed={active}>
                <TypeAvatar code={c} size={38} locked={!known} ring={false} />
                <span>
                  {at}·{cs}
                </span>
              </button>
            );
          }),
        )}
      </div>

      <div className="detail__tabs">
        <Segment variant="tabs" ariaLabel="詳細カテゴリ" value={tab} onChange={setTab} items={TABS} />
      </div>

      <div className="detail__content">
        {tab === 'basic' && <BasicTab p={p} />}
        {tab === 'love' && <LoveTab p={p} />}
        {tab === 'work' && <WorkTab p={p} />}
        {tab === 'sw' && <SwTab p={p} />}
        {tab === 'compat' && <CompatTab p={p} myCode={profile.myCode} />}
      </div>

      {mine && profile.results[0] && <MyScores scores={profile.results[0].scores} />}

      <div className="detail__footer">
        <Button arrow block onClick={() => nav(`/compat?b=${code}`)}>
          このタイプと相性診断
        </Button>
      </div>
    </div>
  );
}

function BasicTab({ p }: { p: TypeProfile }) {
  return (
    <div className="stack">
      <section>
        <SectionTitle color="#8fc7e8">性格の特徴</SectionTitle>
        <p className="body-text">
          {p.base.personality}
          {p.atInfo.personality}
        </p>
        <div className="tags">
          {p.base.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </section>
      <section>
        <SectionTitle color="#b4a3ef" icon="sparkle">
          思考のクセ
        </SectionTitle>
        <p className="body-text">{p.base.thinking}</p>
      </section>
      <section>
        <SectionTitle color="#8fd3b6" icon="star">
          行動パターン
        </SectionTitle>
        <p className="body-text">
          {p.base.behavior}
          {p.csInfo.personality}
        </p>
      </section>
      <Card className="variant-explain">
        <div className="variant-explain__row">
          <span className="variant-explain__key">{p.at}</span>
          <div>
            <p className="variant-explain__name">
              {p.atInfo.label}
              <small>{p.atInfo.short}</small>
            </p>
            <p className="variant-explain__desc">{p.atInfo.description}</p>
          </div>
        </div>
        <div className="variant-explain__row">
          <span className="variant-explain__key variant-explain__key--cs">{p.cs}</span>
          <div>
            <p className="variant-explain__name">
              {p.csInfo.label}
              <small>{p.csInfo.short}</small>
            </p>
            <p className="variant-explain__desc">{p.csInfo.description}</p>
          </div>
        </div>
      </Card>
      <section>
        <SectionTitle color="#f3b0c4" icon="heart-fill">
          あるある
        </SectionTitle>
        <ul className="check-list">
          {p.base.aruaru.map((a) => (
            <li key={a}>
              <Icon name="check-circle" size={18} />
              {a}
            </li>
          ))}
        </ul>
      </section>
      <MatchStrip p={p} />
    </div>
  );
}

function LoveTab({ p }: { p: TypeProfile }) {
  return (
    <div className="stack">
      <section>
        <SectionTitle color="#f3a7c0">恋愛傾向</SectionTitle>
        <p className="body-text">
          {p.base.love}
          {p.atInfo.love}
        </p>
        <div className="tags">
          {p.base.loveTags.map((t) => (
            <Tag key={t} color="#f3a7c0">
              {t}
            </Tag>
          ))}
        </div>
      </section>
      <section>
        <SectionTitle color="#b4a3ef" icon="sparkle">
          ときめくシチュエーション
        </SectionTitle>
        <p className="body-text">{p.csInfo.love}</p>
      </section>
      <MatchStrip p={p} />
    </div>
  );
}

function WorkTab({ p }: { p: TypeProfile }) {
  return (
    <div className="stack">
      <section>
        <SectionTitle color="#8fc7e8" icon="star">
          仕事のスタイル
        </SectionTitle>
        <p className="body-text">
          {p.base.work}
          {p.csInfo.work}
          {p.atInfo.work}
        </p>
      </section>
      <section>
        <SectionTitle color="#8fd3b6" icon="sparkle">
          向いている仕事の例
        </SectionTitle>
        <div className="tags">
          {p.base.jobs.map((j) => (
            <Tag key={j} color="#8fd3b6">
              {j}
            </Tag>
          ))}
        </div>
      </section>
    </div>
  );
}

function SwTab({ p }: { p: TypeProfile }) {
  return (
    <div className="stack">
      <div className="sw-grid">
        <Card className="sw-card sw-card--plus">
          <p className="sw-card__title">強み</p>
          <ul>
            {p.base.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Card>
        <Card className="sw-card sw-card--minus">
          <p className="sw-card__title">弱み</p>
          <ul>
            {p.base.weaknesses.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Card>
      </div>
      <section>
        <SectionTitle color="#a9b8ef" icon="info">
          ストレス傾向
        </SectionTitle>
        <p className="body-text">
          {p.base.stress}
          {p.csInfo.stress}
          {p.atInfo.stress}
        </p>
      </section>
      <section>
        <SectionTitle color="#8fd3b6" icon="heart-fill">
          元気が戻るリセット法
        </SectionTitle>
        <p className="body-text">{p.base.recharge}</p>
      </section>
    </div>
  );
}

function CompatTab({ p, myCode }: { p: TypeProfile; myCode: TypeCode | null }) {
  const nav = useNavigate();
  const matches = bestMatches(p.code, 5);
  return (
    <div className="stack">
      {myCode && myCode !== p.code && (
        <Card className="compat-mini" onClick={() => nav(`/compat?a=${myCode}&b=${p.code}`)}>
          <TypeAvatar code={myCode} size={46} />
          <Icon name="heart-fill" size={16} className="compat-mini__heart" />
          <TypeAvatar code={p.code} size={46} />
          <div className="compat-mini__text">
            <span className="eyebrow">あなたとの相性</span>
            <b>{compatibility(myCode, p.code).score}%</b>
          </div>
          <Icon name="chevron-right" size={18} className="muted" />
        </Card>
      )}
      <SectionTitle color="#f3a7c0">相性のいいタイプ</SectionTitle>
      <div className="rank-list">
        {matches.map((c, i) => {
          const mp = getProfile(c);
          return (
            <Card key={c} className="rank-item" onClick={() => nav(`/compat?a=${p.code}&b=${c}`)}>
              <span className="rank-item__no">{i + 1}</span>
              <TypeAvatar code={c} size={44} />
              <span className="rank-item__text">
                <CodeLabel code={c} />
                <small>{mp.title}</small>
              </span>
              <span className="rank-item__score">{compatibility(p.code, c).score}%</span>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function MatchStrip({ p }: { p: TypeProfile }) {
  const nav = useNavigate();
  const matches = bestMatches(p.code, 3);
  return (
    <Card className="match-strip" onClick={() => nav(`/compat?a=${p.code}&b=${matches[0]}`)}>
      <p className="match-strip__title">このタイプと相性がいいのは？</p>
      <div className="match-strip__row">
        {matches.map((c) => (
          <TypeAvatar key={c} code={c} size={58} />
        ))}
        <Icon name="chevron-right" size={20} className="muted" />
      </div>
    </Card>
  );
}

function MyScores({ scores }: { scores: Record<string, number> }) {
  return (
    <Card className="score-card">
      <SectionTitle icon="chart" color="#a9b8ef">
        あなたの傾向バランス
      </SectionTitle>
      <ScoreBars scores={scores} />
    </Card>
  );
}

export function ScoreBars({ scores }: { scores: Record<string, number> }) {
  return (
    <div className="score-bars">
      {(Object.keys(AXIS_LABELS) as (keyof typeof AXIS_LABELS)[]).map((axis) => {
        const l = AXIS_LABELS[axis];
        const v = scores[axis] ?? 0;
        const leftPct = Math.round(50 - v / 2);
        const leftWins = v <= 0;
        return (
          <div key={axis} className="score-bar">
            <div className="score-bar__labels">
              <span className={leftWins ? 'is-win' : ''}>
                {l.leftKey} {l.left} {leftPct}%
              </span>
              <span className={!leftWins ? 'is-win' : ''}>
                {100 - leftPct}% {l.right} {l.rightKey}
              </span>
            </div>
            <div className="score-bar__track">
              <span className="score-bar__fill" style={leftWins ? { left: 0, width: `${leftPct}%` } : { right: 0, width: `${100 - leftPct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LockedDetail({ p, onBack }: { p: TypeProfile; onBack: () => void }) {
  const nav = useNavigate();
  const { base, variant } = splitCode(p.code);
  return (
    <div className="screen detail detail--locked" style={{ '--g': p.group.color, '--g-soft': p.group.soft, '--g-tint': p.group.tint } as CSSProperties}>
      <div className="detail__hero">
        <div className="detail__hero-bg" />
        <div className="detail__hero-art">
          <Portrait code={p.code} crop="hero" silhouette />
          <span className="locked-q">?</span>
        </div>
        <div className="detail__topbar">
          <IconButton icon="chevron-left" label="戻る" onClick={onBack} className="icon-btn--glass" />
        </div>
        <div className="detail__namecard">
          <span className="code-label code-label--xl">
            {base}
            <small>-{variant}</small>
          </span>
          <p className="detail__title">？？？</p>
          <p className="detail__catch">{p.group.name}のどこかにいる、まだ見ぬタイプ。</p>
        </div>
      </div>
      <div className="detail__content stack">
        <Card className="locked-card">
          <Icon name="lock" size={22} />
          <p>
            このタイプはまだ図鑑に登録されていません。
            <br />
            診断するか、このタイプのともだちを追加すると発見できます。
          </p>
        </Card>
        <Button arrow block onClick={() => nav('/diagnosis')}>
          診断する
        </Button>
        <div className="center">
          <TextLink onClick={() => nav(`/friends?add=${p.code}`)}>このタイプのともだちを追加</TextLink>
        </div>
      </div>
    </div>
  );
}
