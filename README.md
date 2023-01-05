# MakeNTU 機台借用網站

## [111-1] Web Programming Final

**Group 74**
組長： B09502138 徐明晧
組員： R09521260 林和毅、R10227105 王雅茵

## Demo 影片連結
[待補](https://)

## 網頁服務內容
主旨：提供MakeNTU創客松競賽之網站服務，提供機台預約及管理。

### 服務項目：
- 登入機制
    - Users / Admin
- 3D列印機
    - User：新增機台、清除機台、清除使用者、安排使用者
    - Admin：預約機台、察看目前狀態
- 雷射切割機
    - User：新增機台、管理機台排程、察看及控制機台狀態
    - Admin：預約雷切機台及材料，察看等候組數、等候時間、預約狀態


## 使用之第三方套件、框架、程式碼

### Frontend:
- `apollo/client`, `graphql-tools`, `react`, `react-dom`, `react-router-dom`, `styled-components`, `mui`, `axios`, `uuid`

### Backend:
- `apollo/server`, `graphql`, `babel`, `cors`, `express`, `nodeman`, `dotenv-defaults`, `mongoose`, `bcrypt`, `express`

### Databse:
- `MongoDB`, `Redis`

### Container:
- `Docker`

### Deployment:


## 專題製作心得

#### 徐明晧
在這個專題中，我學習到如何建構一個網頁服務，在製作這個網頁服務時，我也重新檢視這學期所學，包括如何使用react建構前端網頁，以及利用GraphQL做為後端框架的情況下要如何處理前後端的溝通。另外，先前作業都是根據既定的spec來寫，而期末專題則需要自己從零開始構思，到底這個專案需要什麼樣的功能、要用甚麼樣的技術來實現，甚至是要如何優化、解決遇到的問題，都是非常踏的挑戰。在分工方面，我們組比較特別的是，在分工上每個人前、後端都會碰到，這樣做的好處是對於前後端各個component的功能、如何再次熟悉、認識這些前後端的技術，且這樣也能更多的去檢視他人的程式碼，學習找出其中的bug並溝通解決問題，降低出錯的機會，也更好維護。
#### 林和毅
這次的專案設計使我有許多感悟，身處一定規模的專案之下也讓我覺得很興奮，因於在學期初的我連一行code都不會打，得瘋狂找資料自學，到現在能cover前後端、資料庫、GraphQL以及環境佈署等等，建立出我理想中的網站，最後優化UI/UX。打心得的當下才敢稍微感受懈怠，也感謝組員的信任，讓我有成長及發揮的空間，並深感溝通、合作的重要性，體會寫出一個像樣的服務背後得有多少人的努力以及心思。在建構網站時，需要先把邏輯釐清，在執行階段時，才不會因為邏輯錯誤需要大修程式碼，與隊友的meeting也能優化思路，最後就是把自己的所學延伸，找document來implement希望實現的功能，架出自己滿意的網站，最後感謝Ric老師開了這扇窗給我。
#### 王雅茵
平常作業就已經做到快死掉了，做專題更是覺得自己有超級多不足之處。謝謝組員們的包容與各種指導，讓我接觸到很多網頁服務的技術。雖然能力有限加上做得很累，但還是很開心！

## 如何使用
### Install Docker ? (待確認)
### Install dependency
```
# ./makeNTU-2023-competition
$ yarn install
```

### Run database
```
# ./makeNTU-2023-competition/server
$ cd server
$ docker-compose up -d
```

### Reset team account
Data in `./server/database/data/teams.json`
```
$ cd database/data
$ yarn database reset
```

### Run backend
```
# ./makeNTU-2023-competition
$ cd ../../..
$ yarn dev-server
```

### Run frontend
```
# ./makeNTU-2023-competition
$ yarn start
```

Goto `http://localhost:3000` to see the website.

## Demo畫面

### 登入介面

- 初始畫面
  ![](https://i.imgur.com/z0n1Wzo.png)
- 登入畫面
  ![](https://i.imgur.com/SvSCiZs.png)
- 選單畫面
  ![](https://i.imgur.com/TOS5ly3.png)

### 3D列印機
#### 管理者
- 管理介面
  ![](https://i.imgur.com/tX0OoUZ.png)
- 新增機台視窗
  ![](https://i.imgur.com/h43MEU1.png)
- 呈現機台狀態
  ![](https://i.imgur.com/U5bl9Mh.png)

#### 使用者

### 3D列印機
#### 管理者
#### 使用者