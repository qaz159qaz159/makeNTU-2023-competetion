# MakeNTU2023Competition

2022 MakeNTU 開發板 雷切 3DP 借用網站

## Quick Start (Development mode)

### Install dependency

```shell
$ # ./makeNTU-2023-competition

$ npm install
$ # or
$ yarn install
```

### Run database

```shell
$ # ./makeNTU-2023-competition/server

$ docker-compose up -d
```

To reset team account (data in `./server/database/data/teams.json`)

```shell
$ # ./makeNTU-2023-competition

$ npm run database reset
$ # or
$ yarn database reset
```

### Run backend

```shell
$ # ./makeNTU-2023-competition

$ npm run dev-server
$ # or
$ yarn dev-server
```

### Run frontend

```shell
$ # ./makeNTU-2023-competition

$ npm start
$ # or
$ yarn start
```

Goto `http://localhost:3000` to see the website.
