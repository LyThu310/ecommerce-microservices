FROM node:24-bookworm-slim

WORKDIR /app/services/product-service

COPY services/product-service/package.json \
     services/product-service/package-lock.json ./

RUN npm ci

COPY services/product-service/src ./src

# product.grpc.js resolve tới /app/proto/product.proto
COPY proto /app/proto

EXPOSE 3003
EXPOSE 50053

CMD ["node", "src/server.js"]