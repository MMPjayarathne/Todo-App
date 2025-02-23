package com.coveragex.todo_app.service;


import com.coveragex.todo_app.model.Task;
import com.coveragex.todo_app.repository.TaskRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getLatestTasks() {
        return taskRepository.findTop5ByCompletedFalseOrderByIdDesc();
    }

    public Task addTask(Task task) {
        return taskRepository.save(task);
    }

    public void markAsDone(Long id) {
        taskRepository.findById(id).ifPresent(task -> {
            task.setCompleted(true);
            taskRepository.save(task);
        });
    }

    public boolean isAvailable(Long id){
        return taskRepository.findById(id).isPresent();
    }

    public Optional<Task> getTaskById(Long id){
        return taskRepository.findById(id);
    }

    public void deleteTaskById(Long id){
        taskRepository.deleteById(id);
    }

    public void updateTask(Long id, Task newTask){
        taskRepository.findById(id).ifPresent(task -> {
            task.setTitle(newTask.getTitle());
            task.setDescription(newTask.getDescription());
            taskRepository.save(task);
        });
    }
}
