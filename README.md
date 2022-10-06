# Kochi Flavor

> 新しい方式で高知県のグルメ情報を紹介し共有、記録することができるウェブアプリケーション


# プロジェクトの紹介
## 1.作ったきっかけ

私が住んでいる高知県は小さい都市ですが、食べ物だけは高知ならではの特産品を利用して作った魅力ある美味しい食べ物がたくさんある全国でも有名な県です。
しかし、こんなに魅力あふれる高知県が地方という理由で都心特化のメディア、アプリなど様々なサービスに離されグルメ情報を探そうとしても未だにインターネット検索や sns、ニュース、雑誌などの限られたメディア情報が全てでした。
もちろんグーグルマップやインスタ投稿など都心と似たサービスはありましたが、高知県特化の新しい方法で情報伝達ができるアプリを作って提供したいと思い、アプリ開発に挑戦しました。

## 2.機能

### ログイン、ログアウト、会員登録
- ユーザーはニックネーム、メールアドレス、パスワどを入力して会員登録することができます。
- 会員登録時、入力したパスワードは`Bcrypt`を利用してハッシュ化され、アカウント情報は`PlanetScale`に仮登録の状態で保存されます。
- `Send Grid`を利用し入力されたメールアドレスに確認コードを送ります。
- 確認コードが一致すると本登録が完了されアカウント情報を新たに`PlanetScale`に保存します。
- ユーザーはメールアドレス、パスワードを利用してログインすることができます。
- ログインに成功した場合、`Iron Session`にセッションを保存します。
- `SWR`を利用してローグイン状態をアップデートします。
- ログアウトの場合`SWR`のステイとを変更し、セッションを消去します。
<div style="display:flex">
    <img width="300" height="665" src="https://user-images.githubusercontent.com/71082215/176831944-761e99c7-14eb-4a1e-853c-35fb97373d96.png">
    <img width="300" height="665" src="https://user-images.githubusercontent.com/71082215/176831954-4c8b0662-626d-4615-87f4-a2bfde3879b2.png">
</div>

### 現在位置を基準に周りの飲食店を探す機能
- `Web API`の`Geolocation`を利用し現在地を取得します。
- ユーザーが現在地取得に許可をしてくれなかった場合、基準位置は高知県庁になります。
- `@react-google-maps/api`を利用してGoogle Map上で既に登録されている現在地の周辺の飲食店データを呼び出します。
<div style="display:flex">
    <img width="300" height="665" src="https://user-images.githubusercontent.com/71082215/176831973-df6fe7c0-2c14-414d-8c23-10504e2012fb.png">
</div>

### 距離順に近所の飲食店リスト表示および検索機能
- `Prisma`のRaw Queryを利用して緯度と経度をもとに現在地から飲食店までの距離を求めます。
- 距離が違い順に飲食店のリストを表示します。
<div style="display:flex">
<img width="300" height="665" src="https://user-images.githubusercontent.com/71082215/176835201-ea3cbb57-52a3-42fe-b6e5-8f833c1e6aef.png">
<img width="300" height="665" src="https://user-images.githubusercontent.com/71082215/176835213-7db74022-3fdc-4293-9b5f-e753efae8705.png">
</div>

### 飲食店情報
- 飲食店の位置、営業時間、種類など飲食店の詳細情報を表示します。
- 行ってきた所、行ってきた所をチェックすることができます。
- 飲食店に対するレビューを作成することができます。レビューの項目は点数、写真、説明があります。
- 写真ファイルは`Cloudflare`に保存しています。（現在、料金の問題上一時停止中）
<div style="display:flex">
    <img width="300" height="665" src="https://user-images.githubusercontent.com/71082215/176831972-fdfee51d-f026-4371-9745-098e5965fb70.png">
    <img width="300" height="665" src="https://user-images.githubusercontent.com/71082215/176831960-0f466485-2888-4011-9218-ae7e0a05326c.png">
</div>

### 飲食店情報提供機能
- ユーザーは飲食店の情報を管理者に提供することができます。
- 飲食店の住所、営業時間、定休日、駐車場、種類、その他の情報が提供できます。
- ユーザーが情報を提供した場合、その情報が`Send Grid`を利用して予め設定したメールアドレスに送信されます。
<div style="display:flex">
    <img width="300" height="665" src="https://user-images.githubusercontent.com/71082215/176837302-fd2c103c-7302-4aef-950a-2e2bdb23de8e.png">
</div>

### 高知県に関する質問投稿機能
- 現在地周辺の質問閲覧や質問を作成することができます。
- 各質問には気になるをつける機能、コメントを作成する機能があります。
- 質問を作成した際には作成した時点の緯度と軽度が一緒に保存され現在地周辺の検索材料として使われます。
<div style="display:flex">
    <img width="300" src="https://user-images.githubusercontent.com/71082215/176831970-738bb3f6-227e-4d7d-944a-3ee8ebfcbb40.png">
</div>

### プロフィール機能
- ユーザーの紹介、プロフィル写真を見ることができます。
- 本人のプロフィールの場合プロフィールの情報を編集することができます。
- 飲食店詳細ページからチェックした行きたい所、行ってきた所、レビュー作成履歴を見ることができます。
- 行きたい所、行ってきた所のリストは現在地から距離順に表示されます。
<div style="display:flex">
    <img width="300" height="665" src="https://user-images.githubusercontent.com/71082215/176831965-31a4a6c3-57d8-4476-8a0b-b59b4f84b88e.png">
    <img width="300" height="665" src="https://user-images.githubusercontent.com/71082215/176831961-eaeb8b82-7620-4aaf-9f1a-391913d5fbb6.png">
<img width="300" height="665" src="https://user-images.githubusercontent.com/71082215/176835558-8181ac5f-1242-4050-843c-6d1b6e070047.png">
</div>

## 3.使用した技術
<h3>☁️ Cloud</h3>
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white"/>
<h3>⚡ Database</h3>
<img src="https://img.shields.io/badge/PlanetScale-000000?style=for-the-badge&logo=PlanetScale&logoColor=white">
<h3>🖋 Design</h3>
<div style="display:flex">
<img src="https://img.shields.io/badge/Canva-%2300C4CC.svg?&style=for-the-badge&logo=Canva&logoColor=white"/>
<img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white"/>
</div>
<h3>🚀 Frameworks & Library</h3>
<div style="display:flex">
<img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
</div>
<h3>👩‍💻 Languages</h3>
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
<h3>⚙️ ORM</h3>
<img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white"/>



## 4.開発期間

約一ヶ月

## 5.ToDo

- [ ] 飲食店ディテールページのレビュー pagination 機能
- [ ] ログインしてないユーザーも飲食店ディテールページ観覧可能にする
- [ ] 各URL ID ランダム文字に変更する
