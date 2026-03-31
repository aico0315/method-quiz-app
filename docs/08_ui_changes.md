# UI 改善の記録

## 変更1：問題画面にメニューへ戻るボタンを追加

### なぜ追加したか

最初の実装では、問題を解いている途中でメニューに戻る方法がありませんでした。
別のレベルに切り替えたいときや間違えてスタートしたときに困るため、ボタンを追加しました。

### やったこと

**① `QuizScreen` が受け取るデータ（Props）に `onMenu` を追加**

```typescript
// 変更前
interface Props {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onNext: (isCorrect: boolean) => void;
}

// 変更後
interface Props {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onNext: (isCorrect: boolean) => void;
  onMenu: () => void;  // ← 追加
}
```

Props に追加することで「このコンポーネントはメニューへ戻る機能を外から受け取る」という設計になります。

**② ヘッダーにボタンを配置**

```tsx
<button className={styles.menuButton} onClick={onMenu}>
  <svg ...>  ← 矢印アイコン
  メニューへ戻る
</button>
```

SVG（ベクター画像）で矢印アイコンを直接コードに書いています。
画像ファイルを使わずアイコンを表示できる方法です。

**③ `App.tsx` からも `onMenu` を渡す**

```tsx
// 変更前
<QuizScreen
  question={quizQuestions[currentIndex]}
  questionNumber={currentIndex + 1}
  totalQuestions={quizQuestions.length}
  onNext={handleNext}
/>

// 変更後
<QuizScreen
  ...
  onNext={handleNext}
  onMenu={handleMenu}  // ← 追加
/>
```

`QuizScreen` が `onMenu` を受け取れるようになっても、`App.tsx` から渡さないと動きません。
コンポーネントの設計変更と、それを使う側の変更はセットで行う必要があります。

---

## 変更2：ボタンのUIを改善

### なぜ改善したか

最初は `← メニュー` というテキストだけのボタンでした。
背景色がなく、ボタンに見えづらかったため改善しました。

### やったこと

```css
/* 変更前 */
.menuButton {
  font-size: 0.85rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

/* 変更後 */
.menuButton {
  display: flex;
  align-items: center;
  gap: 0.3rem;         /* アイコンとテキストの間隔 */
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  background: #f3f4f6; /* ← 背景色を追加 */
  border: none;
  border-radius: 20px; /* ← 角を丸くしてピルバッジ風に */
  padding: 0.35rem 0.8rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s; /* ← ホバー時のアニメーション */
}
```

背景色 + 角丸でボタンだと直感的にわかるデザインにしました。

---

## 変更3：問題番号カウンターをセンターに移動

### なぜ変更したか

ヘッダーに「戻るボタン・問題番号・カテゴリ」が横並びになっていて、問題番号が目立ちにくかったため、1行下げてセンター配置にしました。

### やったこと

**HTML 構造を分ける**

```tsx
// 変更前：全部1つのdivの中
<div className={styles.header}>
  <button>メニューへ戻る</button>
  <span>1 / 6</span>       ← ここにあった
  <span>配列メソッド</span>
</div>

// 変更後：カウンターだけ別の行に
<div className={styles.header}>
  <button>メニューへ戻る</button>
  <span>配列メソッド</span>
</div>
<div className={styles.progressRow}>  ← 新しい行
  <span>1 / 6</span>
</div>
```

**CSS でセンター配置**

```css
.progressRow {
  text-align: center;
}
```

`text-align: center` は「テキストをその要素の中央に揃える」CSSプロパティです。
