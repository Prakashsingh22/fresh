package com.zepto.zepto_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.UUID;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemsRequestDTO {
    private UUID pid;
    private double price;
    private int quantity;

}
