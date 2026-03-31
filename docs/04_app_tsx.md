# 全体の司令塔（App.tsx）

## ファイルの役割

`App.tsx` はアプリ全体の「状態管理」と「画面切り替え」を担っています。
どの画面を表示するか、何問目か、何問正解したか…といった情報をここで一元管理しています。

---

## 状態（useState）の一覧

```typescript
const [screen, setScreen] = useState<Screen>("menu");
// 今どの画面を表示するか。最初は "menu"

const [level, setLevel] = useState<Level>("junior");
// 選ばれたレベル。クリア画面で「もう一度」したとき同じレベルで再挑戦するために保持する

const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
// 出題する問題のリスト（レベル選択後にシャッフルして格納）

const [currentIndex, setCurrentIndex] = useState(0);
// 今何問目か（0始まり）

const [correctCount, setCorrectCount] = useState(0);
// 正解数
```

### なぜ「状態」を使うのか？

React では「状態（state）が変わると画面が自動で更新される」仕組みになっています。
たとえば `screen` を `"quiz"` に変えると、自動的に問題画面が表示されます。
普通の変数を書き換えるだけでは画面は更新されません。

---

## シャッフル処理

```typescript
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];  // 元の配列を壊さないようにコピーを作る
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];  // 2つの要素を入れ替える
  }
  return copy;
}
```

「Fisher-Yates シャッフル」という定番のアルゴリズムです。
末尾から順番に、ランダムな位置と入れ替えることで均一にシャッフルできます。

`<T>` は「ジェネリクス」と呼ばれる書き方で、「どんな型の配列でも使える」という意味です。
今回は `Question[]`（問題の配列）に使っていますが、他の型の配列にも使い回せます。

---

## 画面切り替えの仕組み

```tsx
{screen === "menu" && <MenuScreen onStart={handleStart} />}
{screen === "quiz" && quizQuestions.length > 0 && (
  <QuizScreen ... />
)}
{screen === "clear" && (
  <ClearScreen ... />
)}
```

`&&` は「左が true のときだけ右を表示する」という意味です。
`screen` の値に応じて、3つの画面のうち1つだけが表示されます。

---

## イベントハンドラー

### `handleStart`：ゲーム開始

```typescript
const handleStart = useCallback((selectedLevel: Level) => {
  const filtered = shuffle(questions.filter((q) => q.level === selectedLevel));
  // 選んだレベルの問題だけを取り出して → シャッフルする
  setLevel(selectedLevel);
  setQuizQuestions(filtered);
  setCurrentIndex(0);
  setCorrectCount(0);
  setScreen("quiz"); // 問題画面へ
}, []);
```

### `handleNext`：次の問題へ

```typescript
const handleNext = useCallback((isCorrect: boolean) => {
  const nextCorrect = isCorrect ? correctCount + 1 : correctCount;
  const nextIndex = currentIndex + 1;

  if (nextIndex >= quizQuestions.length) {
    // 全問終了 → クリア画面へ
    setCorrectCount(nextCorrect);
    setScreen("clear");
  } else {
    // まだ問題が残っている → インデックスを進める
    setCorrectCount(nextCorrect);
    setCurrentIndex(nextIndex);
  }
}, [correctCount, currentIndex, quizQuestions.length]);
```

---

## `useCallback` とは？

```typescript
const handleStart = useCallback(() => { ... }, []);
```

関数を「キャッシュ」するための React フックです。
依存配列（第2引数）の中身が変わらない限り、同じ関数オブジェクトを使い回します。
子コンポーネントへ関数を渡すとき、不要な再レンダリングを防ぐ効果があります。

---

## コンポーネントへの `props` の渡し方

```tsx
<MenuScreen onStart={handleStart} />
```

`onStart` という名前で `handleStart` 関数を `MenuScreen` に渡しています。
`MenuScreen` の中でボタンが押されたとき、`onStart(selectedLevel)` と呼び出すことで、
`App.tsx` の `handleStart` が実行されます。

このように「子コンポーネントの出来事を親に伝える」パターンを「コールバック関数」と呼びます。
