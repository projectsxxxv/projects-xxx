FROM node:24-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package.json ./
COPY backend ./backend
COPY browser/site ./browser/site

RUN mkdir -p /app/.data && chown -R node:node /app
USER node

EXPOSE 3000
CMD ["node", "backend/server.js"]
