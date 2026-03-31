# GitHub 連携・公開手順

## この手順でできること

- コードを GitHub に保存する（バックアップ・バージョン管理）
- GitHub Pages でインターネット上に公開する
- `main` ブランチにプッシュするたびに自動でデプロイされる

---

## Step 1：プロジェクトフォルダで git を初期化する

```bash
cd /Users/aico/Desktop/method-quiz-app
git init
git branch -m main   # ブランチ名を main に変更
git add .
git commit -m "メソッド問題アプリの初期実装"
```

### ポイント
- `git init`：そのフォルダを git で管理するための初期設定
- `git add .`：変更したファイルを「コミット候補」にする（ステージング）
- `git commit`：変更を記録する（セーブポイントを作る）
- **注意：** `git init` はプロジェクトフォルダの中で実行すること。デスクトップや上の階層でやると意図しない場所が git 管理対象になる

---

## Step 2：GitHub CLI をインストールする

```bash
brew install gh
```

`gh` は GitHub をターミナルから操作するためのツールです。
ブラウザを使わずにリポジトリの作成やプッシュができます。

---

## Step 3：GitHub にログインする

```bash
gh auth login
```

対話形式で進みます：

```
? Where do you use GitHub?
→ GitHub.com  ← 選択してEnter

? What is your preferred protocol for Git operations on this host?
→ HTTPS  ← 選択してEnter

? How would you like to authenticate GitHub CLI?
→ Login with a web browser  ← 選択してEnter

! First copy your one-time code: XXXX-XXXX  ← このコードをコピー
Press Enter to open github.com in your browser...
```

ブラウザが開いたら：
1. コピーしたコード（例：`XXXX-XXXX`）を貼り付ける
2. 自分のアカウントで **Continue** を押す
3. **Authorize github** を押す（グレーアウトしている場合は再度 `gh auth login` を実行）
4. スマホ認証 or メール認証で本人確認
5. ブラウザに「Congratulations, you're all set!」と表示されたら完了

---

## Step 4：GitHub にリポジトリを作成してプッシュ

```bash
gh repo create method-quiz-app --public --source=. --remote=origin --push
```

このコマンド1つで以下を全部やってくれます：
- GitHub 上にリポジトリを作成
- ローカルの git にリモートURL（origin）を登録
- コードをプッシュ（アップロード）

実行後に表示される URL（例：`https://github.com/aico0315/method-quiz-app`）がリポジトリのページです。

---

## Step 5：GitHub Pages のデプロイ設定

### vite.config.ts に base を追加

```typescript
export default defineConfig({
  plugins: [react()],
  base: "/method-quiz-app/",  // ← リポジトリ名と合わせる
})
```

GitHub Pages で公開する URL は `https://ユーザー名.github.io/リポジトリ名/` になります。
`base` を設定しないと画像やCSSのパスがずれて画面が壊れます。

### GitHub Actions のワークフローを作成

`.github/workflows/deploy.yml` というファイルを作ります。

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main       # main ブランチへのプッシュをトリガーにする

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4       # コードをチェックアウト

      - uses: actions/setup-node@v4     # Node.js をセットアップ
        with:
          node-version: 20

      - run: npm install                # 依存パッケージをインストール
      - run: npm run build              # ビルド（dist/ フォルダが生成される）

      - uses: peaceiris/actions-gh-pages@v4   # gh-pages ブランチにデプロイ
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**GitHub Actions とは：** GitHub 上で自動的にプログラムを実行できる仕組みです。
ここでは「mainにプッシュ → ビルド → 公開」を自動化しています。

### 変更をプッシュ

```bash
git add .
git commit -m "GitHub Pages デプロイ設定を追加"
git push
```

---

## Step 6：GitHub リポジトリの Pages 設定

1. https://github.com/アカウント名/method-quiz-app を開く
2. **Settings** タブ → 左メニュー **Pages**
3. **Source** → `Deploy from a branch`
4. **Branch** → `gh-pages` / `root` に変更して **Save**

---

## 完了：公開URL

```
https://アカウント名.github.io/method-quiz-app/
```

設定後、最初のデプロイには1〜2分かかります。
Actions タブでビルドの進行状況を確認できます。

---

## 今後のコード変更の流れ

コードを修正したら、以下の3コマンドだけで自動デプロイされます。

```bash
git add .
git commit -m "変更内容のメモ"
git push
```

Actions が自動でビルド・デプロイを実行するので、手動作業は不要です。
