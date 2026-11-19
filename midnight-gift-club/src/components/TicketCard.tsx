import { THEMES } from '../data/themes';
import { isExpired } from '../store';
import type { Ticket } from '../types';
import { ThemeIcon } from './Icons';

interface Props {
  ticket: Ticket;
  /** hero: 詳細画面で大きく表示 */
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

export function TicketCard({ ticket, hero, onClick }: Props) {
  const expired = isExpired(ticket);
  const used = ticket.status === 'used';
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`ticket-wrap${hero ? ' ticket-wrap--hero' : ''}${used ? ' is-used' : ''}`}
      aria-label={`${THEMES[ticket.theme].label} ${ticket.title}`}
    >
      <div className={`ticket th-${ticket.theme}`}>
        <div className="ticket__border" />
        <div className="ticket__main">
          <div className="ticket__icon">
            <ThemeIcon theme={ticket.theme} size={hero ? 46 : 34} />
          </div>
          <div className="ticket__text">
            <div className="ticket__kind">{THEMES[ticket.theme].label}</div>
            <div className="ticket__title">{ticket.title}</div>
          </div>
        </div>
        <div className="ticket__stub">
          <span className="ticket__serial">{formatSerial(ticket.serialNo)}</span>
          <span className="barcode" aria-hidden="true" />
        </div>
        {(used || expired) && (
          <span className={`ticket__badge${used ? '' : ' ticket__badge--warn'}`}>{used ? '使用済み' : '期限切れ'}</span>
        )}
      </div>
    </Tag>
  );
}
