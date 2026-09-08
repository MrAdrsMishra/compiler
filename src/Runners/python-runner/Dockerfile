FROM python:3.12-alpine

# 🔴 THIS LINE FIXES EVERYTHING
RUN mkdir -p /app/work

# Always work from mounted directory
WORKDIR /app/work

COPY run.sh /app/run.sh
RUN sed -i 's/\r$//' /app/run.sh && chmod +x /app/run.sh

ENTRYPOINT ["sh", "/app/run.sh"]
