FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:22-alpine
WORKDIR /app

COPY --from=build /app/.output/ ./

EXPOSE 80

CMD ["node", "/app/server/index.mjs"]