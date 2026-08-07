# Medusa v2 — imagem de produção (EasyPanel / VPS)
FROM node:20-slim AS build
RUN apt-get update && apt-get install -y python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# npm resiliente contra 429 (rate-limit do registry): backoff + 1 conexão por vez
RUN npm config set fetch-retries 6 \
 && npm config set fetch-retry-factor 2 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 180000 \
 && npm config set maxsockets 1

# 1) deps do backend
COPY package.json ./
RUN npm install --no-audit --no-fund

# 2) código + build (gera .medusa/server)
COPY . .
RUN npm run build
# o seed lê tua-products.json a partir do cwd (.medusa/server) em runtime
RUN cp tua-products.json .medusa/server/tua-products.json

# 3) deps de produção dentro do servidor buildado
WORKDIR /app/.medusa/server
RUN npm install --omit=dev --no-audit --no-fund

ENV NODE_ENV=production
ENV PORT=9000
EXPOSE 9000

# roda migrations e sobe a Medusa
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
