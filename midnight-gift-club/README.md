# MIDNIGHT GIFT CLUB（仮称）

恋人・好きな人と「一緒にしたいこと」をチケットとして贈り合う、2人用のデジタルチケットブック。
スマホ向けの Web アプリ（PWA）。ホーム画面に追加するとアプリのように起動できます。

## フォルダ構成

```
midnight-gift-club/
├─ docs/
│  ├─ handoff/              引き継ぎ資料（まず README_引き継ぎ.md を読む）
│  └─ design/
│     ├─ moodboards/        デザイン方向性ボード 8点（方向性の参考。UIはコードで再構築）
│     └─ references/        参考画像 2点
├─ public/                  manifest・アイコン・service worker
└─ src/
   ├─ data/                 テーマ定義・初期データ
   ├─ components/           TicketCard / GiftBox / Layout / Celebration …
   ├─ pages/                HOME / TICKETS / 詳細・編集 / REQUEST / STAMP / 履歴 / 通知 / MY PAGE
   ├─ store.tsx             状態管理（ロジックはここに集約）
   └─ styles.css
```

## 使い方

```bash
npm install
npm run dev        # 開発サーバー（http://localhost:5174）
npm run build      # 型チェック + 本番ビルド（dist/）
npm run preview    # ビルド結果の確認
```

スマホで試すには、同じ Wi-Fi で `npm run dev` の Network URL を開く。
iPhone は Safari の「共有 → ホーム画面に追加」、Android は Chrome の「ホーム画面に追加」。

## 現在できること（v0.1 プロトタイプ）

- HOME / TICKETS / REQUEST / STAMP の下部タブ、通知ベル、MY PAGE
- チケットの作成・編集・削除（贈り主）、使用（受け取り側）。使用前に確認、二重使用は不可
- リクエスト送信 → 受信箱 → 採用（チケット化）/ 保留 / 見送り → 使用で COMPLETED
- スタンプ（初期 0/10）。通常チケット使用で +1、10 個でプレミアムチケットを自動発行し 0/10 から再開
- 使用済みチケット・過去のリクエストの履歴、アプリ内通知

画面右上のメニュー → MY PAGE で「贈り主 / 受け取り側」を切り替えて、ひとりで両方の動作を確認できます。

## 未実装（次の段階）

データは**この端末のブラウザ内（localStorage）だけ**に保存されます。2人の端末で同期するには次が必要です。

1. バックエンドと認証（例：Supabase / Firebase）、ペア作成・招待リンク
2. Web Push 通知（許可取得と配信基盤）
3. ストア配信が必要なら Capacitor でネイティブアプリ化（iOS/Android）

## 仕様の暫定判断（`docs/handoff/README_引き継ぎ.md` の「未確定事項」より）

- プレミアムチケットの使用ではスタンプを付与しない
- 期限切れの未使用チケットは使えない（贈り主が期限を編集すれば再び使える）
- リクエスト見送り時は「今回は見送りになりました。また教えてね」とやさしく表示
- 通知はアプリ内のみ
