FROM node:24-bookworm-slim

WORKDIR /app/services/shipment-service

COPY services/shipment-service/package.json \
     services/shipment-service/package-lock.json ./

RUN npm ci

COPY services/shipment-service/src ./src

EXPOSE 3005

CMD ["node", "src/server.js"]