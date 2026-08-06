# Medusa v2 — imagem de produção (EasyPanel / VPS)
FROM node:20-slim AS build
RUN apt-get update && apt-get install -y python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# 1) deps do backend
COPY package.json ./
RUN npm install

# 2) código + build (gera .medusa/server)
COPY . .
RUN npm run build

# 3) deps de produção dentro do servidor buildado
WORKDIR /app/.medusa/server
RUN npm install --omit=dev

ENV NODE_ENV=production
ENV PORT=9000
EXPOSE 9000

# roda migrations e sobe a Medusa
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
