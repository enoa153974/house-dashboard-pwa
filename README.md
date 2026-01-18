# House Dashboard PWA

家に余っている Android タブレットを **横置きスマートディスプレイ**として活用するための  
**家族用ダッシュボード PWA**。

時計・天気・家族ページ・おうち情報などを常設表示し、  
「見るだけで今の状況が分かる」ことを重視した設計。

---

## コンセプト

- 家族専用・据え置き利用前提
- 横置き Android タブレット特化
- 操作より **視認性・即時性**を優先
- 機能は増やしすぎず、必要なものだけ
- 将来の拡張（Firestore / PWA強化）を見据えた構成

---

## メイン画面の役割

**「今、この家がどういう状態かを一瞬で把握する」**

### 表示内容（確定）

- 大きめデジタル時計（最優先）
- 今日の天気
- 各人ページへのボタン（ゆうま / あしゃ / そーくん）
- ちゃっぴー起動ボタン（ChatGPT へワンクリック）
- おうちの情報
  - ゴミの日の情報
  - 家族へのメモ（ホワイトボード的・一時的）

---

## 個人ページ（予定）

- **ゆうま**
  - 今日の予定
  - 今やること（最大3つ）
  - 安心・見通し重視

- **あしゃ**
  - TODO / メモ
  - 作業や家計の思考補助

- **そーくん**
  - 時刻・天気
  - ワンタップ外部リンク
  - 応援メッセージ

---

## 技術スタック

- **Vite**
- **Handlebars（vite-plugin-handlebars）**
- **Sass**
- **ES Modules**
- **PWA対応（予定）**
- **Firestore（必要になった場合のみ導入）**
- デプロイ先：**Vercel**

---

## ディレクトリ構成

```txt
/
├ index.html                # メイン画面（エントリ）
├ vite.config.js
├ package.json
├ dist/                     # build 出力
│
├ public/                   # そのまま配信される静的ファイル
│  ├ icons/
│  └ images/
│
└ src/
   ├ pages/                 # 下層ページ
   │  ├ yuuma.html
   │  ├ asha.html
   │  └ so.html
   │
   ├ partials/              # handlebars partials
   │
   ├ styles/
   │  └ style.scss          # 共通スタイル
   │
   ├ scripts/
   │  ├ main.js             # アプリ初期化（JS/CSSの起点）
   │  ├ clock.js
   │  ├ weather.js
   │  ├ garbage.js
   │  └ homeMemo.js
   │
   ├ assets/
   │  └ js/
   │     └ hamburger.js
   │
   └ data/                  # JSON管理データ
      ├ family.json
      ├ garbage.json
      └ config.json

---

## 開発メモ
main.js は アプリ全体の初期化ハブ。

・CSS（Sass）の読み込み
・各機能JSの import
・DOMContentLoaded 後の初期化処理

## パス設計ルール（重要）
・import（JSモジュール）
・相対パスで記述
・基準は「そのJSファイルの場所」


fetch / img / a（データ・リソース）

ルート基準パスで統一
　fetch('/src/data/garbage.json');

データ管理方針
種類	管理方法
家族定義	JSON
ゴミ日	JSON
おうちメモ	localStorage
天気	外部API
共有・履歴	Firestore（必要時のみ）