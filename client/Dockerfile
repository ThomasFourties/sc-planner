FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . ./

RUN pnpm run build

FROM node:22-alpine AS production
WORKDIR /app

RUN apk add --no-cache curl

COPY --from=build /app/.output/ ./

ENV NODE_ENV=production
ENV PORT=80
ENV HOST=0.0.0.0
ENV NITRO_PORT=80
ENV NITRO_HOST=0.0.0.0

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:80/api/_health || curl -f http://localhost:80/ || exit 1

CMD ["node", "server/index.mjs"]