FROM eclipse-temurin:21-jdk AS build

WORKDIR /backend

VOLUME /root/.m2

COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml ./

RUN --mount=type=cache,target=/root/.m2 ./mvnw dependency:go-offline

COPY src ./src

RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /backend/target/todo-app-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
