import { useNavigate } from 'react-router-dom';
import { Portrait } from '../components/character/TypeVisuals';
import { Icon } from '../components/ui/Icon';
import { Button, IconButton, Sparkles, TextLink } from '../components/ui/primitives';
import { collectionStats, nextUndiscovered } from '../logic/collection';
import { useStore } from '../store/AppStore';

/** 図鑑コンプリートまでの道のり */
export function CompleteScreen() {
  const nav = useNavigate();
  const { profile } = useStore();
  const stats = collectionStats(profile.discovered);
  const next = nextUndiscovered(profile.discovered);
  const done = stats.remaining === 0;

  return (
    <div className="screen milestone">
      <div className="milestone__sky" aria-hidden="true">
        <span className="reveal__cloud reveal__cloud--1" />
        <span className="reveal__cloud reveal__cloud--2" />
      </div>
      <Sparkles count={12} seed={21} className="sparkles--reveal" />
      <div className="milestone__top">
        <IconButton icon="chevron-left" label="戻る" onClick={() => (window.history.length > 1 ? nav(-1) : nav('/'))} className="icon-btn--glass" />
      </div>

      <div className="milestone__crown">
        <svg viewBox="0 0 80 56" aria-hidden="true">
          <defs>
            <linearGradient id="crown-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff2c2" />
              <stop offset="1" stopColor="#f2c55f" />
            </linearGradient>
          </defs>
          <path d="M8,20 L24,34 L40,8 L56,34 L72,20 L66,50 H14 Z" fill="url(#crown-g)" stroke="#e7b24a" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="8" cy="18" r="4" fill="#f6d57f" />
          <circle cx="40" cy="6" r="4.5" fill="#f6d57f" />
          <circle cx="72" cy="18" r="4" fill="#f6d57f" />
          <circle cx="40" cy="38" r="4" fill="#f4a9c0" />
        </svg>
      </div>

      {done ? (
        <h1 className="milestone__title">
          図鑑コンプリート！
          <br />
          <small>64タイプすべてに出会いました♡</small>
        </h1>
      ) : (
        <>
          <h1 className="milestone__title">
            図鑑コンプリートまで
            <br />
            あと <b>{stats.remaining}</b> タイプ！
          </h1>
          <p className="milestone__lead">
            {stats.remaining === 1 ? '最後の1人を見つけて、' : 'まだ見ぬタイプを見つけて、'}
            <br />
            最高の図鑑を完成させよう♡
          </p>
        </>
      )}

      <div className="milestone__figure">
        <span className="milestone__orbit" />
        {next ? (
          <>
            <Portrait code={next} crop="hero" silhouette silhouetteColor="#cfc6f3" />
            <span className="locked-q">?</span>
          </>
        ) : (
          <Portrait code={profile.myCode ?? 'INFP-TS'} crop="hero" />
        )}
      </div>

      <div className="milestone__actions">
        <Button variant="lavender" arrow block onClick={() => nav('/diagnosis')}>
          診断する
        </Button>
        <TextLink onClick={() => nav('/zukan')}>図鑑を見る</TextLink>
      </div>

      <div className="milestone__book" aria-hidden="true">
        <svg viewBox="0 0 300 80">
          <path d="M150,30 C110,10 50,8 10,22 L10,74 C50,62 110,62 150,78 Z" fill="#fbf9ff" stroke="#e2dbf6" />
          <path d="M150,30 C190,10 250,8 290,22 L290,74 C250,62 190,62 150,78 Z" fill="#f6f2ff" stroke="#e2dbf6" />
          <path d="M30,34 C60,28 100,30 130,40 M30,46 C60,40 100,42 130,52 M170,40 C200,30 240,28 270,34 M170,52 C200,42 240,40 270,46" stroke="#e7e1f8" strokeWidth="2" fill="none" />
        </svg>
        <Icon name="sparkle" size={18} className="milestone__book-spark" />
      </div>
    </div>
  );
}
