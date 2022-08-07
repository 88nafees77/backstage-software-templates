#FROM openjdk:11-alpine
#ENTRYPOINT ["/usr/bin/${{values.artifact_id}}.sh"]
#
#COPY ${{values.artifact_id}}.sh /usr/bin/${{values.artifact_id}}.sh
#COPY target/${{values.artifact_id}}.jar /usr/share/${{values.artifact_id}}/${{values.artifact_id}}.jar

FROM openjdk:11-alpine

LABEL maintainer="tech-brew@miqdigital.com"

ARG JAR_FILE

ADD target/${JAR_FILE} /usr/src/app.jar
ADD src/main/resources/tokens /usr/src/tokens
WORKDIR /usr/src

EXPOSE ${{values.http_port}}

#Setting ENTRYPOINT to mark it as executable
CMD exec java ${JAVA_OPTS} -jar app.jar
