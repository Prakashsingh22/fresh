package com.zepto.zepto_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemResponseDTO {
    private UUID pid;
    private String productName;
    private String productImage;
    private int quantity;
    private double price;
}
