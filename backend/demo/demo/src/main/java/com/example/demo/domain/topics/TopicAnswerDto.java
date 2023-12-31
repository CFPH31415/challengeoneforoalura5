package com.example.demo.domain.topics;

public record TopicAnswerDto( Long id, String name) {

    public TopicAnswerDto(Topic topic) {
        this(
                topic.getId(),
                topic.getTitle()
        );
    }

}
