FROM node:24-alpine

RUN apk add --no-cache docker-cli
RUN adduser -D runner

WORKDIR /runner

COPY package*.json ./
RUN npm install

COPY src/Runners/src ./src
# Security module: maliciousCodeGuard.js is imported as ../../security/... and
# seccomp-profile.json is resolved from the same tree inside the container.
COPY src/security /security

USER runner

EXPOSE 4000
CMD ["node", "src/runner.js"]
