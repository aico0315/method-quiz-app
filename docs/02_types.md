# 型定義（types.ts）

## ファイルの役割

TypeScript では「この変数はどんな形のデータを持つか」を**型**として定義できます。
`types.ts` はアプリ全体で使う型をまとめたファイルです。

---

## コードと解説

```typescript
// src/types.ts

// Level：レベルは3種類のどれかしか入れない
export type Level = "junior" | "middle" | "senior";

// Question：問題1問分のデータ構造
export interface Question {
  id: string;        // 問題のID（"1", "2" ...）
  level: Level;      // どのレベルか（juniorなど）
  category: string;  // カテゴリ名（"配列メソッド"など）
  question: string;  // 問題文
  answer: string[];  // 正解（複数パターン可）
  supplement: string;// 補足説明
}

// Screen：今どの画面を表示しているか
export type Screen = "menu" | "quiz" | "clear";
```

---

## ポイント解説

### `type` と `interface` の違い
- **`type`**：「この値はこの中のどれか」という制限に使いやすい
- **`interface`**：オブジェクトの形（どんなプロパティを持つか）を定義するのに使う

このアプリでは役割に応じて使い分けています。

### `"junior" | "middle" | "senior"` とは？
`|` は「または」という意味です。`Level` 型の変数には、この3つの文字列しか入れられません。
`"beginner"` などを入れようとすると TypeScript がエラーを出してくれます。

### `answer: string[]` とは？
`string[]` は「文字列の配列」という意味です。正解が複数パターンある問題に対応するため、配列にしています。
例：`answer: ["Set"]` → 正解は `Set` のみ

### `export` とは？
他のファイルから `import` して使えるようにする宣言です。
`export` が付いていないと、そのファイルの中だけでしか使えません。
