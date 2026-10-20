FROM node:24-bookworm-slim

WORKDIR /app/services/order-service

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY services/order-service/package.json \
     services/order-service/package-lock.json ./

RUN npm ci

COPY services/order-service/prisma ./prisma
COPY services/order-service/prisma7.config.ts ./
COPY services/order-service/src ./src

# customer.client.js và product.client.js resolve tới /app/proto
COPY proto /app/proto

RUN npx prisma generate --config prisma7.config.ts

EXPOSE 3004

CMD ["sh", "-c", "npx prisma migrate deploy --config prisma7.config.ts && node src/server.js"]