FROM node:alpine AS builder

# 1. Declare ARGs for the builder stage
ARG SERVER_HOSTNAME
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL

WORKDIR /app

# 2. Fix: Use '=' for all ENV variables
ENV APP_ENV=build
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV NODE_ENV=production
ENV SERVER_HOSTNAME=${SERVER_HOSTNAME}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV SERVER_API_URL=${NEXT_PUBLIC_API_URL}

# 3. Optimization: Copy package files first to leverage Docker layer caching
COPY package.json yarn.lock* ./

# 4. Fix Error 127: Enable Corepack so 'yarn' is recognized
RUN corepack enable && yarn install

# Copy the rest of the application code
COPY . .

# (Note: Best practice is to have these inside your package.json's devDependencies rather than installing dynamically)
RUN yarn add --dev typescript @types/react @types/node autoprefixer @tailwindcss/postcss

RUN npx next telemetry disable
RUN yarn build
RUN rm -rf node_modules

# ---------------------------------------------------------
FROM node:slim AS runner

# 5. Fix UndefinedVar: Re-declare the ARG in this new stage
ARG SERVER_HOSTNAME

# Use '=' for ENV variables here as well
ENV APP_ENV=prod
ENV NODE_ENV=production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV SERVER_HOSTNAME=${SERVER_HOSTNAME}

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 6. Fix: Removed the hidden non-breaking space character
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS='--trace-warnings --unhandled-rejections=strict'

CMD ["node", "server.js"]
