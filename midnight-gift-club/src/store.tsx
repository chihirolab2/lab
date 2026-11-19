import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { createSeedState } from './data/seed';
import { STAMP_TARGET } from './data/themes';
import type {
  AppNotification,
  AppState,
  NotificationType,
  RequestStatus,
  Role,
  Ticket,
  TicketRequest,
} from './types';

const STORAGE_KEY = 'mgc.v2';

export function uid(prefix: string): string {
  const r =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}-${r}`;
}

/** YYYY-MM-DD（端末のローカル日付） */
export function todayStr(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function isExpired(t: Ticket): boolean {
  return t.status === 'unused' && t.expiryDate !== null && t.expiryDate < todayStr();
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      if (parsed && Array.isArray(parsed.tickets) && parsed.stampCard) {
        return { ...parsed, celebration: null };
      }
    }
  } catch {
    /* localStorage が使えない・壊れている場合は初期データ */
  }
  return createSeedState();
}

type NewTicketInput = Omit<Ticket, 'id' | 'serialNo' | 'status' | 'createdAt' | 'usedAt' | 'isPremium' | 'sourceRequestId'>;

type Action =
  | { type: 'setRole'; role: Role }
  | { type: 'setProfile'; giverName: string; receiverName: string }
  | { type: 'readNotification'; id: string }
  | { type: 'readAllNotifications'; role: Role }
  | { type: 'useTicket'; ticketId: string; ids: { event: string; notif: string; premiumTicket: string; premiumNotif: string } }
  | { type: 'createTicket'; id: string; input: NewTicketInput; fromRequestId?: string; notifId: string }
  | { type: 'updateTicket'; id: string; input: NewTicketInput }
  | { type: 'deleteTicket'; id: string }
  | { type: 'sendRequest'; id: string; notifId: string; input: Pick<TicketRequest, 'category' | 'title' | 'message' | 'preferredPlace'> }
  | { type: 'holdOrDecline'; id: string; status: 'ON_HOLD' | 'DECLINED'; notifId: string }
  | { type: 'dismissCelebration' }
  | { type: 'reset' };

function notif(
  id: string,
  recipient: Role,
  type: NotificationType,
  title: string,
  body: string,
  relatedId: string | null,
): AppNotification {
  return { id, recipient, type, title, body, relatedId, createdAt: new Date().toISOString(), readAt: null };
}

function nextSerial(tickets: Ticket[]): number {
  return tickets.reduce((m, t) => Math.max(m, t.serialNo), 0) + 1;
}

function reducer(state: AppState, a: Action): AppState {
  switch (a.type) {
    case 'setRole':
      return { ...state, role: a.role };

    case 'setProfile':
      return { ...state, profile: { giverName: a.giverName.trim(), receiverName: a.receiverName.trim() } };

    case 'readNotification':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === a.id && !n.readAt ? { ...n, readAt: new Date().toISOString() } : n,
        ),
      };

    case 'readAllNotifications':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.recipient === a.role && !n.readAt ? { ...n, readAt: new Date().toISOString() } : n,
        ),
      };

    case 'useTicket': {
      const ticket = state.tickets.find((t) => t.id === a.ticketId);
      // 二重使用の防止・期限切れチケットは使えない
      if (!ticket || ticket.status === 'used' || isExpired(ticket)) return state;

      const usedAt = new Date().toISOString();
      let tickets = state.tickets.map((t) => (t.id === ticket.id ? { ...t, status: 'used' as const, usedAt } : t));
      let requests = state.requests;
      let notifications = [
        notif(a.ids.notif, 'giver', 'TICKET_USED', 'チケットが使われました', `「${ticket.title}」`, ticket.id),
        ...state.notifications,
      ];

      if (ticket.sourceRequestId) {
        requests = requests.map((r) =>
          r.id === ticket.sourceRequestId ? { ...r, status: 'COMPLETED' as RequestStatus } : r,
        );
      }

      let stampCard = state.stampCard;
      let stampEvents = state.stampEvents;
      let celebration: AppState['celebration'] = state.celebration;

      // スタンプは通常チケットの使用のみ（プレミアムは対象外：仕様未確定のため暫定）
      if (!ticket.isPremium) {
        const count = stampCard.count + 1;
        stampEvents = [
          { id: a.ids.event, ticketId: ticket.id, earnedAt: usedAt, cardNo: stampCard.cardNo },
          ...stampEvents,
        ];
        if (count >= stampCard.target) {
          const premium: Ticket = {
            id: a.ids.premiumTicket,
            title: 'ふたりの特別なお願いを叶える券',
            category: 'PREMIUM',
            theme: 'PREMIUM',
            description: 'スタンプを10個集めたごほうび。内容は贈り主が自由に決められます。',
            terms: '内容は贈り主と相談して決める。',
            expiryDate: null,
            serialNo: nextSerial(tickets),
            status: 'unused',
            createdAt: usedAt,
            usedAt: null,
            isPremium: true,
            sourceRequestId: null,
          };
          tickets = [...tickets, premium];
          notifications = [
            notif(a.ids.premiumNotif, 'giver', 'PREMIUM', 'プレミアムチケットが発行されました', 'スタンプが10個たまりました。内容を整えてあげましょう。', premium.id),
            ...notifications,
          ];
          stampCard = { cardNo: stampCard.cardNo + 1, count: 0, target: STAMP_TARGET };
          celebration = { kind: 'premium', ticketId: premium.id };
        } else {
          stampCard = { ...stampCard, count };
          celebration = { kind: 'stamp', count, ticketId: ticket.id };
        }
      }

      return { ...state, tickets, requests, notifications, stampCard, stampEvents, celebration };
    }

    case 'createTicket': {
      const ticket: Ticket = {
        ...a.input,
        id: a.id,
        serialNo: nextSerial(state.tickets),
        status: 'unused',
        createdAt: new Date().toISOString(),
        usedAt: null,
        isPremium: false,
        sourceRequestId: a.fromRequestId ?? null,
      };
      let requests = state.requests;
      let notifications = state.notifications;
      if (a.fromRequestId) {
        requests = requests.map((r) =>
          r.id === a.fromRequestId
            ? { ...r, status: 'ACCEPTED' as RequestStatus, reviewedAt: new Date().toISOString(), resultingTicketId: ticket.id }
            : r,
        );
        notifications = [
          notif(a.notifId, 'receiver', 'REQUEST_ACCEPTED', 'リクエストが採用されました', `「${ticket.title}」がチケットに加わりました`, ticket.id),
          ...notifications,
        ];
      } else {
        notifications = [
          notif(a.notifId, 'receiver', 'TICKET_ADDED', '新しいチケットが届きました', `「${ticket.title}」`, ticket.id),
          ...notifications,
        ];
      }
      return { ...state, tickets: [...state.tickets, ticket], requests, notifications };
    }

    case 'updateTicket':
      return {
        ...state,
        tickets: state.tickets.map((t) => (t.id === a.id && t.status === 'unused' ? { ...t, ...a.input } : t)),
      };

    case 'deleteTicket':
      return { ...state, tickets: state.tickets.filter((t) => !(t.id === a.id && t.status === 'unused' && !t.isPremium)) };

    case 'sendRequest': {
      const req: TicketRequest = {
        ...a.input,
        id: a.id,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        reviewedAt: null,
        resultingTicketId: null,
      };
      return {
        ...state,
        requests: [req, ...state.requests],
        notifications: [
          notif(a.notifId, 'giver', 'REQUEST_NEW', '新しいリクエストが届きました', `「${req.title}」`, req.id),
          ...state.notifications,
        ],
      };
    }

    case 'holdOrDecline': {
      const req = state.requests.find((r) => r.id === a.id);
      if (!req || req.status !== 'PENDING' && req.status !== 'ON_HOLD') return state;
      const hold = a.status === 'ON_HOLD';
      return {
        ...state,
        requests: state.requests.map((r) =>
          r.id === a.id ? { ...r, status: a.status, reviewedAt: new Date().toISOString() } : r,
        ),
        notifications: [
          notif(
            a.notifId,
            'receiver',
            hold ? 'REQUEST_ON_HOLD' : 'REQUEST_DECLINED',
            hold ? 'リクエストは検討中です' : 'リクエストについてのお知らせ',
            hold ? `「${req.title}」はもう少し考えさせてね` : `「${req.title}」は今回は見送りになりました。また教えてね`,
            req.id,
          ),
          ...state.notifications,
        ],
      };
    }

    case 'dismissCelebration':
      return { ...state, celebration: null };

    case 'reset':
      return { ...createSeedState(), role: state.role, profile: state.profile, requests: [], notifications: [] };
  }
}

interface Ctx {
  state: AppState;
  dispatch: (a: Action) => void;
  /** 現在のロールに届いた通知 */
  myNotifications: AppNotification[];
  unreadCount: number;
  pendingRequestCount: number;
  actions: {
    setRole: (role: Role) => void;
    setProfile: (giverName: string, receiverName: string) => void;
    readNotification: (id: string) => void;
    readAllNotifications: () => void;
    useTicket: (ticketId: string) => void;
    createTicket: (input: NewTicketInput, fromRequestId?: string) => string;
    updateTicket: (id: string, input: NewTicketInput) => void;
    deleteTicket: (id: string) => void;
    sendRequest: (input: Pick<TicketRequest, 'category' | 'title' | 'message' | 'preferredPlace'>) => void;
    holdOrDecline: (id: string, status: 'ON_HOLD' | 'DECLINED') => void;
    dismissCelebration: () => void;
    reset: () => void;
  };
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, celebration: null }));
    } catch {
      /* 保存できなくても動作は継続 */
    }
  }, [state]);

  const value = useMemo<Ctx>(() => {
    const myNotifications = state.notifications
      .filter((n) => n.recipient === state.role)
      .sort((x, y) => y.createdAt.localeCompare(x.createdAt));
    return {
      state,
      dispatch,
      myNotifications,
      unreadCount: myNotifications.filter((n) => !n.readAt).length,
      pendingRequestCount: state.requests.filter((r) => r.status === 'PENDING').length,
      actions: {
        setRole: (role) => dispatch({ type: 'setRole', role }),
        setProfile: (giverName, receiverName) => dispatch({ type: 'setProfile', giverName, receiverName }),
        readNotification: (id) => dispatch({ type: 'readNotification', id }),
        readAllNotifications: () => dispatch({ type: 'readAllNotifications', role: state.role }),
        useTicket: (ticketId) =>
          dispatch({
            type: 'useTicket',
            ticketId,
            ids: { event: uid('stamp'), notif: uid('notif'), premiumTicket: uid('ticket'), premiumNotif: uid('notif') },
          }),
        createTicket: (input, fromRequestId) => {
          const id = uid('ticket');
          dispatch({ type: 'createTicket', id, input, fromRequestId, notifId: uid('notif') });
          return id;
        },
        updateTicket: (id, input) => dispatch({ type: 'updateTicket', id, input }),
        deleteTicket: (id) => dispatch({ type: 'deleteTicket', id }),
        sendRequest: (input) => dispatch({ type: 'sendRequest', id: uid('req'), notifId: uid('notif'), input }),
        holdOrDecline: (id, status) => dispatch({ type: 'holdOrDecline', id, status, notifId: uid('notif') }),
        dismissCelebration: () => dispatch({ type: 'dismissCelebration' }),
        reset: () => dispatch({ type: 'reset' }),
      },
    };
  }, [state]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp must be used within AppProvider');
  return c;
}

export type { NewTicketInput };
