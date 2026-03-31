# データの流れ

## 全体図

```
App.tsx（状態を管理する親）
  │
  ├── MenuScreen
  │     ↑ onStart(level) を呼ぶ
  │
  ├── QuizScreen
  │     ↑ onNext(isCorrect) を呼ぶ
  │
  └── ClearScreen
        ↑ onRetry() / onMenu() を呼ぶ
```

**親（App.tsx）が全ての状態を持ち、子コンポーネントは「必要なデータを受け取る」「出来事を親に伝える」だけ**という設計です。

---

## レベルを選んでから問題が表示されるまで

```
1. MenuScreen のボタンを押す
   → onStart("junior") を呼ぶ（App.tsx の handleStart）

2. handleStart の中で：
   → questions から "junior" の問題だけ filter で取り出す
   → shuffle でシャッフルする
   → setQuizQuestions に格納
   → setScreen("quiz") で画面を切り替える

3. App.tsx が screen === "quiz" を検知して QuizScreen を表示する
   → question={quizQuestions[0]} を渡す（最初の問題）
```

---

## 回答してから次の問題へ進むまで

```
1. テキストボックスに入力 → setInput で状態を更新
   （入力のたびに画面が更新される「制御されたコンポーネント」）

2. 「回答する」ボタンを押す（またはEnter）
   → judge() で正誤を判定
   → setSubmitted(true) で「回答済み」に
   → setIsCorrect(true/false) で結果を保存

3. 「次の問題へ」ボタンを押す（またはEnter）
   → onNext(isCorrect) を呼ぶ（App.tsx の handleNext）

4. handleNext の中で：
   → currentIndex + 1 が quizQuestions.length に達したら setScreen("clear")
   → まだ残っていれば setCurrentIndex を増やす
   → QuizScreen が新しい問題で再描画される
```

---

## 制御されたコンポーネントとは

```tsx
<input
  value={input}          // 状態の値を表示
  onChange={(e) => setInput(e.target.value)}  // 入力があったら状態を更新
/>
```

テキストボックスの値を React の状態（`useState`）で管理するパターンを「制御されたコンポーネント」と呼びます。
`value` が状態と常に同期しているため、「入力内容を取得する」「クリアする」などの操作が状態を変えるだけで完結します。

---

## 問題が切り替わるときの自動リセット

```typescript
useEffect(() => {
  setInput("");
  setSubmitted(false);
  inputRef.current?.focus();
}, [question.id]);  // question.id が変わるたびに実行
```

`App.tsx` で `currentIndex` が変わると、渡す `question` が変わります。
`question.id` が変化したことを `useEffect` が検知して、入力内容と回答状態をリセットします。
`App.tsx` から明示的にリセットを指示しなくても、コンポーネントが自律的に初期化できる設計です。
