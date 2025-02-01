FROM node:alpine AS builder

ARG SERVER_HOSTNAME
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL

WORKDIR /app

ENV APP_ENV build
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV NODE_ENV production
ENV SERVER_HOSTNAME=${SERVER_HOSTNAME}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY . .
RUN yarn install
RUN yarn add --dev typescript @types/react @types/node autoprefixer
RUN yarn build
RUN rm -rf node_modules

FROM node:slim AS runner

ENV APP_ENV prod
ENV NODE_ENV production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV SERVER_HOSTNAME=${SERVER_HOSTNAME}

WORKDIR /app

#  && useradd -r -g pptruse
# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# COPY --from=builder /app/.next ./.next

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder  /app/next.config.js ./next.config.js

# COPY --from=builder /app/yarn.lock ./yarn.lock
## COPY --from=builder /app/.env.local ./.env.local

# RUN yarn install --production

# USER nextjs

EXPOSE 3000

ENV NEXT_TELEMETRY_DISABLED 1

CMD ["node", "server.js"]
