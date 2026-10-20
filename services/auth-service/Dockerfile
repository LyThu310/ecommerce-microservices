FROM node:24-bookworm-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

RUN npm ci

COPY prisma ./prisma
COPY prisma7.config.ts ./
COPY src ./src

RUN npx prisma generate --config prisma7.config.ts

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy --config prisma7.config.ts && node src/server.js"]