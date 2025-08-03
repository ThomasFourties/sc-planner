FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:22-alpine

RUN apk add --no-cache nginx

RUN rm /etc/nginx/http.d/default.conf
RUN rm -rf /var/www/localhost/htdocs/*

RUN mkdir -p /var/www/html
RUN mkdir -p /var/log/nginx
RUN mkdir -p /var/lib/nginx/tmp
RUN mkdir -p /run/nginx

WORKDIR /app

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.output/public /var/www/html

COPY nginx.conf /etc/nginx/http.d/default.conf

COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]