package com.coveragex.todo_app.service;

import com.coveragex.todo_app.model.Task;
import com.coveragex.todo_app.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ActiveProfiles("test")
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private Task task;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        task = new Task();
        task.setTitle("Test Task");
        task.setDescription("Test Description");
        task.setId(1L);
    }

    @Test
    public void testAddTask() {
        when(taskRepository.save(task)).thenReturn(task);

        Task createdTask = taskService.addTask(task);

        assertNotNull(createdTask);
        assertEquals("Test Task", createdTask.getTitle());
        assertEquals("Test Description", createdTask.getDescription());
        verify(taskRepository, times(1)).save(task);
    }

    @Test
    public void testGetTaskById_found() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        Optional<Task> foundTask = taskService.getTaskById(1L);

        assertTrue(foundTask.isPresent());
        assertEquals("Test Task", foundTask.get().getTitle());
        verify(taskRepository, times(1)).findById(1L);
    }

    @Test
    public void testGetTaskById_notFound() {

        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Task> foundTask = taskService.getTaskById(1L);

        assertFalse(foundTask.isPresent());
        verify(taskRepository, times(1)).findById(1L);
    }

    @Test
    public void testMarkAsDone() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        taskService.markAsDone(1L);

        assertTrue(task.isCompleted());
        verify(taskRepository, times(1)).save(task);
    }

    @Test
    public void testDeleteTaskById() {
        taskService.deleteTaskById(1L);

        verify(taskRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testUpdateTask() {
        Task updatedTask = new Task();
        updatedTask.setTitle("Updated Task");
        updatedTask.setDescription("Updated Description");
        updatedTask.setId(1L);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        taskService.updateTask(1L, updatedTask);

        assertEquals("Updated Task", task.getTitle());
        assertEquals("Updated Description", task.getDescription());
        verify(taskRepository, times(1)).save(task);
    }
}
