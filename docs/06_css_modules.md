# CSS Modules の使い方

## CSS Modules とは

ファイル名を `xxx.module.css` にすることで、そのファイルのクラス名が**そのコンポーネントの中だけで有効**になります。

---

## 通常の CSS との違い

通常の CSS（グローバル）では、違うファイルに同じクラス名があると競合します。

```css
/* A.css と B.css に同じ .button があったら片方が上書きされる */
.button { color: red; }
```

CSS Modules では、ビルド時にクラス名が自動的にユニークな名前に変換されます。

```
.button → .MenuScreen_button__3xK9a  （実際のクラス名）
```

---

## 使い方

### CSS ファイル（例：MenuScreen.module.css）

```css
.container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.levelButton {
  padding: 1.2rem;
  border-radius: 12px;
}
```

### コンポーネント側（MenuScreen.tsx）

```tsx
import styles from "./MenuScreen.module.css";

// クラス名は styles.クラス名 で指定する
<div className={styles.container}>
  <button className={styles.levelButton}>...</button>
</div>
```

`styles` はオブジェクトのように扱えて、`styles.container` でクラス名の文字列が取得できます。

---

## 複数クラスを組み合わせるとき

```tsx
// テンプレートリテラルで連結
<div className={`${styles.judgment} ${isCorrect ? styles.correct : styles.incorrect}`}>
```

正解のとき `judgment correct`、不正解のとき `judgment incorrect` というクラスが付きます。
`QuizScreen` で正解・不正解の背景色を切り替えるのにこの方法を使っています。

---

## インラインスタイルとの使い分け

```tsx
// 動的な値（JavaScriptの変数）を使うときはインラインスタイル
<div style={{ width: `${progress}%` }} />
```

プログレスバーの幅のように「JavaScriptで計算した値をそのままスタイルに使いたい」場合は、インラインスタイルが便利です。
基本のスタイルは CSS Modules、動的な部分だけインラインスタイルという使い分けが一般的です。
