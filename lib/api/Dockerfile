FROM node:16-slim AS builder
WORKDIR /app
COPY . .

RUN yarn install
RUN yarn build
RUN rm -rf node_modules

RUN yarn install --production


FROM node:16-slim AS runner
WORKDIR /app

# RUN \
#     echo "https://mirror.uepg.br/alpine/v$(cut -d'.' -f1,2 /etc/alpine-release)/main/" >> /etc/apk/repositories && \
#     echo "https://mirror.uepg.br/alpine/v$(cut -d'.' -f1,2 /etc/alpine-release)/community/" >> /etc/apk/repositories

RUN apt-get update
RUN apt-get install -y postgresql-client

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

ENV NODE_ENV production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

COPY package.json ./package.json
COPY init.sh ./init.sh
COPY ormconfig.js ./ormconfig.js

RUN mkdir -p storage/temp
RUN mkdir -p storage/upload
RUN chmod -R 777 ./storage

RUN chmod +x ./init.sh

USER nodejs

WORKDIR /app

CMD ["yarn", "start:server"]

EXPOSE 3333
