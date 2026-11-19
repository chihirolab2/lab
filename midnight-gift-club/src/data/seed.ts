import { STAMP_TARGET } from './themes';
import type { AppState, Ticket, TicketRequest } from '../types';

const now = () => new Date().toISOString();

function t(
  n: number,
  theme: Ticket['theme'],
  title: string,
  description: string,
  terms: string,
  expiryDate: string | null,
): Ticket {
  return {
    id: `seed-ticket-${n}`,
    title,
    category: theme,
    theme,
    description,
    terms,
    expiryDate,
    serialNo: n,
    status: 'unused',
    createdAt: now(),
    usedAt: null,
    isPremium: false,
    sourceRequestId: null,
  };
}

export function createSeedState(): AppState {
  const tickets: Ticket[] = [
    t(1, 'CAFE', '一緒にカフェに行く券', 'おいしいカフェで、ゆっくりしよう。', '一緒に行くこと。好きなカフェでOK。', null),
    t(2, 'TRAVEL', '一緒に旅行に行く券', '次の旅行は、ふたりで。行き先は一緒に決めよう。', '日程は相談して決める。', null),
    t(3, 'MOVIE', '一緒に映画を観る券', '好きな映画を選んで、一緒に観よう。', '特になし！', null),
    t(4, 'DINNER', '一緒にディナーに行く券', '少し特別な夜ごはんを、ふたりで。', 'お店は相談して決める。', null),
    t(5, 'RELAX', '一緒にのんびりする券', '予定を入れずに、ゆっくり過ごそう。', 'スマホは控えめに。', null),
    t(6, 'SECRET', 'ふたりだけの秘密の券', '何が起きるかは、使ってからのお楽しみ。', '内容は贈り主におまかせ。', null),
  ];

  // 動作確認用のサンプルリクエスト（MY PAGE の「データをリセット」では空にできます）
  const requests: TicketRequest[] = [
    {
      id: 'seed-request-1',
      category: 'FOOD',
      title: '新しくできたカフェに行きたい',
      message: '駅の近くにできたパンケーキのお店が気になっています。',
      preferredPlace: '',
      status: 'PENDING',
      createdAt: now(),
      reviewedAt: null,
      resultingTicketId: null,
    },
  ];

  return {
    role: 'giver',
    profile: { giverName: '', receiverName: '' },
    tickets,
    requests,
    notifications: [
      {
        id: 'seed-notif-1',
        recipient: 'giver',
        type: 'REQUEST_NEW',
        title: '新しいリクエストが届きました',
        body: '「新しくできたカフェに行きたい」',
        relatedId: 'seed-request-1',
        createdAt: now(),
        readAt: null,
      },
    ],
    stampCard: { cardNo: 1, count: 0, target: STAMP_TARGET },
    stampEvents: [],
    celebration: null,
  };
}
