FROM node:18-slim AS builder
WORKDIR /app
COPY . .

RUN yarn install --verbose
RUN yarn build
RUN rm -rf node_modules

RUN yarn install --production


FROM node:18-slim AS runner
WORKDIR /app

# RUN \
#     echo "https://mirror.uepg.br/alpine/v$(cut -d'.' -f1,2 /etc/alpine-release)/main/" >> /etc/apk/repositories && \
#     echo "https://mirror.uepg.br/alpine/v$(cut -d'.' -f1,2 /etc/alpine-release)/community/" >> /etc/apk/repositories

RUN apt-get update && \
    apt-get install -y postgresql-client

RUN addgroup --gid 1001 --system nodejs
RUN adduser --system --uid 1001 nodejs

ENV NODE_ENV=production

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
