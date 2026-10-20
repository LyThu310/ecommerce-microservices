FROM node:24-bookworm-slim

WORKDIR /app/services/api-gateway

COPY services/api-gateway/package.json \
     services/api-gateway/package-lock.json ./

RUN npm ci

COPY services/api-gateway/src ./src

EXPOSE 3000

CMD ["node", "src/server.js"]