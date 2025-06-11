FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN npm run build

EXPOSE 3001

RUN echo '#!/bin/sh\nset -e\necho "Running migrations..."\nnpm run migration:run\necho "Starting application..."\nnpm run start' > start.sh && chmod +x start.sh

CMD ["./start.sh"]