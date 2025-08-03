cd /app

node -r esbuild-register server.ts &

sleep 3

nginx -g "daemon off;"