package com.zepto.zepto_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequestDTO {
    private String paymentMethod;
    private String shippingAddress;
    private UUID warehouseId;
    private List<OrderItemsRequestDTO> items;
}
