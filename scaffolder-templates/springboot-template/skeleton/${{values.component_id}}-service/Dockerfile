FROM openjdk:17-oracle

LABEL maintainer=${{values.team_email}}@yourteam.com

ARG JAR_FILE

ADD target/${JAR_FILE} /usr/src/app.jar
WORKDIR /usr/src

EXPOSE ${{values.http_port}}

#Setting ENTRYPOINT to mark it as executable
CMD exec java ${JAVA_OPTS} -jar app.jar
