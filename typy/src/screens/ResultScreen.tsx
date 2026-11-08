import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Portrait } from '../components/character/TypeVisuals';
import { Icon } from '../components/ui/Icon';
import { Button, Sparkles } from '../components/ui/primitives';
import { getProfile, splitCode } from '../data/catalog';
import { useStore } from '../store/AppStore';

/** 診断結果の「New Friend!」演出画面 */
export function ResultScreen() {
  const nav = useNavigate();
  const { profile, isDiscovered, discover } = useStore();
  const [play, setPlay] = useState(0);
  const code = profile.myCode;
  if (!code) return <Navigate to="/diagnosis" replace />;
  const p = getProfile(code);
  const { base, variant } = splitCode(code);
  const registered = isDiscovered(code);

  const register = () => {
    discover(code);
    nav(`/type/${code}`, { state: { mine: true } });
  };

  return (
    <div className="screen reveal" key={play}>
      <div className="reveal__sky" aria-hidden="true">
        <span className="reveal__cloud reveal__cloud--1" />
        <span className="reveal__cloud reveal__cloud--2" />
        <span className="reveal__orbit" />
      </div>
      <Sparkles count={10} seed={5} className="sparkles--reveal" />
      <button className="reveal__close" aria-label="ホームへ" onClick={() => nav('/')}>
        <Icon name="close" size={22} />
      </button>

      <h1 className="reveal__script">New Friend!</h1>

      <div className="reveal__character">
        <Portrait code={code} crop="hero" />
      </div>

      <div className="reveal__card">
        <p className="reveal__code">
          {base}
          <small>-{variant}</small>
        </p>
        <p className="reveal__name">{p.title}</p>
        <hr />
        <p className="reveal__catch">{p.base.catch}</p>
        <p className="reveal__variant">
          {p.atInfo.label}（{p.atInfo.short}）× {p.csInfo.label}（{p.csInfo.short}）
        </p>
      </div>

      <div className="reveal__actions">
        <Button variant="lavender" arrow block onClick={register}>
          {registered ? 'タイプの詳細を見る' : '図鑑に登録する'}
        </Button>
        <button className="text-link text-link--light" onClick={() => setPlay((n) => n + 1)}>
          もう一度みる <Icon name="refresh" size={16} />
        </button>
      </div>
    </div>
  );
}
