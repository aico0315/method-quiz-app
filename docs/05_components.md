# 各コンポーネントの解説

## MenuScreen.tsx：レベル選択画面

```tsx
interface Props {
  onStart: (level: Level) => void;
}
```

`Props` は「このコンポーネントが受け取るデータの型」です。
`onStart` という関数を1つ受け取ります。`(level: Level) => void` は「Level 型の引数をとって、何も返さない関数」という意味です。

```tsx
const levels = [
  { value: "junior", label: "Junior", description: "配列・文字列・Objectの基本メソッド" },
  { value: "middle", label: "Middle", description: "flatMap・Promise・応用メソッド" },
];
```

レベルの一覧をデータとして持ち、`map` でボタンに変換しています。
「データを元に要素を繰り返し表示する」ときの定番パターンです。

```tsx
{levels.map((level) => (
  <button key={level.value} onClick={() => onStart(level.value)}>
    ...
  </button>
))}
```

`key` はReactが各要素を識別するために必要な一意のIDです。ループの中では必ず指定します。

---

## QuizScreen.tsx：問題・回答画面

最も複雑なコンポーネントです。「回答前」と「回答後」で表示が切り替わります。

### 状態

```typescript
const [input, setInput] = useState("");
// テキストボックスの入力内容

const [submitted, setSubmitted] = useState(false);
// 回答したか（false = 未回答 / true = 回答済み）

const [isCorrect, setIsCorrect] = useState(false);
// 正解だったか
```

### `useRef` でテキストボックスにフォーカス

```typescript
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  setInput("");
  setSubmitted(false);
  inputRef.current?.focus(); // テキストボックスに自動フォーカス
}, [question.id]);
```

`useRef` は「DOM要素（実際のHTML要素）を直接操作したいとき」に使います。
`useEffect` は「問題（question.id）が変わるたびに実行」するように設定しています。
次の問題に移るたび、入力内容がリセットされ、自動でフォーカスが当たります。

### 正誤判定のロジック

```typescript
function normalize(str: string): string {
  return str.replace(/　/g, " ").trim();
  // 全角スペースを半角スペースに変換 → 前後の空白を除去
}

function judge(input: string, answers: string[]): boolean {
  const normalized = normalize(input);
  return answers.some((answer) => normalized === answer);
  // 正解リストのどれかと完全一致すれば true
}
```

- **大文字・小文字は区別する**：`forEach` と `ForEach` は別物
- **前後の空白は許容**：うっかり混入した空白は除去してから判定
- **全角スペースも許容**：日本語入力に切り替えたときに混入しやすいため

### Enterキーで操作できる仕組み

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Enter") {
    if (!submitted) {
      handleSubmit();  // 未回答 → 回答する
    } else {
      onNext(isCorrect);  // 回答済み → 次の問題へ
    }
  }
};
```

`!submitted`（=まだ回答していない）かどうかで処理を分岐しています。

### 条件付きレンダリング

```tsx
{!submitted ? (
  // 回答前：入力フォームを表示
  <div>...</div>
) : (
  // 回答後：正誤・補足を表示
  <div>...</div>
)}
```

`submitted` の値で「入力フォーム」と「解説画面」を切り替えています。

---

## ClearScreen.tsx：クリア画面

```typescript
const percentage = Math.round((correctCount / totalCount) * 100);
// 正解率を計算。Math.round で小数点以下を四捨五入

const getMessage = () => {
  if (percentage === 100) return "完璧！全問正解です！";
  if (percentage >= 80) return "素晴らしい！もう少しで完璧です";
  if (percentage >= 60) return "いい調子！もう一度挑戦してみよう";
  return "まだ伸びしろがあります。繰り返し練習しよう！";
};
```

スコアに応じてメッセージを変えるシンプルな条件分岐です。

```tsx
<button onClick={onRetry}>もう一度挑戦</button>
<button onClick={onMenu}>メニューへ戻る</button>
```

「もう一度」は同じレベルで再スタート、「メニューへ」は最初に戻ります。
どちらも `App.tsx` から渡された関数を呼び出すだけです。
