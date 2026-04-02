# Method Quiz — 初学者向けコードリーディングガイド

## このアプリについて

「日本語で考えたことを咄嗟にコードに落とせるエンジニア」になるための練習アプリです。
問題文を読んで、対応する JavaScript/TypeScript のメソッド名をテキストで入力して答えます。

---

## 画面構成

```
MenuScreen（レベル選択）
    ↓ レベルを選ぶ
QuizScreen（問題画面）
    ↓ 全問終了
ClearScreen（結果画面）
```

3 つの画面（コンポーネント）が `App.tsx` の `screen` という state で切り替わります。

---

## ファイル構成と役割

```
src/
├── App.tsx                   # アプリ全体の状態管理・画面切替
├── App.module.css            # ヘッダー・レイアウトのスタイル
├── index.css                 # CSS変数（ライト/ダークの色定義）
├── types.ts                  # 型定義（Question, Level, Screen）
├── data/
│   └── questions.ts          # 問題データ（30問）
└── components/
    ├── MenuScreen.tsx         # レベル選択画面
    ├── QuizScreen.tsx         # 問題・入力・判定画面
    └── ClearScreen.tsx        # 結果表示画面
```

---

## 状態管理の流れ（App.tsx）

`App.tsx` が全体の状態を持ち、子コンポーネントへ props で渡します。

```tsx
// 現在の画面
const [screen, setScreen] = useState<Screen>("menu");

// 選択したレベル
const [level, setLevel] = useState<Level>("junior");

// 出題する問題リスト（シャッフル済み）
const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
```

### 画面遷移のトリガー

| イベント | 起こること |
|----------|------------|
| レベルボタンを押す | `handleStart` → 問題をシャッフルして `screen = "quiz"` |
| 全問回答 | `handleNext` → `screen = "clear"` |
| もう一度 / メニューへ | `handleRetry` / `handleMenu` |

---

## 答え合わせの仕組み（QuizScreen.tsx）

```tsx
function normalize(str: string): string {
  return str.replace(/　/g, " ").trim(); // 全角スペースを半角に変換
}

function judge(input: string, answers: string[]): boolean {
  return answers.some((answer) => normalize(input) === answer);
}
```

- 入力値を正規化してから `question.answer`（文字列配列）と照合します
- 複数の正解表記（例：`forEach` と `for...of`）を配列で定義できます
- Enter キーで「回答 → 次の問題」と進めます

---

## 問題データの構造（data/questions.ts）

```ts
{
  id: "array-1",
  level: "junior",         // "junior" | "middle"
  category: "配列",
  question: "配列の各要素に処理をしたいとき、何メソッドを使う？",
  answer: ["forEach"],     // 正解の文字列配列（複数可）
  supplement: "forEach は戻り値がない。変換結果が欲しければ map を使う。",
}
```

### 問題を追加するには

`src/data/questions.ts` の配列に 1 オブジェクト追加するだけです。  
`id` はユニークな文字列にしてください。

---

## ダークモードの仕組み

```tsx
// App.tsx
const [isDark, setIsDark] = useState(() => {
  return localStorage.getItem("theme") === "dark"; // 前回の設定を復元
});

useEffect(() => {
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}, [isDark]);
```

```css
/* index.css */
:root { --bg-app: #f5f5f5; --text-main: #1a1a1a; }
[data-theme="dark"] { --bg-app: #0f0f0f; --text-main: #e8e8e8; }
```

`data-theme` 属性を `<html>` に付け替えることで、CSS 変数が切り替わります。  
設定は `localStorage` に保存されるので、再訪問しても引き継がれます。

---

## ヘッダーの構成（App.tsx + App.module.css）

```tsx
<header className={styles.header}>
  <span className={styles.logo}>Method Quiz</span>
  <button className={styles.themeToggle}>🌙</button>
</header>
```

- `position: fixed` で画面上部に固定
- `justify-content: space-between` でロゴ左・ボタン右に配置
- `<main>` に `padding-top: 4.25rem` を入れてヘッダー分の余白を確保

---

## ローカルでの起動方法

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開く。

## デプロイ

`main` ブランチに push すると GitHub Actions が自動で GitHub Pages にデプロイします。
