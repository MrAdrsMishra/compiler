FROM r-base:4.4.1

RUN mkdir -p /app/work
WORKDIR /app/work

COPY run.sh /app/run.sh
RUN chmod +x /app/run.sh

ENTRYPOINT ["sh", "/app/run.sh"]
