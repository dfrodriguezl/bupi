FROM node:12

WORKDIR /app

RUN npm install pm2 -g


COPY dist dist
COPY backend backend
COPY repositorio repositorio


CMD ["pm2-runtime", "backend/server.bundle.js","--json"]
