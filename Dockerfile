FROM node:12-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install --freeze-lockfile

COPY . .
ENV MONGO_HOST mongodb
# ENV REDIS_HOST redisdb
RUN yarn build

CMD ["yarn", "deploy"]
