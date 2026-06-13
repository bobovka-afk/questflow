FROM node:22-slim AS builder
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ARG DATABASE_URL=postgresql://build:build@localhost:5432/build
ENV DATABASE_URL=$DATABASE_URL

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig*.json ./
COPY src ./src

RUN npx prisma generate

RUN npm run build

FROM node:22-slim AS runner
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

COPY --from=builder /app/src/generated/prisma ./src/generated/prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY package.json ./
COPY uploads ./uploads

CMD ["sh", "-c", "until npx prisma migrate deploy; do echo 'Waiting for database...'; sleep 2; done && npm run start:prod"]

