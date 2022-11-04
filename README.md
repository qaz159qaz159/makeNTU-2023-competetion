# NTUEECourse2021

2022 MakeNTU 開發板 雷切 3DP 借用網站

## Quick Start (Development mode)

```shell
$ npm install
$ cd server
$ docker-compose up -d
$ cd ..
$ npm run dev-server           # This will run a develop server
$ npm start
```

To reset team account (data in `./server/database/data/teams.json`)

```shell
$ npm run database reset
```

Goto `http://localhost:3000` to see the website.

## Frontend Develop (With Docker)

```bash
# start frontend, backend, database
$ docker-compose up -d
```

To see frontend logs

```
$ docker logs -f ntueecoursewebsite2021_frontend_1
```

To reset database

```bash
$ docker exec -it ntueecoursewebsite2021_backend_1 npm run database reset
```

## Frontend Develop (Without Docker)

```bash
$ npm install
$ npm start
# in another terminal
cd server
docker-compose up -d
cd ..
npm run database reset
npm run dev-server
```
