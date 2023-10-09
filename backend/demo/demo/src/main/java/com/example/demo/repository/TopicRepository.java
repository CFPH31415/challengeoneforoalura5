package com.example.demo.repository;

import com.example.demo.domain.topics.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {

    List<Topic> findByCourseId(Long id);
    List<Topic> findByUserId(Long id);

}
