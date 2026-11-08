# TYPY（タイピー）

> 自分を知る。自分のタイプを知る。

16タイプ × A/T × C/S = **64タイプ** の自己理解型タイプ診断アプリのプロトタイプです（スマートフォン優先のWebアプリ）。

※ TYPYのオリジナル診断です。公式のMBTI®や16Personalitiesの診断ではありません。

## 起動方法

Node.js 20以上が必要です。

```bash
cd typy
npm install
npm run dev
```

ブラウザで http://localhost:5173 を開きます。PCではスマホ枠付きで、スマホでは全画面で表示されます。
同じWi-Fi内のスマホからは、ターミナルに表示される `Network:` のURLで確認できます。

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー |
| `npm run build` | 型チェック + 本番ビルド（`dist/`） |
| `npm run preview` | ビルド結果のプレビュー |

初回はサンプルデータ（ともだち6人・発見済み7タイプ）が入った状態で起動します。
マイページの「データのリセット」から、サンプルの状態に戻したり空にしたりできます。

## 画面

| パス | 画面 |
| --- | --- |
| `#/` | ホーム（図鑑の進み具合・今日のピックアップ） |
| `#/diagnosis` | 診断の説明（A/T・C/Sの定義） |
| `#/diagnosis/play` | 質問画面（適応型・20〜30問） |
| `#/result` | 診断結果「New Friend!」 |
| `#/zukan` | 64タイプ図鑑（グループ・A/T・C/S・発見済みで絞り込み） |
| `#/type/:code` | キャラクター詳細（基本／恋愛／仕事／強み・弱み／相性） |
| `#/compat?a=&b=` | 相性診断 |
| `#/friends` | ともだちリスト・タイプ分布 |
| `#/mypage` | マイページ |
| `#/complete` | 図鑑コンプリートまでの道のり |

## TYPY独自の指標

- **A アシュアード（自信型）／ T テンダー（繊細型）**：自分の判断への確信と、感情の揺れ方
- **C チャレンジャー（挑戦型）／ S ステディ（安定型）**：変化への向き合い方と、エネルギーが高まる環境

タイプコードは `INFP-TS` のように表します。

## ディレクトリ構成

```
src/
  data/          ドメインモデル・コンテンツ（差し替え前提のサンプル）
    model.ts       型定義（TypeCode, Question, UserProfile など）
    baseTypes.ts   16ベースタイプの文章とキャラクター設定
    groups.ts      グループとA/T・C/Sの定義
    questions.ts   質問バンク（6軸 × 8問）
    catalog.ts     64タイプの組み立て・コード変換
  logic/         純粋関数のロジック
    diagnosis.ts   適応型の出題・終了判定・結果計算
    compatibility.ts 相性スコア・相性ポイント
    collection.ts  図鑑の集計
  services/      永続化（TypyRepository インターフェース + localStorage 実装）
  store/         React Context による状態管理
  components/
    character/     キャラクターSVG（16ベース + 表情・小物で64バリエーション）
    ui/            ボタン・カード・タブ・シートなどのデザインシステム
    layout/        アプリの外枠・タブバー
  screens/       各画面
  styles/        tokens.css（デザイントークン）/ base / components / screens
```

### 本番につなぐときは

- **診断ロジック**：`logic/diagnosis.ts` の `nextQuestion` / `estimateTotal` / `computeResult` を同じシグネチャで差し替えます。質問は `Question[]` の形のJSONをAPIから読み込めば、そのまま使えます。
- **DB**：`services/repository.ts` の `TypyRepository` を実装したクラス（API・Firebase・Supabaseなど）を `repository` に差し替えます。
- **キャラクター**：今は仮イラストとしてSVGで描いています。正式なイラストに差し替えるときは、`components/character/TypeVisuals.tsx` の `Portrait` だけを画像表示に変えれば、全画面に反映されます。
