FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/dist /app/dist

EXPOSE 3000

CMD ["node", "dist/main.js"]  # Assure-toi que 'main.js' est dans le dossier 'dist'
