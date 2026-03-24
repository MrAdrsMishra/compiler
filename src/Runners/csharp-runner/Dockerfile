FROM mono:6.12

RUN mkdir -p /app/work
WORKDIR /app/work

COPY run.sh /app/run.sh
RUN chmod +x /app/run.sh

ENTRYPOINT ["sh", "/app/run.sh"]
