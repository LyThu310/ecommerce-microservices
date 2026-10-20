FROM node:24-bookworm-slim

WORKDIR /app/services/customer-service

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY services/customer-service/package.json \
     services/customer-service/package-lock.json ./

RUN npm ci

COPY services/customer-service/prisma ./prisma
COPY services/customer-service/prisma7.config.ts ./
COPY services/customer-service/src ./src

# customer.grpc.js hiện resolve tới:
# /app/proto/customer.proto
COPY proto /app/proto

RUN npx prisma generate --config prisma7.config.ts

EXPOSE 3002
EXPOSE 50052

CMD ["sh", "-c", "npx prisma migrate deploy --config prisma7.config.ts && node src/server.js"]