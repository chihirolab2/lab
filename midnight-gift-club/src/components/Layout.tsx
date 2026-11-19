import { type ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { BackIcon, BellIcon, CrownIcon, HomeIcon, MenuIcon, SendIcon, TicketIcon } from './Icons';

export type Tone = 'night' | 'day';

interface ScreenProps {
  tone: Tone;
  title?: string;
  /** 戻るボタンを表示する場合の遷移先（-1 で履歴を戻る） */
  back?: string | -1;
  /** 右上に通知ベルとメニューを表示 */
  actions?: boolean;
  hideTabs?: boolean;
  children: ReactNode;
}

export function Screen({ tone, title, back, actions, hideTabs, children }: ScreenProps) {
  const navigate = useNavigate();
  const { unreadCount } = useApp();
  return (
    <div className={`screen screen--${tone}`}>
      <header className="topbar">
        <div className="topbar__side">
          {back !== undefined && (
            <button className="icon-btn" aria-label="戻る" onClick={() => (back === -1 ? navigate(-1) : navigate(back))}>
              <BackIcon />
            </button>
          )}
        </div>
        <h1 className="topbar__title">{title}</h1>
        <div className="topbar__side topbar__side--right">
          {actions && (
            <>
              <button className="icon-btn" aria-label={`通知${unreadCount ? `（未読${unreadCount}件）` : ''}`} onClick={() => navigate('/notifications')}>
                <BellIcon />
                {unreadCount > 0 && <span className="dot-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
              </button>
              <button className="icon-btn" aria-label="メニュー" onClick={() => navigate('/menu')}>
                <MenuIcon />
              </button>
            </>
          )}
        </div>
      </header>
      <main className={`screen__body${hideTabs ? ' screen__body--notabs' : ''}`}>{children}</main>
      {!hideTabs && <TabBar />}
    </div>
  );
}

function TabBar() {
  const { pendingRequestCount, state } = useApp();
  const { pathname } = useLocation();
  const requestBadge = state.role === 'giver' ? pendingRequestCount : 0;
  const tabs = [
    { to: '/', label: 'HOME', icon: <HomeIcon />, end: true, active: pathname === '/' },
    { to: '/tickets', label: 'TICKETS', icon: <TicketIcon />, active: pathname.startsWith('/tickets') },
    { to: '/request', label: 'REQUEST', icon: <SendIcon />, active: pathname.startsWith('/request'), badge: requestBadge },
    { to: '/stamp', label: 'STAMP', icon: <CrownIcon />, active: pathname.startsWith('/stamp') },
  ];
  return (
    <nav className="tabbar" aria-label="メインメニュー">
      {tabs.map((t) => (
        <NavLink key={t.to} to={t.to} end={t.end} className={`tabbar__item${t.active ? ' is-active' : ''}`} aria-current={t.active ? 'page' : undefined}>
          <span className="tabbar__icon">
            {t.icon}
            {!!t.badge && <span className="dot-badge">{t.badge}</span>}
          </span>
          <span className="tabbar__label">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export function Sheet({ children, onClose, label }: { children: ReactNode; onClose?: () => void; label: string }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={label} onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
