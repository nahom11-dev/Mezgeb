# Self-host Mezgeb: the site, the <mezgeb-register> embed (/v1/mezgeb.js) and the API in one container.
#   docker compose up --build      → http://localhost:3000
FROM node:22-slim

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build:embed

ENV PORT=3000
ENV DATA_DIR=/app/data
EXPOSE 3000
CMD ["npx", "tsx", "server.ts", "--production"]
