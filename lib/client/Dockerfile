FROM node:alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:alpine AS builder

ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_API_URL
ARG SERVER_API_URL

ENV NEXTAUTH_URL $NEXTAUTH_URL
ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL
ENV SERVER_API_URL $SERVER_API_URL

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

FROM node:alpine AS runner

ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_API_URL
ARG SERVER_API_URL

ENV NEXTAUTH_URL $NEXTAUTH_URL
ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL
ENV SERVER_API_URL $SERVER_API_URL

ENV NODE_ENV production

WORKDIR /app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "start"]
