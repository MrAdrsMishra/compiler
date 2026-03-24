FROM eclipse-temurin:21-jdk-alpine

ARG KOTLIN_VERSION=2.0.21

RUN apk add --no-cache bash curl unzip
RUN curl -fsSL -o /tmp/kotlin.zip "https://github.com/JetBrains/kotlin/releases/download/v${KOTLIN_VERSION}/kotlin-compiler-${KOTLIN_VERSION}.zip" \
	&& unzip /tmp/kotlin.zip -d /opt \
	&& ln -s /opt/kotlinc/bin/kotlinc /usr/local/bin/kotlinc \
	&& rm -f /tmp/kotlin.zip

RUN mkdir -p /app/work
WORKDIR /app/work

COPY run.sh /app/run.sh
RUN chmod +x /app/run.sh

ENTRYPOINT ["sh", "/app/run.sh"]
