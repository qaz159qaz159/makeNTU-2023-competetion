# [111-1] Web Programming Final

(Group 27)MakeNTU 工具租借網站

### Why We Do This / What's This For

> **MakeNTU 比賽當天，提供參賽者借用主辦方開發板與工具的功能，並透過網站達到更快速及便利的借用步驟，每組成員皆可以確認要求目前的狀態，準備好後由主辦方發出通知，可以大幅降低參賽者借還東西所需要消耗的時間。**

### [Demo 影片連結](https://youtu.be/XparUhp1hWY)

### [網站 Deploy 連結](http://140.112.174.222:7780/)

建議使用 Chrome
(目前版本重整會有問題，請將 7780 後的路徑刪除再重整即可回到首頁)

### [原始程式碼 GitHub Link](https://github.com/YCK1130/2023makeNTUWPFinalProjectMain)

### 程式碼結構(How We Do This)

#### 說明

> **本專題為接受資訊部委託製作，因此傳承自選課系統。然而，我們只參考了必要的登入及切換頁面的實作方式，其餘所有功能頁面無論前端版面&邏輯、後端 websocket、MongoDB 連接皆為全新製作，並無使用學長姐之程式碼，附錄中標星號的文件是傳承自選課系統的，我們也有對其進行調整，詳細 commit 紀錄也都在上面的 github 連結中**

#### 使用之第三方套件、框架、程式碼

- Frontend

  - Material Ui (MUI)
  - React.js
  - Redux
  - React Router
  - styled-components
  - Axios
  - WebSocket
    (與後端連接)

- Backend
  - bcrypt
  - Express
  - Axios
  - WebSocket
  - Redis
  - Mongoose

## 如何在 localhost 安裝與測試之詳細步驟

### Install dependency

```shell
$ # under ./final

$ npm install
$ # or
$ yarn install
```

### Copy .env

```shell
$ # under ./final
$ cp .env.default .env
```

### Run database

```shell
$ # under ./final/server

$ docker-compose up -d
```

To reset team account (data in `./server/database/data/teams.json`)
(!! important)

```shell
$ # under ./fianl

$ # in window
$ npm run window-database reset
$ # or
$ yarn window-database reset

$ # other
$ npm run database reset
$ # or
$ yarn database reset

```

### Run backend

```shell
$ # under ./final
$ # in window
$ npm run window-dev-server
$ # or
$ yarn window-dev-server

$ # other
$ npm run dev-server
$ # or
$ yarn dev-server
```

### Run frontend

```shell
$ # under ./final

$ npm start
$ # or
$ yarn start
```

## 使用方法

### 登入

點擊 LOGIN 後會出現登入頁面
![](https://i.imgur.com/odRQ2lA.png)

其中，使用者分為管理員(admin)及一般使用者(user)兩種

### admin 端(使用 Account : 0,Password : 1111 登入)

登入後點開 drawer(MakeNTU 旁三條線)，即可看到四種 admin 可見的頁面
![](https://i.imgur.com/1pdlCg9.png)

#### Items List Page

- ADD，有兩種新增物品的方式 - 使用模板(黃色版)填寫相關資訊(如下)後按加號或 Enter 新增 - Name - Category (如: Tool, Board) - limit (一組最多可借數量) - stock (初始物品數量) - image (link)(optional，預設為 MakeNTU Icon) - 使用 Import 上傳 CSV 檔 - 須為符合格式之 CSV(如下) - id,name,category,limit,stock,image
  ![](https://i.imgur.com/E2zT7fj.png)
  > 若使用 localhost，可匯入 public/default.csv 進行測試
- EDIT，僅 limit 及 stock 可事後修改
  - 兩個輸入欄位皆已鎖定只能輸入數字
  - 修改任意數量後，Save 按鈕會亮起
  - 按下 save 後才會回傳 server 進行修改
- Delete，右上"x"號可刪除物品卡片，且無法復原
- 其他機制 - 若物品已經有人開始借用，將無法進行修改和刪除 - 可以使用名字(name)或種類(category/tag)進行搜尋
  ![](https://i.imgur.com/cLILZue.png)
  > 上圖範例
  >
  > - Arduino UNO r3 為不可修改的狀態，
  > - 因 Arduino Leonardo 上限修改 save 按鈕亮起
  > - 因為有搜尋，版面只顯示有含"Arduino"的 cards

#### Request Status Page

![](https://i.imgur.com/5XKSi2z.png)

- Request Console(左)
  - 顯示各組所發出的租借請求(可以進行以下操作)
    - 拒絕
    - 呼叫
    - 取消
    - 已領取
  - 不同狀態的請求儲存在不同的 Tab 中
    - 未完成: 申請中/呼叫中
    - 已完成: 已領取
    - 已拒絕: 拒絕
    - 已取消: 已取消(包含使用者自己取消)/已逾時
  - 其中未完成的兩種狀態會有計時器
    - 每次更新狀態(申請中->呼叫中)會計時 15mins
    - 計時(時間小於 1min 會呈現紅色)：
      - **申請中**：提醒管理者處理的緊急程度，並避免使用者過度等待(逾時後會提醒使用者再次請求以提醒管理者)
      - **呼叫中**：提醒使用者前去拿取，並避免申請不領取造成浪費，逾時後將會把資源釋出
- Team Status Console(右)
  - 顯示每組現正租借的數量
  - 當組別歸還時，可調整數字並 Edit
  - 每個欄位數字只能在**0~租借數量**間
- RWDRequest Console 的欄位中
  - 用窄螢幕(如手機)查看狀態時，Team Status 會合併到 Request Console 的欄位中
  - ![](https://i.imgur.com/CY4qBkM.png)

### user 端(可使用 Account : 1,Password : 1111 登入)

登入後點開 drawer(MakeNTU 旁三條線)，即可看到三種 user 可見的頁面
![](https://i.imgur.com/NGmTd8n.png)

#### Borrow Items Page

1. 挑選自己想要的物品 - 不能超出各組租借上限(數量具體由所持數量、已發出的請求、剩餘數量及管理員設定之每組上限決定) - 一樣可以達成搜尋功能，並且在選擇的商品數為零時無法進入下一頁
   ![](https://i.imgur.com/Fp1EhnS.png)
2. 確認已挑選物品 - 版面上將只剩已挑選物品，確認後按"Confirm"即送出請求
   ![](https://i.imgur.com/6i9jGVY.png)
3. 請求成功/失敗頁面 - 因各種原因可能導致請求失敗(含物品選項遭管理者刪除、數量不夠等等) - 成功則顯示已借數量，如下圖
   ![](https://i.imgur.com/e5cL8Fw.png)
4. RWD
   - 用窄螢幕(如手機)選借物品時商品條將變成方形
   - ![](https://i.imgur.com/GacLkpg.png)

#### Your Status Page

![](https://i.imgur.com/i16Ghty.png)

- Request Console(左)
  - 顯示 user 所發出各種請求
    - **被拒絕/取消**的請求可以點垃圾桶刪除
    - 申請中的可以自行取消
    - 請來拿(呼叫中)的只能由管理員(admin)取消
  - 同 admin 所述未完成的兩種狀態會有計時器
- Items Console(右)
  - 呈列所持有的物品及其數量
- RWD
  - 用窄螢幕(如手機)，旁邊的卡片區會變為一個橫條，顯示已領取的物品及數量
  - ![](https://i.imgur.com/yiqG7qo.png)

## 專題心得

- 楊竣凱：這次專題花費了非常多心力，但也感受到團隊合作的重要。因為在前人的基礎上實作，有些地方有所衝突，在最後 deploy 時花了比意想中多的時間，但最後看到他能跑出來真的心裡非常感動！

- 陳冠豪：這次專題實作的體驗非常酷，第一次能夠真正做出一個供別人使用的網站，透過不斷搜尋、解決問題並把一個個所需要的功能用目前擁有的實力做出來時真的非常有成就感；也非常感謝同組同學在製作時的彼此協助和努力！

- 葉庭羽：實作的體驗非常有趣，也更了解前後端的溝通，真的看他跑起來的時候眼淚都要掉下來了，我再也不會嫌棄別的網站難用了 QQ，謝謝同組的兩位大神在製作時的協助。
