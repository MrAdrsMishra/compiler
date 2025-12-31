
FROM node:24-alpine

RUN adduser -D appuser

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY src ./src

USER appuser
EXPOSE 3000
CMD ["node", "src/server.js"]
