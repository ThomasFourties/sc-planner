FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm generate

FROM nginx:1.25-alpine

RUN rm /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/.output/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
    