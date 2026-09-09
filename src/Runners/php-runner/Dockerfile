FROM php:8.3-cli-alpine

RUN mkdir -p /app/work
WORKDIR /app/work

COPY run.sh /app/run.sh
RUN sed -i 's/\r$//' /app/run.sh && chmod +x /app/run.sh

ENTRYPOINT ["sh", "/app/run.sh"]
