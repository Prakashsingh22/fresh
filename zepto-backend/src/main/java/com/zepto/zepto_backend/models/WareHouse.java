package com.zepto.zepto_backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "wareHouses")
public class WareHouse {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;
    @OneToOne
    private Location location;
    @OneToOne
    private User wareHouseAdmin;
    private String wareHouseName;
    private String email;
    private String contactNumber;
    @OneToMany
    private List<WareHouseItem> wareHouseItems = new java.util.ArrayList<>();

    @Column( updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

}
