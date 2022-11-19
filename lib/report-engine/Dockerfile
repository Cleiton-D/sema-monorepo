FROM quay.io/quarkus/ubi-quarkus-graalvmce-builder-image:22.2-java11 AS build

COPY --chown=quarkus:quarkus mvnw /code/mvnw
COPY --chown=quarkus:quarkus .mvn /code/.mvn
COPY --chown=quarkus:quarkus pom.xml /code/

USER quarkus

WORKDIR /code

RUN ./mvnw -B org.apache.maven.plugins:maven-dependency-plugin:3.1.2:go-offline

COPY src /code/src

RUN ./mvnw package

FROM ghcr.io/graalvm/graalvm-ce:ol7-java11-22.3.0

WORKDIR /work/

COPY --from=build /code/target/quarkus-app/ /work/
COPY reports /work/reports

EXPOSE 9000

USER 1001

CMD ["java", "-jar", "quarkus-run.jar", "-Dquarkus.http.host=0.0.0.0"]
