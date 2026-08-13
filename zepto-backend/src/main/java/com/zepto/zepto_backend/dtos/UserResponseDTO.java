package com.zepto.zepto_backend.dtos;

import com.zepto.zepto_backend.models.User;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UserResponseDTO {

    private UUID id;
    private String name;
    private String email;
    private String phone;
    private String userType;
    private LocalDateTime createdAt;
    private String status;

    public UserResponseDTO(User user) {
        this.id = user.getId();
        this.name = user.getUserName();   // adjust getter if needed
        this.email = user.getEmail();
        this.phone = user.getPhoneNumber();
        this.userType = user.getUserType();
        this.createdAt = user.getCreatedAt();
        this.status= user.getStatus();
    }
}
