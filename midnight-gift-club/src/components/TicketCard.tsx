import { TICKET_ART } from '../assets/art';
import { THEMES } from '../data/themes';
import { isExpired } from '../store';
import type { Ticket } from '../types';
import { CrownFill } from './Icons';

interface Props {
  ticket: Ticket;
  /** true: 素材ボードの大きなチケット（For you ♡ ・絵柄・バーコード）。false: 一覧用の細いチケット */
  hero?: boolean;
  onClick?: () => void;
}

export function formatSerial(n: number): string {
  return `No.${String(n).padStart(3, '0')}`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return 'なし';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${y}.${m}.${d}`;
}

function Art({ ticket }: { ticket: Ticket }) {
  const src = TICKET_ART[ticket.theme];
  return src ? <img className="tk__art" src={src} alt="" draggable={false} /> : <CrownFill className="tk__art tk__art--crown" size={64} />;
}

export function TicketCard({ ticket, hero, onClick }: Props) {
  const expired = isExpired(ticket);
  const used = ticket.status === 'used';
  const Tag = onClick ? 'button' : 'div';
  const [first, second] = THEMES[ticket.theme].label.split(' ');

  const badge = (used || expired) && (
    <span className={`tk__badge${used ? '' : ' tk__badge--warn'}`}>{used ? '使用済み' : '期限切れ'}</span>
  );

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`ticket-wrap${hero ? ' ticket-wrap--hero' : ''}${used ? ' is-used' : ''}`}
      aria-label={`${THEMES[ticket.theme].label} ${ticket.title}`}
    >
      {hero ? (
        <div className={`ticket ticket--full th-${ticket.theme}`}>
          <div className="tk__frame" />
          <div className="tk__for">For you ♡</div>
          <div className="tk__main">
            <div className="tk__kind">
              {first}
              <br />
              {second}
            </div>
            <div className="tk__pill">{ticket.title}</div>
            <Art ticket={ticket} />
          </div>
          <div className="tk__stub">
            <CrownFill className="tk__crown" size={26} />
            <span className="tk__no">{formatSerial(ticket.serialNo)}</span>
            <span className="tk__barcode" aria-hidden="true" />
          </div>
          {badge}
        </div>
      ) : (
        <div className={`ticket ticket--compact th-${ticket.theme}`}>
          <div className="tk__frame" />
          <div className="tk__thumb">
            <Art ticket={ticket} />
          </div>
          <div className="tk__text">
            <div className="tk__kind">{THEMES[ticket.theme].label}</div>
            <div className="tk__title">{ticket.title}</div>
          </div>
          <span className="tk__no tk__no--corner">{formatSerial(ticket.serialNo)}</span>
          {badge}
        </div>
      )}
    </Tag>
  );
}
