FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copier les fichiers nécessaires pour les tâches de base de données
COPY --from=builder /app/src/database/seeds ./src/database/seeds
COPY --from=builder /app/src/database/migrations ./src/database/migrations
COPY --from=builder /app/typeorm.config.ts ./typeorm.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]