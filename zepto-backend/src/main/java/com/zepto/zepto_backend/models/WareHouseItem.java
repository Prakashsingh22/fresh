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
@Table(name = "wareHouseItems",uniqueConstraints = {
        @UniqueConstraint(columnNames = {"wid", "pid"})})
public class WareHouseItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;
    @Column(columnDefinition = "BINARY(16)")
    private UUID wid; // items has one warehouse id

//    @ManyToOne(optional = false)
//    @JoinColumn(name = "warehouse_id", nullable = false)
//    private WareHouse wareHouse;



        @Column(columnDefinition = "BINARY(16)")
    private UUID pid; // items has one product id
//    @ManyToOne(optional = false)
//    @JoinColumn(name = "pid", nullable = false)
//    private Product product;

    private double basePrice;
    private double discount;
    private int totalQuantity;


}
