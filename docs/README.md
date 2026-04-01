# 開発ドキュメント一覧

メソッド問題アプリの開発記録です。コードと一緒に読むと理解が深まります。

| ファイル | 内容 |
|---|---|
| [01_overview.md](./01_overview.md) | アプリの全体像・技術スタック・ファイル構成 |
| [02_types.md](./02_types.md) | TypeScript の型定義（types.ts）の解説 |
| [03_questions_data.md](./03_questions_data.md) | 問題データの構造・追加方法 |
| [04_app_tsx.md](./04_app_tsx.md) | 全体の状態管理・画面切り替えロジック |
| [05_components.md](./05_components.md) | 各コンポーネント（Menu / Quiz / Clear）の解説 |
| [06_css_modules.md](./06_css_modules.md) | CSS Modules の仕組みと使い方 |
| [07_data_flow.md](./07_data_flow.md) | データの流れ・コンポーネント間の通信 |
| [08_ui_changes.md](./08_ui_changes.md) | UI改善の記録（メニュー戻るボタン・カウンター移動） |
| [09_github_setup.md](./09_github_setup.md) | GitHub 連携・GitHub Pages 公開手順 |
| [10_qa_split_match.md](./10_qa_split_match.md) | Q&A：split と match の使い分け |

---

## 開発環境の起動方法

```bash
cd method-quiz-app
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開く。
