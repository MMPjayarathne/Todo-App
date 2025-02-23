package com.coveragex.todo_app.controller;

import com.coveragex.todo_app.model.Task;
import com.coveragex.todo_app.service.TaskService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<?> getTasks() {
        log.info("A request to get tasks.");
        Map <String, Object> response = new HashMap<>();
        try {
            List<Task> res = taskService.getLatestTasks();
            return  ResponseEntity.ok(res);
        }catch (Exception e){
            response.put("Error","A server side error occured!");
            log.warn("An error occured when trying get tasks  : {}",e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);

        }
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        log.info("A request to store a task.");
        Map <String, Object> response = new HashMap<>();
        if(task.getTitle() == null || task.getTitle().isEmpty()){
            response.put("Error","The title is missing.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if(task.getDescription() == null || task.getDescription().isEmpty()){
            response.put("Error","The description is missing.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        try {
            Task res = taskService.addTask(task);
            return  ResponseEntity.ok(res);
        }catch (Exception e){
            response.put("Error","A server side error occured!");
            log.warn("An error occured when trying to add data to the table : {}",e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);

        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id){
        log.info("A request to  get a task.");
        Map <String, Object> response = new HashMap<>();
        if(id == null){
            response.put("Error","An id is required to get a task.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        try {
            Optional<Task> task =  taskService.getTaskById(id);
            if (task == null || !task.isPresent()){
                response.put("Error", "Given Id is not available!");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            return  ResponseEntity.ok(task);
        }catch (Exception e){
            response.put("Error","A server side error occured!");
            log.warn("An error occured when trying to get a task : {}",e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);

        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTaskById(@PathVariable Long id){
        log.info("A request to  delete a task.");
        Map <String, Object> response = new HashMap<>();
        if(id == null){
            response.put("Error","An id is required to delete a task.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        try {

            if (!taskService.isAvailable(id)){
                response.put("Error", "Given Id is not available!");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            taskService.deleteTaskById(id);
            return  ResponseEntity.ok("Successfully Deleted.");
        }catch (Exception e){
            response.put("Error","A server side error occured!");
            log.warn("An error occured when trying to delete a task : {}",e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);

        }
    }


    @PutMapping("/{id}/done")
    public ResponseEntity<?> markAsDone(@PathVariable Long id) {
        log.info("A request to  update the task as done.");
        Map <String, Object> response = new HashMap<>();
        if(id == null){
            response.put("Error","An id is required to update the task.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        try {
            taskService.markAsDone(id);
            return  ResponseEntity.ok("Successfully update the task as done!");
        }catch (Exception e){
            response.put("Error","A server side error occured!");
            log.warn("An error occured when trying to update the task as done : {}",e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);

        }


    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task task) {
        log.info("A request to  update the task.");
        Map <String, Object> response = new HashMap<>();
        if(id == null){
            response.put("Error","An id is required to update the task.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        if(task.getTitle() == null || task.getTitle().isEmpty()){
            response.put("Error","The title is missing.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        if(task.getDescription() == null || task.getDescription().isEmpty()){
            response.put("Error","The description is missing.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        try {
            taskService.updateTask(id,task);
            return  ResponseEntity.ok("Successfully update the task!");
        }catch (Exception e){
            response.put("Error","A server side error occured!");
            log.warn("An error occured when trying to update the task : {}",e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);

        }


    }
}
