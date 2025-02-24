package com.coveragex.todo_app.controller;


import com.coveragex.todo_app.model.Task;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/***
 * E2E test for the TaskController
 */

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ActiveProfiles("test")  // Use a separate profile for testing if want
public class TaskControllerE2ETest {

    @LocalServerPort
    private int port;

    @BeforeAll
    void setup() {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = port;
    }

    @Test
    void testCreateTaskAndGetById() {
        Task newTask = new Task();
        newTask.setTitle("Test Task");
        newTask.setDescription("This is a test task");

        int taskId = given()
                .contentType(ContentType.JSON)
                .body(newTask)
                .when()
                .post("/api/tasks")
                .then()
                .statusCode(200)
                .body("title", equalTo("Test Task"))
                .extract().path("id");


        given()
                .pathParam("id", taskId)
                .when()
                .get("/api/tasks/{id}")
                .then()
                .statusCode(200)
                .body("title", equalTo("Test Task"))
                .body("description", equalTo("This is a test task"));
    }

    @Test
    void testUpdateTask() {
        Task newTask = new Task();
        newTask.setTitle("Old Title");
        newTask.setDescription("Old Description");

        int taskId = given()
                .contentType(ContentType.JSON)
                .body(newTask)
                .when()
                .post("/api/tasks")
                .then()
                .statusCode(200)
                .extract().path("id");

        Task updatedTask = new Task();
        updatedTask.setTitle("Updated Title");
        updatedTask.setDescription("Updated Description");

        given()
                .contentType(ContentType.JSON)
                .pathParam("id", taskId)
                .body(updatedTask)
                .when()
                .put("/api/tasks/{id}")
                .then()
                .statusCode(200)
                .body(equalTo("Successfully update the task!"));

        given()
                .pathParam("id", taskId)
                .when()
                .get("/api/tasks/{id}")
                .then()
                .statusCode(200)
                .body("title", equalTo("Updated Title"))
                .body("description", equalTo("Updated Description"));
    }

    @Test
    void testDeleteTask() {

        Task newTask = new Task();
        newTask.setTitle("Task to Delete");
        newTask.setDescription("This task will be deleted");

        int taskId = given()
                .contentType(ContentType.JSON)
                .body(newTask)
                .when()
                .post("/api/tasks")
                .then()
                .statusCode(200)
                .extract().path("id");


        given()
                .pathParam("id", taskId)
                .when()
                .delete("/api/tasks/{id}")
                .then()
                .statusCode(200)
                .body(equalTo("Successfully Deleted."));

        given()
                .pathParam("id", taskId)
                .when()
                .get("/api/tasks/{id}")
                .then()
                .statusCode(400);
    }
}
