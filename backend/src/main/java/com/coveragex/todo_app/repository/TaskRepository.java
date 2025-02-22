package com.coveragex.todo_app.repository;

import com.coveragex.todo_app.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findTop5ByCompletedFalseOrderByIdDesc();
}
