FROM swift:5.10

RUN mkdir -p /app/work
WORKDIR /app/work

COPY run.sh /app/run.sh
RUN chmod +x /app/run.sh

ENTRYPOINT ["sh", "/app/run.sh"]
