package com.zepto.zepto_backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zepto.zepto_backend.enums.UserType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;


    @Column(name = "user_name",nullable = false)
    private String userName;


    @Column(name = "email",nullable = false,unique = true)
    private String email;


    @JsonIgnore
    @Column(name = "password",nullable = false)
    private String password;

    @Column(name = "phone_number",nullable = false)
    private String phoneNumber;


//    @Enumerated(EnumType.STRING) // Store enum name in DB
    private String userType;

    @CreationTimestamp
    private LocalDateTime createdAt;


    @Column(name = "status",nullable = false)
    private String status;




}
