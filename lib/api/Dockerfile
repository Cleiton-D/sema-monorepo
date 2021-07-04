FROM node:lts-alpine as deps

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

FROM node:alpine AS runner
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

ENV NODE_ENV production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/init.sh ./init.sh
COPY --from=builder /app/ormconfig.js ./ormconfig.js

RUN yarn install --production --ignore-scripts --prefer-offline

USER nodejs

WORKDIR /app

CMD ["yarn", "start"]

EXPOSE 3333
