package com.zepto.zepto_backend.dtos;

import com.zepto.zepto_backend.models.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDTO {
    private Order order;
    private List<OrderItemResponseDTO> items;
}
