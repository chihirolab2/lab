import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { CodeLabel, Portrait, TypeAvatar } from '../components/character/TypeVisuals';
import { Icon } from '../components/ui/Icon';
import { Button, Card, ProgressBar, Sparkles } from '../components/ui/primitives';
import { getProfile } from '../data/catalog';
import { GROUP_ORDER, GROUPS } from '../data/groups';
import type { TypeCode } from '../data/model';
import { collectionStats, todaysPickup } from '../logic/collection';
import { useStore } from '../store/AppStore';

const HERO: { code: TypeCode; cls: string }[] = [
  { code: 'INTJ-AS', cls: 'hero-cast__a' },
  { code: 'INTP-TS', cls: 'hero-cast__b' },
  { code: 'INFP-TS', cls: 'hero-cast__c' },
  { code: 'ENTP-AC', cls: 'hero-cast__d' },
];

export function HomeScreen() {
  const nav = useNavigate();
  const { profile } = useStore();
  const stats = collectionStats(profile.discovered);
  const pickup = todaysPickup();
  const pick = getProfile(pickup);
  const mine = profile.myCode ? getProfile(profile.myCode) : null;

  return (
    <div className="screen home">
      <header className="home__head">
        <Sparkles count={6} seed={3} />
        <p className="home__brand">TYPY</p>
        <h1 className="home__title">
          タイピー
          <br />
          ともだち図鑑
        </h1>
        <p className="home__lead">
          自分を知る。自分のタイプを知る。
          <br />
          診断して、新しい友だちに出会おう♡
        </p>
      </header>

      <div className="hero-cast" aria-hidden="true">
        {HERO.map((h) => (
          <div key={h.code} className={`hero-cast__item ${h.cls}`}>
            <Portrait code={h.code} crop="bust" />
          </div>
        ))}
        <div className="hero-cast__fade" />
      </div>

      <div className="home__body">
        <Card className="collection-card" onClick={() => nav('/zukan')}>
          <p className="collection-card__label">あなたの図鑑</p>
          <p className="collection-card__count">
            <b>{stats.found}</b>
            <span> / {stats.total}</span>
          </p>
          <ProgressBar value={stats.found} max={stats.total} />
          <div className="collection-card__groups">
            {GROUP_ORDER.map((g) => (
              <div key={g} className="group-pill" style={{ '--g': GROUPS[g].color } as CSSProperties}>
                <span className="group-pill__name">{GROUPS[g].name}</span>
                <span className="group-pill__num">
                  <b>{stats.byGroup[g].found}</b>/{stats.byGroup[g].total}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {mine && (
          <Card className="mytype-card" onClick={() => nav(`/type/${mine.code}`)}>
            <TypeAvatar code={mine.code} size={58} />
            <div className="mytype-card__text">
              <span className="eyebrow">あなたのタイプ</span>
              <CodeLabel code={mine.code} />
              <span className="mytype-card__title">{mine.title}</span>
            </div>
            <Icon name="chevron-right" size={18} className="muted" />
          </Card>
        )}

        <Button arrow block onClick={() => nav('/diagnosis')}>
          {mine ? 'もう一度診断する' : '診断する'}
        </Button>

        <section className="home__section">
          <h2 className="home__section-title">今日のピックアップ</h2>
          <Card className="pickup-card" onClick={() => nav(`/type/${pickup}`)}>
            <div className="pickup-card__art" style={{ '--g-soft': pick.group.soft, '--g-tint': pick.group.tint } as CSSProperties}>
              <Portrait code={pickup} crop="bust" />
            </div>
            <div className="pickup-card__text">
              <span className="pickup-card__code">
                <CodeLabel code={pickup} />
              </span>
              <p className="pickup-card__q">このタイプ、どんな人？</p>
              <p className="pickup-card__catch">{pick.base.catch}</p>
              <span className="pickup-card__more">
                タップして見る <Icon name="arrow-right" size={14} />
              </span>
            </div>
            <Sparkles count={3} seed={9} className="sparkles--card" />
          </Card>
        </section>

        <section className="home__section">
          <div className="home__shortcuts">
            <Card className="shortcut" onClick={() => nav('/compat')}>
              <span className="shortcut__icon shortcut__icon--pink">
                <Icon name="heart-fill" size={20} />
              </span>
              <span className="shortcut__title">相性診断</span>
              <span className="shortcut__sub">ふたりの相性をチェック</span>
            </Card>
            <Card className="shortcut" onClick={() => nav('/friends')}>
              <span className="shortcut__icon shortcut__icon--mint">
                <Icon name="users" size={20} />
              </span>
              <span className="shortcut__title">ともだち</span>
              <span className="shortcut__sub">{profile.friends.length}人のタイプ分布</span>
            </Card>
          </div>
        </section>

        {stats.remaining > 0 && stats.remaining <= 32 && (
          <Card className="milestone-banner" onClick={() => nav('/complete')}>
            <Icon name="crown" size={22} className="milestone-banner__icon" />
            <span>
              コンプリートまで あと <b>{stats.remaining}</b> タイプ
            </span>
            <Icon name="chevron-right" size={18} />
          </Card>
        )}
      </div>
    </div>
  );
}
