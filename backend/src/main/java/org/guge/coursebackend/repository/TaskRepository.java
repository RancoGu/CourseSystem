package org.guge.coursebackend.repository;

import org.guge.coursebackend.entity.Task;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends CrudRepository<Task, Long> {
    List<Task> findAllByCourseId(long courseId);
}
