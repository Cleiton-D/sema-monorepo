# Base Node image
FROM node:alpine as base

# Setup all node_modules
FROM base as deps

RUN mkdir /app
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production=false

# Setup production node_modules
FROM base as production-deps

RUN mkdir /app
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY package.json yarn.lock ./
RUN yarn install --production

# Build the app
FROM base as build

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

COPY . .
RUN npm run build

# Build production image
FROM base

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules

COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start"]