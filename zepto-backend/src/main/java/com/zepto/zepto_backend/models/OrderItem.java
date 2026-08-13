package com.zepto.zepto_backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orderItems")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;
    @Column(columnDefinition = "BINARY(16)")
    private UUID oid;
    @Column(columnDefinition = "BINARY(16)")
    private UUID pid;
    @Column(columnDefinition = "BINARY(16)")
    private UUID wid; // Recorded warehouse ID for this item
    private double price;
    private int quantity;
}
