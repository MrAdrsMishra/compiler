FROM node:24-alpine

RUN apk add --no-cache docker-cli 

WORKDIR /runner

COPY package*.json ./
RUN npm install

COPY src ./src

USER runner

EXPOSE 4000
CMD ["node", "src/runner.js"]