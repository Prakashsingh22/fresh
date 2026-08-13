package com.zepto.zepto_backend.models;

import com.zepto.zepto_backend.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;
    private LocalDateTime orderPlacedTime;
    private LocalDateTime orderDispatchedTime;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    private String paymentMethod;
    @Column(length = 1000)
    private String shippingAddress;
    @ManyToOne
    @JoinColumn(name = "consumer_id")
    private User consumer;
    @ManyToOne
    private WareHouse wareHouse;
    private Double totalAmount;
    private String cancellationReason;
    private String returnReason;
    @Column(length = 1000)
    private String returnComments;
    private LocalDateTime returnRequestedTime;
}
