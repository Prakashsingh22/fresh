package com.zepto.zepto_backend.controllers;

import com.zepto.zepto_backend.models.Order;
import com.zepto.zepto_backend.models.User;
import com.zepto.zepto_backend.services.OrderService;
import com.zepto.zepto_backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/warehouse/orders")
public class WarehouseOrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @PutMapping("/{orderId}/pack")
    public ResponseEntity<?> markPacked(
            @PathVariable UUID orderId,
            Principal principal
    ) {
        User user = userService.getUserByEmail(principal.getName());

        if (!userService.isWarehouseAdmin(user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Only warehouse admin can pack orders");
        }

        orderService.markOrderPacked(orderId, user);
        return ResponseEntity.ok("Order marked as PACKED");
    }

    @PutMapping("/{orderId}/dispatch")
    public ResponseEntity<?> markDispatched(
            @PathVariable UUID orderId,
            Principal principal
    ) {
        User user = userService.getUserByEmail(principal.getName());

        if (!userService.isWarehouseAdmin(user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Only warehouse admin can dispatch orders");
        }

        orderService.markOrderDispatched(orderId, user);
        return ResponseEntity.ok("Order marked as DISPATCHED");
    }
    @GetMapping("/my-warehouse")
    public List<Order> getMyWarehouseOrders(Principal principal) {
        return orderService.getWarehouseOrders(principal);
    }

}
