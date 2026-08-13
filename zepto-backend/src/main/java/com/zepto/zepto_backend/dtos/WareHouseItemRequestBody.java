package com.zepto.zepto_backend.dtos;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WareHouseItemRequestBody {
    @Column(columnDefinition = "BINARY(16)")
    private UUID wid; // items has one warehouse id
    @Column(columnDefinition = "BINARY(16)")
    private UUID pid; // items has one product id
    private double basePrice;
    private double discount;
    private int totalQuantity;
}
