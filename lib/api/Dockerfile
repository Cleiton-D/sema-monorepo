FROM node:alpine AS deps
WORKDIR /app
COPY . .
RUN yarn install --production --ignore-scripts --prefer-offline

FROM node:alpine AS runner
WORKDIR /app

RUN apk add --no-cache postgresql-client

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

ENV NODE_ENV production

COPY --from=deps /app/node_modules ./node_modules

COPY package.json ./package.json
COPY dist ./dist
COPY init.sh ./init.sh
COPY ormconfig.js ./ormconfig.js

RUN chmod +x ./init.sh

USER nodejs

WORKDIR /app

CMD ["yarn", "start"]

EXPOSE 3333
