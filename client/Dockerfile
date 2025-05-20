FROM node:22-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json pnpm-lock.yaml ./

# Installer pnpm et les dépendances
RUN npm install -g pnpm
RUN pnpm install

# Copier le reste des fichiers
COPY . .

# Générer l'application
RUN pnpm run generate

# Image de production
FROM nginx:1.25-alpine

# Nettoyer la configuration par défaut
RUN rm /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

# Copier la configuration NGINX
COPY nginx.conf /etc/nginx/conf.d/

# Copier les fichiers générés
COPY --from=builder /app/.output/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]