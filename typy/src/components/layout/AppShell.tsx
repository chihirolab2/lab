import { useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Icon, type IconName } from '../ui/Icon';

const TABS: { to: string; label: string; icon: IconName; match: string[] }[] = [
  { to: '/', label: 'ホーム', icon: 'home', match: ['/'] },
  { to: '/zukan', label: '図鑑', icon: 'book', match: ['/zukan', '/type', '/complete'] },
  { to: '/diagnosis', label: '診断', icon: 'quiz', match: ['/diagnosis'] },
  { to: '/mypage', label: 'マイページ', icon: 'user', match: ['/mypage'] },
];

/** タブバーを隠す画面（没入系） */
const IMMERSIVE = ['/diagnosis/play', '/result'];

export function AppShell() {
  const { pathname } = useLocation();
  const immersive = IMMERSIVE.some((p) => pathname.startsWith(p));
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="stage">
      <div className="phone">
        <div className="bg" aria-hidden="true">
          <span className="bg__cloud bg__cloud--1" />
          <span className="bg__cloud bg__cloud--2" />
          <span className="bg__cloud bg__cloud--3" />
        </div>
        <div ref={scrollRef} className={`viewport ${immersive ? 'viewport--immersive' : ''}`}>
          <Outlet />
        </div>
        {!immersive && <TabBar pathname={pathname} />}
      </div>
    </div>
  );
}

function TabBar({ pathname }: { pathname: string }) {
  const nav = useNavigate();
  const isActive = (match: string[]) =>
    match.some((m) => (m === '/' ? pathname === '/' : pathname.startsWith(m)));
  const friendsActive = pathname.startsWith('/friends') || pathname.startsWith('/compat');
  const [home, zukan, diag, me] = TABS;
  const tab = (t: (typeof TABS)[number]) => (
    <NavLink key={t.to} to={t.to} className={`tabbar__item ${isActive(t.match) ? 'is-active' : ''}`} end>
      <Icon name={t.icon} size={23} />
      <span>{t.label}</span>
    </NavLink>
  );
  return (
    <nav className="tabbar" aria-label="メインメニュー">
      {tab(home)}
      {tab(zukan)}
      <button className={`tabbar__center ${friendsActive ? 'is-active' : ''}`} onClick={() => nav('/friends')} aria-label="ともだち・相性">
        <span className="tabbar__star">
          <Icon name="star" size={26} stroke={0} fill="#fff" />
        </span>
        <span className="tabbar__center-label">ともだち</span>
      </button>
      {tab(diag)}
      {tab(me)}
    </nav>
  );
}
