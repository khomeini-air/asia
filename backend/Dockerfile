# Build
FROM maven:3.8.5-openjdk-17 AS build
ENV HOME=/usr/app
RUN mkdir -p $HOME
WORKDIR $HOME
ADD . $HOME
RUN --mount=type=cache,target=/root/.m2 mvn -f $HOME/pom.xml clean package

FROM maven:3.8.5-openjdk-17
COPY --from=build /usr/app/target/asia-0.0.1-SNAPSHOT.jar /app/runner.jar
ENTRYPOINT ["java","-jar","/app/runner.jar"]
