export type Role = 'giver' | 'receiver';

/** チケットの色・デザインの種類（PREMIUM は特典用） */
export type ThemeKey = 'CAFE' | 'TRAVEL' | 'MOVIE' | 'DINNER' | 'RELAX' | 'SECRET' | 'PREMIUM';

export type TicketStatus = 'unused' | 'used';

export interface Ticket {
  id: string;
  /** チケットに大きく表示する名前（例：一緒にカフェに行く券） */
  title: string;
  category: ThemeKey;
  theme: ThemeKey;
  description: string;
  terms: string;
  /** YYYY-MM-DD。null は期限なし */
  expiryDate: string | null;
  serialNo: number;
  status: TicketStatus;
  createdAt: string;
  usedAt: string | null;
  isPremium: boolean;
  sourceRequestId: string | null;
}

export type RequestCategory = 'CAFE' | 'TRAVEL' | 'MOVIE' | 'DINNER' | 'RELAX' | 'OTHER';
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'ON_HOLD' | 'DECLINED' | 'COMPLETED';

export interface TicketRequest {
  id: string;
  category: RequestCategory;
  title: string;
  message: string;
  preferredPlace: string;
  status: RequestStatus;
  createdAt: string;
  reviewedAt: string | null;
  resultingTicketId: string | null;
}

export type NotificationType =
  | 'REQUEST_NEW'
  | 'REQUEST_ACCEPTED'
  | 'REQUEST_ON_HOLD'
  | 'REQUEST_DECLINED'
  | 'TICKET_USED'
  | 'TICKET_ADDED'
  | 'STAMP'
  | 'PREMIUM';

export interface AppNotification {
  id: string;
  recipient: Role;
  type: NotificationType;
  title: string;
  body: string;
  relatedId: string | null;
  createdAt: string;
  readAt: string | null;
}

export interface StampEvent {
  id: string;
  ticketId: string;
  earnedAt: string;
  cardNo: number;
}

export interface StampCard {
  cardNo: number;
  count: number;
  target: number;
}

export interface Profile {
  giverName: string;
  receiverName: string;
}

export type Celebration =
  | { kind: 'stamp'; count: number; ticketId: string }
  | { kind: 'premium'; ticketId: string }
  | null;

export interface AppState {
  role: Role;
  profile: Profile;
  tickets: Ticket[];
  requests: TicketRequest[];
  notifications: AppNotification[];
  stampCard: StampCard;
  stampEvents: StampEvent[];
  celebration: Celebration;
}
