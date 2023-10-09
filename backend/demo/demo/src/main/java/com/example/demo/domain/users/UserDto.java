package com.example.demo.domain.users;

public record UserDto(
        Long id,
        String username
) {

    public UserDto(User user) {
        this(
                user.getId(),
                user.getUsername()
        );
    }

}
