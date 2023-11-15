FROM node:alpine AS builder

WORKDIR /app

COPY . .
RUN yarn install
RUN yarn build
RUN rm -rf node_modules

FROM node:alpine AS runner

ENV NODE_ENV production

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

RUN yarn install --production

EXPOSE 3000

ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "run", "start"]
